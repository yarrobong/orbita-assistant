import type { Template, TemplateCategory } from '../domain/types'

const synonymGroups: string[][] = [
  ['белый', 'белые', 'белом', 'белого', 'белую'],
  ['доставка', 'отправить', 'отправка', 'авито'],
  ['самовывоз', 'забрать', 'приехать'],
  ['отзыв', 'оценка', 'отозваться'],
  ['quest', 'квест', 'шлем'],
  ['геймпад', 'джойстик', 'контроллер'],
]

function normalize(value: string): string {
  return value.toLocaleLowerCase('ru-RU').replaceAll('ё', 'е').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
}

function queryGroups(query: string): string[][] {
  return normalize(query).split(/\s+/u).filter(Boolean).map((word) => {
    const stem = word.slice(0, 4)
    const synonyms = synonymGroups.find((group) => group.some((term) => term.slice(0, 4) === stem))
    return synonyms ? [word, ...synonyms] : [word]
  })
}

function matchesWord(word: string, content: string): boolean {
  const stem = word.length > 4 ? word.slice(0, 4) : word
  return content.split(' ').some((part) => part.startsWith(stem) || stem.startsWith(part))
}

export function searchTemplates(
  templates: Template[],
  query: string,
  category?: TemplateCategory | 'favorites',
  favoriteIds: ReadonlySet<string> = new Set(),
): Template[] {
  const groups = queryGroups(query)
  return templates.filter((template) => {
    if (category === 'favorites' && !favoriteIds.has(template.id)) return false
    if (category && category !== 'favorites' && template.category !== category) return false
    if (groups.length === 0) return true
    const content = normalize([
      template.title, template.body, template.tags.join(' '), template.usage,
      template.checklist.join(' '), template.category,
    ].join(' '))
    return groups.every((group) => group.some((word) => matchesWord(word, content)))
  }).sort((a, b) => a.defaultPriority - b.defaultPriority)
}
