let s = require('../sleep')

exports.url = 'https://canntrust.ca/find-a-clinic/'

exports.getFsaData = async ({ page, fsa }) => {
  try {
    page.addStyleTag({
      content: `
      .age-gate-wrapper, 
      .spu-bg, 
      .spu-box,
      .hustle-slidein {
        display: none !important;
      }
    `,
    })

    let input = '#wpsl-search-input'
    await page.waitForSelector(input)
    await page.focus(input)
    await page.keyboard.type(fsa)

    await page.click('#wpsl-radius .wpsl-selected-item')
    // await page.keyboard.type(fsa)
    await s(200)
    await page.click('.wpsl-active li:last-child')
    await s(200)

    await page.click('#wpsl-results .wpsl-selected-item')
    await s(200)
    await page.click('.wpsl-active li:last-child')
    await s(200)

    await page.click('#wpsl-search-btn')
  } catch (err) {
    console.log(err.message)
    return
  }

  await s(10000)

  let data = await page.evaluate(() => {
    let searchResults = Array.from(document.querySelectorAll('#wpsl-stores li'))

    return searchResults.map(r => {
      let name = r.querySelector('strong').innerText
      let add1 = r.querySelectorAll('span')[0].innerText
      let add2 = r.querySelectorAll('span')[1].innerText
      let add3 = r.querySelectorAll('span')[2].innerText
      return [name, `${add1} ${add2} ${add3}`]
    })
  })

  console.log(data)

  return data
}
