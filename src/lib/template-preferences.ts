import { templateCatalog } from '../data/templates'
import type { TemplateCategory } from '../domain/types'

const validTemplateIds = new Set(templateCatalog.map(({ id }) => id))

const labels: Record<TemplateCategory, string> = {
  general: 'Общее',
  product: 'Товар',
  delivery: 'Доставка',
  pickup: 'Самовывоз',
  'after-purchase': 'После покупки',
  quest: 'Настройка Quest',
  safety: 'Безопасность',
  other: 'Другое',
}

export function categoryLabel(category: TemplateCategory): string {
  return labels[category]
}

export function normalizeRecentIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return [...new Set(value.filter((id): id is string => typeof id === 'string' && validTemplateIds.has(id)))].slice(0, 8)
}

export function rememberTemplate(recentIds: string[], id: string): string[] {
  return normalizeRecentIds([id, ...recentIds])
}
