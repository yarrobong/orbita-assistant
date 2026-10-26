import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CopyComposer from './CopyComposer'
import { initialFlowState, transition } from '../domain/flow'
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

  it('copies a neutral alternative when required fields are missing', () => {
    const template = { ...basicTemplate, body: 'Самовывоз {{date}} в {{time}}', requiredFields: ['date', 'time'], neutralAlternative: 'Уточню время самовывоза и напишу вам.' }
    render(<CopyComposer template={template} state={initialFlowState('pickup')} onFieldChange={() => {}} />)

    expect(screen.getByRole('button', { name: 'Копировать' })).toBeEnabled()
    expect(screen.getByLabelText('Текст сообщения')).toHaveValue(template.neutralAlternative)
    expect(screen.getByText(/Добавьте дату и время/)).toBeInTheDocument()
  })

  it('offers and copies a neutral alternative when required fields are missing', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const template = {
      ...basicTemplate,
      body: 'Подъезжайте {{date}} в {{time}}',
      requiredFields: ['date', 'time'],
      neutralAlternative: 'Я уточню удобное время и напишу вам. Пока не выезжайте, пожалуйста.',
    }
    render(<CopyComposer template={template} state={initialFlowState('pickup')} onFieldChange={() => {}} />)

    expect(screen.getByLabelText('Текст сообщения')).toHaveValue(template.neutralAlternative)
    expect(screen.getByRole('button', { name: 'Копировать' })).toBeEnabled()
    expect((screen.getByLabelText('Текст сообщения') as HTMLTextAreaElement).value).not.toContain('{{')
    fireEvent.click(screen.getByRole('button', { name: 'Копировать' }))
    expect(writeText).toHaveBeenCalledWith(template.neutralAlternative)
    expect(await screen.findByText('Скопировано')).toBeInTheDocument()
  })

  it('includes a handover contact only after permission and a separate include action', () => {
    const contactTemplate = {
      ...basicTemplate,
      id: 'pickup.contact',
      category: 'pickup' as const,
      body: 'Выдающий {{handoverName}}, телефон {{handoverPhone}}.',
      requiredFields: ['handoverName', 'handoverPhone'],
      guardFlags: ['contactPermission'] as Template['guardFlags'],
      neutralAlternative: 'Я уточню детали выдачи и напишу вам.',
    }
    let state = initialFlowState('pickup')
    state = transition(state, { type: 'set-field', field: 'handoverName', value: 'Мария' })
    state = transition(state, { type: 'set-field', field: 'handoverPhone', value: '+7 900 123-45-67' })
    const onConfirm = vi.fn()
    render(<CopyComposer template={contactTemplate} state={state} onFieldChange={() => {}} onConfirm={onConfirm} />)

    expect(screen.getByLabelText('Текст сообщения')).toHaveValue(contactTemplate.neutralAlternative)
    expect(screen.getByRole('button', { name: 'Копировать' })).toBeEnabled()
    fireEvent.click(screen.getByLabelText('Подтверждаю разрешение передать контакт'))
    expect(onConfirm).toHaveBeenCalledWith('contactPermission', true)
    expect(screen.queryByLabelText('Добавить контакт выдающего в сообщение')).not.toBeInTheDocument()
  })

  it('requires a separate include action after contact permission is present', () => {
    const contactTemplate = {
      ...basicTemplate,
      id: 'pickup.contact',
      category: 'pickup' as const,
      body: 'Выдающий {{handoverName}}, телефон {{handoverPhone}}.',
      requiredFields: ['handoverName', 'handoverPhone'],
      guardFlags: ['contactPermission'] as Template['guardFlags'],
      neutralAlternative: 'Я уточню детали выдачи и напишу вам.',
    }
    let state = initialFlowState('pickup')
    state = transition(state, { type: 'set-field', field: 'handoverName', value: 'Мария' })
    state = transition(state, { type: 'set-field', field: 'handoverPhone', value: '+7 900 123-45-67' })
    state = transition(state, { type: 'confirm', flag: 'contactPermission', value: true })
    render(<CopyComposer template={contactTemplate} state={state} onFieldChange={() => {}} />)

    const include = screen.getByLabelText('Добавить контакт выдающего в сообщение')
    expect(include).not.toBeChecked()
    fireEvent.click(include)
    expect(screen.getByLabelText('Текст сообщения')).toHaveValue('Выдающий Мария, телефон +7 900 123-45-67.')
  })

  it('uses the contact-free message when an optional handover contact is not included', () => {
    const template: Template = {
      ...basicTemplate,
      id: 'pickup.address',
      category: 'pickup',
      body: 'Адрес: {{address}}. Контакт: {{handoverName}}, {{handoverPhone}}.',
      withoutContactBody: 'Адрес: {{address}}. Напишите перед выездом, чтобы уточнить детали.',
      requiredFields: ['address'],
      guardFlags: ['contactPermission'],
      neutralAlternative: 'Я уточню адрес и инструкции и напишу вам.',
    }
    let state = initialFlowState('pickup')
    state = transition(state, { type: 'set-field', field: 'address', value: 'Введённый адрес' })
    const onFieldChange = (field: string, value: string) => { state = transition(state, { type: 'set-field', field, value }) }
    render(<CopyComposer template={template} state={state} onFieldChange={onFieldChange} onConfirm={() => {}} showDetails />)

    expect(screen.getByLabelText('Текст сообщения')).toHaveValue('Адрес: Введённый адрес. Напишите перед выездом, чтобы уточнить детали.')
    expect(screen.getByRole('button', { name: 'Копировать' })).toBeEnabled()
    expect(screen.getByLabelText('Подтверждаю разрешение передать контакт')).toBeInTheDocument()
    expect(screen.queryByLabelText('Добавить контакт выдающего в сообщение')).not.toBeInTheDocument()
  })
})
