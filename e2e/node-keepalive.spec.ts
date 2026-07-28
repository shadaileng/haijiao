import { test, expect } from '@playwright/test'
import { E2E } from './config'

test.describe('NodeView keep-alive 和滚动位置', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript((cfg) => {
      localStorage.setItem('settings', JSON.stringify(cfg))
    }, {
      uid: E2E.uid,
      token: E2E.token,
      apiBase: E2E.mirrorDomain,
    })
  })

  test('keep-alive 缓存 + 滚动位置记忆', async ({ page }) => {
    await page.goto('/node')
    await page.waitForSelector('.van-grid', { timeout: 15000 })

    // 验证板块数据加载
    const count = await page.locator('.van-grid-item').count()
    expect(count).toBeGreaterThan(0)
    console.log('板块数量:', count)

    // 滚动到 500px
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.scrollY)).toBe(500)

    // 用 evaluate 模拟点击（避免 Playwright scroll-into-view 干扰）
    await page.evaluate(() => {
      document.querySelector('.van-grid-item')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      )
    })
    await page.waitForURL(/\/node\/\d+/, { timeout: 10000 })
    await page.waitForTimeout(500)

    // 验证 keep-alive：板块数据应保留
    await page.evaluate(() => (window as any).__router__.back())
    await page.waitForTimeout(1500)

    const cachedCount = await page.locator('.van-grid-item').count()
    expect(cachedCount).toBe(count)
    console.log('缓存后板块数量:', cachedCount)

    // 验证滚动位置恢复
    const scrollY = await page.evaluate(() => window.scrollY)
    console.log('返回后滚动位置:', scrollY)
    expect(scrollY).toBe(500)
  })
})
