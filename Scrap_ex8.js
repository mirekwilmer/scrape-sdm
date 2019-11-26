
const puppeteer = require('puppeteer');

(async() => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	
	await page.setRequestInterception(true);
	page.on('request', request => {
		if (request.resourceType() === 'script')
			request.abort();
		else
			request.continue();
	});
	const url = 'https://www.youtube.com';
	await page.goto(url, {
		waitUntil: 'networkidle2',
		timeout: 3000000
	});
	await page.screenshot({path: './screens/youtube-nojs.png'});

	await browser.close();
})();