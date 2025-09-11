import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { runNetworkDiagnostics } from './utils/network-diagnostics'

// Run network diagnostics for international users
if (typeof window !== 'undefined') {
  runNetworkDiagnostics();
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
