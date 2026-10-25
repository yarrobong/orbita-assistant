import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { APP_BASE } from './lib/config'

const root = document.getElementById('root')

if (!root) throw new Error('Root element is missing')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`${APP_BASE}sw.js`, { scope: APP_BASE }).catch(() => undefined)
  }, { once: true })
}
