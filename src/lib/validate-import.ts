import type { ImportableTemplate, TemplateCategory } from '../domain/types'

export type ImportResult = { valid: boolean; templates: ImportableTemplate[]; errors: string[] }

const allowedTemplateKeys = new Set([
  'id', 'title', 'category', 'stage', 'audience', 'body', 'tags', 'requiredFields',
  'guardFlags', 'checklist', 'defaultPriority', 'revision', 'source', 'usage',
])
const allowedCategories = new Set<TemplateCategory>([
  'general', 'product', 'delivery', 'pickup', 'after-purchase', 'quest', 'safety', 'other',
])
const allowedFlags = new Set([
  'stockConfirmed', 'deliveryAvailable', 'orderVerified', 'shippedVerified', 'receivedVerified',
  'handoverConfirmed', 'buyerMessagePrepared', 'buyerNotified', 'addressConfirmed', 'contactPermission', 'handoverCompleted',
  'reviewRequested', 'issueOpen', 'compatibilityChecked', 'variantChecked', 'priceConfirmed', 'termsConfirmed',
  'stockAvailable', 'stockUnavailable', 'noIssueOpen', 'reviewNotRequested', 'handoverContext',
])
const forbiddenKeyPattern = /(?:customer|buyer.?name|buyer.?phone|conversation|password|secret|api.?key|access.?token)/iu
const stringArrays = ['tags', 'requiredFields', 'guardFlags', 'checklist'] as const

function invalid(errors: string[]): ImportResult {
  return { valid: false, templates: [], errors }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

export function validateImport(text: string): ImportResult {
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    return invalid(['Файл не является корректным JSON.'])
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return invalid(['Ожидается объект с версией и списком шаблонов.'])
  const root = value as Record<string, unknown>
  if (Object.keys(root).some((key) => forbiddenKeyPattern.test(key))) return invalid(['В файле обнаружен запрещённый ключ с личными данными или секретом.'])
  if (root.version !== 1 || !Array.isArray(root.templates)) return invalid(['Поддерживается только формат версии 1 со списком templates.'])
  if (root.templates.length > 200) return invalid(['В файле может быть не более 200 шаблонов.'])

  const errors: string[] = []
  const ids = new Set<string>()
  const templates: ImportableTemplate[] = []

  root.templates.forEach((raw, index) => {
    const label = `Шаблон ${index + 1}`
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      errors.push(`${label}: ожидается объект.`)
      return
    }
    const item = raw as Record<string, unknown>
    const keys = Object.keys(item)
    if (keys.some((key) => forbiddenKeyPattern.test(key))) errors.push(`${label}: запрещённый ключ.`)
    if (keys.some((key) => !allowedTemplateKeys.has(key))) errors.push(`${label}: неизвестное поле.`)
    for (const key of ['id', 'title', 'category', 'stage', 'audience', 'body'] as const) {
      if (typeof item[key] !== 'string' || item[key].trim().length === 0) errors.push(`${label}: поле ${key} обязательно.`)
    }
    if (typeof item.body === 'string' && item.body.length > 5000) errors.push(`${label}: текст длиннее 5000 символов.`)
    if (typeof item.title === 'string' && item.title.length > 120) errors.push(`${label}: заголовок длиннее 120 символов.`)
    if (typeof item.id === 'string') {
      if (ids.has(item.id)) errors.push(`${label}: повторяется id ${item.id}.`)
      ids.add(item.id)
    }
    if (typeof item.category === 'string' && !allowedCategories.has(item.category as TemplateCategory)) errors.push(`${label}: неизвестная категория.`)
    if (item.audience !== 'buyer' && item.audience !== 'handover') errors.push(`${label}: неизвестная аудитория.`)
    for (const field of stringArrays) {
      if (!isStringArray(item[field])) errors.push(`${label}: поле ${field} должно быть списком строк.`)
    }
    if (Array.isArray(item.guardFlags) && item.guardFlags.some((flag) => typeof flag !== 'string' || !allowedFlags.has(flag))) {
      errors.push(`${label}: неизвестное условие использования.`)
    }
    if (typeof item.defaultPriority !== 'number' || !Number.isFinite(item.defaultPriority)) errors.push(`${label}: defaultPriority должен быть числом.`)
    if (typeof item.revision !== 'number' || !Number.isInteger(item.revision) || item.revision < 1) errors.push(`${label}: revision должен быть целым числом от 1.`)
    templates.push(item as unknown as ImportableTemplate)
  })

  return errors.length > 0 ? invalid(errors) : { valid: true, templates, errors: [] }
}
