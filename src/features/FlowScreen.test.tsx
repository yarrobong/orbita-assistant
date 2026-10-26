import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import FlowScreen from './FlowScreen'

afterEach(cleanup)

describe('scenario workspace', () => {
  it('keeps every delivery situation independently selectable', () => {
    render(<FlowScreen kind="delivery" onBack={vi.fn()} />)
    const situations = screen.getByRole('group', { name: 'Ситуации доставки' })
    expect(within(situations).getAllByRole('button')).toHaveLength(10)

    fireEvent.click(within(situations).getByRole('button', { name: 'Заказ отправлен' }))
    expect(screen.getByRole('button', { name: 'Копировать' })).toBeEnabled()
    expect(screen.getByLabelText('Текст сообщения')).toHaveTextContent(/доставку/u)
  })

  it('keeps every pickup situation independently selectable and uses a neutral agreement reply', () => {
    render(<FlowScreen kind="pickup" onBack={vi.fn()} />)
    const situations = screen.getByRole('group', { name: 'Ситуации самовывоза' })
    expect(within(situations).getAllByRole('button')).toHaveLength(9)

    fireEvent.click(within(situations).getByRole('button', { name: 'Время и выдача согласованы' }))
    const message = screen.getByLabelText('Текст сообщения')
    expect(message).toHaveTextContent(/уточню дату, время и адрес/u)
    expect(message.textContent).not.toMatch(/\{\{/u)
    expect(screen.getByRole('button', { name: 'Копировать' })).toBeEnabled()
  })

  it('labels point-of-sale coordination as internal', () => {
    render(<FlowScreen kind="pickup" onBack={vi.fn()} />)
    const situations = screen.getByRole('group', { name: 'Ситуации самовывоза' })
    fireEvent.click(within(situations).getByRole('button', { name: 'Уточнить с человеком на точке' }))

    expect(screen.getByText('Внутреннее сообщение')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Копировать' })).toBeEnabled()
  })
})
