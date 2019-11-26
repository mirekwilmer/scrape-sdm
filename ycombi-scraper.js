
const puppeteer = require('puppeteer');
const pagesToScrape = process.argv[2];

function run () {
    return new Promise(async (resolve, reject) => {
        try {
			if (!pagesToScrape) {
                pagesToScrape = 1;		
            }
            const browser = await puppeteer.launch();
		/*	{
				userDataDir: './data',
			});
		*/	
            const page = await browser.newPage();
			// allow only 'document' type requests
            await page.setRequestInterception(true);
            page.on('request', (request) => {
                if (request.resourceType() === 'document') {
                    request.continue();
                } else {
                    request.abort();
                }
            });	
			
            await page.goto("https://news.ycombinator.com/");
			
            let currentPage = 1;
			let nni = 0;
            let urls = [];
		    
			while (currentPage <= pagesToScrape ) {
				await page.waitForSelector('a.storylink');
				let newUrls = await page.evaluate(() => {
					let results = [];
					let items = document.querySelectorAll('a.storylink');
					items.forEach((item) => {
						results.push({
							url:  item.getAttribute('href'),
							text: item.innerText,
						});
					});
					return results;
				});
				nni = nni + newUrls.length;
				urls = urls.concat(newUrls);
				if (currentPage < pagesToScrape) {
					await Promise.all([
						await page.waitForSelector('a.morelink'),
						await page.click('a.morelink'),
						await page.waitForSelector('a.storylink')
					])
				}			
				currentPage++;
			}				
					
			// save data as JSON
			const fs = require('fs')
		
			fs.writeFile(
				'./json/mdata1.json',
				JSON.stringify(urls, null, 2),
				(err) => err ? console.error('Data not saved!', err):console.log('Saved ', nni,' items OK.')
			)
		
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}

run().then(console.log).catch(console.error);
