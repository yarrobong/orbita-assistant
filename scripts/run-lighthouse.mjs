import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { chromium } from '@playwright/test'

const url = 'http://127.0.0.1:4173/orbita-assistant/'
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1'], { stdio: 'ignore' })
const tempDir = await mkdtemp(join(tmpdir(), 'orbita-lighthouse-'))
const reportPath = join(tempDir, 'report.json')
try {
  let ready = false
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { const response = await fetch(url); if (response.ok) { ready = true; break } } catch { /* server is starting */ }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  if (!ready) throw new Error('Vite preview did not start on port 4173')
  const chromePath = chromium.executablePath()
  const result = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['--yes', 'lighthouse@13.5.0', url, `--chrome-path=${chromePath}`, '--chrome-flags=--headless --no-sandbox', '--quiet', '--output=json', `--output-path=${reportPath}`], { encoding: 'utf8', stdio: 'pipe', shell: process.platform === 'win32' })
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `Lighthouse exited with ${result.status}`)
  const report = JSON.parse(await readFile(reportPath, 'utf8'))
  const scores = Object.fromEntries(Object.entries(report.categories).map(([name, category]) => [name, Math.round(category.score * 100)]))
  const metrics = Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'speed-index', 'total-blocking-time', 'cumulative-layout-shift'].map((id) => [id, report.audits[id]?.displayValue ?? 'unavailable']))
  console.log(`Lighthouse 13.5.0 mobile profile: Performance ${scores.performance}; Accessibility ${scores.accessibility}; Best Practices ${scores['best-practices']}; SEO ${scores.seo}`)
  console.log(`FCP ${metrics['first-contentful-paint']}; LCP ${metrics['largest-contentful-paint']}; Speed Index ${metrics['speed-index']}; TBT ${metrics['total-blocking-time']}; CLS ${metrics['cumulative-layout-shift']}`)
  if (scores.performance < 95) throw new Error(`Lighthouse Performance ${scores.performance} is below the 95-point target`)
  await writeFileReport(scores, metrics)
} finally {
  server.kill('SIGTERM')
  await rm(tempDir, { recursive: true, force: true })
}

async function writeFileReport(scores, metrics) {
  const { writeFile } = await import('node:fs/promises')
  const content = `# Performance verification\n\n- Tool: Lighthouse 13.5.0, default mobile profile\n- Browser: Playwright Chromium installed with \`npx playwright install chromium\`\n- URL: local production preview at \`/orbita-assistant/\`\n- Scores: Performance ${scores.performance}, Accessibility ${scores.accessibility}, Best Practices ${scores['best-practices']}, SEO ${scores.seo}\n- Metrics: FCP ${metrics['first-contentful-paint']}, LCP ${metrics['largest-contentful-paint']}, Speed Index ${metrics['speed-index']}, TBT ${metrics['total-blocking-time']}, CLS ${metrics['cumulative-layout-shift']}\n- Initial JS/CSS gzip: separately checked by \`npm run audit:budget\` (JavaScript <=180 KiB; JS + CSS <=300 KiB).\n- Limitation: one local run is an engineering check, not a guarantee for every device or network.\n`
  await writeFile('docs/performance.md', content)
}
