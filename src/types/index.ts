export interface UserInfo {
  uid: string
  token: string
  nickname?: string
}

export interface FollowUser {
  userId: string
  nickname: string
}

export interface Page {
  index: number
  size: number
  total: number
}

export interface TopicUser {
  id: number
  nickname: string
  avatar: string
}

export interface Node {
  nodeId: string
  name: string
  icon: string
}

export interface Attachment {
  id: number
  remoteUrl: string
  category: string
  status: number
  coverUrl: string
  video_time_length: number
  keyPath: string
}

export interface Topic {
  topicId: number
  title: string
  user: TopicUser | null
  content: string
  attachments: Attachment[]
  likeCount: number
  createTime: string
  node: Node | null
  commentCount: number
  doors: number[]
}

export interface LiteTopic extends Topic {
  liteContent: string
}

export interface LiteTopicPage {
  results: LiteTopic[]
  page: Page
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

export interface CommentItem {
  user_id: number
  nickname: string
  floor: number
  avatar: string
  attachments: string
  certVideo: boolean
  reply_id: number
  create_time: string
  content: string
  commend_list: CommentItem[]
}

export interface CommentPage {
  results: CommentItem[]
  page: Page
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

export interface LoginParams {
  username: string
  password: string
  captchaCode?: string
  captchaId?: string
  ref?: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    nickname: string
    avatar: string
    email: string
    username: string
    description: string
    topicCount: number
    commentCount: number
    fansCount: number
    favoriteCount: number
    createTime: string
    lastLoginTime: string
    [key: string]: any
  }
  domain: string
  domainAbroad: string
  customerService: string
  ref: string
  type: number
  vip_domain: string
}
