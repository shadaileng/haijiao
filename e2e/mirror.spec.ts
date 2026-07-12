import { test, expect } from '@playwright/test'
import { E2E } from './config'

test.describe('镜像源 X-Back-end 头', () => {
  const backend =
    E2E.mirrorDomain || 'https://mirror.example.com'

  test('应用对 /api/* 请求携带 X-Backend 头', async ({ context, page }) => {
    await context.addInitScript((apiBase: string) => {
      localStorage.setItem('settings', JSON.stringify({ apiBase, uid: '', token: '' }))
    }, backend)

    page.on('console', (m) => console.log('[console]', m.type(), m.text()))
    page.on('pageerror', (e) => console.log('[pageerror]', e.message))
    const seen: string[] = []
    page.on('request', (req) => {
      console.log('[req]', req.url())
      if (req.url().includes('/api')) {
        const h = req.headers()['x-backend']
        if (h) seen.push(h)
      }
    })

    await page.goto('/hot')
    await page.waitForTimeout(5000)

    expect(seen.length).toBeGreaterThan(0)
    for (const h of seen) {
      expect(h).toBe(backend)
    }
  })
})
