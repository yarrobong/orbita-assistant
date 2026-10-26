import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => { (window as Window & { __copied?: string }).__copied = text } } })
    if (sessionStorage.getItem('orbita:e2e-initialized') !== 'true') {
      localStorage.clear()
      sessionStorage.setItem('orbita:e2e-initialized', 'true')
    }
  })
})

test('all ten delivery situations open and copy without prior stage confirmations', async ({ page }) => {
  await page.goto('./#/flow/delivery')
  const stages = page.getByRole('group', { name: 'Ситуации доставки' })
  const labels = [
    'Спрашивает о доставке', 'Хочет оформить заказ', 'Заказ оформлен', 'Спрашивает о сроках отправки',
    'Заказ отправлен', 'Посылка в пути', 'Посылка в пункте выдачи', 'Покупатель получил товар', 'Попросить отзыв', 'Проблема с заказом',
  ]
  await expect(stages.getByRole('button')).toHaveCount(10)
  for (const label of labels) {
    await stages.getByRole('button', { name: label }).click()
    await expect(page.getByRole('button', { name: 'Копировать' })).toBeEnabled()
  }
  await stages.getByRole('button', { name: 'Заказ отправлен' }).click()
  await page.getByRole('button', { name: 'Копировать' }).click()
  await expect(page.getByText('Скопировано')).toBeVisible()
  expect(await page.evaluate(() => (window as Window & { __copied?: string }).__copied)).toMatch(/передали в доставку/u)
})

test('all nine pickup situations are independently available and the coordination message is internal', async ({ page }) => {
  await page.goto('./#/flow/pickup')
  const stages = page.getByRole('group', { name: 'Ситуации самовывоза' })
  const labels = [
    'Интересуется самовывозом', 'Предложил дату и время', 'Уточнить с человеком на точке',
    'Выдающий не может в это время', 'Время и выдача согласованы', 'Передать адрес и инструкции',
    'Покупатель приехал', 'Товар передан', 'Попросить отзыв',
  ]
  await expect(stages.getByRole('button')).toHaveCount(9)
  for (const label of labels) {
    await stages.getByRole('button', { name: label }).click()
    await expect(page.getByRole('button', { name: 'Копировать' })).toBeEnabled()
  }
  await stages.getByRole('button', { name: 'Уточнить с человеком на точке' }).click()
  await expect(page.getByText('Внутреннее сообщение', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Копировать' })).toBeEnabled()
  await stages.getByRole('button', { name: 'Интересуется самовывозом' }).click()
  await expect(page.getByLabel('Текст сообщения')).toContainText(/уточню, получится ли организовать выдачу/u)
  await expect(page.getByLabel('Текст сообщения')).not.toContainText(/Екатеринбург|Академический/u)
})

test('pickup agreement and address messages use neutral text until exact details are present', async ({ page }) => {
  await page.goto('./#/flow/pickup')
  const stages = page.getByRole('group', { name: 'Ситуации самовывоза' })
  await stages.getByRole('button', { name: 'Время и выдача согласованы' }).click()
  await expect(page.getByLabel('Текст сообщения')).toContainText(/уточню дату, время и адрес/u)
  await expect(page.getByRole('button', { name: 'Копировать' })).toBeEnabled()
  await expect(page.getByLabel('Текст сообщения')).not.toContainText(/\{\{|Адрес:/u)

  await page.locator('.composer-details summary').click()
  await page.getByLabel('Дата', { exact: true }).fill('30 октября')
  await page.getByLabel('Время', { exact: true }).fill('17:00')
  await page.getByLabel('Адрес', { exact: true }).fill('Адрес, введённый пользователем')
  await expect(page.getByLabel('Текст сообщения')).toContainText('30 октября в 17:00. Адрес: Адрес, введённый пользователем.')
  await expect(page.getByLabel('Подтверждаю разрешение передать контакт')).toHaveCount(0)

  await stages.getByRole('button', { name: 'Передать адрес и инструкции' }).click()
  await page.locator('.composer-details summary').click()
  await page.getByLabel('Адрес', { exact: true }).clear()
  await expect(page.getByLabel('Текст сообщения')).toContainText(/уточню адрес и инструкции/u)
  await page.getByLabel('Адрес', { exact: true }).fill('Тестовый адрес, введённый пользователем')
  await expect(page.getByLabel('Текст сообщения')).toContainText('Тестовый адрес, введённый пользователем')
  await expect(page.getByRole('button', { name: 'Копировать' })).toBeEnabled()
})

test('handover contact stays out until permission and a separate include action are selected', async ({ page }) => {
  await page.goto('./#/flow/pickup')
  await page.getByRole('group', { name: 'Ситуации самовывоза' }).getByRole('button', { name: 'Передать адрес и инструкции' }).click()
  await page.locator('.composer-details summary').click()
  await page.getByLabel('Адрес', { exact: true }).fill('Адрес для этого теста')
  await page.getByLabel('Кто выдаст', { exact: true }).fill('Мария')
  await page.getByLabel('Контакт выдающего', { exact: true }).fill('+7 900 123-45-67')
  await expect(page.getByLabel('Текст сообщения')).not.toContainText('+7 900 123-45-67')
  await page.getByLabel('Подтверждаю разрешение передать контакт').check()
  await expect(page.getByLabel('Добавить контакт выдающего в сообщение')).not.toBeChecked()
  await expect(page.getByLabel('Текст сообщения')).not.toContainText('+7 900 123-45-67')
  await page.getByLabel('Добавить контакт выдающего в сообщение').check()
  await expect(page.getByLabel('Текст сообщения')).toContainText('+7 900 123-45-67')
  await page.getByRole('button', { name: 'Копировать' }).click()
  expect(await page.evaluate(() => (window as Window & { __copied?: string }).__copied)).toContain('+7 900 123-45-67')
  const savedScenario = await page.evaluate(() => localStorage.getItem('orbita:last-scenario'))
  expect(savedScenario).not.toContain('+7 900 123-45-67')
  expect(savedScenario).not.toContain('Мария')
})

test('review is open from After purchase and the issue-first option stays available', async ({ page }) => {
  await page.goto('./#/flow/after-purchase')
  await expect(page.getByText(/Просить отзыв следует после получения товара/u)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Копировать' })).toBeEnabled()
  await page.getByRole('button', { name: 'Уже попросил отзыв' }).click()
  await expect(page.getByRole('button', { name: 'Отметка об отзыве поставлена' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Копировать' })).toBeEnabled()
  await page.getByRole('group', { name: 'Вариант после покупки' }).getByRole('button', { name: 'Есть проблема — сначала помочь' }).click()
  await expect(page.getByRole('heading', { name: 'Проблема с товаром' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Копировать' })).toBeEnabled()
  await page.getByRole('group', { name: 'Вариант после покупки' }).getByRole('button', { name: 'Попросить отзыв' }).click()
  await expect(page.getByRole('button', { name: 'Копировать' })).toBeEnabled()
})

test('delivery and pickup review situations offer a non-blocking optional request marker', async ({ page }) => {
  for (const [route, group, label] of [
    ['delivery', 'Ситуации доставки', 'Попросить отзыв'],
    ['pickup', 'Ситуации самовывоза', 'Попросить отзыв'],
  ]) {
    await page.goto(`./#/flow/${route}`)
    await page.getByRole('group', { name: group }).getByRole('button', { name: label }).click()
    await page.getByRole('button', { name: 'Уже попросил отзыв' }).click()
    await expect(page.getByRole('button', { name: 'Отметка об отзыве поставлена' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Копировать' })).toBeEnabled()
  }
})

test('scenario copy stays reachable on a short mobile screen while editing', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 560 })
  await page.goto('./#/flow/delivery')
  await page.getByRole('group', { name: 'Ситуации доставки' }).getByRole('button', { name: 'Заказ отправлен' }).click()
  await page.getByRole('button', { name: 'Изменить текст' }).click()
  const textarea = page.getByRole('textbox', { name: 'Текст сообщения' })
  await textarea.focus()
  await page.setViewportSize({ width: 320, height: 360 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
  await page.getByRole('button', { name: 'Копировать' }).scrollIntoViewIfNeeded()
  await expect(page.getByRole('button', { name: 'Копировать' })).toBeVisible()
  await page.getByRole('button', { name: 'Копировать' }).click()
  await expect(page.getByText('Скопировано')).toBeVisible()
})

test('mobile delivery opens the selected message without keeping the full stage list above it', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./#/flow/delivery')
  const situations = page.getByRole('group', { name: 'Ситуации доставки' })
  await expect(situations).toBeVisible()
  await expect(page.getByRole('button', { name: 'Копировать' })).toHaveCount(0)
  await situations.getByRole('button', { name: 'Заказ отправлен' }).click()
  await expect(page.getByRole('button', { name: 'Копировать' })).toBeVisible()
  await expect(situations).toBeHidden()
  await page.getByRole('button', { name: /Выбрать ситуацию/u }).click()
  await expect(situations).toBeVisible()
})

test('search, hash route reload, and narrow mobile view work without horizontal scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto('./#/home')
  await page.getByRole('navigation').getByRole('button', { name: 'Ответы' }).click()
  await page.getByRole('searchbox', { name: 'Поиск ответа' }).fill('белый геймпад')
  await expect(page.getByRole('heading', { name: 'Есть белые геймпады Xbox' })).toBeVisible()
  await page.getByRole('navigation').getByRole('button', { name: 'Главная' }).click()
  await page.getByRole('button', { name: 'Открыть поиск' }).click()
  await page.getByRole('searchbox', { name: 'Поиск по ответам' }).fill('quest 3s')
  await page.getByRole('option').first().click()
  await expect(page.getByRole('heading', { name: 'Уточнить модель' }).first()).toBeVisible()
  await expect(page.getByLabel('Текст сообщения')).toContainText(/Quest 3S/u)
  await page.goto('./#/flow/delivery')
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Авито Доставка' })).toBeVisible()
  for (const width of [320, 360, 375, 390, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 800 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  }
})

test('template has a stable URL that survives reload and browser back', async ({ page }) => {
  await page.goto('./#/answers')
  const firstCard = page.locator('.template-row').first()
  const title = await firstCard.locator('h2').textContent()
  await firstCard.getByRole('button', { name: /Открыть|Подготовить/u }).click()
  await expect(page).toHaveURL(/#\/template\/[\w%-]+$/u)
  await expect(page.locator('.detail-pane h1')).toHaveText(title!)

  await page.reload()
  await expect(page.locator('.detail-pane h1')).toHaveText(title!)
  await page.goBack()
  await expect(page).toHaveURL(/#\/answers$/u)
  await expect(page.getByRole('heading', { name: 'Все ответы' })).toBeVisible()
})

test('desktop answer selection keeps the catalog visible beside the selected template', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('./#/answers')
  const firstRow = page.locator('.template-row').first()
  await firstRow.getByRole('button', { name: /Открыть|Подготовить|Копировать/u }).click()
  await expect(page).toHaveURL(/#\/template\/[\w%-]+$/u)
  await expect(page.locator('.master-pane')).toBeVisible()
  await expect(page.locator('.detail-pane')).toBeVisible()
  await expect(page.locator('.master-pane .template-row')).toHaveCount(118)
})

test('mobile answer selection opens sequential details and returns to the list', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./#/answers')
  const search = page.getByRole('searchbox', { name: 'Поиск ответа' })
  await search.fill('в наличии')
  await page.locator('.template-row').first().getByRole('button', { name: /Открыть|Подготовить|Копировать/u }).click()
  await expect(page.locator('.detail-pane')).toBeVisible()
  await expect(page.getByRole('button', { name: /Все ответы/u })).toBeVisible()
  await page.getByRole('button', { name: /Все ответы/u }).click()
  await expect(page).toHaveURL(/#\/answers$/u)
  await expect(page.locator('.master-pane')).toBeVisible()
  await expect(page.getByRole('searchbox', { name: 'Поиск ответа' })).toHaveValue('в наличии')
})

test('quick answer opens source template beside its list and records only its ID as recent', async ({ page }) => {
  await page.goto('./#/quick')
  await page.getByRole('button', { name: 'Сделаете фотографии?' }).click()
  await expect(page).toHaveURL(/#\/template\/auto-10$/u)
  await expect(page.locator('.master-pane')).toBeVisible()
  await expect(page.locator('.detail-pane')).toBeVisible()
  await expect(page.locator('.audience-switch')).toHaveCount(0)
  await page.getByRole('button', { name: 'Копировать' }).click()
  await expect(page.getByText('Скопировано')).toBeVisible()
  await expect.poll(() => page.evaluate(() => localStorage.getItem('orbita:recent-templates'))).toContain('auto-10')
  await page.getByRole('navigation').getByRole('button', { name: 'Главная' }).click()
  await expect(page.getByRole('button', { name: /Можно дополнительные фото/ })).toBeVisible()
})

test('search opens focused on mobile, filters as you type, and supports the desktop shortcut', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto('./#/home')
  await page.getByRole('button', { name: 'Открыть поиск' }).click()
  const mobileSearch = page.getByRole('searchbox', { name: 'Поиск по ответам' })
  await expect(mobileSearch).toBeFocused()
  await mobileSearch.fill('дополнительные фото')
  const photoResult = page.getByRole('option', { name: 'Можно дополнительные фото?' })
  await expect(photoResult).toBeVisible()
  await photoResult.click()
  await expect(page).toHaveURL(/#\/template\/auto-10$/u)
  await page.getByRole('button', { name: 'Открыть поиск' }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Поиск ответов' })).toHaveCount(0)
  await page.getByRole('navigation').getByRole('button', { name: 'Ответы' }).click()
  await expect(page.getByRole('searchbox', { name: 'Поиск ответа' })).toBeFocused()

  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('./#/home')
  await page.keyboard.press('Control+k')
  await expect(page.getByRole('searchbox', { name: 'Быстрый поиск' })).toBeFocused()
})

test('primary navigation is vertical on desktop and spans three destinations on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('./#/home')
  const sidebar = page.locator('.sidebar')
  await expect(sidebar).toHaveCSS('width', '216px')
  const topbar = await page.locator('.topbar').boundingBox()
  expect(topbar!.height).toBeGreaterThanOrEqual(56)
  expect(topbar!.height).toBeLessThanOrEqual(64)
  const items = page.getByRole('navigation', { name: 'Основная навигация' }).getByRole('button')
  await expect(items).toHaveCount(3)
  const first = await items.nth(0).boundingBox()
  const second = await items.nth(1).boundingBox()
  expect(second!.y).toBeGreaterThan(first!.y)

  await page.setViewportSize({ width: 390, height: 844 })
  const mobileNav = await page.getByRole('navigation', { name: 'Основная навигация' }).boundingBox()
  expect(mobileNav!.width).toBe(390)
  await expect(items).toHaveCount(3)
})

test('responsive workspace has no horizontal overflow at all target widths', async ({ page }) => {
  for (const width of [320, 390, 768, 1280, 1728]) {
    const height = width < 500 ? 740 : 900
    await page.setViewportSize({ width, height })
    await page.goto('./#/home')
    await expect(page.getByRole('heading', { name: 'Подготовить сообщение' })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    await page.goto('./#/answers')
    await expect(page.locator('.template-row')).toHaveCount(118)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    await page.goto('./#/flow/delivery')
    await page.getByRole('group', { name: 'Ситуации доставки' }).getByRole('button', { name: 'Заказ отправлен' }).click()
    await expect(page.getByRole('button', { name: 'Копировать' })).toBeEnabled()
    await expect(page.getByRole('button', { name: 'Копировать' })).toBeInViewport()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  }
})

test('short mobile composer, safe-area spacing, keyboard focus, and empty search stay usable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 360 })
  await page.goto('./#/flow/delivery')
  await page.getByRole('group', { name: 'Ситуации доставки' }).getByRole('button', { name: 'Заказ отправлен' }).click()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
  await page.getByRole('button', { name: 'Копировать' }).scrollIntoViewIfNeeded()
  await expect(page.getByRole('button', { name: 'Копировать' })).toBeVisible()

  await page.setViewportSize({ width: 390, height: 844 })
  const bottomPadding = await page.locator('.main-content').evaluate((element) => Number.parseFloat(getComputedStyle(element).paddingBottom))
  expect(bottomPadding).toBeGreaterThanOrEqual(108)
  const nav = await page.getByRole('navigation', { name: 'Основная навигация' }).boundingBox()
  expect(nav!.y + nav!.height).toBeLessThanOrEqual(844)

  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('./#/home')
  await page.keyboard.press('Control+k')
  const focusedSearch = page.getByRole('searchbox', { name: 'Быстрый поиск' })
  await expect(focusedSearch).toBeFocused()
  const focusStyle = await focusedSearch.evaluate((element) => ({ visible: element.matches(':focus-visible'), width: getComputedStyle(element).outlineWidth }))
  expect(focusStyle.visible).toBe(true)
  expect(focusStyle.width).toBe('2px')

  await page.goto('./#/answers')
  await page.getByRole('searchbox', { name: 'Поиск ответа' }).fill('zzzz-no-results')
  await expect(page.getByText('Ничего не найдено. Попробуйте другое слово или категорию.')).toBeVisible()
})

test('home view has no WCAG A/AA axe violations', async ({ page }) => {
  await page.goto('./#/home')
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  expect(results.violations).toEqual([])
})

test('answers, mobile search, scenarios, and composer have no WCAG A/AA axe violations', async ({ page }) => {
  const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
  await page.goto('./#/answers')
  expect((await new AxeBuilder({ page }).withTags(tags).analyze()).violations).toEqual([])
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Открыть поиск' }).click()
  await page.getByRole('searchbox', { name: 'Поиск по ответам' }).fill('белый геймпад')
  expect((await new AxeBuilder({ page }).withTags(tags).analyze()).violations).toEqual([])
  await page.getByRole('option', { name: 'Есть белые геймпады Xbox' }).click()
  expect((await new AxeBuilder({ page }).withTags(tags).analyze()).violations).toEqual([])
  await page.goto('./#/flow/delivery')
  await page.getByRole('group', { name: 'Ситуации доставки' }).getByRole('button', { name: 'Заказ отправлен' }).click()
  expect((await new AxeBuilder({ page }).withTags(tags).analyze()).violations).toEqual([])
  await page.goto('./#/flow/pickup')
  await page.getByRole('group', { name: 'Ситуации самовывоза' }).getByRole('button', { name: 'Интересуется самовывозом' }).click()
  expect((await new AxeBuilder({ page }).withTags(tags).analyze()).violations).toEqual([])
})

test('service worker caches app shell and permits offline reload', async ({ page, context }) => {
  await page.goto('./#/home')
  const manifest = await page.evaluate(async () => (await (await fetch('/orbita-assistant/manifest.webmanifest')).json()) as { start_url: string; scope: string; icons: Array<{ src: string }> })
  expect(manifest.start_url).toBe('/orbita-assistant/')
  expect(manifest.scope).toBe('/orbita-assistant/')
  expect(manifest.icons).toHaveLength(2)
  await expect(page.locator('meta[name="apple-mobile-web-app-capable"]')).toHaveAttribute('content', 'yes')
  const workerText = await (await page.request.get('http://127.0.0.1:4173/orbita-assistant/sw.js')).text()
  expect(workerText).toMatch(/addEventListener\('message',[\s\S]*event\.data\?\.type === 'ACTIVATE_UPDATE'\) self\.skipWaiting\(\)/u)
  await page.evaluate(() => navigator.serviceWorker.ready)
  await page.reload()
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Подготовить сообщение' })).toBeVisible()
  await page.getByRole('button', { name: /Авито Доставка/ }).click()
  await expect(page.getByRole('heading', { name: 'Авито Доставка' })).toBeVisible()
  await page.getByRole('navigation').getByRole('button', { name: 'Ответы' }).click()
  await page.getByRole('searchbox', { name: 'Поиск ответа' }).fill('белый геймпад')
  await expect(page.getByRole('heading', { name: 'Есть белые геймпады Xbox' })).toBeVisible()
  await page.getByRole('button', { name: 'Добавить «Есть белые геймпады Xbox» в избранное' }).click()
  await expect(page.getByRole('button', { name: 'Убрать «Есть белые геймпады Xbox» из избранного' })).toBeVisible()
  await expect.poll(() => page.evaluate(() => localStorage.getItem('orbita:favorites'))).toContain('"R08"')
  await page.reload()
  await expect(page.getByRole('button', { name: 'Убрать «Есть белые геймпады Xbox» из избранного' })).toBeVisible()
})
