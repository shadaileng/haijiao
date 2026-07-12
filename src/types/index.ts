export interface UserInfo {
  uid: string
  token: string
  nickname?: string
}

export interface User {
  userId: number
  nickname: string
  avatar: string
  description: string
  topicCount: number
  videoCount: number
  fansCount: number
  favoriteCount: number
}

export interface UserCurrent {
  id: number
  nickname: string
  avatar: string
  description: string
  topicCount: number
  videoCount: number
  commentCount: number
  fansCount: number
  favoriteCount: number
  status: number
  sex: number
  vip: number
  vipExpiresTime: string
  tags: Array<any> | null
  role: number
  phone: string
  gold: number
  topicLikeNum: number
  username: string
  email: string
  emailVerified: boolean
  createTime: string
  lastLoginTime: string
  lastLoginIp: string
}

export interface FollowUser {
  id: number
  userId: number
  nickname: string
  avatar: string
  description: string
  topicCount: number
  videoCount: number
  fansCount: number
  favoriteCount: number
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

export interface CommentItem {
  userId: number
  nickname: string
  floor: number
  avatar: string
  attachments: string
  certVideo: boolean
  replyId: number
  createTime: string
  content: string
  commendList: CommentItem[]
}

export interface CommentPage {
  results: CommentItem[]
  page: Page
}

export interface ApiResult<T = any> {
  success: boolean
  data: T
  isEncrypted?: boolean
  message?: string
  errorCode?: number
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
  user: UserCurrent
  domain: string
  domainAbroad: string
  customerService: string
  ref: string
  type: number
  vip_domain: string
}
