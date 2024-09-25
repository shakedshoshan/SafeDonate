const scraper = require('../utils/scraperData.js');
const { processScrapedResults }  = require('../utils/filterResults.js');

// Function to scrape Google search results for a given association number and keywords
module.exports.scrapeOnline = async function scrapeOnline(req, res) {
    const { associationNumber, category } = req.body;
    const filteredResults = []
   
    console.log('Starting scraping process for association number:', associationNumber, category);
    try {
        await scraper.scrapeData(associationNumber, category, (keyword, scrapedResults) => {
           const filtered = processScrapedResults(keyword, associationNumber, scrapedResults);
           filteredResults.push(filtered);
        });
        console.log("yes")
        console.log('final results: ', filteredResults)
        return res.json({results: filteredResults});

    } catch (error) {
        console.log("no")
        console.log("Error during scraping or filtering:", error);
        return res.status(500).json({ error: 'Failed to scrape data' });
    }
}


// const scraper = require('../utils/scraper1.js');

// // Function to scrape Google search results for a given association number and keywords
// module.exports.scrapeOnline = async function scrapeOnline(req, res) {
//     const { associationNumber, category } = req.body;
   
//     console.log('Starting scraping process for association number:', associationNumber, category);
//     try {
//         const results = await scraper.scrapeData(associationNumber, category);
//         console.log("yes")
//         console.log(results)
//         return res.json(results);
//     } catch (error) {
//         console.log("no")
//         return res.status(500).json({ error: 'Failed to scrape data' });
//     }
// }