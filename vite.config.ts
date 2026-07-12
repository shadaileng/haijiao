import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import http from 'node:http'
import https from 'node:https'

function dynamicProxyPlugin() {
  return {
    name: 'dynamic-proxy',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api')) return next()

        // 本地处理 /api/proxy-image（模拟 Worker 行为）
        if (req.url.startsWith('/api/proxy-image')) {
          const rawUrl = req.url || ''
          const qIdx = rawUrl.indexOf('?url=')
          let targetUrl = ''
          if (qIdx >= 0) {
            try { targetUrl = decodeURIComponent(rawUrl.slice(qIdx + 5)) } catch { targetUrl = rawUrl.slice(qIdx + 5) }
          }
          if (!targetUrl) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: false, message: 'Missing url parameter' }))
            return
          }
          const backend = (req.headers['x-backend'] as string) || 'https://haijiao.com'
          if (!targetUrl.startsWith('http')) {
            targetUrl = backend.replace(/\/$/, '') + (targetUrl.startsWith('/') ? targetUrl : '/' + targetUrl)
          }
          https.get(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win6; x64) AppleWebKit/537.36' } }, (proxyRes) => {
            let data = ''
            proxyRes.on('data', (chunk) => { data += chunk })
            proxyRes.on('end', () => {
              res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
              })
              res.end(data)
            })
          }).on('error', (err) => {
            console.error('[proxy-image error]', err.message)
            res.writeHead(502, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: false, message: 'Proxy error' }))
          })
          return
        }

        const backend = (req.headers['x-backend'] as string) || ''
        if (!backend) return next()
        let target: URL
        try {
          target = new URL(backend)
          if (target.protocol !== 'https:') return next()
        } catch { return next() }

        const path = req.url
        const opts = {
          hostname: target.hostname,
          port: 443,
          path,
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
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          vant: ['vant'],
        },
      },
    },
  },
  optimizeDeps: {
    entries: ['index.html'],
  },
})
