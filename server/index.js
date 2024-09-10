// Load environment variables
require('dotenv').config();

// Import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/userRoute.js');
const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());

app.use('/users', userRouter);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('App connected to database');
    const server = app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
    console.error('Error connecting to database:', error);
    //process.exit(1);
  });

// Routes

// Define the keywords you want to search for
// const keywords = ['הליכים משפטיים', 'הליכים', 'פלילי', 'פירוק', 'עמותה'];
const keywords = ['עמותה'];
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.get('/scrape/:associationNumber', async (req, res) => {
  const associationNumber = req.params.associationNumber;
  console.log('Starting scraping process for association number:', associationNumber);

  try {
  // Launch Puppeteer to open a headless browser
  const browser = await puppeteer.launch({ headless: true });
  const results = [];

  for (const keyword of keywords) {
    // Create the Google search URL for the current keyword
    const searchUrl = `https://www.google.com/search?q="${associationNumber}"+${keyword}`;
    const page = await browser.newPage();

    // Set a random User-Agent for each page request
    const userAgent = randomUseragent.getRandom();
    await page.setUserAgent(userAgent);
    
    // Go to the search URL
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    // Extract relevant links and titles from the search result page
    const searchResults = await page.evaluate(() => {
      const links = [];
   
    const elements = document.querySelectorAll('div.g');

    elements.forEach(el => {
      const titleElement = el.querySelector('a h3');
      const linkElement = el.querySelector('a');
      const snippetElement = el.querySelector('.VwiC3b'); // Class for the snippet under the title

      if (titleElement && linkElement && snippetElement) {
        links.push({
          title: titleElement.innerText,
          url: linkElement.href,
          snippet: snippetElement.innerText,
        });
      }
    });

    return links;
  });
  console.log(`Search results for keyword: ${keyword}`);
  console.log(searchResults);

  // Filter results to include only those with both the association number and keyword in the snippet
  const filteredResults = searchResults.filter(result => 
    result.snippet.includes(associationNumber) && result.snippet.includes(keyword)
  );

  // Debug: Log the filtered results
  console.log(`Filtered results for keyword: ${keyword}`);
  console.log(filteredResults);

    // Add the keyword to each result for reference
    filteredResults.forEach(result => {
      result.keyword = keyword;
    });

    // Combine search results for each keyword
    results.push(...filteredResults);
    await page.close();

     // Debug: Wait a bit to slow down scraping and prevent rate-limiting
     await delay(Math.floor(Math.random() * 3000) + 1000); // Delay between 1s and 4s
  }

  // Close the browser after all searches
  await browser.close();

  // Send the combined results as JSON response
  res.json(results);

} catch (error) {
  console.error('Error during scraping:', error);
  res.status(500).json({ error: 'Failed to scrape data' });
}
  
  // try {
  //   // Launch Puppeteer to open a headless browser
  //   const browser = await puppeteer.launch({ });
  //   const results = [];

  //   for (const keyword of keywords) {
  //     // Create the Google search URL for the current keyword
  //     const searchUrl = `https://www.google.com/search?q=${associationNumber}+${keyword}`;
  //     const page = await browser.newPage();
      
  //     // Go to the search URL
  //     await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  //     // Extract relevant links and titles from the search result page
  //     const searchResults = await page.evaluate(() => {
  //       const links = [];
  //       const elements = document.querySelectorAll('a h3');
  //       elements.forEach(el => {
  //         const parent = el.closest('a');
  //         if (parent) {
  //           links.push({ 
  //             title: el.innerText,
  //              url: parent.href 
  //           });
  //         }
  //       });
  //       return links;
  //     });

  //     // // Filter the results where both associationNumber and keyword are in the URL
  //   const filteredResults = searchResults.filter(result => 
  //     result.url.includes(associationNumber) && result.url.includes(encodeURIComponent(keyword))
  //   );

  //     // Add the keyword to each result for reference
  //     filteredResults.forEach(result => {
  //       result.keyword = keyword;
  //     });

  //     // Combine search results for each keyword
  //     results.push(...filteredResults);
  //     await page.close();
  //   }

  //   // Close the browser after all searches
  //   await browser.close();

  //   // Send the combined results as JSON response
  //   res.json(results);

  // } catch (error) {
  //   console.error('Error during scraping:', error);
  //   res.status(500).json({ error: 'Failed to scrape data' });
  // }
});




// try {
//   // Launch Puppeteer to open a headless browser
//   const browser = await puppeteer.launch({ headless: true });
//   const results = [];

//   for (const keyword of keywords) {
//     // Create the Google search URL for the current keyword
//     const searchUrl = `https://www.google.com/search?q="${associationNumber}"+${keyword}`;
//     const page = await browser.newPage();

//     // Set a random User-Agent for each page request
//     const userAgent = randomUseragent.getRandom();
//     await page.setUserAgent(userAgent);
    
//     // Go to the search URL
//     await page.goto(searchUrl, { waitUntil: 'networkidle2' });

//     // Extract relevant links and titles from the search result page
//     const searchResults = await page.evaluate(() => {
//       const links = [];
//     //   const elements = document.querySelectorAll('a h3');
      
//     //   elements.forEach(el => {
//     //     const parent = el.closest('a');
//     //     if (parent) {
//     //       links.push({ 
//     //         title: el.innerText,
//     //         url: parent.href 
//     //       });
//     //     }
//     //   });
//     //   return links;
//     // });

//     // // Filter the results where both associationNumber and keyword are in the URL
//     // const filteredResults = searchResults.filter(result => 
//     //   result.url.includes(associationNumber) && result.url.includes(encodeURIComponent(keyword))
//     // );
//     const elements = document.querySelectorAll('div.g');

//     elements.forEach(el => {
//       const titleElement = el.querySelector('a h3');
//       const linkElement = el.querySelector('a');
//       const snippetElement = el.querySelector('.VwiC3b'); // Class for the snippet under the title

//       if (titleElement && linkElement && snippetElement) {
//         links.push({
//           title: titleElement.innerText,
//           url: linkElement.href,
//           snippet: snippetElement.innerText,
//         });
//       }
//     });

//     return links;
//   });
//   console.log('Search results for keyword:', keyword);
//   console.log(searchResults);

//   // Filter results to include only those with both the association number and keyword in the snippet
//   const filteredResults = searchResults.filter(result => 
//     result.snippet.includes(associationNumber) && result.snippet.includes(keyword)
//   );

//     // Add the keyword to each result for reference
//     filteredResults.forEach(result => {
//       result.keyword = keyword;
//     });

//     // Combine search results for each keyword
//     results.push(...filteredResults);
//     await page.close();
//   }

//   // Close the browser after all searches
//   await browser.close();

//   // Send the combined results as JSON response
//   res.json(results);

// } catch (error) {
//   console.error('Error during scraping:', error);
//   res.status(500).json({ error: 'Failed to scrape data' });
// }


// app.get('/scrape/:associationNumber', async (req, res) => {
//   const associationNumber = req.params.associationNumber;
//   console.log('hello index')
//   try {
//     // Launch Puppeteer to open a headless browser
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
    
//     // Perform Google search with the association number
//     const searchUrl = `https://www.google.com/search?q=${associationNumber}+עמותה`;
//     await page.goto(searchUrl, { waitUntil: 'networkidle2' });

//     // Extract relevant links and titles from the search result page
//     const searchResults = await page.evaluate(() => {
//       const links = [];
//       const elements = document.querySelectorAll('a h3'); // This selects the title of each result
//       elements.forEach(el => {
//         const parent = el.closest('a');
//         if (parent) {
//           links.push({ title: el.innerText, url: parent.href });
//         }
//       });
//       return links;
//     });

//     // Close the browser
//     await browser.close();

//     // Send the extracted data as JSON response
//     res.json(searchResults);

//   } catch (error) {
//     console.error('Error scraping:', error);
//     res.status(500).json({ error: 'Failed to scrape data' });
//   }
// });

app.get('/', (req, res) => {
  res.send('Hello World!');
});
