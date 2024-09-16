const scraper = require('../Utils/scraper.js');
//import { scrapeGoogle } from "../Utils/scraper";

// Function to scrape Google search results for a given association number and keywords
module.exports.scrapeOnline = async function scrapeOnline(req, res) {
    const associationNumber = req.params.associationNumber;
    //const associationNumber = 580007086//580570950;
    console.log('Starting scraping process for association number:', associationNumber);
    try {
        const results = await scraper.scrapeData(associationNumber);
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to scrape data' });
    }
}