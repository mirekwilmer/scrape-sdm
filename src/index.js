const fs = require("fs");
const puppeteer = require("puppeteer");
const loadFsas = require('./loadFsas')

const CLINIC_FINDER_URL = "https://clinicfinder.shoppersdrugmart.ca/";
const FSA_FILE = './FSA.csv'

async function main() {
  const fsas = await loadFsas(FSA_FILE)

  try {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();

    async function getData(fsa) {
      await page.goto(CLINIC_FINDER_URL, {
        waitUntil: "networkidle2",
        timeout: 3000000
      });

      let s = t => new Promise(r => setTimeout(r, t));

      await page.waitForSelector("#search-input");
      await page.focus("#search-input");
      await page.keyboard.type(fsa);
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

      let data = await page.evaluate(() => {
        let searchResults = Array.from(
          document.querySelectorAll(".search-result")
        );
        return searchResults.map(result => {
          let name = result.querySelector("label.sb.purple").innerText;
          let city = result.querySelector("label.ssb.black-font").innerText;
          let address = result.querySelector("p.sr").innerText;

          let details = result.querySelector(
            ".row:nth-child(2) > div:last-child .col:first-child > a"
          ).href;

          let directions = result.querySelector(
            ".row:nth-child(2) > div:last-child .col:last-child > a"
          ).href;

          return {
            name,
            city,
            address,
            details,
            directions
          };
        });
      });

      // save data as JSON

      await new Promise((resolve, reject) => {
        fs.writeFile("./json/" + fsa + "-data.json", JSON.stringify(data, null, 2), err => {
          if (err) {
            reject(err);
          } else {
            resolve();
            console.log(fsa + " Done.");
          }
        });
      });
    }

    for (let f of fsas) {
      await getData(f);
    }

    console.log("finished");
    browser.close();

    // all done, close this browser
  } catch (error) {
    // if something went wrong display the error
    console.log(error);
  }
}

main();