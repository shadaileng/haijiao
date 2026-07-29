import { test, expect, Page } from '@playwright/test'

async function debugTopicPage(page: Page) {
  // Set auth in localStorage before navigation
  await page.addInitScript((apiBase: string) => {
    const cfg = {
      apiBase,
      uid: '168149806501',
      token: 'd670d77fdbe840eeac8fe439bacbb095',
    }
    localStorage.setItem('settings', JSON.stringify(cfg))
  }, 'https://hj2606029d3.top')

  // Collect console errors
  const consoleErrors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      consoleErrors.push(`[${msg.type()}] ${msg.text()}`)
    }
  })
  page.on('pageerror', err => consoleErrors.push(`[PAGE ERROR] ${err.message}`))

  // Navigate to topic page
  await page.goto('/topic/2213238', { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(3000)

  // Get detailed info about the rendered page
  const result = await page.evaluate(() => {
    const infos: Record<string, any> = {}

    // Check skeleton state
    const skeletons = document.querySelectorAll('.van-skeleton')
    infos.skeletons = []
    skeletons.forEach(s => {
      infos.skeletons.push({
        hasLoadingClass: s.classList.contains('van-skeleton--loading'),
        className: s.className,
        style: s.style,
      })
    })
    infos.hasSkeleton = skeletons.length > 0

    // Nav bar
    infos.navBar = !!document.querySelector('.van-nav-bar')
    infos.navTitle = document.querySelector('.van-nav-bar .van-nav-bar__title')?.textContent

    // Content title
    const titleEl = document.querySelector('.hv-title')
    infos.title = titleEl ? titleEl.textContent.trim() : null

    // Topic content area
    const contentDiv = document.querySelector('.content')
    infos.contentExists = !!contentDiv
    infos.contentInnerHTML = contentDiv ? contentDiv.innerHTML.substring(0, 500) : ''

    // Video div
    const videoDiv = document.querySelector('.hv-video-div')
    infos.videoDiv = !!videoDiv
    infos.videoImg = videoDiv ? videoDiv.querySelector('img') : null
    if (infos.videoDiv) {
      const img = videoDiv.querySelector('img')
      infos.imgSrc = img ? img.src : '(no src)'
      infos.imgStyle = img ? img.style.cssText : '(no style)'
      infos.imgWidth = img ? img.offsetWidth : 0
      infos.imgHeight = img ? img.offsetHeight : 0
      infos.videoWidth = videoDiv.offsetWidth
      infos.videoHeight = videoDiv.offsetHeight
      infos.videoComputedStyles = getComputedStyle(videoDiv)
    }

    // Comments
    infos.commentCells = document.querySelectorAll('.comment-cell').length
    infos.commentDivider = !!document.querySelector('.van-divider')

    // Compute styles for content div
    if (contentDiv) {
      infos.contentComputed = getComputedStyle(contentDiv)
      infos.contentWidth = contentDiv.offsetWidth
      infos.contentHeight = contentDiv.offsetHeight
      infos.contentDisplay = contentDiv.style.display
    }

    return infos
  })

  console.log('=== DEBUG RESULTS ===')
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === 'object' && value !== null) {
      console.log(`${key}:`, JSON.stringify(value, null, 2).substring(0, 500))
    } else {
      console.log(`${key}:`, value)
    }
  }

  console.log('\n=== CONSOLE ERRORS ===')
  consoleErrors.forEach(e => console.log(e))

  result.consoleErrors = consoleErrors
  return result
}

test.describe('Debug topic 2213238 rendering issues', () => {
  test('full page rendering analysis', async ({ page }) => {
    const result = await debugTopicPage(page)

    // Verify key elements exist
    expect(result.navBar).toBe(true)
    expect(result.navTitle).toBeTruthy()
    expect(result.title).not.toBeNull()
    expect(result.contentExists).toBe(true)
    expect(result.videoDiv).toBeTruthy()

    // Critical: Video container should have non-zero dimensions
    if (result.videoDiv) {
      expect(result.videoWidth).toBeGreaterThan(0)
      expect(result.videoHeight).toBeGreaterThan(0)
      if (result.videoImg) {
        expect(result.imgWidth).toBeGreaterThan(0)
        expect(result.imgHeight).toBeGreaterThan(0)
        // Check that img has src with base64 or actual URL
        expect(result.imgSrc).toContain('data:image')
        expect(result.imgSrc).toContain(',')
      }
    }

    expect(result.commentCells).toBeGreaterThan(0)
    expect(result.commentDivider).toBe(true)
    expect(result.consoleErrors).toEqual([])

    console.log('\n✅ All checks passed - page is rendering correctly')
  })
})
