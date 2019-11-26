
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhonex = devices['iPhone X'];
const url = 'https://www.google.ca';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulate(iPhonex);

  	await page.goto(url, {
		waitUntil: 'networkidle2',
		timeout: 3000000
	});
  
  await page.focus('#tsf > div:nth-child(2) > div.A7Yvie.emca > div.zGVn2e > div > div.a4bIc > input');
  await page.keyboard.type('Piszemy przez Puppeteer !');
  await page.screenshot({ path: './screens/keyboard_ca.png' });
  await browser.close();
})()

// input.gLFyf.gsfi

//#tsf > div:nth-child(2) > div > div.RNNXgb > div > div.a4bIc > input

//#tsf > div:nth-child(2) > div.A7Yvie.emca > div.zGVn2e > div > div.a4bIc > input

