import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import http from 'node:http'
import https from 'node:https'

function dynamicProxyPlugin() {
  // P2P 信令服务内存存储（本地开发用）
  const p2pPeers = new Map<string, { id: string; nickname: string; lastSeen: number }>()
  const PEER_TIMEOUT = 30 * 60 * 1000

  function handleP2PLocal(req: any, res: any) {
    let body = ''
    req.on('data', (chunk: any) => { body += chunk })
    req.on('end', () => {
      const url = new URL(req.url, 'http://localhost')
      const path = url.pathname.replace('/api/p2p', '')

      console.log('[P2P] Request:', req.method, path)

      try {
        const data = body ? JSON.parse(body) : {}

        if (path === '/register' && req.method === 'POST') {
          const { peerId, nickname } = data
          // 清理超时节点
          const now = Date.now()
          for (const [id, peer] of p2pPeers) {
            if (now - peer.lastSeen > PEER_TIMEOUT) {
              p2pPeers.delete(id)
            }
          }
          // 返回其他节点列表
          const peers = Array.from(p2pPeers.values())
            .filter(p => p.id !== peerId)
            .map(p => p.id)
          // 添加当前节点
          p2pPeers.set(peerId, {
            id: peerId,
            nickname: nickname || `设备 ${peerId.slice(0, 8)}`,
            lastSeen: now,
          })
          console.log('[P2P] Register:', peerId, 'Peers:', peers)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: true, peers }))
          return
        }

        if (path === '/unregister' && req.method === 'POST') {
          const { peerId } = data
          p2pPeers.delete(peerId)
          console.log('[P2P] Unregister:', peerId)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: true }))
          return
        }

        if (path === '/heartbeat' && req.method === 'POST') {
          const { peerId, nickname } = data
          const peer = p2pPeers.get(peerId)
          if (peer) {
            peer.lastSeen = Date.now()
            if (nickname) peer.nickname = nickname
          }
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: true }))
          return
        }

        // offer/answer/candidate 简单返回成功
        if (['/offer', '/answer', '/candidate'].includes(path) && req.method === 'POST') {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: true }))
          return
        }

        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: false, message: 'Not found' }))
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: false, message: 'Internal error' }))
      }
    })
  }

  return {
    name: 'dynamic-proxy',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        try {
          decodeURI(req.url || '/')
        } catch {
          res.writeHead(400, { 'Content-Type': 'text/plain' })
          res.end('Bad Request: Malformed URI')
          return
        }
        if (!req.url?.startsWith('/api')) return next()

        // P2P 信令服务本地处理
        if (req.url?.startsWith('/api/p2p')) {
          return handleP2PLocal(req, res)
        }

        const backend = (req.headers['x-backend'] as string) || 'https://haijiao.com'

        let target: URL
        try {
          target = new URL(backend)
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: false, message: 'Invalid backend URL' }))
          return
        }
        if (target.protocol !== 'https:') {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: false, message: 'Backend must use HTTPS' }))
          return
        }

        let reqPath: string
        try {
          reqPath = decodeURI(req.url!)
        } catch {
          reqPath = req.url!
        }
        let encodedPath: string
        try {
          const u = new URL(reqPath, 'https://placeholder.com')
          encodedPath = u.pathname + u.search
        } catch {
          encodedPath = encodeURI(reqPath)
        }
        const opts = {
          hostname: target.hostname,
          port: 443,
          path: encodedPath,
          method: req.method,
          headers: { ...req.headers, host: target.host },
          rejectAuthorized: false,
        }
        const proxyReq = https.request(opts, (proxyRes) => {
          res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
          proxyRes.pipe(res)
        })
        proxyReq.on('error', (err) => {
          console.error('[proxy error]', err.message)
          res.writeHead(502)
          res.end('Proxy Error')
        })
        req.pipe(proxyReq)
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), dynamicProxyPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    watch: {
      ignored: ['**/docs/**', '**/e2e/**'],
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          vant: ['vant'],
          dplayer: ['dplayer'],
          hls: ['hls.js'],
        },
      },
    },
  },
  optimizeDeps: {
    entries: ['index.html'],
  },
})
