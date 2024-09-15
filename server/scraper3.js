const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const associationNumber = 580570950
const keyword = "הליכים"

const getAssociationName = async () => {
    searchUrl = `https://www.google.com/search?q="${associationNumber}"+${keyword}`;
 browser = await puppeteer.launch({
    headless: true,
    args: ["--disabled-setuid-sandbox", "--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36 Agency/97.8.6287.88",
  });
  await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
  let association_results = [];
  association_results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".Ww4FFb")).map((el) => {    
        return {    
            title: el.querySelector(".DKV0Md")?.textContent,
        }
    })
  });
  console.log(association_results)
  await browser.close();
};
getAssociationName();