const puppeteer = require("puppeteer");
//const puppeteer = require('puppeteer-extra');
//const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const randomUseragent = require('random-useragent');
const axios = require('axios');
const cheerio = require('cheerio');
const associationNumber = 580570950

// const keywords = ['הליכים משפטיים', 'הליכים', 'פלילי', 'פירוק', 'עמותה'];
const keywords = ['עמותה', 'הליכים'];

// Add a delay between requests to mimic human behavior
function delay(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

const scrapeGoogle = async () => {
   const results = [];
   let browser;

   try {
      browser = await puppeteer.launch({
         headless: true,
         args: ["--disabled-setuid-sandbox", "--no-sandbox"],
      });

      for (const keyword of keywords) {
         const searchQuery = `"${associationNumber}" ${keyword}`;
         const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
         const page = await browser.newPage();

         // Set a random User-Agent
         const userAgent = randomUseragent.getRandom();
         console.log(userAgent);

         if (typeof userAgent === 'string' && userAgent.includes('Chrome') && parseFloat(userAgent.split('Chrome/')[1]) > 80) {
            await page.setUserAgent(userAgent);

         } else {
            console.error("Failed to retrieve a valid user agent.");
         }

         console.log(`Using User-Agent: ${userAgent}`);
         console.log(`Navigated to: ${searchUrl}`);

         // Go to the Google search URL
         await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

         const isCaptcha = await page.$('form[action="/sorry/index"]');
         if (isCaptcha) {
            console.log("CAPTCHA detected, skipping this keyword.");
            await page.close();
            continue; // Skip this keyword if CAPTCHA is encountered
         }

         const searchResults = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".Ww4FFb")).map((el) => {
               const titleEl = el.querySelector(".DKV0Md") || el.querySelector("h3");  // Titles are usually inside <h3> tags
               const linkEl = el.querySelector('a');    // Links inside <a> tags
               return {
                  title: titleEl?.textContent || "No title found",
                  link: linkEl?.href || "No link found"
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

         // Add random delay to avoid detection
         await delay(Math.random() * 2000 + 3000); // Wait between 3-5 seconds
      }

   } catch (error) {
      console.error('Error during scraping:', error);
   } finally {
      // Close the browser
      if (browser) {
         await browser.close();
      }
   }
   return results;
};

// Run the scraping
scrapeGoogle().then(results => {
   console.log('Final results:', results);
});