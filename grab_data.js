
// load puppeteer
const puppeteer = require('puppeteer')
const fs = require('fs')
const url = 'https://clinicfinder.shoppersdrugmart.ca/';

void (async () => {

	try {
		// create new browser instance
		const browser = await puppeteer.launch({
				headless: false
/*
			slowMo: 150 
*/
		})
		// create a page inside the browser
		const page = await browser.newPage()
					// allow only 'document' type requests
/*					
        await page.setRequestInterception(true);
            page.on('request', (request) => {
                if (request.resourceType() === 'document') {
                    request.continue();
                } else {
                    request.abort();
                }
        });	
*/		
		// navigate to a website 

		await page.goto(url, {
			waitUntil: 'networkidle2',
			timeout: 3000000
		});
	
		// problems here ....
		
		// enter data for location and wait for navigation
		const [response1] = await Promise.all([
			await page.waitForSelector('#search-input'),
			await page.focus('#search-input'),
			await page.keyboard.type('Montreal'),
			page.keyboard.press('Enter')				
		])
		

		await page.focus('#search-input')
		const [response2] = await Promise.all([		
			page.waitForNavigation({ waitUntil: 'networkidle0' }),
			page.click('#search-button'),
		])		
		const [response3] = await Promise.all([
			page.waitForNavigation({ waitUntil: 'networkidle0' }), 
			page.keyboard.press('Enter')	
		])

// the following is not finished ...
/*
		// grab the mydata on loop 
		const mydata = awaits page.evaluate(() => {
			// helper function grabFromRow
			const grabFromRow = (row, classname) => row
				.querySelector('td.${classname}')
				.innerText
				.trim()
			
			// our selectors
			const MYDATA_ROW_SELECTOR = 'xx.zzzz'
			// array to store the data
			const adata = []
			// get number of rows
			const dataRows = document.query.SelectorAll(MYDATA_ROW_SELECTOR)
			
			// loop over for each row getting data - this is example to modify
			
			for (const tr of dataRows) {
				adata.push ({
					name: grabFromRow (tr, 'name'),
					addres1:  grabFromRow (tr, 'addres1'),
					city: 	  grabFromRow (tr, 'city'),
					province: grabFromRow (tr, 'province'),
					postal:   grabFromRow (tr, 'postal'),
					phone: 	  grabFromRow (tr, 'phone')   // .... etc
				})
			}
			// return data to mydata variable	
			return adata
		}
		
		
		// save data as JSON

		fs.writeFile(
			'./json/mydata.json',
			JSON.stringify(mydata, null, 2),
			(err) => err ? console.error('Data not saved!', err):console.log('Data saved OK.')
		)
*/		
		// all done, close this browser
		await browser.close()
		
	} catch (error) {
		
		// if something went wrong display the error 
		console.log(error)
	}
  
})()