
// load puppeteer
const puppeteer = require('puppeteer')

void (async () => {
	// wrapper fro errors
	try {
		// create new browser instance
		const browser = await puppeteer.launch({
				headless: false
/*
			headless: false,
			slowMo: 250 
*/
		})
		// create a page inside the browser
		const page = await browser.newPage()
		
		// navigate to a website 
		await page.goto('https://clinicfinder.shoppersdrugmart.ca/')

		// Get the "viewport" of the page, as reported by the page.
		await page.evaluate(() => console.log(`url is ${location.href}`))
  
		const dimensions = await page.evaluate(() => {
			return {
				width: document.documentElement.clientWidth,
				height: document.documentElement.clientHeight,
				deviceScaleFactor: window.devicePixelRatio
			}
		})
		// display dimensions on the console 
		console.log('Dimensions:', dimensions)

		// take a screenshot and save it 
		await page.screenshot({
			path: './screenshots/shoppers.png'
		})

		// generate a pdf and save it	
		/*
		await page.pdf({
			path: './pdfs/shoppers.pdf',
			format: 'A4'
		})
		*/	
		page.on('console', msg => console.log('PAGE LOG:', msg.text()))
		
		// all done, close this browser
		await browser.close()
		
	} catch (error) {
		
		// if something went wrong display the error 
		console.log(error)
	}
  
})()