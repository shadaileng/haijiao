import { chromium } from '@playwright/test'

const UID = '168149806501'
const TOKEN = '4090c7d6d8784b22a6e4b7654d533761'
const API_BASE = 'https://hj2606029d3.top'

function utf8Decode(binary) {
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder('utf-8').decode(bytes)
}

function decodeEncrypted(str) {
  for (const layers of [3, 2, 1]) {
    try {
      let decoded = str
      for (let i = 0; i < layers; i++) decoded = atob(decoded)
      const utf = utf8Decode(decoded)
      JSON.parse(utf)
      return utf
    } catch {}
  }
  return str
}

function toCamelCase(obj) {
  if (Array.isArray(obj)) return obj.map(toCamelCase)
  if (obj && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
        toCamelCase(v),
      ])
    )
  }
  return obj
}

async function debugFollow() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox'],
  })

  const context = await browser.newContext({ ignoreHTTPSErrors: true })
  const page = await context.newPage()

  console.log(`\n=== Config ===`)
  console.log(`API Base: ${API_BASE}`)
  console.log(`UID: ${UID}`)

  // 先导航到任意页面建立 origin
  await page.goto(`${API_BASE}/hot`, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(2000)

  // 在页面上下文中发请求
  console.log(`\n=== Fetching follow list ===`)
  const rawResult = await page.evaluate(async ({ uid, token, apiBase }) => {
    const headers = {
      'X-Backend': apiBase,
      'X-User-Id': uid,
      'X-User-Token': token,
    }
    const resp = await fetch('/api/user/favorite/users', { headers })
    return await resp.json()
  }, { uid: UID, token: TOKEN, apiBase: API_BASE })

  console.log(`\n--- Raw API envelope ---`)
  console.log(`success: ${rawResult.success}`)
  console.log(`isEncrypted: ${rawResult.isEncrypted}`)
  console.log(`message: ${rawResult.message}`)

  if (rawResult.isEncrypted && rawResult.data) {
    console.log(`encrypted data length: ${rawResult.data.length}`)

    try {
      const decrypted = decodeEncrypted(rawResult.data)
      const parsed = JSON.parse(decrypted)
      const camelData = toCamelCase(parsed)

      if (Array.isArray(camelData)) {
        console.log(`\n========== FOLLOW LIST RESPONSE STRUCTURE ==========`)
        console.log(`Total items: ${camelData.length}`)
        if (camelData.length > 0) {
          console.log(`\n--- First item keys ---`)
          console.log(Object.keys(camelData[0]).join(', '))

          const countFields = Object.keys(camelData[0]).filter(k =>
            k.toLowerCase().includes('count') || k.toLowerCase().includes('num')
          )
          console.log(`\n--- Count/Num fields ---`)
          console.log(countFields.length > 0 ? countFields.join(', ') : 'NONE')

          console.log(`\n--- First item (complete) ---`)
          console.log(JSON.stringify(camelData[0], null, 2))

          console.log(`\n--- All items (topicCount) ---`)
          camelData.forEach((item, i) => {
            console.log(`[${i}] userId=${item.userId} nickname="${item.nickname}" topicCount=${item.topicCount} videoCount=${item.videoCount} fansCount=${item.fansCount} favoriteCount=${item.favoriteCount}`)
          })
        }
      } else {
        console.log(`Decrypted type: ${typeof camelData}`)
        console.log(JSON.stringify(camelData, null, 2).substring(0, 3000))
      }
    } catch (e) {
      console.log(`Decrypt/parse error: ${e.message}`)
    }
  }

  await browser.close()
  console.log(`\n=== Done ===`)
}

debugFollow().catch(err => {
  console.error('Debug failed:', err)
  process.exit(1)
})
