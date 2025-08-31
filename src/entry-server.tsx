import React from 'react'
import { StaticRouter } from 'react-router-dom/server'
import { renderToString } from 'react-dom/server'
import App, { AppRoutes } from './App'

export async function render(url: string) {
  try {
    const appHtml = renderToString(
      <React.StrictMode>
        <App>
          <StaticRouter location={url}>
            <AppRoutes />
          </StaticRouter>
        </App>
      </React.StrictMode>
    )

    return { html: appHtml }
  } catch (error) {
    console.error('Server-side rendering failed:', error)
    return { html: '<!-- SSR Error -->' }
  }
}
