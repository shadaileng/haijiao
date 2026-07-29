import { md5 } from 'js-md5'
import { useSettingsStore } from '@/stores/settings'
import { toCamelCase } from '@/utils/transform'
import type { ApiResult, LoginParams, LoginResponse, VideoLine } from '@/types'
import { showToast } from 'vant'

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
    throw new Error(data.message || '请求失败')
  }

  let result = data.data
  if (data.isEncrypted) {
    try {
      result = JSON.parse(decodeEncrypted(String(data.data))) as T
    } catch (e) {
      console.error('decrypt error:', e)
      showToast({ message: '数据解密失败，请检查镜像源配置', type: 'fail' })
    }
  }
  return toCamelCase(result) as T
}

// 帖子详情
export async function getTopic(topicId: string | number): Promise<any> {
  return request({ url: `/topic/${topicId}` })
}

// 视频地址解析（修复认证来源：统一 settings store 的 uid/token）
export async function loadVideoSrc(id: string | number, resourceId: string | number, line = 'normal1'): Promise<any> {
  const settings = useSettingsStore()
  const data = await request({
    url: '/attachment',
    method: 'POST',
    body: {
      id: Number(id),
      resource_id: Number(resourceId),
      resource_type: 'topic',
      line,
    },
    headers: {
      'X-User-Id': settings.uid,
      'X-User-Token': settings.token,
    },
  })
  return data
}

// 获取视频可用线路列表
export async function getVideoLines(attachmentId: string | number): Promise<VideoLine[]> {
  return request({ url: '/topic/att/' + attachmentId })
}

// 解析 preview.m3u8 → 完整视频 URL
// 参考 haijiao.py:getRealUrl (docs/reference/haijiao_download/haijiao.py:168-180)
export async function resolveRealUrl(previewUrl: string): Promise<string> {
  const resp = await fetch(previewUrl)
  const text = await resp.text()
  const lines = text.split('\n').filter(l => !l.startsWith('#') && l.trim())
  if (!lines.length) return previewUrl
  const firstLine = lines[0]
  let code: string
  if (firstLine.startsWith('http')) {
    code = firstLine.slice(firstLine.lastIndexOf('/') + 1, firstLine.lastIndexOf('.') - 1)
  } else {
    code = firstLine.slice(0, firstLine.lastIndexOf('.') - 1)
  }
  return previewUrl.replace(/(\d+_i)_preview/, code)
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
        } catch (e) {
          console.warn('video parse failed:', e)
          return item
        }
      }
      return item
    })
  )
  return data
}

export const TAB_CONFIG: Record<number, { url: string; label: string }> = {
  0: { url: '/topic/hot/topics',                    label: '热门' },
  1: { url: '/topic/node/news',                     label: '最新' },
  2: { url: '/topic/node/topics?type=1&nodeId=0',   label: '全部' },
}

export async function getTabTopics(tabIndex: number, page: number, limit = 20): Promise<any> {
  const cfg = TAB_CONFIG[tabIndex] || TAB_CONFIG[0]
  return request({ url: cfg.url, params: { page, limit } })
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

export async function getTags(params?: Record<string, any>): Promise<any> {
  return request({ url: '/tag/tags', params })
}

export async function getNodes(): Promise<any> {
  return request({ url: '/topic/nodes_by_ver/v2', params: { ver: 0 } })
}

export async function getNodeTopics(
  nodeId: number,
  page: number,
  type = 2,
  limit = 20
): Promise<any> {
  return request({ url: '/topic/node/topics', params: { nodeId, type, page, limit } })
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

// 收藏帖子
export async function addFavorite(topicId: string | number): Promise<any> {
  return request({ url: '/favorite/add', params: { entityId: topicId, entityType: 'topic' } })
}

// 取消收藏
export async function delFavorite(topicId: string | number): Promise<any> {
  return request({ url: '/favorite/delete', params: { entityId: topicId, entityType: 'topic' } })
}

// 检查帖子是否已收藏
export async function checkFavorite(topicId: string | number): Promise<any> {
  return request({ url: '/favorite/favorite', params: { entityId: topicId, entityType: 'topic' } })
}

// 收藏夹列表
export async function getFavoriteFolders(): Promise<any> {
  return request({ url: '/favorite/v2/folderList', params: {} })
}

// 收藏夹内帖子列表（分页）
export async function getFavoriteTopics(
  page: number,
  limit = 20,
  folderId?: number,
  total?: number
): Promise<any> {
  const params: Record<string, any> = { page, limit }
  if (folderId !== undefined) params.folderId = folderId
  if (total !== undefined) params.total = total
  return request({ url: '/favorite/v2/topics', params })
}

export async function login(params: LoginParams): Promise<LoginResponse> {
  const sign = md5(params.username + params.password + navigator.userAgent)
  const response = await fetch('/api/login/signin', {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json', pcver: '2' }),
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
  let result: LoginResponse = data.data!
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

export interface Api {
  topic(params: { params: { topicId: string | number } }): Promise<ApiResult>
  hot(params: { params: { page: number; limit?: number } }): Promise<ApiResult>
  tabTopics(params: { params: { tabIndex: number; page: number; limit?: number } }): Promise<ApiResult>
  search(params: { params: { key: string; page: number; node_id?: number } }): Promise<ApiResult>
  tags(params?: { params?: any }): Promise<ApiResult>
  nodes(): Promise<ApiResult>
  nodeTopics(params: { params: { nodeId: number; page: number; type?: number; limit?: number } }): Promise<ApiResult>
  follow(): Promise<ApiResult>
  topics(params: { params: { userId: string; page: number; type: number } }): Promise<ApiResult>
  userinfo(params: { uid: string | number }): Promise<ApiResult>
  reply_list(params: { params: { page: number; sort: string; topic_id: number; search_type: number; user_id: number } }): Promise<ApiResult>
  current(): Promise<ApiResult>
  login(params: LoginParams): Promise<ApiResult>
  videoLines(params: { attachmentId: string | number }): Promise<ApiResult>
  addFavorite(params: { params: { topicId: string | number } }): Promise<ApiResult>
  delFavorite(params: { params: { topicId: string | number } }): Promise<ApiResult>
  checkFavorite(params: { params: { topicId: string | number } }): Promise<ApiResult>
  favoriteFolders(): Promise<ApiResult>
  favoriteTopics(params: { params: { page: number; limit?: number; folderId?: number; total?: number } }): Promise<ApiResult>
}

// 统一 API 对象，所有视图直接 import 使用
export const api: Api = {
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
  async tabTopics({ params }: { params: { tabIndex: number; page: number; limit?: number } }) {
    try {
      const data = await getTabTopics(params.tabIndex, params.page, params.limit)
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
  async tags({ params }: { params?: any } = {}) {
    try {
      const data = await getTags(params)
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
  async nodes() {
    try {
      const data = await getNodes()
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
  async nodeTopics({ params }: { params: { nodeId: number; page: number; type?: number; limit?: number } }) {
    try {
      const data = await getNodeTopics(params.nodeId, params.page, params.type, params.limit)
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
  async videoLines({ attachmentId }: { attachmentId: string | number }) {
    try {
      const data = await getVideoLines(attachmentId)
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
  async addFavorite({ params }: { params: { topicId: string | number } }) {
    try {
      const data = await addFavorite(params.topicId)
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
  async delFavorite({ params }: { params: { topicId: string | number } }) {
    try {
      const data = await delFavorite(params.topicId)
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
  async checkFavorite({ params }: { params: { topicId: string | number } }) {
    try {
      const data = await checkFavorite(params.topicId)
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
  async favoriteFolders() {
    try {
      const data = await getFavoriteFolders()
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
  async favoriteTopics({ params }: { params: { page: number; limit?: number; folderId?: number; total?: number } }) {
    try {
      const data = await getFavoriteTopics(params.page, params.limit, params.folderId, params.total)
      return { success: true, data }
    } catch (e: any) {
      return { success: false, message: e.message }
    }
  },
}
