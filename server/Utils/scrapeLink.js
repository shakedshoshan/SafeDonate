const puppeteer = require('puppeteer');
const cheerio = require("cheerio");

const fetchAssociationLink = async (associationNumber) => {
    const url = `https://www.guidestar.org.il/organization/${associationNumber}/contact`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        const data = await page.content();

        const $ = cheerio.load(data);
        const websiteLink = $(".malkar-contact-web .malkar-contact-section a[href^='http']").first().attr("href");
        const emailLink = $(".malkar-contact-info .malkar-contact-detail a[href^='mailto']").first().attr("href");
        const phoneNumber = $(".malkar-contact-phone a[href^='tel']").first().text();

        await browser.close();

        if (websiteLink) return websiteLink;
        if (emailLink) return emailLink.replace("mailto:", "");
        if (phoneNumber) return phoneNumber;

        return "NO_CONTACT_INFO";
        // throw { status: 404, message: "No contact information available." };
    } catch (error) {
        await browser.close();
        if (error.response) {
            // If the error is due to a bad response from axios
            throw { status: 500, message: 'Error fetching data from external source.' };
        }
        throw error; // Rethrow the original error if it's not from axios

        // console.error('Error fetching link with Puppeteer:', error.message);
        
        // return "Error: Unable to fetch contact information.";
    }
};

module.exports = { fetchAssociationLink };