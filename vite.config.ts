import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname, extname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@app': resolve(__dirname, 'src/app'),
      '@features': resolve(__dirname, 'src/features'),
      '@shared': resolve(__dirname, 'src/shared'),
    },
  },
  plugins: [
    {
      name: 'performa-spa-route-fallback',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.method !== 'GET' && req.method !== 'HEAD') return next()
          const accept = req.headers.accept ?? ''
          if (!accept.includes('text/html')) return next()

          const path = req.url?.split('?')[0] ?? ''
          if (extname(path)) return next()
          if (path.startsWith('/@') || path.startsWith('/src/') || path.startsWith('/node_modules/')) {
            return next()
          }

          const html = readFileSync(resolve(server.config.root, 'index.html'), 'utf-8')
          const transformed = await server.transformIndexHtml(path, html)
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/html')
          res.end(transformed)
        })
      },
    },
    react(),
  ],
})
