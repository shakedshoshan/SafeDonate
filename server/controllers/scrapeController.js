const scraper = require('../utils/scraperData.js');
const { processScrapedResults } = require('../utils/filterResults.js');
const { fetchAssociationLink } = require('../utils/scrapeLink.js');

const getLink = async (req, res) => {
    const { associationNumber } = req.body;
    try {
        const link = await fetchAssociationLink(associationNumber);
        // console.log(link.message)
        // if (!link) {
        //     throw new Error('Link not found');
        // }
        console.log('controller link: ', link)
        return res.status(200).json({ link });

    } catch (error) {
        return res.status(500).json({ error: 'Failed to scrape link' });

    }
}

// Function to scrape Google search results for a given association number and keywords
const scrapeOnline = async (req, res) => {
    const { associationNumber, category } = req.body;
    const filteredResults = []

    console.log('Starting scraping process for association number:', associationNumber, category);
    try {
        await scraper.scrapeData(associationNumber, category, (keyword, scrapedResults) => {
            const filtered = processScrapedResults(keyword, associationNumber, scrapedResults);
            filteredResults.push(filtered);
        });
        // console.log('Final filtered results:', filteredResults);
        return res.status(200).json({ results: filteredResults });

    } catch (error) {
        console.error('Error scraping online data:', error.message);
        return res.status(500).json({ error: 'Failed to scrape data' });
    }
}

module.exports = { getLink, scrapeOnline };