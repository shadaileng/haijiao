import { chromium } from '@playwright/test'

async function debugOrigin() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox'],
  })

  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  })

  const page = await context.newPage()

  await context.addCookies([
    { name: 'uid', value: '168149806501', domain: 'hj2606029d3.top', path: '/' },
    { name: 'token', value: '1c002874269e49ac953ac099aadfaaa5', domain: 'hj2606029d3.top', path: '/' },
  ])

  await page.addInitScript(() => {
    localStorage.setItem('uid', '168149806501')
    localStorage.setItem('token', '1c002874269e49ac953ac099aadfaaa5')
  })

  page.on('console', (m) => {
    const text = m.text()
    if (text.includes('HLS') || text.includes('key') || text.includes('wasm') || text.includes('config') || text.includes('version')) {
      console.log(`[${m.type()}] ${text.substring(0, 300)}`)
    }
  })

  // Network monitor
  const wasmUrls = []
  const keyUrls = []
  page.on('request', (req) => {
    const url = req.url()
    if (url.includes('.wasm')) {
      wasmUrls.push(url)
      console.log('WASM request:', url.substring(0, 200))
    }
    if (url.includes('.key') || url.includes('.keyv')) {
      keyUrls.push(url)
      console.log('KEY request:', url.substring(0, 200))
    }
  })

  await page.goto('https://hj2606029d3.top/post/details?pid=1742505', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  }).catch(e => console.log('Navigation error:', e.message))

  await page.waitForTimeout(10000)

  // Check sessionStorage config for kversion
  const kv = await page.evaluate(() => {
    return {
      config: sessionStorage.getItem('config'),
      kversion: JSON.parse(sessionStorage.getItem('config') || '{}').kversion,
    }
  })
  console.log('\n=== kversion ===')
  console.log(JSON.stringify(kv, null, 2))

  console.log('\n=== WASM URLs found ===')
  console.log(JSON.stringify(wasmUrls, null, 2))

  console.log('\n=== Key URLs found ===')
  console.log(JSON.stringify(keyUrls, null, 2))

  // Check if wasm files exist on the server
  if (wasmUrls.length > 0) {
    for (const url of wasmUrls) {
      try {
        const resp = await page.request.get(url)
        console.log(`WASM ${url}: status=${resp.status()}, size=${(await resp.body()).length}`)
      } catch (e) {
        console.log(`WASM ${url}: error ${e.message}`)
      }
    }
  }

  await browser.close()
}

debugOrigin().catch(err => {
  console.error('Debug failed:', err)
  process.exit(1)
})
