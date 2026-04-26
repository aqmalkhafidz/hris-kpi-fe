import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const appRoutes = new Set([
  '/',
  '/login',
  '/forgot-password',
  '/dashboard',
  '/self-appraisal',
  '/my-account',
  '/review/sl/a1',
  '/review/hod/a1',
  '/review/hodiv/a1',
  '/hr/dashboard',
  '/hr/organization',
  '/hr/kra-templates',
  '/hr/cycles',
  '/hr/distribution',
  '/hr/reports',
])

export default defineConfig({
  plugins: [
    {
      name: 'performa-spa-route-fallback',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const path = req.url?.split('?')[0] ?? ''
          if (!appRoutes.has(path)) return next()

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
