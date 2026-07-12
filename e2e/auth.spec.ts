import { test, expect } from '@playwright/test'
import { E2E } from './config'
import { noAuth, noMirror, loginViaUI } from './helpers'

test.describe('登录态链路', () => {
  test.skip(noMirror, '需先在 e2e/config.ts 填入 mirrorDomain')
  test.skip(noAuth, '需先在 e2e/config.ts 填入 username + password')

  test.beforeEach(async ({ context }) => {
    await context.addInitScript((apiBase: string) => {
      const raw = localStorage.getItem('settings')
      const cfg = raw ? JSON.parse(raw) : {}
      cfg.apiBase = apiBase
      localStorage.setItem('settings', JSON.stringify(cfg))
    }, E2E.mirrorDomain)
  })

  test('真实登录并验证 localStorage', async ({ page }) => {
    await loginViaUI(page)
    await expect(page).toHaveURL(/\/hot/)

    const settings = await page.evaluate(() => {
      const raw = localStorage.getItem('settings')
      return raw ? JSON.parse(raw) : null
    })
    expect(settings).toBeTruthy()
    expect(settings.uid).toBeTruthy()
    expect(settings.token).toBeTruthy()
    expect(settings.apiBase).toBe(E2E.mirrorDomain)
  })

  test('设置页显示已登录', async ({ page }) => {
    await loginViaUI(page)
    await page.goto('/settings')
    await expect(page.getByText('已登录')).toBeVisible({ timeout: 10000 })
  })

  test('关注列表渲染', async ({ page }) => {
    await loginViaUI(page)
    await page.goto('/follow')
    await expect(page.locator('.card').first()).toBeVisible({ timeout: 20000 })
  })

  test('用户主页渲染', async ({ page }) => {
    await loginViaUI(page)
    const uid = await page.evaluate(() => {
      const raw = localStorage.getItem('settings')
      return raw ? JSON.parse(raw).uid : ''
    })
    if (!uid) {
      test.skip(true, '登录后未获取到 uid')
      return
    }
    await page.goto(`/homepage/${uid}/test`)
    await expect(page.locator('.user-info, .card').first()).toBeVisible({ timeout: 20000 })
  })
})
