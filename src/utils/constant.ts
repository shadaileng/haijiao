// 本地占位图（data URI，避免依赖外部网络）
const svg =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#ebedf0"/><text x="50%" y="50%" font-size="10" fill="#969799" text-anchor="middle" dominant-baseline="middle">LOAD</text></svg>'
  )

export const LOADING_URL = svg
export const API_URL = 'https://haijiao.com'
