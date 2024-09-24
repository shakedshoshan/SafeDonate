const scraper = require('../Utils/scraper1.js');

// Function to scrape Google search results for a given association number and keywords
module.exports.scrapeOnline = async function scrapeOnline(req, res) {
    const { associationNumber, category } = req.body;
   
    console.log('Starting scraping process for association number:', associationNumber, category);
    try {
        const results = await scraper.scrapeData(associationNumber, category);
        console.log("yes")
        console.log(results)
        return res.json(results);
    } catch (error) {
        console.log("no")
        return res.status(500).json({ error: 'Failed to scrape data' });
    }
}