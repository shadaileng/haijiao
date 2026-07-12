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
        try {
          decodeURI(req.url || '/')
        } catch {
          res.writeHead(400, { 'Content-Type': 'text/plain' })
          res.end('Bad Request: Malformed URI')
          return
        }
        if (!req.url?.startsWith('/api')) return next()

        const backend = (req.headers['x-backend'] as string) || ''
        if (!backend) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: false, message: 'Missing X-Backend header' }))
          return
        }

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
