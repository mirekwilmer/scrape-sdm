
const puppeteer = require('puppeteer');
const fs = require('fs');

(async() => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	
	const url = 'https://www.youtube.com';
	await page.goto(url, {
		waitUntil: 'networkidle0',      // 'networkidle2'
		timeout: 3000000
	});
	const html = await page.content();
	
	//save our html in a file
	fs.writeFile('./html/page.html', html, _ => console.log('HTML saved'));

	await browser.close();
})();