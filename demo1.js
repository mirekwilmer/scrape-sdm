const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
		headless: false,
		slowMo: 250 
		});
  const page = await browser.newPage();
  await page.goto('https://www.iqvia.com');

  // Get the "viewport" of the page, as reported by the page.
  await page.evaluate(() => console.log(`url is ${location.href}`));
  
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });

  console.log('Dimensions:', dimensions);
  
  // await page.pdf({path: 'iqvia.pdf', format: 'A4'});
  await page.screenshot({path: 'iqvia.png'});
  
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await browser.close();
})();