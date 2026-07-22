import { test, expect } from '@playwright/test'

test.describe('调试帖子1742505视频', () => {
  test('捕获API响应和视频播放', async ({ page }) => {
    const logs: string[] = []
    const requests: any[] = []

    page.on('console', (m) => {
      logs.push(`[${m.type()}] ${m.text()}`)
    })
    page.on('pageerror', (err) => {
      logs.push(`[pageerror] ${err.message}`)
    })
    page.on('request', (req) => {
      if (req.url().includes('/api/') || req.url().includes('.m3u8')) {
        requests.push({ url: req.url(), method: req.method() })
      }
    })

    // 设置 token 到 localStorage
    await page.addInitScript(() => {
      const raw = localStorage.getItem('settings')
      const cfg = raw ? JSON.parse(raw) : {}
      cfg.uid = '168149806501'
      cfg.token = '1c002874269e49ac953ac099aadfaaa5'
      cfg.apiBase = 'https://haijiao.com'
      localStorage.setItem('settings', JSON.stringify(cfg))
    })

    // 打开帖子
    await page.goto('/topic/1742505', { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(3000)

    // 检查页面状态
    const pageContent = await page.textContent('body')
    console.log('=== Page loaded, checking content ===')
    console.log('has sale info:', pageContent?.includes('售') || pageContent?.includes('购买'))
    console.log('has sell-btn:', pageContent?.includes('sell-btn'))
    console.log('has video-div:', pageContent?.includes('hv-video-div'))

    // 查找 video-div
    const videoDivs = page.locator('.hv-video-div')
    const count = await videoDivs.count()
    console.log(`found ${count} video divs`)

    if (count > 0) {
      // 获取 video div 信息
      const videoInfo = await page.evaluate(() => {
        const divs = document.querySelectorAll('.hv-video-div')
        return Array.from(divs).map(d => ({
          id: d.getAttribute('data-id'),
          keyPath: d.getAttribute('key-path'),
          dataUrl: d.getAttribute('data-url'),
        }))
      })
      console.log('video divs info:', JSON.stringify(videoInfo, null, 2))

      // 点击第一个视频
      console.log('clicking video...')
      await page.evaluate(() => {
        const img = document.querySelector<HTMLElement>('.hv-video-div img')
        if (img) img.click()
      })
      await page.waitForTimeout(5000)

      // 检查视频播放器
      const hasVideo = await page.locator('.hv-video-container video').count()
      console.log(`video player created: ${hasVideo > 0}`)
      const dplayer = await page.locator('.dplayer').count()
      console.log(`dplayer created: ${dplayer > 0}`)
    }

    // 输出所有日志
    console.log('\n=== Console Logs ===')
    logs.forEach(l => console.log(l))

    // 输出所有 API 请求
    console.log('\n=== API Requests ===')
    requests.forEach(r => console.log(JSON.stringify(r)))

    // 尝试获取 API 响应
    const apiResponses = await page.evaluate(async () => {
      const topicRes = await fetch('/api/topic/1742505', {
        headers: {
          'X-Backend': 'https://haijiao.com',
          'X-User-Id': '168149806501',
          'X-User-Token': '1c002874269e49ac953ac099aadfaaa5',
        },
      })
      const topicData = await topicRes.text()
      return { topicBody: topicData.substring(0, 2000) }
    })
    console.log('\n=== Direct API Response ===')
    console.log(apiResponses.topicBody)

    // 断言确保测试有输出
    expect(true).toBe(true)
  })
})
