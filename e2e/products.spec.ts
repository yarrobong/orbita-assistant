import { test, expect } from '@playwright/test'

test('product catalog opens a sourced headset and prepares answer', async ({ page }) => {
  await page.goto('/orbita-assistant/#/products')
  await expect(page.getByRole('heading', { name: 'Товары и знания' })).toBeVisible()
  await page.getByRole('button', { name: /Meta Quest 3S/ }).first().click()
  await expect(page.getByRole('heading', { name: 'Meta Quest 3S' })).toBeVisible()
  await page.getByLabel('Вопрос покупателя').selectOption('features')
  await expect(page.getByLabel('Подготовленный ответ покупателю')).toHaveValue(/1832/u)
  await expect(page.getByRole('button', { name: 'Копировать ответ' })).toBeEnabled()
})

test('product compatibility refuses unsupported accessory claims', async ({ page }) => {
  await page.goto('/orbita-assistant/#/products/mount-quest3')
  await page.getByLabel('Модель шлема покупателя').selectOption('quest3s')
  await expect(page.getByText(/Нужно проверить конкретную модель/)).toBeVisible()
  await expect(page.getByLabel('Подготовленный ответ покупателю')).toHaveValue(/не подтверждена/u)
})

test('product knowledge remains available after offline reload', async ({ page, context }) => {
  await page.goto('/orbita-assistant/#/products')
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await expect(page.getByText(/товаров в справочнике/)).toBeVisible()
  await page.reload()
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Товары и знания' })).toBeVisible()
  await context.setOffline(false)
})
