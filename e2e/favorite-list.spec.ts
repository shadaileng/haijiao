import { test, expect } from '@playwright/test'
import { E2E } from './config'

test('查找原站收藏列表入口', async ({ page }) => {
  // Go to user profile page
  await page.goto(`${E2E.mirrorDomain}/homepage/168149806501`)
  await page.waitForLoadState('networkidle')

  // Get all clickable elements and their text
  const clickableItems = await page.$$eval('[class*="cell"], [class*="tab"], [class*="menu"], a, button, [role="tab"]', els =>
    els.map(el => ({
      tag: el.tagName,
      text: el.textContent?.trim().substring(0, 50),
      href: (el as HTMLAnchorElement).href || '',
      class: el.className?.substring(0, 50),
    })).filter(item => item.text && item.text.length > 0 && item.text.length < 50)
  )
  console.log('\n=== 页面可点击元素 ===')
  clickableItems.forEach(item => console.log(`${item.tag} | ${item.text} | ${item.href} | ${item.class}`))

  // Look for any element with text containing 收藏/fav/love/star
  const favElements = await page.$$eval('*', els =>
    els.filter(el => {
      const text = el.textContent?.trim() || ''
      return text.length < 20 && (text.includes('收藏') || text.includes('fav') || text.includes('关注') || text.includes('足迹'))
    }).map(el => ({
      tag: el.tagName,
      text: el.textContent?.trim(),
      class: el.className?.substring(0, 50),
    }))
  )
  console.log('\n=== 收藏/关注/足迹相关元素 ===')
  favElements.forEach(item => console.log(`${item.tag} | ${item.text} | ${item.class}`))

  // Check if there's a tab bar or navigation
  const navItems = await page.$$eval('.van-tab, .van-tabs__nav, [class*="nav"], [class*="tab"]', els =>
    els.map(el => ({
      text: el.textContent?.trim().substring(0, 30),
      class: el.className?.substring(0, 50),
    }))
  )
  console.log('\n=== 导航/Tab 元素 ===')
  navItems.forEach(item => console.log(`${item.text} | ${item.class}`))
})
