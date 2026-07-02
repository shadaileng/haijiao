import type { ApiResult } from '@/types'

const API_BASE = '/api'

interface RequestOptions {
  url: string
  method?: string
  params?: Record<string, any>
  body?: any
  headers?: Record<string, string>
}

function buildUrl(path: string, params?: Record<string, any>): string {
  const url = `${API_BASE}${path}`
  if (!params || Object.keys(params).length === 0) return url
  const search = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) search.append(k, String(v))
  }
  const qs = search.toString()
  return qs ? `${url}?${qs}` : url
}

function getHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...extra,
  }
}

export async function request(options: RequestOptions): Promise<any> {
  const { url, method = 'GET', params, body, headers } = options
  const fullUrl = buildUrl(url, params)

  const fetchOptions: RequestInit = {
    method,
    headers: getHeaders(headers),
  }

  if (body) {
    fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
  }

  try {
    const response = await fetch(fullUrl, fetchOptions)
    const data: ApiResult = await response.json()

    if (!data.success) {
      throw new Error(data.message || '请求失败')
    }

    let result = data.data
    if (data.isEncrypted) {
      try {
        const decoded = decodeMultiBase64(data.data)
        result = JSON.parse(decoded)
      } catch (e) {
        console.error('decrypt error:', e)
      }
    }

    return result
  } catch (error) {
    console.error('request error:', error)
    throw error
  }
}

function decodeMultiBase64(str: string): string {
  let decoded = str
  for (let i = 0; i < 3; i++) {
    decoded = atob(decoded)
  }
  return utf8Decode(decoded)
}

function utf8Decode(binary: string): string {
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder('utf-8').decode(bytes)
}

// Topic APIs
export async function getTopic(topicId: string): Promise<any> {
  return request({ url: `/topic/${topicId}` })
}

export async function getTopicAttachments(topicId: string): Promise<any[]> {
  const data = await getTopic(topicId)
  if (!data?.attachments) return []

  const attachments = await Promise.all(
    data.attachments.map(async (item: any) => {
      if (item.category === 'video') {
        return await loadVideoSrc(item.id, topicId)
      }
      return item
    })
  )

  return attachments
}

async function loadVideoSrc(id: string, resourceId: string): Promise<any> {
  const { useUserStore } = await import('@/stores/user')
  const store = useUserStore()

  const response = await fetch(`${API_BASE}/attachment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': store.uid,
      'X-User-Token': store.token,
    },
    body: JSON.stringify({
      id: parseInt(id),
      resource_id: parseInt(resourceId),
      resource_type: 'topic',
      line: '',
    }),
  })

  const data: ApiResult = await response.json()
  if (!data.success) {
    throw new Error(data.message || '视频加载失败')
  }

  let result = data.data
  if (data.isEncrypted) {
    try {
      result = JSON.parse(decodeMultiBase64(data.data))
    } catch (e) {
      console.error('decrypt video error:', e)
    }
  }

  return result
}

// User/Follow APIs
export async function getFollowList(token: string, uid: string): Promise<any[]> {
  return request({
    url: '/user/favorite/users',
    params: {},
    headers: {
      'X-User-Id': uid,
      'X-User-Token': token,
    },
  })
}

// Topic list APIs
export async function getUserTopics(userId: string, page: number, limit: number = 15): Promise<any> {
  return request({
    url: '/topic/node/topics',
    params: { userId, page, type: 1, limit },
  })
}

export async function searchTopics(key: string, page: number, nodeId: number = 0): Promise<any> {
  return request({
    url: '/topic/searchV2',
    params: { key, page, node_id: nodeId },
  })
}

// Image processing
export async function processImages(items: any[]): Promise<any[]> {
  const props = items.map(async (item: any) => {
    if (!item.remoteUrl) return item
    try {
      const resp = await fetch(item.remoteUrl)
      const text = await resp.text()
      if (!text) return item
      const result = customDecode(text)
      const base64Part = result.split('base64,')[1] || ''
      return {
        ...item,
        remoteUrl: result.substring(0, result.length - base64Part.length % 4 || 0),
      }
    } catch {
      return item
    }
  })
  return Promise.all(props)
}

function customDecode(str: string): string {
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
