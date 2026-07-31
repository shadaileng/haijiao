const P2P_API_BASE = '/api/p2p'

interface RegisterResponse {
  success: boolean
  peers: string[]
}

interface SignalingResponse {
  success: boolean
}

async function request<T>(path: string, method: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const response = await fetch(`${P2P_API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new Error(`Signaling request failed: ${response.statusText}`)
  }

  return response.json()
}

export const signalingClient = {
  async register(peerId: string): Promise<RegisterResponse> {
    return request<RegisterResponse>('/register', 'POST', { peerId })
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

  async heartbeat(peerId: string, nickname: string): Promise<void> {
    await request<SignalingResponse>('/heartbeat', 'POST', { peerId, nickname })
  },
}
