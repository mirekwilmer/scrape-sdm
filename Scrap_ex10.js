
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless:false, slowMo: 100});
  const page = await browser.newPage();
  
  //Go to my page and wait until the page loads
  await page.goto('https://www.aymen-loukil.com/en/contact-aymen/', {		waitUntil: 'networkidle0'});
  await page.waitForSelector('#post-311 > div > header > h1');

  //type the name
  await page.focus('#wpcf7-f671-p311-o1 > form > p:nth-child(2) > label > span > input')
  await page.keyboard.type('PuppeteerBot');
  //type the email
  await page.focus('#wpcf7-f671-p311-o1 > form > p:nth-child(3) > label > span > input')
  await page.keyboard.type('PuppeteerBot@mail.com');
  //type the message
  await page.focus('#wpcf7-f671-p311-o1 > form > p:nth-child(5) > label > span > textarea')
  await page.keyboard.type("Hello Mirek ! It is me your PuppeteerBot, i test your contact form !");
  //Click on the submit button
  await page.click('#wpcf7-f671-p311-o1 > form > p:nth-child(6) > input')  
  await page.screenshot({ path: './screens/form.png', fullPage: true });
  
  await browser.close();
	
})();
