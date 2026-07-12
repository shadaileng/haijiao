import { test, expect, type Page } from '@playwright/test'
import { E2E } from './config'

export const noMirror = !E2E.mirrorDomain
export const noAuth = !(E2E.username && E2E.password)
export const noVideo = noAuth || !E2E.videoPid

export async function loginViaUI(page: Page) {
  // 捕获 API 响应用于调试
  page.on('response', async (resp) => {
    if (resp.url().includes('/api/login')) {
      try {
        const body = await resp.json()
        console.log('[login response]', resp.status(), JSON.stringify(body))
      } catch {}
    }
  })
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('[console error]', m.text())
  })

  await page.goto('/login')
  await page.waitForSelector('.login-form', { timeout: 10000 })

  const emailField = page.locator('.login-form .van-field').first().locator('input')
  await emailField.fill(E2E.username)

  const pwdField = page.locator('.login-form .van-field').nth(1).locator('input')
  await pwdField.fill(E2E.password)

  await page.locator('.login-btn').click()

  // 等待跳转离开登录页
  await page.waitForURL((u) => !u.pathname.includes('/login'), { timeout: 20000 })
}
