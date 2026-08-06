import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env')
  if (!fs.existsSync(envPath)) return

  const content = fs.readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let value = trimmed.slice(eqIdx + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

loadEnv()

export const E2E = {
  mirrorDomain: process.env.E2E_MIRROR_DOMAIN || 'https://example.com',
  uid: process.env.E2E_UID || '',
  token: process.env.E2E_TOKEN || '',
  username: process.env.E2E_USERNAME || '',
  password: process.env.E2E_PASSWORD || '',
  videoPid: process.env.E2E_VIDEO_PID || '2193260',
}

export function hasAuth(): boolean {
  return !!E2E.username && !!E2E.password
}

export function hasVideo(): boolean {
  return hasAuth() && !!E2E.videoPid
}
