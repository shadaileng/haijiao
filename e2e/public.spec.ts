import { test, expect } from '@playwright/test'
import { E2E } from './config'
import { noMirror } from './helpers'

test.describe('公开页冒烟', () => {
  test.skip(noMirror, '需先在 e2e/config.ts 填入 mirrorDomain（可用镜像域名）')

  test.beforeEach(async ({ context }) => {
    await context.addInitScript((apiBase: string) => {
      const raw = localStorage.getItem('settings')
      const cfg = raw ? JSON.parse(raw) : {}
      cfg.apiBase = apiBase
      localStorage.setItem('settings', JSON.stringify(cfg))
    }, E2E.mirrorDomain)
  })

  test('热门列表渲染', async ({ page }) => {
    page.on('console', (m) => {
      if (m.type() === 'error') console.log('[console]', m.text())
    })
    page.on('requestfailed', (req) => {
      console.log('[failed]', req.url(), req.failure()?.errorText)
    })

    await page.goto('/hot')
    await expect(page.locator('.card').first()).toBeVisible({ timeout: 30000 })
    const title = await page.locator('.card').first().innerText()
    expect(title.trim().length).toBeGreaterThan(0)
  })

  test('TabBar 跳转到搜索', async ({ page }) => {
    await page.goto('/hot')
    await page.getByText('搜索').click()
    await expect(page).toHaveURL(/\/search/)
  })

  test('搜索返回结果', async ({ page }) => {
    await page.goto('/search')
    const input = page.locator('input').first()
    await input.fill('海')
    await input.press('Enter')
    await expect(page.locator('.card').first()).toBeVisible({ timeout: 20000 })
  })

  test('封面图片被解码为 data URI', async ({ page }) => {
    await page.goto('/hot')
    await expect(page.locator('.card').first()).toBeVisible({ timeout: 30000 })
    const img = page.locator('.card .van-image img, .card .hv-user-icon, .card img').first()
    await expect(img).toBeVisible({ timeout: 20000 })
    // IntersectionObserver 异步触发解码，等待 src 从 loading 状态变为 data: URI
    await expect(img).toHaveAttribute('src', /^data:/, { timeout: 30000 })
  })
})
