import { createHash } from 'node:crypto'
import { readFile, readdir, writeFile } from 'node:fs/promises'

const base = '/orbita-assistant/'
const assets = (await readdir('dist/assets')).sort().map((file) => `${base}assets/${file}`)
const staticFiles = [base, `${base}manifest.webmanifest`, `${base}icons/orbita-192.png`, `${base}icons/orbita-512.png`, ...assets]
const revisionHash = createHash('sha256').update(staticFiles.join('\n'))
for (const file of staticFiles) {
  const localPath = file === base ? 'dist/index.html' : `dist/${file.slice(base.length)}`
  revisionHash.update(await readFile(localPath))
}
const revision = revisionHash.digest('hex').slice(0, 10)
const worker = `const CACHE = 'orbita-shell-${revision}'
const APP_BASE = '${base}'
const STATIC_FILES = ${JSON.stringify(staticFiles)}
self.addEventListener('message', (event) => {
  if (event.data?.type === 'ACTIVATE_UPDATE') self.skipWaiting()
})
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(STATIC_FILES)))
})
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('orbita-shell-') && key !== CACHE).map((key) => caches.delete(key)))))
})
self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(APP_BASE)) return
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => response.ok ? response : caches.match(APP_BASE)).catch(() => caches.match(APP_BASE)))
    return
  }
  event.respondWith(caches.match(request, { ignoreSearch: true, ignoreVary: true }).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone()))
    return response
  })))
})
`
await writeFile('dist/sw.js', worker)
