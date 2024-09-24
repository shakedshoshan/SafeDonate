const scraper = require('../Utils/scraper.js');

// Function to scrape Google search results for a given association number and keywords
module.exports.scrapeOnline = async function scrapeOnline(req, res) {
    const { associationNumber, category } = req.body;
   
    console.log('Starting scraping process for association number:', associationNumber, category);
    try {
        const results = await scraper.scrapeData(associationNumber, category);
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to scrape data' });
    }
}