const puppeteer = require('puppeteer');
const cheerio = require("cheerio");

const fetchContactInfo = async (associationNumber) => {
    const url = `https://www.guidestar.org.il/organization/${associationNumber}/contact`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Navigate to page and wait for content to load
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Wait for main content container
        await page.waitForSelector('.malkar-contact-section', { timeout: 5000 }).catch(() => null);
        
        const data = await page.content();
        const $ = cheerio.load(data);

        // Extract contact info
        const websiteLink = $(".malkar-contact-web .malkar-contact-section a[href^='http']").first().attr("href");
        const emailLink = $(".malkar-contact-info .malkar-contact-detail a[href^='mailto']").first().attr("href");
        
        const phoneNumbers = [];
        $(".malkar-contact-phone-num-wrapper .malkar-contact-detail.malkar-contact-phone a[href^='tel']").each((index, element) => {
            const phoneNumber = $(element).text().trim();
            if (phoneNumber && /^[\d\-+\s()]+$/.test(phoneNumber)) {
                phoneNumbers.push(phoneNumber);
            }
        });

        const fullAddress = $(".malkar-contact-detail.ng-star-inserted")
            .not(".malkar-contact-phone")
            .text()
            .trim();

        await browser.close();

        // Build contact info object, only including fields with valid data
        const contactInfo = {};

        if (websiteLink && websiteLink.startsWith('http')) {
            contactInfo.website = websiteLink;
        }

        if (emailLink && emailLink.includes('@')) {
            contactInfo.email = emailLink.replace("mailto:", "").trim();
        }

        if (phoneNumbers.length > 0) {
            contactInfo.phoneNumbers = phoneNumbers;
        }

        if (fullAddress && fullAddress.length > 0) {
            contactInfo.address = fullAddress;
        }

        // Return the contact info even if only some fields are populated
        return contactInfo;

    } catch (error) {
        console.error('Error fetching association contact:', error);
        await browser.close();
        throw error;
    }
};

module.exports = { fetchContactInfo };