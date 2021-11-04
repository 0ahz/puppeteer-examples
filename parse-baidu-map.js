const puppeteer = require('puppeteer')

const keyword = encodeURIComponent('火锅')

;(async () => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto(`https://map.baidu.com/search/${keyword}/?querytype=s&wd=${keyword}`, { waitUntil: 'networkidle2' })
  let result = await parsePage(page)
  while (await nextPage(page)) {
    const pageResult = await parsePage(page)
    result = result.concat(pageResult)
  }
  console.log(result)
  await browser.close()
})()

async function parsePage(page) {
  let result = await page.$$eval(`a.n-blue[data-stat-code]`, els => els.map(el => el.textContent))
  return result
}

async function nextPage(page) {
  let nextBtn = await page.$(`a[tid="toNextPage"]:not(.next-none)`)
  if (nextBtn) {
    await nextBtn.click()
    await page.waitForNetworkIdle()
    await page.waitForSelector('.poilist')
  }
  return nextBtn
}
