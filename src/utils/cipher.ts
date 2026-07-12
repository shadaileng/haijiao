const CHARS = 'ABCD*EFGHIJKLMNOPQRSTUVWX#YZabcdefghijklmnopqrstuvwxyz1234567890'

function utf8Decode(binary: string): string {
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder('utf-8').decode(bytes)
}

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
    if (s !== 64 && s >= 0) result += String.fromCharCode(((r & 3) << 6) | c)
  }
  return utf8Decode(result)
}

export { utf8Decode }
