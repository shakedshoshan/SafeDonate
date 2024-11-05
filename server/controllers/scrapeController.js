const scraper = require('../utils/scraperDataaa.js');
const { processScrapedResults } = require('../utils/filterResults.js');
const { fetchContactInfo } = require('../utils/scrapeContactInfo.js');
const { flaskAPIBaseUrl } = require("./../config");
const axios = require("axios");

const scrapeOnline = async (req, res) => {
    const { associationNumber, category } = req.body;
     //const filteredResults = []
    const scrapedResults = [];

    console.log('Starting scraping process for association number:', associationNumber, category);
    try {
        // await scraper.scrapeData(associationNumber, category, (keyword, scrapedResults) => {
        //     const filtered = processScrapedResults(keyword, associationNumber, scrapedResults);
        //     filteredResults.push(filtered);
        // });
        // // console.log('Final filtered results:', filteredResults);
        // return res.status(200).json({ results: filteredResults });
        
        await scraper.scrapeDataaa(associationNumber, category, (keyword, results) => {
            scrapedResults.push({
                keyword,
                results
            });
        });

        // Get filter from Flask server
        const analyzeResults = await generateAnalyzer({
            results: scrapedResults,
            associationNumber,
        });
        console.log('Analyze Results:', analyzeResults);
        //return res.status(200).json({ analyzeResults });
        return res.status(200).json({ scrapedResults });

    } catch (error) {
        console.error('Error scraping online data:', error.message);
        return res.status(500).json({ error: 'Failed to scrape data' });
    }
}


// Function to scrape Google search results for a given association number and keywords
const generateAnalyzer = async (data) => {
    try {
        const flaskAPIUrl = `${flaskAPIBaseUrl}/analyze`;
        const response = await axios.post(flaskAPIUrl, data);
        return response.data;
    } catch (err) {
        console.error("Error processing data:", err);
        throw err;
    }
};


const getContactInfo = async (req, res) => {
    const { associationNumber } = req.body;
    try {
        const contactInfo = await fetchContactInfo(associationNumber);
        console.log('Contact Information:', contactInfo.address);
        return res.status(200).json({ contactInfo });

    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve contact information' });
    }
}


module.exports = { getContactInfo, scrapeOnline };