export interface UserInfo {
  uid: string
  token: string
  nickname?: string
}

export interface FollowUser {
  userId: string
  nickname: string
}

export interface TopicItem {
  topicId: string
  id: string
  title: string
  content: string
  desc: string
  user: {
    id: string
    nickname: string
  }
  create_time: string
  createTime: string
  category?: string
  remoteUrl?: string
  play_info?: {
    cdn_url?: string
  }
  video_url?: string
  url?: string
  name?: string
  [key: string]: any
}

export interface TopicListResponse {
  results: TopicItem[]
  page: {
    total: number
    page: number
    limit: number
  }
}

export interface SearchResponse {
  results: TopicItem[]
  page: {
    total: number
    page: number
    limit: number
  }
}

export interface AttachmentItem {
  id: string
  category: string
  remoteUrl: string
  name?: string
  play_info?: {
    cdn_url?: string
  }
  video_url?: string
  url?: string
  [key: string]: any
}

export interface PaginationProps {
  totalCount: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export interface ApiResult<T = any> {
  success: boolean
  data: T
  isEncrypted?: boolean
  message?: string
}
