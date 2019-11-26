
const CREDS = require ('./creds');
const puppeteer = require('puppeteer');
const url = 'https://github.com/login/';

function run () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
				headless: false
/*
				slowMo: 250 
*/
			});

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
			await page.goto(url, {
				waitUntil: 'networkidle2',
				timeout: 3000000
			});
				
			// DOM element selectors
			const USERNAME_SELECTOR = '#login_field';
			const PASSWORD_SELECTOR = '#password'; 
			const BUTTON_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block'; 
			await page.waitForSelector(USERNAME_SELECTOR);

			await page.click(USERNAME_SELECTOR);  		// go to username field
			await page.keyboard.type(CREDS.username);	// pass your username
	
	await page.click(PASSWORD_SELECTOR);  		// go to password field
	await page.keyboard.type(CREDS.password);	// enter your password
		
	await page.click(BUTTON_SELECTOR);			// click on SIGN_IN button
	await page.waitForNavigation({waitUntil: 'networkidle2'});				// wait for results
		
	
	const userToSearch = 'john';
	const searchUrl = `https://github.com/search?q=${userToSearch}&type=Users&utf8=%E2%9C%93`;

	await page.goto(searchUrl);
	await page.waitForNavigation({waitUntil: 'networkidle2'});	
	
	// await page.waitFor(2*10000);

/*

#user_search_results > div.user-list > div:nth-child(1)
#user_search_results > div.user-list > div:nth-child(1) > div.d-flex.flex-auto > div
#user_search_results > div.user-list > div:nth-child(4) > div.d-flex.flex-auto > div > ul > li:nth-child(2) > a
#user_search_results > div.user-list > div:nth-child(8) > div.d-flex.flex-auto > div > ul > li:nth-child(2) > a

#user_search_results > div.user-list > div:nth-child(4) > div.d-flex.flex-auto > div > a > em
	
#user_search_results > div.user-list > div:nth-child(4) > div.d-flex.flex-auto > div > ul > li:nth-child(2) > a
#user_search_results > div.user-list > div:nth-child(4) > div.d-flex.flex-auto > div > ul > li:nth-child(2) > a	
*/
	
	// await browser.close();
}

run();