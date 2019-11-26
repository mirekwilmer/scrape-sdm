
const puppeteer = require('puppeteer');

const devices = require('puppeteer/DeviceDescriptors');
const iPhonex = devices['iPhone 7 Plus'];

puppeteer.launch({headless:false}).then(async browser => {
	const page = await browser.newPage();
	//We use here page.emulate so no more need to set the viewport separately
	//await page.setViewport({ width: 1280, height: 800 })
	await page.emulate(iPhonex);
	await page.goto('https://www.homedepot.com/');
	await page.screenshot({ path: './screens/homedepot-iphone_7_plus.png'});

await browser.close();
});

