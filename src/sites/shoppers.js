let s = require('../sleep')

exports.url = 'https://clinicfinder.shoppersdrugmart.ca/'

exports.getFsaData = async ({ page, fsa }) => {
  try {
    await page.waitForSelector('#search-input')
    await page.focus('#search-input')
    await page.keyboard.type(fsa)
    await page.focus('#search-input')
    await page.waitForSelector('.pac-container')

    await s(2000)
    await page.keyboard.press('ArrowDown')
    await s(1000)
    await page.click('body')
    await s(1000)
    await page.focus('#search-button')
    await page.click('#search-button')
  } catch (err) {
    console.log(err.message)
    return
  }

  await s(2000)

  let [data] = await page.evaluate(() => {
    let searchResults = Array.from(document.querySelectorAll('.search-result'))
    return searchResults.map(result => {
      let name = result.querySelector('label.sb.purple').innerText
      let city = result.querySelector('label.ssb.black-font').innerText
      let address = result.querySelector('p.sr').innerText

      let details = result.querySelector(
        '.row:nth-child(2) > div:last-child .col:first-child > a',
      ).href

      let directions = result.querySelector(
        '.row:nth-child(2) > div:last-child .col:last-child > a',
      ).href

      return [name, city, address, details, directions]
    })
  })

  return data
}
