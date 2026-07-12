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
