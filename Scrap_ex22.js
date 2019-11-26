
const puppeteer = require('puppeteer');
const options = {
	path: './screens/amazon-header.png',
	fullPage: false,
	clip: {
		x: 0,
		y: 0,
		width: 1280,
		height: 150
	}
}

puppeteer.launch({headless: false}).then(async browser => {
	const page = await browser.newPage();
	await page.setViewport({ width: 1280, height: 800 })
	await page.goto('https://www.amazon.com');
	await page.screenshot(options);
//	await page.waitFor(5000);
	await browser.close();
});


