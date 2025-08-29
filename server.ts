import express from 'express'
import fs from 'fs'
import path from 'path'

const isProd = process.env.NODE_ENV === 'production'
const resolve = (p: string) => path.resolve(__dirname, p)

async function createServer() {
  const app = express()

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite')
    const vite = await createViteServer({ server: { middlewareMode: 'ssr' } })
    app.use(vite.middlewares)

    app.use('*', async (req, res) => {
      const url = req.originalUrl
      try {
        let template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
        const { html } = render(url)
        const htmlResponse = template.replace('<!--ssr-outlet-->', html)
        res.status(200).set({ 'Content-Type': 'text/html' }).end(htmlResponse)
      } catch (e: any) {
        vite.ssrFixStacktrace(e)
        console.error(e)
        res.status(500).end(e.message)
      }
    })
  } else {
    const clientDist = resolve('dist/client')
    app.use(express.static(clientDist))
    const { render } = require('./dist/server/entry-server.js')
    const template = fs.readFileSync(path.join(clientDist, 'index.html'), 'utf-8')
    app.use('*', (req, res) => {
      const url = req.originalUrl
      const { html } = render(url)
      const htmlResponse = template.replace('<!--ssr-outlet-->', html)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(htmlResponse)
    })
  }

  return { app }
}

createServer().then(({ app }) => {
  const port = process.env.PORT || 5173
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
})
