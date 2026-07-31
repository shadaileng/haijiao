export interface DeviceIdentity {
  id: string
  nickname: string
  createdAt: number
  lastActive: number
}

const IDENTITY_KEY = 'p2p_identity'
const DEFAULT_NICKNAME_PREFIX = '设备'

export async function generateFingerprint(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    (navigator as any).deviceMemory || 'unknown',
    navigator.platform,
    navigator.maxTouchPoints || 0,
  ]

  const fingerprint = components.join('|')
  const encoder = new TextEncoder()
  const data = encoder.encode(fingerprint)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function getDefaultNickname(id: string): string {
  return `${DEFAULT_NICKNAME_PREFIX} ${id.slice(0, 8)}`
}

export async function getOrCreateIdentity(): Promise<DeviceIdentity> {
  const stored = localStorage.getItem(IDENTITY_KEY)
  if (stored) {
    const identity: DeviceIdentity = JSON.parse(stored)
    identity.lastActive = Date.now()
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity))
    return identity
  }

  const fingerprint = await generateFingerprint()
  const identity: DeviceIdentity = {
    id: fingerprint,
    nickname: getDefaultNickname(fingerprint),
    createdAt: Date.now(),
    lastActive: Date.now(),
  }
  localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity))
  return identity
}

export function updateIdentityNickname(nickname: string): void {
  const stored = localStorage.getItem(IDENTITY_KEY)
  if (!stored) return

  const identity: DeviceIdentity = JSON.parse(stored)
  identity.nickname = nickname
  localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity))
}

export function clearIdentity(): void {
  localStorage.removeItem(IDENTITY_KEY)
}
