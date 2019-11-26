
const puppeteer = require('puppeteer');
const url = 'https://www.google.com';

puppeteer.launch().then(async browser => {
	const page = await browser.newPage();

	await page.goto(url, {
		waitUntil: 'networkidle2',
		timeout: 3000000
	});
	const title = await page.title()
	console.log(title)
	await browser.close();
});

