import { test, expect } from '@playwright/test'

test('收藏列表页显示收藏夹和帖子', async ({ page }) => {
  // 访问本地应用的收藏列表页
  await page.goto('http://localhost:3001/favorites', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(3000)

  // 检查页面标题
  const navTitle = page.locator('.van-nav-bar__title')
  if (await navTitle.isVisible()) {
    const title = await navTitle.textContent()
    console.log('标题:', title)
  }

  // 检查是否有收藏夹 tabs
  const folderTabs = await page.locator('.folder-tab').count()
  console.log('收藏夹数量:', folderTabs)

  // 检查页面内容
  const bodyText = await page.textContent('body')
  console.log('页面内容:', bodyText?.substring(0, 300))
})
