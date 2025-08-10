import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { validateAllLinks } from '@/data/validateLinks'

validateAllLinks();

createRoot(document.getElementById("root")!).render(<App />);
