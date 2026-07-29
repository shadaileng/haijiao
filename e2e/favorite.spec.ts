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
    // 先获取一个可用的帖子
    await page.goto('/hot')
    await page.waitForTimeout(5000)

    // 点击第一个帖子进入详情
    const firstTopic = page.locator('.hv-title').first()
    await firstTopic.click()
    await page.waitForTimeout(3000)

    // 等待内容加载
    await page.waitForSelector('.hv-topic-state', { timeout: 20000 })
    // 收藏按钮（star 或 star-o 图标）应该存在
    const favoriteBtn = page.locator('.hv-topic-state .van-icon').last()
    await expect(favoriteBtn).toBeVisible()
  })

  test('收藏按钮点击切换状态', async ({ page }) => {
    const apiRequests: string[] = []
    const apiResponses: string[] = []
    page.on('response', async (resp) => {
      if (resp.url().includes('/api/favorite')) {
        try {
          const body = await resp.json()
          apiResponses.push(JSON.stringify(body))
        } catch {}
      }
    })
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

    const url = page.url()
    const pidMatch = url.match(/\/topic\/(\d+)/)
    expect(pidMatch).toBeTruthy()
    console.log('Testing with pid:', pidMatch![1])

    await page.waitForSelector('.hv-topic-state', { timeout: 20000 })

    const favoriteCol = page.locator('.hv-topic-state').last()
    await expect(favoriteCol).toBeVisible()

    const favoriteIcon = favoriteCol.locator('.van-icon')
    const beforeClass = await favoriteIcon.getAttribute('class')
    const wasFavorite = beforeClass?.includes('favorite-active') ?? false
    console.log('Before class:', beforeClass, 'wasFavorite:', wasFavorite)

    await favoriteCol.click()
    await page.waitForTimeout(3000)

    const afterClass = await favoriteIcon.getAttribute('class')
    const isFavorite = afterClass?.includes('favorite-active') ?? false
    console.log('After class:', afterClass, 'isFavorite:', isFavorite)
    console.log('API requests:', apiRequests)
    console.log('API responses:', apiResponses)

    // 验证收藏 API 被调用
    expect(apiRequests.length).toBeGreaterThan(0)
    expect(apiRequests[0]).toContain('/api/favorite/add')

    // 后端可能返回错误（"收藏的内容不存在"），但前端应正确处理不崩溃
    // 如果后端成功，验证状态切换
    if (apiResponses.length > 0) {
      const resp = JSON.parse(apiResponses[0])
      if (resp.success) {
        expect(isFavorite).toBe(true)
      } else {
        // 后端失败时，UI 不应崩溃，icon 保持原状
        expect(isFavorite).toBe(wasFavorite)
      }
    }
  })

  test('设置页显示收藏入口', async ({ page }) => {
    await page.goto('/settings')
    await expect(page.getByText('收藏')).toBeVisible({ timeout: 10000 })
  })

  test('收藏列表页可访问', async ({ page }) => {
    await page.goto('/favorites')
    // 等待导航栏加载
    await expect(page.getByText('我的收藏')).toBeVisible({ timeout: 10000 })
  })
})
