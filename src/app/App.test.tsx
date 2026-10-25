import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

afterEach(() => { cleanup(); vi.unstubAllGlobals(); window.location.hash = '#/home' })
beforeEach(() => { window.location.hash = '#/home' })

describe('app shell', () => {
  it('shows the ORBITA workspace and a single primary navigation', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /orbita assistant/i })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getAllByRole('navigation')).toHaveLength(1)
    expect(document.querySelector('.app-frame')).toHaveAttribute('data-app-base', '/orbita-assistant/')
  })

  it('opens a neutral pickup flow without promising a confirmed visit', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Самовывоз/ }))

    expect(screen.getByRole('heading', { name: 'Самовывоз' })).toBeInTheDocument()
    expect(screen.getByText(/сначала уточню возможность выдачи/i)).toBeInTheDocument()
    expect(screen.queryByText(/можете приезжать/i)).not.toBeInTheDocument()
  })

  it('keeps the internal handover message behind an explicit audience switch', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Самовывоз/ }))
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

  it('does not call clipboard success when the browser rejects copying', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('permission denied'))
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Новый покупатель/ }))
    fireEvent.click(screen.getByRole('button', { name: /Уточнить наличие/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Копировать' }))

    expect(await screen.findByText(/скопируйте вручную/i)).toBeInTheDocument()
    expect(screen.queryByText('Скопировано')).not.toBeInTheDocument()
  })
})
