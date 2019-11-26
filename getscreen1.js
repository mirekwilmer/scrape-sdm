const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://news.bitcoin.com');
  await page.screenshot({path: 'bitcoin_news.png'});

  await browser.close();
})();
