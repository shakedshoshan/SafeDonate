const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const randomUseragent = require('random-useragent');
const axios = require('axios');
const cheerio = require('cheerio');

puppeteer.use(StealthPlugin()); // Enable stealth mode

// const keywords = ['הליכים משפטיים', 'הליכים', 'פלילי', 'פירוק', 'עמותה'];
const keywords = ['עמותה', 'הליכים'];

// Delay function to mimic human-like browsing behavior
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry function for handling retries with exponential backoff
const retry = async (fn, retries = 3, delayMs = 3000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i < retries - 1) {
                console.warn(`Retrying... (${i + 1}/${retries})`);
                await delay(delayMs * (i + 1)); // Exponential backoff
            } else {
                throw err;
            }
        }
    }
};


// Function to scrape Google search results for a given association number and keywords
const scrapeGoogle = async (associationNumber) => {
    const results = [];
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ["--disabled-setuid-sandbox", "--no-sandbox"],
        });

        for (const keyword of keywords) {
            const searchQuery = `"${associationNumber}" ${keyword}`;
            //  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
            const page = await browser.newPage();

            const userAgent = randomUseragent.getRandom();
         
            if (typeof userAgent === 'string' && userAgent.includes('Chrome') && parseFloat(userAgent.split('Chrome/')[1]) > 80) {
                await page.setUserAgent(userAgent);
                console.log(`Using User-Agent: ${userAgent}`);
            }

            // Set extra HTTP headers
            await page.setExtraHTTPHeaders({
                "User-Agent": userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36",
            });

            // Navigate to the Google search page and wait for content to load
            await retry(() => page.goto(searchUrl, { waitUntil: "domcontentloaded" }), 3, 5000);
            console.log(`Navigated to: ${searchUrl}`);

            const isCaptcha = await page.$('form[action="/sorry/index"]');
            if (isCaptcha) {
                console.warn("CAPTCHA detected, skipping this keyword.");
                //console.log("CAPTCHA detected, skipping this keyword.");
                await page.close();
                continue; // Skip this keyword if CAPTCHA is encountered
            }

            // Scrape the search results from the page
            const searchResults = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".g")).map((el) => {
                    const titleEl = el.querySelector("h3");  // Titles inside <h3> tags
                    const linkEl = el.querySelector('a');    // Links inside <a> tags
                    return {
                        title: titleEl ? titleEl.textContent : "No title found",
                        link: linkEl ? linkEl.href : "No link found",
                    };
                });
            });

            console.log(`Results for keyword '${keyword}':`, searchResults);

            // Store the results
            results.push({
                keyword,
                searchResults
            });

            // Close the page after each search
            await page.close();

             // Random delay to mimic human browsing and avoid detection
            await delay(Math.random() * 2000 + 3000); // Wait between 3-5 seconds
        }
    } catch (error) {
        console.error('Error during scraping:', error);
    } finally {
        if (browser) {
            await browser.close();
            console.log("finish scraping")
        }
    }
    return results;
};

// Run the scraping
module.exports = { scrapeGoogle }