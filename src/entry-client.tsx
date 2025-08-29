import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App, { AppRoutes } from './App'
import './index.css'

function Root() {
  return (
    <App>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </App>
  )
}

hydrateRoot(document.getElementById('root')!, <Root />)
