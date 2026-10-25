import { useRef, useState } from 'react'
import { canUseTemplate } from '../domain/flow'
import { renderTemplate } from '../domain/render-template'
import type { Audience, FlagName, FlowState, Template } from '../domain/types'
import { copyText } from '../lib/clipboard'

type Props = {
  template: Template
  state: FlowState
  onFieldChange: (field: string, value: string) => void
  onConfirm?: (flag: FlagName, value: boolean) => void
  onAudienceChange?: (audience: Audience) => void
  showGuardControls?: boolean
  showRequiredFields?: boolean
}

const fieldLabels: Record<string, string> = {
  product: 'Товар', variant: 'Цвет или вариант', date: 'Дата', time: 'Время', address: 'Адрес',
  handoverName: 'Кто выдаст', handoverPhone: 'Контакт выдающего', price: 'Цена', alternative: 'Вариант на замену',
  model: 'Модель устройства', task: 'Задача', custom: 'Дополнительное значение', dateTime: 'Дата и время', when: 'Срок',
}
const flagLabels: Partial<Record<FlagName, string>> = {
  stockConfirmed: 'Проверил остаток конкретного товара',
  deliveryAvailable: 'Проверил, что Авито Доставка доступна',
  orderVerified: 'Проверил заказ в Авито',
  shippedVerified: 'Проверил передачу в доставку в Авито',
  arrivedVerified: 'Проверил прибытие заказа в Авито',
  receivedVerified: 'Проверил, что покупатель получил товар',
  handoverConfirmed: 'Человек на точке подтвердил товар и время',
  meetingConfirmed: 'Сверил и подтвердил встречу покупателю',
  addressConfirmed: 'Проверил адрес выдачи',
  contactPermission: 'Получил разрешение передать контакт',
  handoverCompleted: 'Подтвердил фактическую передачу товара',
  issueOpen: 'Есть нерешённая проблема',
  compatibilityChecked: 'Проверил совместимость конкретной модели',
  variantChecked: 'Проверил остаток именно этого цвета или варианта',
  priceConfirmed: 'Проверил цену или скидку',
  termsConfirmed: 'Проверил условия гарантии или возврата',
}
const nonInteractiveGuards = new Set(['noIssueOpen', 'reviewNotRequested', 'handoverContext'])

function missingMessage(missing: string[]): string {
  const labels = missing.map((field) => (fieldLabels[field] ?? field).toLocaleLowerCase('ru-RU'))
  if (labels.length === 2 && labels[0] === 'дата' && labels[1] === 'время') return 'Заполните дату и время, чтобы скопировать.'
  return `Заполните: ${labels.join(', ')}.`
}

export default function CopyComposer({ template, state, onFieldChange, onConfirm, onAudienceChange, showGuardControls = true, showRequiredFields = true }: Props) {
  const textarea = useRef<HTMLTextAreaElement>(null)
  const [draft, setDraft] = useState<{ templateId: string; source: string; text: string } | null>(null)
  const [copyStatus, setCopyStatus] = useState<{ source: string; message: string } | null>(null)
  const rendered = renderTemplate(template, state.fields)
  const guardResult = canUseTemplate(template, state)
  const editedText = draft?.templateId === template.id && draft.source === rendered.text ? draft.text : rendered.text
  const status = copyStatus?.source === rendered.text ? copyStatus.message : ''
  const isCopyable = rendered.copyable && guardResult.allowed

  const confirmableFlags = [...new Set(template.guardFlags.filter((flag): flag is FlagName => !nonInteractiveGuards.has(flag) && flag in state.flags))]
  const needsInventory = template.guardFlags.includes('stockAvailable') || template.guardFlags.includes('stockUnavailable')
  const needsHandoverContext = template.audience === 'handover'

  const handleCopy = async () => {
    if (!isCopyable) return
    const copied = await copyText(editedText)
    if (copied) {
      setCopyStatus({ source: rendered.text, message: 'Скопировано' })
    } else {
      textarea.current?.focus()
      textarea.current?.select()
      setCopyStatus({ source: rendered.text, message: 'Буфер недоступен. Текст выделен — скопируйте вручную.' })
    }
  }

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

      {showRequiredFields && template.requiredFields.length > 0 && <div className="field-grid">
        {template.requiredFields.map((field) => (
          <label className="field-label" key={field}>
            <span>{fieldLabels[field] ?? field}</span>
            <input value={state.fields[field] ?? ''} onChange={(event) => onFieldChange(field, event.target.value)} autoComplete="off" />
          </label>
        ))}
      </div>}

      {showGuardControls && needsInventory && <div className="guard-control inventory-control">
        {!template.requiredFields.includes('product') && <label className="field-label"><span>Товар</span><input value={state.fields.product ?? ''} onChange={(event) => onFieldChange('product', event.target.value)} autoComplete="off" /></label>}
        <label className="field-label">
          <span>Проверенный остаток</span>
          <select aria-label="Проверенный остаток" value={state.fields.stockStatus ?? ''} onChange={(event) => onFieldChange('stockStatus', event.target.value)}>
            <option value="">Выберите после проверки</option>
            <option value="available">Вариант есть в наличии</option>
            <option value="unavailable">Варианта нет в наличии</option>
            <option value="mixed">Цвета или варианты отличаются</option>
          </select>
        </label>
        {state.fields.stockStatus && <label className="check-row"><input type="checkbox" checked={state.flags.stockConfirmed} onChange={(event) => onConfirm?.('stockConfirmed', event.target.checked)} /> Я проверил этот остаток</label>}
        {template.guardFlags.includes('variantChecked') && <label className="field-label"><span>Какой вариант проверен?</span><input value={state.fields.variant ?? ''} onChange={(event) => onFieldChange('variant', event.target.value)} /></label>}
      </div>}

      {showGuardControls && confirmableFlags.filter((flag) => !['stockConfirmed', 'issueOpen', 'variantChecked'].includes(flag)).length > 0 && <div className="guard-checklist">
        {confirmableFlags.filter((flag) => !['stockConfirmed', 'issueOpen', 'variantChecked'].includes(flag)).map((flag) => (
          <label className="check-row" key={flag}>
            <input type="checkbox" checked={state.flags[flag]} onChange={(event) => onConfirm?.(flag, event.target.checked)} />
            {flagLabels[flag] ?? flag}
          </label>
        ))}
      </div>}

      {template.checklist.length > 0 && <div className="check-before">
        <strong>Перед отправкой проверьте</strong>
        <ul>{template.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>}

      {template.guardFlags.includes('handoverContext') && <div className="internal-warning">Это сообщение предназначено человеку на точке, не покупателю.</div>}

      <label className="message-label" htmlFor={`message-${template.id}`}>Текст сообщения</label>
      <textarea
        ref={textarea}
        id={`message-${template.id}`}
        aria-label="Текст сообщения"
        className="message-editor"
        value={editedText}
        onChange={(event) => { setDraft({ templateId: template.id, source: rendered.text, text: event.target.value }); setCopyStatus(null) }}
        rows={Math.max(4, Math.ceil(editedText.length / 58))}
      />

      {rendered.missing.length > 0 && <p className="guard-message">{missingMessage(rendered.missing)}</p>}
      {!guardResult.allowed && guardResult.reasons.filter((reason) => !reason.startsWith('Заполните поле')).length > 0 && <p className="guard-message">{guardResult.reasons.filter((reason) => !reason.startsWith('Заполните поле')).join(' ')}</p>}
      {template.audience === 'handover' && <p className="privacy-inline">Контакт и адрес вводятся вручную и остаются в этом браузере.</p>}
      <div className="composer-actions">
        <button className="button button-primary copy-button" disabled={!isCopyable || (!onConfirm && confirmableFlags.length > 0)} onClick={handleCopy} type="button">Копировать</button>
        <span aria-live="polite" className="copy-status">{status}</span>
      </div>
      <p className="copy-disclaimer">Копирование не отправляет сообщение в Авито.</p>
    </section>
  )
}
