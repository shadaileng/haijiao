const CHARS = 'ABCD*EFGHIJKLMNOPQRSTUVWX#YZabcdefghijklmnopqrstuvwxyz1234567890'

export function customDecode(str: string): string {
  let decoded = str.replace(/[^A-Za-z0-9\*\#]/g, '')
  let result = ''
  let u = 0
  while (u < decoded.length) {
    const o = CHARS.indexOf(decoded.charAt(u++))
    const r = CHARS.indexOf(decoded.charAt(u++))
    const s = CHARS.indexOf(decoded.charAt(u++))
    const c = CHARS.indexOf(decoded.charAt(u++))
    result += String.fromCharCode((o << 2) | (r >> 4))
    if (s !== 64) result += String.fromCharCode(((15 & r) << 4) | (s >> 2))
    if (c !== 64) result += String.fromCharCode(((3 & s) << 6) | c)
  }
  const bytes = new Uint8Array(result.length)
  for (let i = 0; i < result.length; i++) {
    bytes[i] = result.charCodeAt(i)
  }
  return new TextDecoder('utf-8').decode(bytes)
}

/** @deprecated 请使用 imageLoader.load() / imageLoader.observe() 替代。保留此函数以便回退。 */
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
