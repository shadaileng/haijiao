export const E2E = {
  mirrorDomain: 'https://hj260602947.top',

  // 登录凭据（auth/video 规格使用真实登录流程）
  uid: '',
  token: '',
  username: 'qpf0510@qq.com',
  password: 'qpf0510',

  // 含视频+图片的帖子
  videoPid: '2193260',
}

export function hasAuth(): boolean {
  return !!E2E.username && !!E2E.password
}

export function hasVideo(): boolean {
  return hasAuth() && !!E2E.videoPid
}
