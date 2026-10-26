import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

afterEach(() => { cleanup(); Reflect.deleteProperty(navigator, 'serviceWorker'); vi.unstubAllGlobals(); window.location.hash = '#/home' })
beforeEach(() => { window.location.hash = '#/home'; localStorage.clear() })

describe('app shell', () => {
  it('shows exactly three primary sections and marks Home active', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Что нужно сделать?' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getAllByRole('navigation')).toHaveLength(1)
    const nav = screen.getByRole('navigation', { name: 'Основная навигация' })
    expect(nav.querySelectorAll('button')).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Главная' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('region', { name: 'Выберите ситуацию' }).querySelectorAll('button')).toHaveLength(4)
    expect(screen.queryByRole('button', { name: 'Сценарии' })).not.toBeInTheDocument()
    expect(document.querySelector('.app-frame')).toHaveAttribute('data-app-base', '/orbita-assistant/')
  })

  it('marks the active primary section from the current route', () => {
    window.location.hash = '#/settings'
    render(<App />)

    const nav = screen.getByRole('navigation', { name: 'Основная навигация' })
    expect(within(nav).getByRole('button', { name: 'Настройки' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('button', { name: 'Главная' })).not.toHaveAttribute('aria-current')
  })

  it.each([
    ['#/flows', '#/home'],
    ['#/templates', '#/answers'],
    ['#/use-template', '#/answers'],
  ])('redirects legacy route %s to %s', async (legacy, current) => {
    window.location.hash = legacy
    render(<App />)

    expect(await screen.findByRole('main')).toBeInTheDocument()
    expect(window.location.hash).toBe(current)
  })

  it('opens a template from its stable URL and keeps Answers active after reload', () => {
    window.location.hash = '#/template/top-02'
    const { unmount } = render(<App />)

    expect(screen.getAllByRole('heading', { name: 'Доставка — оформление' })).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Ответы' })).toHaveAttribute('aria-current', 'page')
    unmount()

    render(<App />)
    expect(screen.getAllByRole('heading', { name: 'Доставка — оформление' })).toHaveLength(2)
  })

  it('routes an unknown template ID to Answers safely', async () => {
    window.location.hash = '#/template/not-a-template'
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Все ответы' })).toBeInTheDocument()
    expect(window.location.hash).toBe('#/answers')
  })

  it('keeps an in-progress pickup draft while visiting Answers and returning', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Самовывоз/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Время' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Дата' }), { target: { value: '30 октября' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ответы' }))
    fireEvent.click(screen.getByRole('button', { name: 'Главная' }))
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(screen.getByRole('textbox', { name: 'Дата' })).toHaveValue('30 октября')
  })

  it('opens a neutral pickup flow without promising a confirmed visit', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Самовывоз/ }))

    expect(screen.getByRole('heading', { name: 'Самовывоз' })).toBeInTheDocument()
    expect(screen.getByText(/сначала уточню возможность выдачи/i)).toBeInTheDocument()
    expect(screen.queryByText(/можете приезжать/i)).not.toBeInTheDocument()
  })

  it('shows the eight named quick answer intents', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Ответить покупателю/ }))
    expect(screen.getAllByRole('heading', { name: 'Что спросил покупатель?' })).toHaveLength(2)
    for (const label of ['Есть ли товар в наличии?', 'Можно ли доставкой?', 'Можно ли самовывозом?', 'Сделаете фотографии?', 'Подойдёт ли аксессуар?', 'Возможен ли торг?', 'Когда отправите?', 'Спасибо за покупку']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
  })

  it('keeps the internal handover message behind an explicit audience switch', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Самовывоз/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Время' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Товар' }), { target: { value: 'Ремешок' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Дата' }), { target: { value: '30 октября' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Время' }), { target: { value: '17:00' } })
    fireEvent.click(screen.getByRole('button', { name: 'Согласование' }))
    expect(screen.queryByText(/Покупатель хочет забрать/)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Человеку на точке' }))
    expect(screen.getByText(/Покупатель хочет забрать/)).toBeInTheDocument()
    expect(screen.getByText('Внутреннее сообщение')).toBeInTheDocument()
  })

  it('finds the ORBITA white Xbox controller answer in the library', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Ответы' }))
    fireEvent.change(screen.getByRole('searchbox', { name: 'Поиск ответа' }), { target: { value: 'белый геймпад' } })

    expect(screen.getByRole('heading', { name: 'Есть белые геймпады Xbox' })).toBeInTheDocument()
  })

  it('offers a waiting PWA update and activates it only after the user chooses update', async () => {
    const waiting = { postMessage: vi.fn() }
    const registration = new EventTarget() as EventTarget & { waiting: typeof waiting; update: () => Promise<void> }
    registration.waiting = waiting
    registration.update = vi.fn().mockResolvedValue(undefined)
    const serviceWorker = new EventTarget() as EventTarget & { ready: Promise<typeof registration> }
    serviceWorker.ready = Promise.resolve(registration)
    Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: serviceWorker })

    render(<App />)

    expect(await screen.findByText(/доступно обновление/i)).toBeInTheDocument()
    expect(waiting.postMessage).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Обновить приложение' }))

    expect(waiting.postMessage).toHaveBeenCalledWith({ type: 'ACTIVATE_UPDATE' })
  })

  it('does not call clipboard success when the browser rejects copying', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('permission denied'))
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Ответить покупателю/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Есть ли товар в наличии?' }))
    fireEvent.click(screen.getByRole('button', { name: 'Копировать' }))

    expect(await screen.findByText(/скопируйте вручную/i)).toBeInTheDocument()
    expect(screen.queryByText('Скопировано')).not.toBeInTheDocument()
  })
})
