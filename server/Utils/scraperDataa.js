const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom'); // For using Readability with JSDOM
const { checkCategory, getUserAgent, delay } = require('./scraperUtils.js');

puppeteer.use(StealthPlugin()); // Enable stealth mode

// Dynamically import `p-limit` to handle the ESM error
let limit;
(async () => {
    const pLimit = (await import('p-limit')).default;
    limit = pLimit(10); // Set concurrency limit
})();

// Function to scrape data for a single keyword
const scrapeKeyword = async (browser, associationNumber, keyword) => {
    const searchQuery = `"${associationNumber}" ${keyword}`;
    const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
    const page = await browser.newPage();

    const userAgent = getUserAgent();
    await page.setUserAgent(userAgent);

    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const isCaptcha = await page.$('form[action="/sorry/index"]');
    if (isCaptcha) {
        console.warn(`CAPTCHA detected for keyword: "${keyword}", skipping.`);
        await page.close();
        return null; // Return null if CAPTCHA is encountered
    }

    // Scrape search results
    const searchResults = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.g')).map((el) => {
            const titleEl = el.querySelector('h3');
            const linkEl = el.querySelector('a');
            return {
                title: titleEl ? titleEl.textContent : 'No title found',
                link: linkEl ? linkEl.href : 'No link found',
            };
        });
    });

    await page.close(); // Close the page after scraping search results

    // Process each result for readability
    const articles = await Promise.all(
        searchResults.map((result) =>
            limit(async () => {
                const articlePage = await browser.newPage();
                await articlePage.goto(result.link, { waitUntil: 'domcontentloaded', timeout: 30000 });

                // Get the content and apply Readability
                const content = await articlePage.content();
                const dom = new JSDOM(content);
                const reader = new Readability(dom.window.document);
                const article = reader.parse();

                await articlePage.close(); // Close the article page after processing
                return {
                    title: result.title,
                    link: result.link,
                    content: article ? article.textContent : 'No content found',
                };
            })
        )
    );

    return articles; // Return the parsed articles
};

// Main scraping function
const scrapeDataa = async (associationNumber, category, onScrapedResult) => {
    const results = [];
    let browser;

    const keywords = checkCategory(category);

    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--disabled-setuid-sandbox', '--no-sandbox'],
        });

           // Wait for `p-limit` to load before executing any scraping
           if (!limit) {
            const pLimit = (await import('p-limit')).default;
            limit = pLimit(10);
        }

        // Run all keyword scraping tasks in parallel with limited concurrency
        const keywordScrapingPromises = keywords.map((keyword) =>
            limit(() => scrapeKeyword(browser, associationNumber, keyword))
        );

        const articlesArray = await Promise.all(keywordScrapingPromises);
        
        // Flatten the array and filter out null results (due to CAPTCHA)
        const allArticles = articlesArray.flat().filter(Boolean);

        // Pass the scraped results to the callback
        onScrapedResult(allArticles);
    } catch (error) {
        console.error('Error during scraping:', error);
    } finally {
        if (browser) {
            await browser.close();
            console.log('Finish scraping');
        }
    }

    return results;
};

// Run the scraping
module.exports = { scrapeDataa };


