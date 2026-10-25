import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'bootstrap5/src/css/bootstrap.min.css';
import './index.scss'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
