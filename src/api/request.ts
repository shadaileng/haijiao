import { md5 } from 'js-md5'
import { useSettingsStore } from '@/stores/settings'
import router from '@/router'
import type { ApiResult, LoginParams, LoginResponse } from '@/types'

let _redirecting = false
function handleAuthError() {
  if (_redirecting) return
  _redirecting = true
  const settings = useSettingsStore()
  settings.logout()
  setTimeout(() => { _redirecting = false }, 1000)
  router.push('/login')
}

function utf8Decode(binary: string): string {
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder('utf-8').decode(bytes)
}

// 多层 base64 解密（兼容 1/2/3 层加密）
function decodeEncrypted(str: string): string {
  for (const layers of [3, 2, 1]) {
    try {
      let decoded = str
      for (let i = 0; i < layers; i++) decoded = atob(decoded)
      const utf = utf8Decode(decoded)
      JSON.parse(utf)
      return utf
    } catch {
      // 尝试更少的层数
    }
  }
  return str
}

interface RequestOptions {
  url: string
  method?: string
  params?: Record<string, any>
  body?: any
  headers?: Record<string, string>
}

function buildUrl(path: string, params?: Record<string, any>): string {
  const url = `/api${path}`
  if (!params || Object.keys(params).length === 0) return url
  const search = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) search.append(k, String(v))
  }
  const qs = search.toString()
  return qs ? `${url}?${qs}` : url
}

function getAuthHeaders(extra?: Record<string, string>): Record<string, string> {
  const settings = useSettingsStore()
  const headers: Record<string, string> = {
    'X-Backend': settings.apiBase,
    ...extra,
  }
  if (settings.uid) headers['X-User-Id'] = settings.uid
  if (settings.token) headers['X-User-Token'] = settings.token
  return headers
}

export async function request<T = any>(options: RequestOptions): Promise<T> {
  const { url, method = 'GET', params, body, headers } = options
  const fetchOptions: RequestInit = {
    method,
    headers: getAuthHeaders({
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    }),
  }
  if (body) {
    fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
  }

  const response = await fetch(buildUrl(url, params), fetchOptions)
  const data: ApiResult<T> = await response.json()

  if (!data.success) {
    if (data.errorCode === 1) {
      handleAuthError()
    }
    throw new Error(data.message || '请求失败')
  }

  let result = data.data
  if (data.isEncrypted) {
    try {
      result = JSON.parse(decodeEncrypted(String(data.data))) as T
    } catch (e) {
      console.error('decrypt error:', e)
    }
  }
  return result
}

// 帖子详情
export async function getTopic(topicId: string | number): Promise<any> {
  return request({ url: `/topic/${topicId}` })
}

// 视频地址解析（修复认证来源：统一 settings store 的 uid/token）
export async function loadVideoSrc(id: string | number, resourceId: string | number): Promise<any> {
  const settings = useSettingsStore()
  const data = await request({
    url: '/attachment',
    method: 'POST',
    body: {
      id: Number(id),
      resource_id: Number(resourceId),
      resource_type: 'topic',
      line: 'normal1',
    },
    headers: {
      'X-User-Id': settings.uid,
      'X-User-Token': settings.token,
    },
  })
  return data
}

// 帖子详情（含视频附件解析）
export async function getTopicWithVideo(topicId: string | number): Promise<any> {
  const data = await getTopic(topicId)
  if (!data?.attachments) return data
  data.attachments = await Promise.all(
    data.attachments.map(async (item: any) => {
      if (item.category === 'video') {
        try {
          return await loadVideoSrc(item.id, topicId)
        } catch {
          return item
        }
      }
      return item
    })
  )
  return data
}

export async function getHotTopics(page: number, limit = 20): Promise<any> {
  return request({ url: '/topic/hot/topics', params: { page, limit } })
}

export async function getFollowList(): Promise<any> {
  return request({ url: '/user/favorite/users', params: {} })
}

export async function getUserTopics(
  userId: string | number,
  page: number,
  type = 1,
  limit = 15
): Promise<any> {
  return request({ url: '/topic/node/topics', params: { userId, page, type, limit } })
}

export async function searchTopics(
  key: string,
  page: number,
  nodeId = 0
): Promise<any> {
  return request({ url: '/topic/searchV2', params: { key, page, node_id: nodeId } })
}

export async function getUserInfo(uid: string | number): Promise<any> {
  return request({ url: `/user/info/${uid}` })
}

export async function getComments(params: Record<string, any>): Promise<any> {
  return request({ url: '/comment/reply_list', params })
}

export async function getCurrentUser(): Promise<any> {
  return request({
    url: '/user/current',
    params: { date: new Date().getTime() },
  })
}

export async function login(params: LoginParams): Promise<LoginResponse> {
  const sign = md5(params.username + params.password + navigator.userAgent)
  const response = await fetch('/api/login/signin', {
    method: 'POST',
    headers: getAuthHeaders({ pcver: '2' }),
    body: JSON.stringify({
      Username: params.username,
      Password: params.password,
      CaptchaCode: params.captchaCode || '',
      CaptchaId: params.captchaId || '',
      Ref: params.ref || '',
      Sign: sign,
    }),
  })
  const data: ApiResult<LoginResponse> = await response.json()
  if (!data.success) {
    throw new Error(data.message || '登录失败')
  }
  let result: LoginResponse = data.data
  if (data.isEncrypted) {
    try {
      result = JSON.parse(decodeEncrypted(String(data.data)))
    } catch (e) {
      console.error('decrypt login error:', e)
      throw new Error('登录数据解密失败')
    }
  }
  // 凭证保存由 user store 的 loginFromApi() 方法负责
  return result
}

// wxt 风格 api 对象（供组件 inject('$api') 使用）
export const api = {
  async topic({ params }: { params: { topicId: string | number } }) {
    try {
      const data = await getTopicWithVideo(params.topicId)
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
  async hot({ params }: { params: { page: number; limit?: number } }) {
    try {
      const data = await getHotTopics(params.page, params.limit)
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
  async search({ params }: { params: any }) {
    try {
      const data = await searchTopics(params.key, params.page, params.node_id)
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
  async follow() {
    try {
      const data = await getFollowList()
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
  async topics({ params }: { params: any }) {
    try {
      const data = await getUserTopics(params.userId, params.page, params.type)
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
  async userinfo({ uid }: { uid: string | number }) {
    try {
      const data = await getUserInfo(uid)
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
  async reply_list({ params }: { params: any }) {
    try {
      const data = await getComments(params)
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
  async current() {
    try {
      const data = await getCurrentUser()
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
  async login(params: LoginParams) {
    try {
      const data = await login(params)
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
}
