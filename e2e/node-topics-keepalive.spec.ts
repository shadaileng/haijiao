import { test, expect } from '@playwright/test'
import { E2E } from './config'

test.describe('NodeTopicsView keep-alive + 滚动位置', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript((cfg) => {
      localStorage.setItem('settings', JSON.stringify(cfg))
    }, {
      uid: E2E.uid,
      token: E2E.token,
      apiBase: E2E.mirrorDomain,
    })
  })

  test('返回后重新进入同一板块，帖子数据和滚动位置保留', async ({ page }) => {
    // 1. 进入板块列表，再点击进入热门板块帖子
    await page.goto('/node')
    await page.waitForSelector('.van-grid', { timeout: 15000 })
    await page.evaluate(() => {
      const items = document.querySelectorAll('.van-grid-item')
      for (const item of items) {
        if (item.textContent?.includes('热门')) {
          item.dispatchEvent(new MouseEvent('click', { bubbles: true }))
          break
        }
      }
    })
    await page.waitForURL(/\/node\/\d+/, { timeout: 10000 })
    await page.waitForSelector('.card', { timeout: 20000 })
    const topicCount = await page.locator('.card').count()
    console.log('帖子数量:', topicCount)
    expect(topicCount).toBeGreaterThan(0)

    // 2. 滚动到 800px
    await page.evaluate(() => window.scrollTo(0, 800))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.scrollY)).toBe(800)

    // 3. 返回板块列表
    await page.evaluate(() => (window as any).__router__.back())
    await page.waitForTimeout(1500)
    expect(page.url()).toContain('/node')

    // 4. 重新进入同一板块帖子页
    await page.evaluate(() => {
      const items = document.querySelectorAll('.van-grid-item')
      for (const item of items) {
        if (item.textContent?.includes('热门')) {
          item.dispatchEvent(new MouseEvent('click', { bubbles: true }))
          break
        }
      }
    })
    await page.waitForURL(/\/node\/\d+/, { timeout: 10000 })
    await page.waitForTimeout(1500)

    // 5. 验证 keep-alive：帖子数据保留（数量一致，无 skeleton）
    const cachedCount = await page.locator('.card').count()
    console.log('缓存后帖子数量:', cachedCount)
    expect(cachedCount).toBe(topicCount)

    // 6. 验证滚动位置恢复
    const scrollY = await page.evaluate(() => window.scrollY)
    console.log('返回后滚动位置:', scrollY)
    expect(scrollY).toBeGreaterThan(0)
  })
})
