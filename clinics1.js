
// load puppeteer
const puppeteer = require("puppeteer");
const fs = require("fs");
const url = "https://clinicfinder.shoppersdrugmart.ca/";
 
async function main() {
  try {
    // create new browser instance
    const browser = await puppeteer.launch({
      headless: false
      /*
            slowMo: 150
*/
    });
    // create a page inside the browser
    const page = await browser.newPage();
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
      waitUntil: "networkidle2",
      timeout: 3000000
    });
 
    let s = t => new Promise(r => setTimeout(r, t));
 
    await page.waitForSelector("#search-input");
    await page.focus("#search-input");
    await page.keyboard.type("J7V");
    await page.focus("#search-input");
    await page.waitForSelector(".pac-container");
 
    await s(2000);
    await page.keyboard.press("ArrowDown");
    await s(1000);
    await page.click("body");
    await s(1000);
    await page.focus("#search-button");
    await page.click("#search-button");
 
    await s(2000);

	// get lenght of the list
	const LENGTH_SELECTOR_CLASS = 'search-result';
		let listLength = await page.evaluate((sel) => {
			return document.getElementsByClassName(sel).length;
		}, LENGTH_SELECTOR_CLASS);
//	console.log(123, listLength)

	const LIST_NAME_SELECTOR = '#search-container > div:nth-child(IDX) > div > div:nth-child(1) > div.col > label.sb.purple';
	const LIST_CITY_SELECTOR = '#search-container > div:nth-child(IDX) > div > div:nth-child(1) > div.col > label.ssb.black-font';
	const LIST_ADDRESS_SELECTOR = '#search-container > div:nth-child(IDX) > div > div:nth-child(1) > div.col > p';
	const LIST_DETAILS_SELECTOR = '#search-container > div:nth-child(IDX) > div > div:nth-child(2) > div.col > div > div:nth-child(1) > a';
	const LIST_WEBPAGE_SELECTOR = '#search-container > div:nth-child(IDX) > div > div:nth-child(2) > div.col > div > div:nth-child(2) > a';
	
	for (let i = 1; i <= listLength; i++) {
    // change the index to the next child
		let nameSelector = LIST_NAME_SELECTOR.replace("IDX", i); 
		let citySelector = LIST_CITY_SELECTOR.replace("IDX", i);
		let addrSelector = LIST_ADDRESS_SELECTOR.replace("IDX", i);
		let detSelector  = LIST_DETAILS_SELECTOR.replace("IDX", i);
		let webSelector  = LIST_WEBPAGE_SELECTOR.replace("IDX", i);
		
		let name = await page.evaluate((sel) => {
			return document.querySelector(sel).getAttribute('innerText');
		}, nameSelector);
		if (!name) {
			console.log('ind = ', i,' name is NULL.\r');
			continue;
		}
		
		let city = await page.evaluate((sel) => {
			return document.querySelector(sel).getAttribute('innerText');
		}, citySelector);
		if (!city)
			continue;

		let addr = await page.evaluate((sel) => {
			return document.querySelector(sel).getAttribute('innerText');
		}, addrSelector);
		if (!addr)
			continue;

		let details = await page.evaluate((sel) => {
			return document.querySelector(sel).getAttribute('href');
		}, detSelector);
		if (!details)
			continue;

		let webpage = await page.evaluate((sel) => {
			return document.querySelector(sel).getAttribute('href');
		}, webSelector);
		if (!webpage)
			continue;

    console.log('{\r');
	console.log('name = ', name,'\r');
	console.log('city = ', city,'\r');
	console.log('addr = ', addr,'\r');
	console.log('details = ', details,'\r');
	console.log('direction = ', webpage,'\r');	
	console.log('}');
	
    // TODO save this user
	}
		
		
		
   
/*   
    let r = await page.evaluate(() => {

		let names = Array.from(document.querySelectorAll('.search-result label.purple')).map(x => x.innerText)
		let cities = Array.from(document.querySelectorAll('.search-result label.ssb.black-font')).map(x => x.innerText)
		let addresses = Array.from(document.querySelectorAll('.search-result p.sr')).map(x => x.innerText)
     	let wdetails = Array.from(document.querySelectorAll(".search-result .text-button")).map(x => x.href)
		let wdirects = Array.from(document.querySelectorAll(".search-result a.text-button")).map(x => x.href)
		return names.map((name, i) => ({
			name,
			city: cities[i],
			address: addresses[i],
			details: wdetails[i],
			direction: wdirects[i]
		}))
    });
   
    console.log(123, r)
*/ 
 
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
                    city:     grabFromRow (tr, 'city'),
                    province: grabFromRow (tr, 'province'),
                    postal:   grabFromRow (tr, 'postal'),
                    phone:    grabFromRow (tr, 'phone')   // .... etc
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
    console.log(error);
  }
}
 
main();

