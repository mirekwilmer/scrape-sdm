
const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch();
	// or setup proxy to avoid problems ....
	//const browser = await puppeteer.launch({args: [ '--proxy-server=127.0.0.1:3030' ], headless:false});
  
	const page = await browser.newPage();
	await page.setExtraHTTPHeaders({Referer: 'https://sparktoro.com/'}) 
	
//  	await page.goto('https://sparktoro.com/trending');
	await page.goto('https://sparktoro.com/trending', {
		waitUntil: 'networkidle2',
		timeout: 3000000
	});
	await page.waitForSelector('div.title > a');

	const stories = await page.evaluate(() => {
		const links = Array.from(document.querySelectorAll('div.title > a'))
		return links.map(link => link.href).slice(0, 10)
	})

  	console.log(stories);
    await browser.close();
})();