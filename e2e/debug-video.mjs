import { chromium } from '@playwright/test'

async function debug() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const context = await browser.newContext({
    baseURL: 'http://localhost:3000',
    ignoreHTTPSErrors: true,
  })

  const page = await context.newPage()

  // Log all console messages
  page.on('console', (m) => {
    console.log(`[${m.type()}] ${m.text()}`)
  })
  page.on('pageerror', (err) => {
    console.log(`[pageerror] ${err.message}`)
  })

  // Capture network responses
  page.on('response', async (resp) => {
    const url = resp.url()
    if (url.includes('.m3u8')) {
      console.log('m3u8 fetch:', url, 'status:', resp.status())
      try {
        const text = await resp.text()
        console.log('m3u8 content (first 300 chars):', text.substring(0, 300))
      } catch {}
    }
    if (url.includes('.key')) {
      console.log('key fetch:', url, 'status:', resp.status(), 'len:', (await resp.body()).length)
    }
    if (url.includes('.ts')) {
      console.log('ts fetch:', url.substring(url.lastIndexOf('/') + 1), 'status:', resp.status())
    }
  })

  // Set token in localStorage
  await page.addInitScript(() => {
    const raw = localStorage.getItem('settings')
    const cfg = raw ? JSON.parse(raw) : {}
    cfg.uid = '168149806501'
    cfg.token = '1c002874269e49ac953ac099aadfaaa5'
    cfg.apiBase = 'https://hj2606029d3.top'
    localStorage.setItem('settings', JSON.stringify(cfg))
  })

  // Open the topic
  console.log('Navigating to /topic/1742505...')
  await page.goto('/topic/1742505', { waitUntil: 'networkidle', timeout: 30000 }).catch(e => {
    console.log('Navigation error:', e.message)
  })
  await page.waitForTimeout(3000)

  // Click the video
  const videoDivCount = await page.locator('.hv-video-div').count()
  console.log(`\nhv-video-div count: ${videoDivCount}`)

  if (videoDivCount > 0) {
    console.log('Clicking video...')
    await page.evaluate(() => {
      const img = document.querySelector('.hv-video-div img')
      if (img) img.click()
    })
    
    // Wait for player and networking
    await page.waitForTimeout(15000)
    
    // Try to play the video
    await page.evaluate(() => {
      const v = document.querySelector('.dplayer video')
      if (v) {
        v.play().catch(e => console.log('play() error:', e.message))
      }
    })
    await page.waitForTimeout(3000)

    // Get video state
    const videoState = await page.evaluate(() => {
      const v = document.querySelector('.dplayer video')
      if (!v) return null
      const hls = v.__hls || null
      return {
        error: v.error ? { code: v.error.code, message: v.error.message } : null,
        networkState: v.networkState,
        readyState: v.readyState,
        currentTime: v.currentTime,
        paused: v.paused,
        ended: v.ended,
        buffered: v.buffered?.length || 0,
        hlsState: hls ? 'exists' : 'no hls instance found',
      }
    })
    console.log('\nVideo state:', JSON.stringify(videoState, null, 2))
  }

  await browser.close()
}

debug().catch(err => {
  console.error('Debug failed:', err)
  process.exit(1)
})
