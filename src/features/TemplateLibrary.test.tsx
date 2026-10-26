import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import TemplateLibrary from './TemplateLibrary'

afterEach(cleanup)

describe('template library actions', () => {
  it('copies a safe answer from the compact list and tracks its ID', async () => {
    const onCopy = vi.fn().mockResolvedValue(true)
    const onCopied = vi.fn()
    render(<TemplateLibrary favorites={[]} recentIds={[]} onFavorite={vi.fn()} onUse={vi.fn()} onCopy={onCopy} onCopied={onCopied} />)
    fireEvent.change(screen.getByRole('searchbox', { name: 'Поиск ответа' }), { target: { value: 'Товар в наличии?' } })
    const row = screen.getByRole('heading', { name: 'Товар в наличии?' }).closest('.template-row') as HTMLElement
    fireEvent.click(within(row).getByRole('button', { name: 'Копировать' }))
    expect(await screen.findByRole('button', { name: 'Скопировано' })).toBeInTheDocument()
    expect(onCopy).toHaveBeenCalledWith('auto-02', expect.stringContaining('Наличие конкретного экземпляра уточню'))
    expect(onCopied).toHaveBeenCalledWith('auto-02')
  })

  it('shows Russian category names and copies safe intent questions from the list', async () => {
    const onUse = vi.fn()
    const onCopy = vi.fn().mockResolvedValue(true)
    render(<TemplateLibrary favorites={[]} recentIds={[]} onFavorite={vi.fn()} onUse={onUse} onCopy={onCopy} onCopied={vi.fn()} />)
    expect(screen.getAllByText('Товар').length).toBeGreaterThan(0)
    expect(screen.queryByText('product')).not.toBeInTheDocument()
    fireEvent.change(screen.getByRole('searchbox', { name: 'Поиск ответа' }), { target: { value: 'Возможен торг?' } })
    const row = screen.getByRole('heading', { name: 'Возможен торг?' }).closest('.template-row') as HTMLElement
    fireEvent.click(within(row).getByRole('button', { name: 'Копировать' }))
    await screen.findByRole('button', { name: 'Скопировано' })
    expect(onUse).not.toHaveBeenCalled()
    expect(onCopy).toHaveBeenCalledWith('auto-09', expect.stringContaining('Уточню, возможен ли такой вариант'))
  })
})
