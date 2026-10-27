import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HomeScreen from './HomeScreen'

afterEach(cleanup)

const baseProps = () => ({
  onOpen: vi.fn(),
  onUseTemplate: vi.fn(),
  favorites: [] as string[],
  recentIds: [] as string[],
})

describe('home workspace', () => {
  it('shows four direct actions without a repeated brand eyebrow', () => {
    const props = baseProps()
    render(<HomeScreen {...props} />)

    expect(screen.getByRole('heading', { name: 'Подготовить сообщение' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ответить покупателю/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Авито Доставка/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Самовывоз/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /После покупки/ })).toBeInTheDocument()
    expect(screen.queryByText('ORBITA ASSISTANT')).not.toBeInTheDocument()
  })

  it('does not render empty recent or continuation sections', () => {
    render(<HomeScreen {...baseProps()} />)

    expect(screen.queryByRole('heading', { name: 'Недавние и избранные' })).not.toBeInTheDocument()
    expect(screen.queryByText('Продолжить сценарий')).not.toBeInTheDocument()
  })

  it('shows a real recent answer and opens that template', () => {
    const props = baseProps()
    props.recentIds = ['auto-10']
    render(<HomeScreen {...props} />)

    fireEvent.click(screen.getByRole('button', { name: /Можно дополнительные фото/ }))
    expect(props.onUseTemplate).toHaveBeenCalledWith('auto-10')
  })

  it('renders continuation as a normal row and preserves its action', () => {
    const props = { ...baseProps(), lastScenario: { path: 'delivery', stage: 'D4' }, onContinue: vi.fn() }
    render(<HomeScreen {...props} />)

    const row = screen.getByRole('region', { name: 'Последняя ситуация' })
    expect(row).toBeInTheDocument()
    expect(row).not.toHaveClass('resume-card')
    expect(screen.queryByText(/статусы нужно проверить заново/u)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(props.onContinue).toHaveBeenCalledOnce()
  })
})
