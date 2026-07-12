import { test, expect } from '@playwright/test'
import { E2E } from './config'
import { noMirror } from './helpers'

test.describe('公开页冒烟', () => {
  test.skip(noMirror, '需先在 e2e/config.ts 填入 mirrorDomain（可用镜像域名）')

  test.beforeEach(async ({ context }) => {
    await context.addInitScript((apiBase: string) => {
      localStorage.setItem('settings', JSON.stringify({ apiBase, uid: '', token: '' }))
    }, E2E.mirrorDomain)
  })

  test('热门列表渲染', async ({ page }) => {
    page.on('console', (m) => {
      if (m.type() === 'error') console.log('[console]', m.text())
    })
    page.on('requestfailed', (req) => {
      console.log('[failed]', req.url(), req.failure()?.errorText)
    })
    // 捕获所有请求的头信息
    page.on('request', (req) => {
      const url = req.url()
      if (url.includes('/api')) {
        console.log('[request headers]', url, JSON.stringify(req.headers()))
      }
    })

    await page.goto('/hot')
    await page.waitForTimeout(3000)

    // 检查当前 settings store 值
    const settings = await page.evaluate(() => {
      const raw = localStorage.getItem('settings')
      return raw ? JSON.parse(raw) : null
    })
    console.log('[settings]', JSON.stringify(settings))

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
    await expect(page.locator('.card img').first()).toBeVisible({ timeout: 20000 })
    const src = await page.locator('.card img').first().getAttribute('src')
    expect(src?.startsWith('data:')).toBeTruthy()
  })
})
