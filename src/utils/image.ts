const CHARS = 'ABCD*EFGHIJKLMNOPQRSTUVWX#YZabcdefghijklmnopqrstuvwxyz1234567890'

function customDecode(str: string): string {
  let decoded = str.replace(/[^A-Za-z0-9\*\#]/g, '')
  let result = ''
  let u = 0
  while (u < decoded.length) {
    const o = CHARS.indexOf(decoded.charAt(u++))
    const r = CHARS.indexOf(decoded.charAt(u++))
    const s = CHARS.indexOf(decoded.charAt(u++))
    const c = CHARS.indexOf(decoded.charAt(u++))
    result += String.fromCharCode((o << 2) | (r >> 4))
    if (s !== 64 && s >= 0) result += String.fromCharCode(((r & 3) << 6) | c)
  }
  const bytes = new Uint8Array(result.length)
  for (let i = 0; i < result.length; i++) {
    bytes[i] = result.charCodeAt(i)
  }
  return new TextDecoder('utf-8').decode(bytes)
}

export async function fetchImageThroughProxy(imageUrl: string): Promise<string> {
  const url = imageUrl.endsWith('.txt') ? imageUrl : imageUrl + '.txt'
  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`

  const response = await fetch(proxyUrl)
  if (!response.ok) return ''
  const text = await response.text()
  if (!text) return ''

  const result = customDecode(text)
  if (!result) return ''
  const base64Part = result.split('base64,')[1] || ''
  const trim = base64Part.length % 4 || 0
  return result.substring(0, result.length - trim)
}

export function loadImg(items: { remoteUrl: string }[]): Promise<{ remoteUrl: string }[]> {
  const props = items.map(async item => {
    item.remoteUrl = await fetch(item.remoteUrl)
      .then(resp => resp.text())
      .then(data => {
        if (!data) return item.remoteUrl
        const result = customDecode(data)
        if (!result) return item.remoteUrl
        const base64Part = result.split('base64,')[1] || ''
        const trim = base64Part.length % 4 || 0
        return result.substring(0, result.length - trim)
      })
      .catch(() => item.remoteUrl)
    return item
  })
  return Promise.all(props)
}
