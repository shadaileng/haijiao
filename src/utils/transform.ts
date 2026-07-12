const snakeToCamelMap: Record<string, string> = {
  topic_id: 'topicId',
  like_count: 'likeCount',
  create_time: 'createTime',
  comment_count: 'commentCount',
  node_id: 'nodeId',
  user_id: 'userId',
  cover_url: 'coverUrl',
  remote_url: 'remoteUrl',
  key_path: 'keyPath',
  lite_content: 'liteContent',
  video_time_length: 'videoTimeLength',
  search_type: 'searchType',
  total_page: 'totalPage',
}

export function toCamelCase<T = any>(obj: any): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(toCamelCase) as any
  const result: any = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = snakeToCamelMap[key] || key
    result[camelKey] = toCamelCase(value)
  }
  return result as T
}
