import { useRef, useState } from 'react'
import { canUseTemplate } from '../domain/flow'
import { renderTemplate } from '../domain/render-template'
import type { Audience, FlagName, FlowState, Template, TemplateCategory } from '../domain/types'
import { copyText } from '../lib/clipboard'

type Props = {
  template: Template
  state: FlowState
  onFieldChange: (field: string, value: string) => void
  onConfirm?: (flag: FlagName, value: boolean) => void
  onAudienceChange?: (audience: Audience) => void
  onCopied?: () => void
  showGuardControls?: boolean
  showRequiredFields?: boolean
  showDetails?: boolean
  showEditToggle?: boolean
}

const fieldLabels: Record<string, string> = {
  product: 'Товар', variant: 'Цвет или вариант', date: 'Дата', time: 'Время', address: 'Адрес',
  handoverName: 'Кто выдаст', handoverPhone: 'Контакт выдающего', price: 'Цена', alternative: 'Вариант на замену',
  model: 'Модель устройства', task: 'Задача', custom: 'Дополнительное значение', dateTime: 'Дата и время', when: 'Срок',
}
const neutralAlternatives: Record<TemplateCategory, (audience: Audience) => string> = {
  delivery: () => 'Уточню информацию по заказу и напишу вам.',
  pickup: (audience) => audience === 'handover'
    ? 'Привет! Покупатель интересуется самовывозом. Сможешь уточнить, получится ли организовать выдачу? Напиши, пожалуйста, удобное время.'
    : 'Я уточню детали самовывоза и напишу вам. Пожалуйста, пока не выезжайте.',
  'after-purchase': () => 'Спасибо, что написали. Уточню информацию и вернусь к вам с ответом.',
  product: () => 'Уточню информацию о товаре и напишу вам.',
  general: () => 'Уточню детали и вернусь к вам с ответом.',
  quest: () => 'Уточню детали и вернусь к вам с ответом.',
  safety: () => 'Уточню детали и вернусь к вам с ответом.',
  other: () => 'Уточню детали и вернусь к вам с ответом.',
}
const contactFields = ['handoverName', 'handoverPhone']

function missingMessage(missing: string[]): string {
  const labels = missing.map((field) => (fieldLabels[field] ?? field).toLocaleLowerCase('ru-RU'))
  if (labels.length === 2 && labels[0] === 'дата' && labels[1] === 'время') return 'Добавьте дату и время в деталях, если хотите отправить точный ответ.'
  return `Добавьте ${labels.join(', ')} в деталях для точного ответа.`
}

export default function CopyComposer({
  template, state, onFieldChange, onConfirm, onAudienceChange, onCopied,
  showGuardControls = true, showRequiredFields = true, showDetails = false, showEditToggle = false,
}: Props) {
  const textarea = useRef<HTMLTextAreaElement>(null)
  const [draft, setDraft] = useState<{ templateId: string; source: string; text: string } | null>(null)
  const [copyStatus, setCopyStatus] = useState<{ source: string; message: string } | null>(null)
  const [includeHandoverContact, setIncludeHandoverContact] = useState(false)
  const [editing, setEditing] = useState(!showEditToggle)
  const rendered = renderTemplate(template, state.fields)
  const guardResult = canUseTemplate(template, state)
  const needsContactPermission = template.guardFlags.includes('contactPermission')
    || contactFields.some((field) => template.requiredFields.includes(field) || template.body.includes(`{{${field}}}`))
  const contactReady = state.flags.contactPermission
    && Boolean(state.fields.handoverName?.trim() && state.fields.handoverPhone?.trim())
  const contactIncluded = needsContactPermission && contactReady && includeHandoverContact
  const needsNeutral = !rendered.copyable || (needsContactPermission && !contactIncluded)
  const neutral = template.neutralAlternative ?? neutralAlternatives[template.category](template.audience)
  const sourceText = needsNeutral ? neutral : rendered.text
  const editedText = draft?.templateId === template.id && draft.source === sourceText ? draft.text : sourceText
  const status = copyStatus?.source === sourceText ? copyStatus.message : ''
  const containsPlaceholder = /\{\{[^}]+\}\}/u.test(editedText)
  const insertedContactWithoutPermission = needsContactPermission && !contactIncluded && contactFields.some((field) => {
    const value = state.fields[field]?.trim()
    return value && value.length > 2 && editedText.includes(value)
  })
  const isCopyable = guardResult.allowed && editedText.trim().length > 0 && !containsPlaceholder && !insertedContactWithoutPermission
  const hasDetails = (showRequiredFields && template.requiredFields.length > 0) || needsContactPermission
  const needsHandoverContext = template.audience === 'handover'

  const handleFieldChange = (field: string, value: string) => {
    if (contactFields.includes(field)) setIncludeHandoverContact(false)
    onFieldChange(field, value)
  }
  const handleConfirm = (flag: FlagName, value: boolean) => {
    if (flag === 'contactPermission' && !value) setIncludeHandoverContact(false)
    onConfirm?.(flag, value)
  }
  const handleCopy = async () => {
    if (!isCopyable) return
    const copied = await copyText(editedText)
    if (copied) {
      setCopyStatus({ source: sourceText, message: 'Скопировано' })
      onCopied?.()
    } else {
      textarea.current?.focus()
      textarea.current?.select()
      setCopyStatus({ source: sourceText, message: 'Буфер недоступен. Текст выделен — скопируйте вручную.' })
    }
  }
  const renderFields = () => template.requiredFields.map((field) => (
    <label className="field-label" key={field}>
      <span>{fieldLabels[field] ?? field}</span>
      <input value={state.fields[field] ?? ''} onChange={(event) => handleFieldChange(field, event.target.value)} autoComplete="off" inputMode={field === 'handoverPhone' ? 'tel' : undefined} />
    </label>
  ))
  const renderContactControls = () => needsContactPermission && <>
    {contactFields.filter((field) => !template.requiredFields.includes(field)).map((field) => (
      <label className="field-label" key={field}>
        <span>{fieldLabels[field]}</span>
        <input value={state.fields[field] ?? ''} onChange={(event) => handleFieldChange(field, event.target.value)} autoComplete="off" inputMode={field === 'handoverPhone' ? 'tel' : undefined} />
      </label>
    ))}
    <label className="check-row">
      <input type="checkbox" checked={state.flags.contactPermission} onChange={(event) => handleConfirm('contactPermission', event.target.checked)} disabled={!onConfirm} />
      Подтверждаю разрешение передать контакт
    </label>
    {contactReady
      ? <label className="check-row"><input type="checkbox" checked={includeHandoverContact} onChange={(event) => setIncludeHandoverContact(event.target.checked)} />Добавить контакт выдающего в сообщение</label>
      : <p className="privacy-inline">Без разрешения и отдельного выбора контакт не попадёт в сообщение. Текст без контакта можно скопировать.</p>}
  </>

  return (
    <section className="composer" aria-labelledby={`composer-${template.id}`}>
      <div className="composer-heading">
        <div>
          {needsHandoverContext && <span className="audience-badge audience-internal">Внутреннее сообщение</span>}
          {!needsHandoverContext && <span className="audience-badge">Покупателю</span>}
          <h3 id={`composer-${template.id}`}>{template.title}</h3>
        </div>
        <span className="copy-symbol" aria-hidden="true">↗</span>
      </div>
      {template.usage && <p className="composer-usage">{template.usage}</p>}

      {onAudienceChange && <div className="audience-switch" aria-label="Кому предназначено сообщение">
        <button type="button" aria-pressed={state.audience === 'buyer'} onClick={() => onAudienceChange('buyer')}>Покупателю</button>
        <button type="button" aria-pressed={state.audience === 'handover'} onClick={() => onAudienceChange('handover')}>Человеку на точке</button>
      </div>}

      {showRequiredFields && !showDetails && template.requiredFields.length > 0 && <div className="field-grid">{renderFields()}</div>}
      {showGuardControls && needsContactPermission && !showDetails && <div className="guard-checklist">{renderContactControls()}</div>}
      {template.guardFlags.includes('handoverContext') && <div className="internal-warning">Внутреннее сообщение человеку на точке — не отправляйте покупателю.</div>}

      <label className="message-label" htmlFor={`message-${template.id}`}>Готовое сообщение</label>
      {editing ? <textarea
        ref={textarea}
        id={`message-${template.id}`}
        aria-label="Текст сообщения"
        className="message-editor"
        value={editedText}
        onChange={(event) => { setDraft({ templateId: template.id, source: sourceText, text: event.target.value }); setCopyStatus(null) }}
        rows={Math.max(3, Math.min(6, Math.ceil(editedText.length / 58)))}
      /> : <p className="message-preview" aria-label="Текст сообщения">{editedText}</p>}
      {needsNeutral && <p className="neutral-notice" role="status">{rendered.missing.length ? missingMessage(rendered.missing) : 'Контакт не добавлен. Для него нужны разрешение и отдельный выбор.'} Показан безопасный нейтральный вариант.</p>}
      {!guardResult.allowed && <p className="guard-message">{guardResult.reasons.join(' ')}</p>}
      {needsHandoverContext && <p className="privacy-inline">Контакт и адрес вводятся вручную и остаются в этом браузере.</p>}

      <div className="composer-actions">
        <button className="button button-primary copy-button" disabled={!isCopyable} onClick={handleCopy} type="button">Копировать</button>
        <span aria-live="polite" className="copy-status">{status}</span>
      </div>
      <p className="copy-disclaimer">Копирование не отправляет сообщение в Авито.</p>
      <div className="composer-secondary-actions">
        {showEditToggle && <button className="text-button" type="button" aria-expanded={editing} onClick={() => setEditing((open) => !open)}>{editing ? 'Готово' : 'Изменить текст'}</button>}
        {showDetails && hasDetails && <details className="composer-details">
          <summary>Детали и контакт</summary>
          {showRequiredFields && template.requiredFields.length > 0 && <div className="field-grid">{renderFields()}</div>}
          {renderContactControls()}
        </details>}
      </div>
    </section>
  )
}
