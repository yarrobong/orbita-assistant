import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text: string) => { (window as Window & { __copied?: string }).__copied = text } },
    })
  })
})

test('a customer can choose Quest games, reorder by priority and copy', async ({ page }) => {
  await page.goto('./#/games')
  await expect(page.getByRole('heading', { name: 'Игры для Quest' })).toBeVisible()
  await expect(page.getByText('216 из 216')).toBeVisible()
  await page.getByRole('button', { name: 'Добавить игру 2MD - VR Football Unleashed' }).click()
  await page.getByRole('button', { name: "Добавить игру A Fisherman's Tale" }).click()
  await page.getByRole('button', { name: "Поднять A Fisherman's Tale выше" }).click()
  const text = page.locator('#quest-games-request')
  await expect(text).toHaveValue(/1\. A Fisherman's Tale[\s\S]*2\. 2MD - VR Football Unleashed/u)
  await page.getByRole('button', { name: 'Копировать список игр' }).click()
  await expect(page.getByRole('status')).toContainText('Список скопирован')
  const copied = await page.evaluate(() => (window as Window & { __copied?: string }).__copied)
  expect(copied).toContain("1. A Fisherman's Tale")
  expect(copied).toContain("2. 2MD - VR Football Unleashed")
})

test('selection cannot exceed 15 and filters preserve chosen priorities', async ({ page }) => {
  await page.goto('./#/games')
  for (let i = 0; i < 15; i++) {
    await page.getByRole('button', { name: /^Добавить игру /u }).first().click()
  }
  await expect(page.getByText('15 / 15')).toBeVisible()
  await expect(page.getByRole('button', { name: /^Добавить игру /u }).first()).toBeDisabled()
  await page.getByRole('searchbox', { name: 'Найти игру' }).fill('Alvo')
  await expect(page.getByText('Мультиплеер по таблице: Частично', { exact: true })).toBeVisible()
  await expect(page.getByText('15 / 15')).toBeVisible()
  await page.getByRole('button', { name: /Удалить .* из списка/u }).first().click()
  await expect(page.getByText('14 / 15')).toBeVisible()
})

test('seller can copy a public invitation link without order data', async ({ page }) => {
  await page.goto('./#/games')
  await page.getByRole('button', { name: 'Копировать приглашение' }).click()
  const copied = await page.evaluate(() => (window as Window & { __copied?: string }).__copied)
  expect(copied).toContain('/orbita-assistant/#/games')
  expect(copied).toContain('до 15 игр')
  expect(copied).toContain('Все 15 могут не поместиться')
})

test('games list works at small mobile size and does not overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto('./#/games')
  await expect(page.getByRole('heading', { name: 'Игры для Quest' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
  await page.getByRole('button', { name: 'Добавить игру 2MD - VR Football Unleashed' }).click()
  await expect(page.locator('#quest-games-request')).toHaveValue(/1\. 2MD - VR Football Unleashed/u)
  expect((await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()).violations).toEqual([])
})

test('direct games route remains available after offline reload', async ({ page, context }) => {
  await page.goto('./#/games')
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await page.reload()
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Игры для Quest' })).toBeVisible()
  await expect(page.getByText('216 из 216')).toBeVisible()
  await context.setOffline(false)
})
