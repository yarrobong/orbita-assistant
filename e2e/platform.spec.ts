import { expect, test } from '@playwright/test'

test('Safari layout and basic scenarios work at phone and desktop widths', async ({ page }) => {
  await page.goto('./#/home')
  await expect(page.getByRole('heading', { name: 'ORBITA Assistant' })).toBeVisible()
  for (const size of [{ width: 320, height: 740 }, { width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1280, height: 800 }]) {
    await page.setViewportSize(size)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(size.width)
  }
  await page.getByRole('navigation').getByRole('button', { name: 'Сценарии' }).click()
  await page.getByRole('button', { name: /Самовывоз/ }).click()
  await expect(page.getByRole('heading', { name: 'Самовывоз' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Копировать' })).toBeEnabled()
})
