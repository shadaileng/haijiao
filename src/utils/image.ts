import { customDecode } from '@/utils/cipher'
import { useSettingsStore } from '@/stores/settings'

export async function fetchImageThroughProxy(imageUrl: string): Promise<string> {
  const url = imageUrl.endsWith('.txt') ? imageUrl : imageUrl + '.txt'
  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`
  const settings = useSettingsStore()
  const response = await fetch(proxyUrl, {
    headers: { 'X-Backend': settings.apiBase },
  })
  if (!response.ok) return ''
  const text = await response.text()
  if (!text) return ''

  const result = customDecode(text)
  if (!result) return ''
  const base64Part = result.split('base64,')[1] || ''
  const trim = base64Part.length % 4 || 0
  return result.substring(0, result.length - trim)
}
