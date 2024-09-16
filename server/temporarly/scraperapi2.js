const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
PROXY_USERNAME = 'scraperapi';
PROXY_PASSWORD = 'b9b7986690faf1a060b2cf74af029b9d';
PROXY_SERVER = 'proxy-server.scraperapi.com';
PROXY_SERVER_PORT = '8001';
const associationNumber = 580570950;

(async () => {
    const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: [
    '--proxy-server=http://${PROXY_SERVER}:${PROXY_SERVER_PORT}'
    ]
    });
    const searchUrl = `https://www.google.com/search?q="${associationNumber}"`;
    const page = await browser.newPage();
    await page.authenticate({
        username: PROXY_USERNAME,
        password: PROXY_PASSWORD,
    });
    try {
        await page.goto(searchUrl, {timeout: 180000});
        let bodyHTML = await page.evaluate(() => document.body.innerHTML);
        let $ = cheerio.load(bodyHTML);
        let article_headlines = $('a[href*="/r/webscraping/comments"] > div')
        article_headlines.each((index, element) => {
            title = $(element).find('h3').text()
            scraped_headlines.push({
                'title': title
            })
        });
    }
    catch(err) {
    console.log(err);
    }
    await browser.close();
    console.log(scraped_headlines)
    })();    
const render = 'true'

const keyword = "פירוק"
//.DKV0Md
const url = `https://www.google.com/search?q="${associationNumber}"+${keyword}`;
axios('http://api.scraperapi.com/', { 
    params: {
        'url': url,
        'api_key': API_KEY,
        'render' : render
    }})
.then(response => {
    const html = response.data;
    const $ = cheerio.load(html)
    const salePrice = $('.sale-price').text()
    console.log(salePrice);
})
.catch(console.error);