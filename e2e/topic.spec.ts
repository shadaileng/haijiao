import { test, expect } from '@playwright/test'
import { E2E } from './config'
import { noMirror, noVideo, loginViaUI } from './helpers'

test.describe('帖子详情（视频+图片）', () => {
  test.skip(noMirror, '需先填入 mirrorDomain')
  test.skip(noVideo, '需先填入 username/password/videoPid')

  test.beforeEach(async ({ context }) => {
    await context.addInitScript((apiBase: string) => {
      const raw = localStorage.getItem('settings')
      const cfg = raw ? JSON.parse(raw) : {}
      cfg.apiBase = apiBase
      localStorage.setItem('settings', JSON.stringify(cfg))
    }, E2E.mirrorDomain)
  })

  test('登录后查看帖子：视频装配 + 图片解码', async ({ page }) => {
    page.on('console', (m) => {
      if (m.type() === 'error') console.log('[console error]', m.text())
    })

    // 1. 真实登录
    await loginViaUI(page)
    await expect(page).toHaveURL(/\/hot/)

    // 2. 进入含视频+图片的帖子
    await page.goto(`/topic/${E2E.videoPid}`)
    await page.waitForLoadState('networkidle')

    // 3. 断言视频：等待视频封面出现并点击
    await expect(page.locator('.hv-video-div').first()).toBeVisible({ timeout: 20000 })

    // 通过 JS 触发点击（避免 Playwright click 被 overlay 遮挡的问题）
    await page.evaluate(() => {
      const img = document.querySelector<HTMLElement>('.hv-video-div img')
      if (img) img.click()
    })

    // DPlayer 通过 loadVideoSrc API 异步创建，等待 <video> 出现
    const video = page.locator('.hv-video-container video').first()
    await expect(video).toBeVisible({ timeout: 30000 })
    const src = await video.getAttribute('src')
    expect(src).toMatch(/^blob:/)

    // 4. 断言图片：帖子内容中的 <img> src 被替换为 data URI
    const contentImgs = page.locator('.content img[data-src]').first()
    await expect(contentImgs).toBeVisible({ timeout: 15000 })
    await expect(contentImgs).toHaveAttribute('src', /^data:/, { timeout: 15000 })
  })
})
