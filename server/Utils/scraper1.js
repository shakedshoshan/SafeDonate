const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const randomUseragent = require('random-useragent');
const keywordDictionary = require('./keywordDictionary.js');
const axios = require('axios');
const cheerio = require('cheerio');

puppeteer.use(StealthPlugin()); // Enable stealth mode
// const keywords = ['הליכים משפטיים', 'הליכים', 'פלילי', 'פירוק', 'עמותה'];
//const generalKeywords = ['פלילי', 'פירוק', 'הליכים'];
//const keywords = ['פירוק'];

// Delay function to mimic human-like browsing behavior

const checkCategory = (category) => {
    const trimmedCategory = category?.trim() || "כללי";
    const keywords = keywordDictionary[trimmedCategory];
    
    // Check if keywords are found
    // if (keywords) {
    //   return keywords;
    // } else {
    //   // If not found, use "כללי"
    //   console.warn(`Category "${trimmedCategory}" not found, using "כללי"`);
    //   return keywordDictionary["כללי"];
    // }
    if (!keywords) {
        return keywordDictionary["כללי"];
    }
    return keywords  
  };
//     const trimmedCategory = category?.trim() || "כללי";
//     const keywords = keywordDictionary[trimmedCategory];
//     console.log(trimmedCategory)

//     if (!keywords) {
//         console.error(`Category "${trimmedCategory}" not found in keywordDictionary`);
//         // Handle the case where keywords is undefined or empty
//         return [];
//     }
//     return keywordDictionary[trimmedCategory];
// }

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const selectRandom = () => {
    const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36"
    ]
    var randomNumber = Math.floor(Math.random() * userAgents.length);
    return userAgents[randomNumber];
}

const getUserAgent = () => {
    const userAgent = randomUseragent.getRandom();

    if (typeof userAgent === 'string' && userAgent.includes('Chrome') && parseFloat(userAgent.split('Chrome/')[1]) > 80) {
        console.log("User agent from random")
        return userAgent;
    }
    else {
        console.log("User agent from List")
        return selectRandom();
    }
}
// Function to scrape Google search results for a given association number and keywords
const scrapeData = async (associationNumber, category) => {
    const results = [];
    let browser;
    
    const keywords = checkCategory(category);

    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ["--disabled-setuid-sandbox", "--no-sandbox"],
        });

        //for (const [category, keywords] of Object.entries(keywordDictionary)) {

        //console.log(`Scraping topic: ${category}`); // For debugging

        for (const keyword of keywords) {
            console.log("hii")
            const searchQuery = `"${associationNumber}" ${keyword}`;
            const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
            const page = await browser.newPage();

            const userAgent = getUserAgent();
            await page.setUserAgent(userAgent);
            //console.log(`Using User-Agent: ${userAgent}`);


            // // Set extra HTTP headers
            // await page.setExtraHTTPHeaders({
            //     "User-Agent": userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36",
            // });

            // Navigate to the Google search page and wait for content to load
            await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
            //console.log(`Navigated to: ${searchUrl}`);

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
                    const contentEl = el.querySelector(".Hdw6tb");  // Snippet/content area
                    return {
                        title: titleEl ? titleEl.textContent : "No title found",
                        link: linkEl ? linkEl.href : "No link found",
                        content: contentEl ? contentEl.textContent : "No content found"
                    };
                });
            });

            console.log(`Results for keyword '${keyword}':`, searchResults);

            // Filter results where the associationNumber and keyword are found in the title or content
            const filteredResults = searchResults.filter(result =>
                (result.title.includes(associationNumber) || result.content.includes(associationNumber)) &&
                (result.title.includes(keyword) || result.content.includes(keyword))
            );

            //console.log(`Filtered Results for keyword '${keyword}':`, filteredResults);

            // Store the filtered results
            results.push({
                keyword,
                filteredResults
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
module.exports = { scrapeData }