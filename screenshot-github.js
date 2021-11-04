const puppeteer = require('puppeteer')

const repo = 'puppeteer/examples'
const showCodeList = true

;(async () => {
  const browser = await puppeteer.launch({ headless: true })

  const page = await browser.newPage()
  await page.setViewport({ width: 720, height: 1200, deviceScaleFactor: 2 })
  await page.goto(`https://github.com/${repo}`)

  await page.waitForSelector('#readme', { visible: true })

  if (showCodeList) {
    await page.$eval(`.Details-content--shown > .js-details-target`, btn => btn.click())
  }

  const overlay = await page.$('#js-repo-pjax-container')
  await overlay.screenshot({
    path: `screenshots/${toSnakeCase(repo)}.png`,
  })

  await browser.close()
})()

function toSnakeCase(str) {
  return (
    str &&
    str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.toLowerCase())
      .join('_')
  )
}
