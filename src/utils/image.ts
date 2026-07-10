export function utf8Decode(binary: string): string {
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder('utf-8').decode(bytes)
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
  return utf8Decode(result)
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
  return result.substring(0, result.length - (base64Part.length % 4 || 0))
}
