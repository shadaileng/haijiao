import { useUserStore } from '@/stores/user'

function getImageBase(): string {
  const store = useUserStore()
  const base = store.proxyBase || '/api'
  if (base === '/api') return ''
  if (base.endsWith('/api')) return base.slice(0, -4)
  return base
}

export function customDecode(str: string): string {
  let decoded = str
  decoded = decoded.replace(/[^A-Za-z0-9\*\#]/g, '')
  const chars = 'ABCD*EFGHIJKLMNOPQRSTUVWX#YZabcdefghijklmnopqrstuvwxyz1234567890'
  let result = ''
  let u = 0
  while (u < decoded.length) {
    const o = chars.indexOf(decoded.charAt(u++))
    const r = chars.indexOf(decoded.charAt(u++))
    const s = chars.indexOf(decoded.charAt(u++))
    const c = chars.indexOf(decoded.charAt(u++))
    result += String.fromCharCode((o << 2) | (r >> 4))
    if (s !== 64) result += String.fromCharCode(((r & 3) << 6) | c)
  }
  return result
}

function getPathFromUrl(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.pathname + parsed.search
  } catch {
    return url.startsWith('/') ? url : '/' + url
  }
}

export async function fetchImageThroughProxy(imageUrl: string): Promise<string> {
  const imageBase = getImageBase()
  const path = getPathFromUrl(imageUrl)
  const encodedPath = path.endsWith('.txt') ? path : path + '.txt'
  const proxyUrl = `${imageBase}${encodedPath}`
  const response = await fetch(proxyUrl)
  if (!response.ok) return ''
  const text = await response.text()
  if (!text) return ''

  const result = customDecode(text)
  const base64Part = result.split('base64,')[1] || ''
  return result.substring(0, result.length - (base64Part.length % 4 || 0))
}
