const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const randomUseragent = require('random-useragent');
const axios = require('axios');
const cheerio = require('cheerio');

// Enable stealth mode to avoid getting detected
puppeteer.use(StealthPlugin());

// const keywords = ['הליכים משפטיים', 'הליכים', 'פלילי', 'פירוק', 'עמותה'];
const keywords = ['עמותה'];

// Fetch free proxies (you can use any free proxy service)
async function fetchProxyList() {
  try {
    const response = await axios.get('https://www.sslproxies.org/');
    const html = response.data
    
    const $ = cheerio.load(html);
    
    const proxyList = []; // Fill with actual proxies from response (e.g., by scraping the page)
 
    // Select the table rows that contain proxy details (IP and port)
    $('table tbody tr').each((index, element) => {
      const ip = $(element).find('td').eq(0).text(); // IP address
      const port = $(element).find('td').eq(1).text(); // Port

      // Combine IP and port into a proxy string
      if (ip && port) {
         proxyList.push({ip, port});
       }
    });
    //console.log('Fetched proxies:', proxyList);
    
    // Return the list of proxies
    return proxyList;
  } catch (error) {
      console.error('Error fetching proxy list:', error);
    return [];
  }
}

// Function to select a random proxy
function getRandomProxy(proxyList) {
  const randomIndex = Math.floor(Math.random() * proxyList.length);
  return proxyList[randomIndex];
}

// Add a delay between requests to mimic human behavior
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Scrape Google with rotating proxies and user-agent
async function scrapeGoogle(associationNumber, proxyList) {
  const results = [];
  // Set up a random proxy
  // const proxy = getRandomProxy(proxyList);
  // console.log(`Using proxy:`, proxy);

  let browser;

  for (const proxy of proxyList) {
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [`--proxy-server=http://${proxy.ip}:${proxy.port}`],
        ignoreHTTPSErrors: true
      });
      console.log("hi0")
      // Launch Puppeteer with stealth
      // const browser = await puppeteer.launch({
      //   headless: true, // Run in headless mode
      //   args: [`--proxy-server=http://${proxy.ip}:${proxy.port}`],
      // });

      //try {
      for (const keyword of keywords) {
        const searchUrl = `https://www.google.com/search?q="${associationNumber}"+${keyword}`;
        const page = await browser.newPage();
        console.log("hi1")
        
        // Set a random User-Agent
        const userAgent = randomUseragent.getRandom();
        await page.setUserAgent(userAgent);

  
        //console.log(`Using proxy:`, proxy);
        //await page.authenticate({ username: 'proxyUser', password: 'proxyPassword' }); // Only if needed for your proxies

        // Go to the Google search URL
        await page.goto(searchUrl, { waitUntil: 'networkidle2' });
    
        // Extract search results from the page
        const searchResults = await page.evaluate(() => {
          const links = [];
  
          const elements = document.querySelectorAll('div.g'); // Google search result div
          elements.forEach(el => {
            const titleElement = el.querySelector('a h3');
            const linkElement = el.querySelector('a');
            const snippetElement = el.querySelector('.IsZvec');

            if (titleElement && linkElement && snippetElement) {
              links.push({
                title: titleElement.innerText,
                url: linkElement.href,
                snippet: snippetElement.innerText,
              });
            }
          });
          console.log(links)
          return links;
        });

        // Filter results where the associationNumber and keyword are found in the title or snippet
        const filteredResults = searchResults.filter(result =>
          (result.title.includes(associationNumber) || result.snippet.includes(associationNumber)) &&
          (result.title.includes(keyword) || result.snippet.includes(keyword))
        );

        // Store the results
        results.push(...filteredResults);

        // Close the page after each search
        await page.close();

        // Add random delay to avoid detection
        await delay(Math.random() * 2000 + 3000); // Wait between 3-5 seconds
      }
    } catch (error) {
    //console.error('Error during scraping:', error);
        console.error(`Proxy ${proxy.ip}:${proxy.port} failed: ${error.message}`);
    } finally {
    // Close the browser
      if (browser) {
        await browser.close();
      }
    }
  }
  return results;
}

module.exports = { scrapeGoogle, fetchProxyList };
