const puppeteer = require("puppeteer");
  const cheerio = require("cheerio");
 const getBooksData = async () => {
  const url = "https://www.google.com/search?q=merchant+of+venice&gl=us&tbm=bks";
 browser = await puppeteer.launch({
    headless: true,
    args: ["--disabled-setuid-sandbox", "--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36 Agency/97.8.6287.88",
  });
  await page.goto(url, { waitUntil: "domcontentloaded" });
  let books_results = [];
  books_results = await page.evaluate(() => {
     return Array.from(document.querySelectorAll(".Yr5TG")).map((el) => {
        return {    
            title: el.querySelector(".DKV0Md")?.textContent,
            writers: el.querySelector(".N96wpd")?.textContent,
            description: el.querySelector(".cmlJmd")?.textContent,
            thumbnail: el.querySelector("img").getAttribute("src"),
        }
    })
  });
  console.log(books_results)
  await browser.close();
};
getBooksData();