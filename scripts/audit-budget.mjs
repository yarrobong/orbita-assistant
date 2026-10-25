import { readdir, readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'

const files = (await readdir('dist/assets')).map((name) => `dist/assets/${name}`)
const js = files.filter((file) => file.endsWith('.js'))
const css = files.filter((file) => file.endsWith('.css'))
const gzipBytes = await Promise.all([...js, ...css].map(async (file) => gzipSync(await readFile(file)).length))
const total = gzipBytes.reduce((sum, bytes) => sum + bytes, 0)
const jsGzip = (await Promise.all(js.map(async (file) => gzipSync(await readFile(file)).length))).reduce((sum, bytes) => sum + bytes, 0)
console.log(`Initial JavaScript: ${(jsGzip / 1024).toFixed(1)} KiB gzip; JS + CSS: ${(total / 1024).toFixed(1)} KiB gzip`)
if (jsGzip > 180 * 1024) throw new Error('Initial JavaScript exceeds the 180 KiB gzip budget')
if (total > 300 * 1024) throw new Error('Initial JS/CSS exceeds the 300 KiB gzip critical-content budget')
