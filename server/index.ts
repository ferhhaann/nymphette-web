import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production'
) {
  const resolve = (p: string) => path.resolve(__dirname, p)

  const indexProd = isProd
    ? fs.readFileSync(resolve('../dist/client/index.html'), 'utf-8')
    : ''

  const app = express()

  let vite: any
  if (!isProd) {
    vite = await createViteServer({
      root,
      logLevel: 'info',
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100,
        },
      },
      appType: 'custom'
    })
    app.use(vite.middlewares)
  } else {
    app.use(express.static(resolve('../dist/client'), { index: false }))
  }

  // Handle all routes
  app.use(async (req, res, next) => {
    try {
      const url = req.originalUrl

      let template: string
      let render: (url: string, context?: any) => { html: string; context: any }

      if (!isProd) {
        template = fs.readFileSync(resolve('../index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
      } else {
        template = indexProd
        // @ts-ignore - This file will be created during build
        render = (await import('../dist/server/entry-server.js')).render
      }

      const rendered = render(url, {})
      const html = template
        .replace(`<!--ssr-outlet-->`, rendered.html)
        .replace(`<!--ssr-head-->`, generateHead(rendered.context))

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e: any) {
      !isProd && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}

function generateHead(helmetContext: any) {
  const { helmet } = helmetContext
  if (!helmet) return ''
  
  return [
    helmet.title?.toString() || '',
    helmet.meta?.toString() || '',
    helmet.link?.toString() || '',
    helmet.script?.toString() || '',
  ].join('\n')
}

createServer().then(({ app }) =>
  app.listen(3000, () => {
    console.log(`Server started at http://localhost:3000 (${process.env.NODE_ENV || 'development'} mode)`)
  })
)

export { createServer }