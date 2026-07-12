import { test, expect } from '@playwright/test'
import { E2E } from './config'
import { noAuth, noMirror, noVideo } from './helpers'

async function loginViaUI(page: import('@playwright/test').Page) {
  await page.goto('/login')
  const emailField = page.locator('.login-form .van-field').first().locator('input')
  await emailField.fill(E2E.username)
  const pwdField = page.locator('.login-form .van-field').nth(1).locator('input')
  await pwdField.fill(E2E.password)
  await page.locator('.login-btn').click()
  await page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 15000 })
}

test.describe('帖子详情（视频+图片）', () => {
  test.skip(noMirror, '需先填入 mirrorDomain')
  test.skip(noVideo, '需先填入 username/password/videoPid')

  test('登录后查看帖子：视频装配 + 图片解码', async ({ page }) => {
    // 1. 真实登录
    await loginViaUI(page)
    await expect(page).toHaveURL(/\/hot/)

    // 2. 进入含视频+图片的帖子
    await page.goto(`/topic/${E2E.videoPid}`)

    // 3. 断言视频：点击视频封面 → <video> src 含 .m3u8
    await expect(page.locator('.hv-video-div').first()).toBeVisible({ timeout: 20000 })
    await page.locator('.hv-video-div').first().click()
    const video = page.locator('.hv-video-container video').first()
    await expect(video).toBeVisible({ timeout: 15000 })
    const src = await video.getAttribute('src')
    expect(src?.endsWith('.m3u8')).toBeTruthy()

    // 4. 断言图片：帖子内容中的 <img> src 被替换为 data URI
    const contentImgs = page.locator('.topic-content img, .hv-rich-text img').first()
    await expect(contentImgs).toBeVisible({ timeout: 10000 })
    const imgSrc = await contentImgs.getAttribute('src')
    expect(imgSrc?.startsWith('data:')).toBeTruthy()
  })
})
