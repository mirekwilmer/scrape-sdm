const puppeteer = require('puppeteer');

const url = process.argv[2];
if (!url) {
    throw "Please provide URL as a first argument";
}
async function run() {
  try {	
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url, {
		waitUntil: 'networkidle2',
		timeout: 3000000
		});
	await page.screenshot({path: './screens/github.png'});
	await browser.close();
  } catch (error) {
	// if something went wrong display the error 
	console.log(error)
  }
}
run();
