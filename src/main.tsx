import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const container = document.getElementById("root")!

if (container.hasChildNodes()) {
  // SSR hydration
  hydrateRoot(container, 
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  // Client-side only fallback
  import('react-dom/client').then(({ createRoot }) => {
    createRoot(container).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  })
}
