import { mkdir } from 'node:fs/promises'
import { chromium } from '@playwright/test'

const baseURL = 'http://127.0.0.1:4173/orbita-assistant/'
const outputDir = 'docs/screenshots/workspace-palette'
await mkdir(outputDir, { recursive: true })

const views = [
  { name: 'home', route: '#/home' },
  { name: 'answers', route: '#/answers' },
  { name: 'delivery', route: '#/flow/delivery', stage: 'Заказ отправлен' },
  { name: 'pickup', route: '#/flow/pickup', stage: 'Время и выдача согласованы' },
]

const browser = await chromium.launch()
for (const viewport of [{ name: 'mobile', width: 390, height: 844 }, { name: 'desktop', width: 1280, height: 900 }]) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 })
  for (const view of views) {
    await page.goto(`${baseURL}${view.route}`)
    if (view.stage) {
      await page.getByRole('button', { name: view.stage, exact: true }).click()
    }
    await page.screenshot({ path: `${outputDir}/${view.name}-${viewport.name}.png` })
  }
  await page.close()
}
await browser.close()
