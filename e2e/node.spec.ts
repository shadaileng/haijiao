import { test, expect } from '@playwright/test'
import { E2E } from './config'

test.describe('板块页面', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript((cfg) => {
      localStorage.setItem('settings', JSON.stringify(cfg))
    }, {
      uid: E2E.uid,
      token: E2E.token,
      apiBase: E2E.mirrorDomain,
    })
  })

  test('板块列表页加载并显示列表', async ({ page }) => {
    await page.goto('/node')
    await page.waitForSelector('.node-list', { timeout: 15000 })
    await page.screenshot({ path: 'test-results/node-list.png', fullPage: true })
    const items = page.locator('.node-item')
    const count = await items.count()
    console.log(`板块数量: ${count}`)
    expect(count).toBeGreaterThan(0)
  })

  test('点击板块跳转到帖子列表', async ({ page }) => {
    await page.goto('/node')
    await page.waitForSelector('.node-list', { timeout: 15000 })
    const firstItem = page.locator('.node-item').first()
    await firstItem.click()
    await page.waitForURL(/\/node\/\d+/, { timeout: 10000 })
    await page.screenshot({ path: 'test-results/node-topics.png', fullPage: true })
    console.log('URL:', page.url())
    const body = await page.textContent('body')
    expect(body).toBeTruthy()
  })
})
