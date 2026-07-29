import { test, expect } from '@playwright/test'
import { E2E } from './config'

test.describe('帖子收藏功能', () => {
  const backend = E2E.mirrorDomain || 'https://example.com'

  test.beforeEach(async ({ context }) => {
    await context.addInitScript((cfg: { apiBase: string; uid: string; token: string }) => {
      localStorage.setItem('settings', JSON.stringify(cfg))
    }, { apiBase: backend, uid: E2E.uid, token: E2E.token })
  })

  test('帖子详情页显示收藏按钮', async ({ page }) => {
    await page.goto('/hot')
    await page.waitForTimeout(5000)
    const firstTopic = page.locator('.hv-title').first()
    await firstTopic.click()
    await page.waitForTimeout(3000)
    await page.waitForSelector('.hv-topic-state', { timeout: 20000 })
    const favoriteBtn = page.locator('.hv-topic-state .van-icon').last()
    await expect(favoriteBtn).toBeVisible()
  })

  test('收藏按钮点击切换状态', async ({ page }) => {
    const apiRequests: string[] = []
    page.on('request', (req) => {
      if (req.url().includes('/api/favorite')) {
        apiRequests.push(req.url())
      }
    })

    await page.goto('/hot')
    await page.waitForTimeout(5000)
    const firstTopic = page.locator('.hv-title').first()
    await firstTopic.click()
    await page.waitForTimeout(3000)

    const pidMatch = page.url().match(/\/topic\/(\d+)/)
    expect(pidMatch).toBeTruthy()

    await page.waitForSelector('.hv-topic-state', { timeout: 20000 })

    const favoriteCol = page.locator('.hv-topic-state').last()
    await expect(favoriteCol).toBeVisible()

    const favoriteIcon = favoriteCol.locator('.van-icon')
    const beforeClass = await favoriteIcon.getAttribute('class')
    const wasFavorite = beforeClass?.includes('favorite-active') ?? false

    await favoriteCol.click()
    await page.waitForTimeout(3000)

    const afterClass = await favoriteIcon.getAttribute('class')
    const isFavorite = afterClass?.includes('favorite-active') ?? false

    expect(isFavorite).toBe(!wasFavorite)
    expect(apiRequests.length).toBe(2)
    expect(apiRequests[0]).toContain('/api/favorite/favorite')
    expect(apiRequests[1]).toMatch(/\/api\/favorite\/(add|delete)/)
  })

  test('设置页显示收藏入口', async ({ page }) => {
    await page.goto('/settings')
    await expect(page.getByText('收藏')).toBeVisible({ timeout: 10000 })
  })

  test('收藏列表页可访问', async ({ page }) => {
    await page.goto('/favorites')
    await expect(page.getByText('我的收藏')).toBeVisible({ timeout: 10000 })
  })
})
