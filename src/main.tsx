import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Database-only mode - no JSON validation needed

createRoot(document.getElementById("root")!).render(<App />);
