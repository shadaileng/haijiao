import { customDecode } from '@/utils/cipher'

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
