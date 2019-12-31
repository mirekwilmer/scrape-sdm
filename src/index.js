require('dotenv').config()

const fs = require('fs')
const puppeteer = require('puppeteer')
const loadFsas = require('./loadFsas')

const site = process.argv[2]

const { url, getFsaData } = require('./sites/' + site)

const data_dir = 'data/' + site
const FSA_FILE = 'src/FSA.csv'

if (!fs.existsSync(data_dir)) {
  fs.mkdirSync(data_dir)
}

async function main() {
  let page

  async function getAllData(fsa) {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 3000000,
    })

    let data = await getFsaData({ page, fsa })

    // save data as JSON

    await new Promise((resolve, reject) => {
      fs.appendFile(`./${data_dir}/data.csv`, data.join('|') + '\n', err => {
        if (err) {
          reject(err)
        } else {
          resolve()
          console.log(fsa + ' Done.')
        }
      })
    })
  }

  const fsas = await loadFsas(FSA_FILE)

  try {
    const browser = await puppeteer.launch({
      headless: false,
    })

    page = await browser.newPage()

    for (let f of fsas) {
      await getAllData(f)
    }

    console.log('finished')
    // browser.close()

    // all done, close this browser
  } catch (error) {
    // if something went wrong display the error
    console.log(error)
  }
}

main()
