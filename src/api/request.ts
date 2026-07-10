import { md5 } from 'js-md5'
import type { ApiResult, LoginParams, LoginResponse } from '@/types'
import { useUserStore } from '@/stores/user'

// Get proxy base URL from store, fallback to /api
function getProxyBase(): string {
  const store = useUserStore()
  return store.proxyBase || '/api'
}

// Get full API prefix, appending /api when proxyBase is a full URL
function getApiPrefix(): string {
  const base = getProxyBase()
  if (base === '/api') return base
  if (base.startsWith('http')) return `${base}/api`
  return base
}

// Derive API host from proxyBase (for direct resource URLs)
function getApiHost(): string {
  const store = useUserStore()
  if (store.proxyBase && store.proxyBase.startsWith('http')) {
    try {
      return new URL(store.proxyBase).hostname
    } catch {}
  }
  return 'haijiao.com'
}

// Build proxied URL using proxy base prefix
function buildProxiedUrl(path: string, params?: Record<string, any>): string {
  const url = `${getApiPrefix()}${path}`
  if (!params || Object.keys(params).length === 0) return url
  const search = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) search.append(k, String(v))
  }
  const qs = search.toString()
  return qs ? `${url}?${qs}` : url
}

// Build direct URL (for external resources like images/videos)
function buildDirectUrl(path: string): string {
  const host = getApiHost()
  return `https://${host}${path}`
}

interface RequestOptions {
  url: string
  method?: string
  params?: Record<string, any>
  body?: any
  headers?: Record<string, string>
}

function buildUrl(path: string, params?: Record<string, any>): string {
  return buildProxiedUrl(path, params)
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

  const response = await fetch(buildDirectUrl('/api/attachment'), {
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

// Hot topics API
export async function getHotTopics(page: number, limit: number = 20): Promise<any> {
  return request({
    url: '/topic/hot/topics',
    params: { page, limit },
  })
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

// Login API
export async function login(params: LoginParams): Promise<LoginResponse> {
  const sign = generateSign(params.username, params.password)

  const response = await fetch(`${getApiPrefix()}/login/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'pcver': '2',
    },
    body: JSON.stringify({
      Username: params.username,
      Password: params.password,
      CaptchaCode: params.captchaCode || '',
      CaptchaId: params.captchaId || '',
      Ref: params.ref || '',
      Sign: sign,
    }),
  })

  const data: ApiResult = await response.json()

  if (!data.success) {
    throw new Error(data.message || '登录失败')
  }

  let result: LoginResponse = data.data
  if (data.isEncrypted) {
    try {
      const decoded = decodeMultiBase64(data.data)
      result = JSON.parse(decoded)
    } catch (e) {
      console.error('decrypt login error:', e)
      throw new Error('登录数据解密失败')
    }
  }

  return result
}

function generateSign(username: string, password: string): string {
  return md5(username + password + navigator.userAgent)
}

// Image processing
export async function processImages(items: any[]): Promise<any[]> {
  const props = items.map(async (item: any) => {
    if (!item.remoteUrl) return item
    try {
      const directUrl = buildDirectUrl(item.remoteUrl)
      const resp = await fetch(directUrl)
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
