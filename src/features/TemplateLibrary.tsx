import { useMemo, useState } from 'react'
import { templateCatalog } from '../data/templates'
import { searchTemplates } from '../lib/search'
import { categoryLabel } from '../lib/template-preferences'
import { renderTemplate } from '../domain/render-template'
import type { TemplateCategory } from '../domain/types'

type Props = { favorites: string[]; recentIds: string[]; onFavorite: (id: string) => void; onUse: (id: string) => void; onCopy: (id: string, text: string) => Promise<boolean>; onCopied: (id: string) => void; query?: string; onQueryChange?: (query: string) => void }
type LibraryCategory = TemplateCategory | 'favorites' | 'recent' | undefined
const categories: Array<[string, LibraryCategory]> = [
  ['Все', undefined], ['Товар', 'product'], ['Общее', 'general'], ['Доставка', 'delivery'], ['Самовывоз', 'pickup'], ['После покупки', 'after-purchase'], ['Настройка Quest', 'quest'], ['Безопасность', 'safety'], ['Другое', 'other'], ['Недавние', 'recent'], ['Избранное', 'favorites'],
]

export default function TemplateLibrary({ favorites, recentIds, onFavorite, onUse, onCopy, onCopied, query: externalQuery, onQueryChange }: Props) {
  const [localQuery, setLocalQuery] = useState('')
  const query = externalQuery ?? localQuery
  const [category, setCategory] = useState<LibraryCategory>()
  const [copiedId, setCopiedId] = useState('')
  const results = useMemo(() => {
    const base = searchTemplates(templateCatalog, query, category === 'favorites' ? 'favorites' : undefined, new Set(favorites))
    if (category === 'recent') return base.filter(({ id }) => recentIds.includes(id)).sort((a, b) => recentIds.indexOf(a.id) - recentIds.indexOf(b.id))
    if (category && category !== 'favorites') return base.filter(({ category: value }) => value === category)
    return base
  }, [query, category, favorites, recentIds])
  const copyOrOpenTemplate = async (id: string) => {
    const template = templateCatalog.find(({ id: templateId }) => templateId === id)!
    const canCopyFromList = template.audience === 'buyer' && template.guardFlags.length === 0 && renderTemplate(template, {}).copyable
    if (canCopyFromList) {
      if (await onCopy(id, template.body)) { setCopiedId(id); onCopied(id); return }
    }
    onUse(id)
  }
  return <section aria-labelledby="page-title"><header className="page-heading"><p className="eyebrow">БАЗА ОТВЕТОВ ORBITA</p><h1 id="page-title">Все ответы</h1><p className="lead">Шаблоны из рабочей базы. Перед отправкой проверьте подсказки и условия.</p></header>
    <label className="library-search"><span className="sr-only">Поиск ответа</span><input type="search" aria-label="Поиск ответа" placeholder="Например, доставка или Quest 3S" value={query} onChange={(event) => onQueryChange ? onQueryChange(event.target.value) : setLocalQuery(event.target.value)} /></label>
    <div className="category-chips" aria-label="Категории">{categories.map(([label, value]) => <button type="button" key={label} aria-pressed={category === value} onClick={() => setCategory(value as typeof category)}>{label}</button>)}</div>
    <p className="result-count" aria-live="polite">{results.length} ответов</p>
    <div className="template-list">{results.map((template) => {
      const canCopyFromList = template.audience === 'buyer' && template.guardFlags.length === 0 && renderTemplate(template, {}).copyable
      return <article className="template-row" key={template.id}>
        <div className="template-row-main"><span className="template-category">{categoryLabel(template.category)}</span><h2>{template.title}</h2><p className="template-excerpt">{template.body}</p></div>
        <div className="template-row-actions"><button className={`favorite-button${favorites.includes(template.id) ? ' is-favorite' : ''}`} type="button" aria-label={favorites.includes(template.id) ? `Убрать «${template.title}» из избранного` : `Добавить «${template.title}» в избранное`} onClick={() => onFavorite(template.id)}>{favorites.includes(template.id) ? '★' : '☆'}</button><button type="button" className="button button-secondary" onClick={() => void copyOrOpenTemplate(template.id)}>{copiedId === template.id ? 'Скопировано' : canCopyFromList ? 'Копировать' : 'Подготовить'}</button></div>
      </article>
    })}</div>
    {results.length === 0 && <p className="empty-state">Ничего не найдено. Попробуйте другое слово или категорию.</p>}
  </section>
}
