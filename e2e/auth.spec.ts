import { test, expect } from '@playwright/test'
import { E2E } from './config'
import { noAuth, noMirror } from './helpers'

async function loginViaUI(page: import('@playwright/test').Page) {
  await page.goto('/login')
  // 邮箱字段（label="邮箱"）
  const emailField = page.locator('.login-form .van-field').first().locator('input')
  await emailField.fill(E2E.username)
  // 密码字段（label="密码"）
  const pwdField = page.locator('.login-form .van-field').nth(1).locator('input')
  await pwdField.fill(E2E.password)
  // 点击登录按钮
  await page.locator('.login-btn').click()
  // 等待跳转离开登录页
  await page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 15000 })
}

test.describe('登录态链路', () => {
  test.skip(noMirror, '需先在 e2e/config.ts 填入 mirrorDomain')
  test.skip(noAuth, '需先在 e2e/config.ts 填入 username + password')

  test('真实登录并验证 localStorage', async ({ page }) => {
    await loginViaUI(page)
    // 登录成功后应跳转到 /hot
    await expect(page).toHaveURL(/\/hot/)

    // 检查 localStorage settings 里有 uid 和 token
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
    // 登录后从 localStorage 获取 uid
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
