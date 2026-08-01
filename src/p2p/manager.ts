import { getOrCreateIdentity, type DeviceIdentity } from './identity'
import { signalingClient } from './signaling'
import { useP2PStore } from '@/stores/p2p'

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]

const HEARTBEAT_INTERVAL = 5 * 60 * 1000

export class P2PManager {
  private identity: DeviceIdentity | null = null
  private peers = new Map<string, {
    connection: RTCPeerConnection
    dataChannel?: RTCDataChannel
  }>()
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private onDataCallbacks: Array<(data: unknown) => void> = []

  async initialize(): Promise<void> {
    this.identity = await getOrCreateIdentity()
  }

  getIdentity(): DeviceIdentity | null {
    return this.identity
  }

  async connect(): Promise<void> {
    if (!this.identity) {
      await this.initialize()
    }

    try {
      const response = await signalingClient.register(
        this.identity!.id,
        this.identity!.nickname
      )
      const p2pStore = useP2PStore()
      p2pStore.setStatus('connected')

      // 立即添加当前设备到设备列表
      p2pStore.updateDeviceStatus(this.identity!.id, 'online', this.identity!.nickname)

      // 立即填充所有已在线设备到设备列表（不等 WebRTC 连上）
      for (const peer of response.peers) {
        p2pStore.updateDeviceStatus(peer.id, 'online', peer.nickname)
      }

      // 发起 WebRTC 连接
      for (const peer of response.peers) {
        if (!this.peers.has(peer.id)) {
          await this.initiateConnection(peer.id)
        }
      }

      this.startHeartbeat()
    } catch (error) {
      console.error('P2P connect failed:', error)
      const p2pStore = useP2PStore()
      if (error instanceof Error && error.message === 'P2P unavailable') {
        p2pStore.setStatus('unavailable')
      } else {
        p2pStore.setStatus('disconnected')
      }
    }
  }

  disconnect(): void {
    this.stopHeartbeat()

    for (const [, peer] of this.peers) {
      peer.connection.close()
    }
    this.peers.clear()

    if (this.identity) {
      signalingClient.unregister(this.identity.id).catch(console.error)
    }

    const p2pStore = useP2PStore()
    p2pStore.setStatus('disconnected')
  }

  broadcast(data: unknown): void {
    const message = JSON.stringify(data)
    for (const [, peer] of this.peers) {
      if (peer.dataChannel?.readyState === 'open') {
        peer.dataChannel.send(message)
      }
    }
  }

  onData(callback: (data: unknown) => void): void {
    this.onDataCallbacks.push(callback)
  }

  private async initiateConnection(peerId: string): Promise<void> {
    const pc = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
    })

    const dc = pc.createDataChannel('shared-data', {
      ordered: true,
    })

    dc.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        for (const callback of this.onDataCallbacks) {
          callback(data)
        }
      } catch (error) {
        console.error('Failed to parse P2P message:', error)
      }
    }

    dc.onopen = () => {
      const p2pStore = useP2PStore()
      p2pStore.updateDeviceStatus(peerId, 'online')
    }

    dc.onclose = () => {
      const p2pStore = useP2PStore()
      p2pStore.updateDeviceStatus(peerId, 'offline')
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && this.identity) {
        signalingClient.sendCandidate(
          this.identity.id,
          peerId,
          event.candidate.toJSON()
        ).catch(console.error)
      }
    }

    pc.onconnectionstatechange = () => {
      const p2pStore = useP2PStore()
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        this.peers.delete(peerId)
        p2pStore.updateDeviceStatus(peerId, 'offline')
      }
    }

    this.peers.set(peerId, { connection: pc, dataChannel: dc })

    try {
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      if (this.identity) {
        await signalingClient.sendOffer(
          this.identity.id,
          peerId,
          pc.localDescription!.toJSON()
        )
      }
    } catch (error) {
      console.error('Failed to create offer:', error)
      this.peers.delete(peerId)
      pc.close()
    }
  }

  async handleOffer(from: string, sdp: RTCSessionDescriptionInit): Promise<void> {
    if (!this.identity) return

    const pc = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
    })

    const dc = pc.createDataChannel('shared-data', {
      ordered: true,
    })

    dc.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        for (const callback of this.onDataCallbacks) {
          callback(data)
        }
      } catch (error) {
        console.error('Failed to parse P2P message:', error)
      }
    }

    dc.onopen = () => {
      const p2pStore = useP2PStore()
      p2pStore.updateDeviceStatus(from, 'online')
    }

    dc.onclose = () => {
      const p2pStore = useP2PStore()
      p2pStore.updateDeviceStatus(from, 'offline')
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        signalingClient.sendCandidate(
          this.identity!.id,
          from,
          event.candidate.toJSON()
        ).catch(console.error)
      }
    }

    this.peers.set(from, { connection: pc, dataChannel: dc })

    await pc.setRemoteDescription(new RTCSessionDescription(sdp))
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    await signalingClient.sendAnswer(
      this.identity.id,
      from,
      pc.localDescription!.toJSON()
    )
  }

  async handleAnswer(from: string, sdp: RTCSessionDescriptionInit): Promise<void> {
    const peer = this.peers.get(from)
    if (!peer) return

    await peer.connection.setRemoteDescription(new RTCSessionDescription(sdp))
  }

  async handleCandidate(from: string, candidate: RTCIceCandidateInit): Promise<void> {
    const peer = this.peers.get(from)
    if (!peer) return

    await peer.connection.addIceCandidate(new RTCIceCandidate(candidate))
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(async () => {
      if (this.identity) {
        try {
          const response = await signalingClient.heartbeat(
            this.identity.id,
            this.identity.nickname
          )
          // 心跳响应中可能有新设备，更新设备列表
          const p2pStore = useP2PStore()
          for (const peer of response.peers) {
            p2pStore.updateDeviceStatus(peer.id, 'online', peer.nickname)
          }
        } catch (error) {
          console.error('P2P heartbeat failed:', error)
        }
      }
    }, HEARTBEAT_INTERVAL)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }
}

export const p2pManager = new P2PManager()
