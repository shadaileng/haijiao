const P2P_API_BASE = '/api/p2p'

interface RegisterResponse {
  success: boolean
  peers: { id: string; nickname: string }[]  // 返回完整 peer 记录
}

interface HeartbeatResponse {
  success: boolean
  peers: { id: string; nickname: string }[]  // 心跳也返回 peer 列表
}

interface SignalingResponse {
  success: boolean
}

async function request<T>(path: string, method: string, body?: unknown): Promise<T> {
  console.log(`[P2P Send] ${method} ${path}`, body)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const response = await fetch(`${P2P_API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 503) {
    console.log('[P2P] Service unavailable: D1 not configured')
    throw new Error('P2P unavailable')
  }

  if (!response.ok) {
    throw new Error(`Signaling request failed: ${response.statusText}`)
  }

  const data = await response.json()
  console.log(`[P2P Recv] ${path}`, data)
  return data
}

export const signalingClient = {
  async register(peerId: string, nickname?: string): Promise<RegisterResponse> {
    return request<RegisterResponse>('/register', 'POST', { peerId, nickname })
  },

  async unregister(peerId: string): Promise<void> {
    await request<SignalingResponse>('/unregister', 'POST', { peerId })
  },

  async sendOffer(from: string, to: string, sdp: RTCSessionDescriptionInit): Promise<void> {
    await request<SignalingResponse>('/offer', 'POST', { from, to, sdp })
  },

  async sendAnswer(from: string, to: string, sdp: RTCSessionDescriptionInit): Promise<void> {
    await request<SignalingResponse>('/answer', 'POST', { from, to, sdp })
  },

  async sendCandidate(from: string, to: string, candidate: RTCIceCandidateInit): Promise<void> {
    await request<SignalingResponse>('/candidate', 'POST', { from, to, candidate })
  },

  async heartbeat(peerId: string, nickname: string): Promise<HeartbeatResponse> {
    return request<HeartbeatResponse>('/heartbeat', 'POST', { peerId, nickname })
  },
}
