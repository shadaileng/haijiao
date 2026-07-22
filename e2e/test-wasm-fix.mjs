import { chromium } from '@playwright/test'

async function testWasmFix() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
  })

  const page = await browser.newPage({
    ignoreHTTPSErrors: true,
  })

  // Monitor ALL console messages
  page.on('console', (m) => {
    const text = m.text()
    if (text.length < 500) {
      console.log(`[${m.type()}] ${text}`)
    }
  })

  // Capture network for debugging
  const nets = []
  page.on('request', req => {
    const u = req.url()
    if (u.includes('.wasm') || u.includes('.key') || u.includes('.jpg') || u.includes('.ts') || u.includes('.m3u8')) {
      nets.push('REQ: ' + u.substring(0, 200))
    }
  })
  page.on('response', resp => {
    const u = resp.url()
    if (u.includes('.wasm') || u.includes('.key') || u.includes('.jpg') || u.includes('.ts') || u.includes('.m3u8')) {
      nets.push(`RES: ${u.substring(0, 150)} ${resp.status()}`)
    }
  })

  console.log('Navigating to topic 1742505...')
  
  // Set auth in localStorage before navigation
  await page.goto('http://localhost:3000', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  })
  await page.evaluate(() => {
    localStorage.setItem('settings', JSON.stringify({
      apiBase: 'https://hj2606029d3.top',
      uid: '168149806501',
      token: '1c002874269e49ac953ac099aadfaaa5',
    }))
  })

  await page.goto('http://localhost:3000/topic/1742505', {
    waitUntil: 'networkidle',
    timeout: 60000,
  }).catch(e => console.log('Navigation error:', e.message))

  await page.waitForTimeout(5000)

  // Check for video elements
  const videoContainers = await page.locator('.hv-video-div').count()
  console.log('\nhv-video-div count:', videoContainers)

  if (videoContainers > 0) {
    // Click the video to start playback
    console.log('Clicking video...')
    await page.evaluate(() => {
      const img = document.querySelector('.hv-video-div img')
      if (img) img.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    await page.waitForTimeout(5000)

    // Check if DPlayer and video element exist
    const dplayer = await page.locator('.dplayer').count()
    console.log('DPlayer found:', dplayer)

    const video = await page.locator('video').first()
    const hasVideo = await video.count()
    console.log('Video element found:', hasVideo)

    if (hasVideo > 0) {
      // Wait for video to buffer
      for (let i = 0; i < 10; i++) {
        await page.waitForTimeout(2000)
        const state = await page.evaluate(() => {
          const v = document.querySelector('video')
          if (!v) return null
          return {
            readyState: v.readyState,
            currentTime: v.currentTime,
            duration: v.duration,
            paused: v.paused,
            buffered: v.buffered.length,
            networkState: v.networkState,
            error: v.error ? { code: v.error.code, message: v.error.message } : null,
          }
        })
        console.log(`Check ${i}:`, JSON.stringify(state))

        if (state && state.currentTime > 2) {
          console.log('\n*** VIDEO IS PLAYING! ***')
          break
        }
        if (state && state.readyState >= 3 && state.currentTime >= 0) {
          console.log('*** Video buffered and ready ***')
        }
      }
    }

    console.log('\n=== Network captures ===')
    for (const n of nets) {
      console.log(n)
    }
  }

  await browser.close()
}

testWasmFix().catch(err => {
  console.error('Test failed:', err)
  process.exit(1)
})
