import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CopyComposer from './CopyComposer'
import { initialFlowState } from '../domain/flow'
import type { Template } from '../domain/types'

afterEach(() => { cleanup(); vi.unstubAllGlobals() })

const basicTemplate: Template = {
  id: 'test.reply', title: 'Первый ответ', category: 'general', stage: 'N0', audience: 'buyer',
  body: 'Здравствуйте! Подскажите, что важно уточнить?', tags: [], requiredFields: [], guardFlags: [], checklist: [],
  defaultPriority: 1, revision: 1, source: 'Все ответы', usage: 'Проверка копирования',
}

describe('CopyComposer', () => {
  it('copies the edited text and reports success only after clipboard write resolves', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    render(<CopyComposer template={basicTemplate} state={initialFlowState('new')} onFieldChange={() => {}} />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Текст сообщения' }), { target: { value: 'Моя отредактированная версия' } })
    fireEvent.click(screen.getByRole('button', { name: 'Копировать' }))

    expect(writeText).toHaveBeenCalledWith('Моя отредактированная версия')
    expect(await screen.findByText('Скопировано')).toBeInTheDocument()
  })

  it('blocks copying required fields until filled and rendered', () => {
    const template = { ...basicTemplate, body: 'Самовывоз {{date}} в {{time}}', requiredFields: ['date', 'time'] }
    render(<CopyComposer template={template} state={initialFlowState('pickup')} onFieldChange={() => {}} />)

    expect(screen.getByRole('button', { name: 'Копировать' })).toBeDisabled()
    expect(screen.getByText(/Заполните дату и время/)).toBeInTheDocument()
  })
})
