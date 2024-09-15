const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const proxies = [
  { ip: '51.83.62.245', port: '8080' },
  { ip: '185.195.71.218', port: '18080' },
  { ip: '160.86.242.23', port: '8080' },
  // Add more proxies here...
];

async function testProxy(proxy) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [`--proxy-server=http://${proxy.ip}:${proxy.port}`],
    ignoreHTTPSErrors: true // Ignore SSL certificate errors
  });

  try {
    const page = await browser.newPage();
    const response = await page.goto('https://httpbin.org/ip', { waitUntil: 'networkidle2' });

    if (response.status() === 200) {
      const content = await page.content();
      console.log(`Proxy ${proxy.ip}:${proxy.port} is working`);
      console.log('Response content:', content);
    } else {
      console.log(`Proxy ${proxy.ip}:${proxy.port} failed with status ${response.status()}`);
    }
    await page.close();
  } catch (error) {
    console.error(`Proxy ${proxy.ip}:${proxy.port} failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

async function testAllProxies(proxies) {
  for (const proxy of proxies) {
    await testProxy(proxy);
  }
}

testAllProxies(proxies);



// const axios = require('axios');
// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const randomUseragent = require('random-useragent');

// // Enable stealth mode to avoid getting detected
// puppeteer.use(StealthPlugin());

// // List of proxies
// const proxies = [
//   { ip: '51.83.62.245', port: '8080' },
//   { ip: '185.195.71.218', port: '18080' },
//   { ip: '160.86.242.23', port: '8080' },
// ];

// // Add a delay between requests to mimic human behavior
// function delay(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// // Scrape Google with rotating proxies and user-agent
// async function scrapeGoogle(associationNumber) {
//   const results = [];
//   const browser = await puppeteer.launch({
//     headless: true,
//     args: [`--proxy-server=http://${proxies[0].ip}:${proxies[0].port}`] // Use the first proxy in the list initially
//   });

//   try {
//     for (const proxy of proxies) {
//       try {
//         console.log(`Testing proxy: ${proxy.ip}:${proxy.port}`);
        
//         const page = await browser.newPage();
//         const userAgent = randomUseragent.getRandom();
//         await page.setUserAgent(userAgent);

//         // await page.goto(`https://www.google.com/search?q="${associationNumber}"`, { waitUntil: 'networkidle2' });
//         await page.goto(`https://www.google.com/search?q="${associationNumber}"`, { waitUntil: 'networkidle2' });

//         // Extract search results from the page
//         const searchResults = await page.evaluate(() => {
//           const links = [];
//           const elements = document.querySelectorAll('div.g');
//           elements.forEach(el => {
//             const titleElement = el.querySelector('a h3');
//             const linkElement = el.querySelector('a');
//             const snippetElement = el.querySelector('.IsZvec');

//             if (titleElement && linkElement && snippetElement) {
//               links.push({
//                 title: titleElement.innerText,
//                 url: linkElement.href,
//                 snippet: snippetElement.innerText,
//               });
//             }
//           });
//           return links;
//         });

//         results.push(...searchResults);

//         await page.close();
//         await delay(Math.random() * 2000 + 3000); // Wait between 3-5 seconds

//       } catch (error) {
//         console.error(`Proxy failed: ${proxy.ip}:${proxy.port} - ${error.message}`);
//       }
//     }
//   } catch (error) {
//     console.error('Error during scraping:', error);
//   } finally {
//     await browser.close();
//   }

//   return results;
// }

// Example usage
// scrapeGoogle('580570950').then(results => {
//   console.log('Scraping results:', results);
// }).catch(error => {
//   console.error('Scraping failed:', error);
// });





// const { fetchProxyList } = require('./scraper');
// const axios = require('axios');
// const puppeteer = require('puppeteer');

// (async () => {
//   try {
//     const proxies = await fetchProxyList();
//     //console.log('Proxies fetched:', proxies);
//     proxies.forEach(proxy => {
//         console.log(proxy.ip)
//         console.log(proxy.port)
//         const test = { ip: proxy.ip, port: proxy.port };
//         testProxy(test);
//     });
    
//   } catch (error) {
//     console.error('Error:', error);
//   }
// })();


// async function testProxy(proxy) {
//   try {
//     const response = await axios.get('https://www.google.com', {
//       proxy: {
//         host: proxy.ip,
//         port: proxy.port,
//       },
//        timeout: 5000, // Set a timeout to avoid long waits
//     });
//     console.log('Proxy works:', response.status);
//   } catch (error) {
//     console.error('Proxy failed:', error.message);
//   }
// }

// // Test a proxy



