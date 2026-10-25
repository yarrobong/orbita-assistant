import { useMemo, useState } from 'react'
import { templateCatalog } from '../data/templates'
import { searchTemplates } from '../lib/search'
import type { TemplateCategory } from '../domain/types'

type Props = { favorites: string[]; onFavorite: (id: string) => void; onUse: (id: string) => void; query?: string; onQueryChange?: (query: string) => void }
const categories: Array<[string, TemplateCategory | 'favorites' | undefined]> = [
  ['Все', undefined], ['Вопросы о товаре', 'product'], ['Общее', 'general'], ['Доставка', 'delivery'], ['Самовывоз', 'pickup'], ['После покупки', 'after-purchase'], ['Настройка Quest', 'quest'], ['Безопасные ответы', 'other'], ['Избранное', 'favorites'],
]

export default function TemplateLibrary({ favorites, onFavorite, onUse, query: externalQuery, onQueryChange }: Props) {
  const [localQuery, setLocalQuery] = useState('')
  const query = externalQuery ?? localQuery
  const [category, setCategory] = useState<TemplateCategory | 'favorites' | undefined>()
  const results = useMemo(() => searchTemplates(templateCatalog, query, category, new Set(favorites)), [query, category, favorites])
  return <section aria-labelledby="page-title"><header className="page-heading"><p className="eyebrow">БАЗА ОТВЕТОВ ORBITA</p><h1 id="page-title">Все ответы</h1><p className="lead">Шаблоны из рабочей базы. Перед отправкой проверьте подсказки и условия.</p></header>
    <label className="library-search"><span className="sr-only">Поиск ответа</span><input type="search" aria-label="Поиск ответа" placeholder="Например, доставка или Quest 3S" value={query} onChange={(event) => onQueryChange ? onQueryChange(event.target.value) : setLocalQuery(event.target.value)} /></label>
    <div className="category-chips" aria-label="Категории">{categories.map(([label, value]) => <button type="button" key={label} aria-pressed={category === value} onClick={() => setCategory(value as typeof category)}>{label}</button>)}</div>
    <p className="result-count" aria-live="polite">{results.length} ответов</p>
    <div className="template-list">{results.map((template) => <article className="template-card" key={template.id}>
      <div className="template-card-top"><span className="template-category">{template.category}</span><button className={`favorite-button${favorites.includes(template.id) ? ' is-favorite' : ''}`} type="button" aria-label={favorites.includes(template.id) ? `Убрать «${template.title}» из избранного` : `Добавить «${template.title}» в избранное`} onClick={() => onFavorite(template.id)}>{favorites.includes(template.id) ? '★' : '☆'}</button></div>
      <h2>{template.title}</h2><p className="template-excerpt">{template.body}</p>{template.usage && <p className="template-usage">{template.usage}</p>}
      {template.checklist.length > 0 && <details><summary>Перед отправкой</summary><ul>{template.checklist.map((item) => <li key={item}>{item}</li>)}</ul></details>}
      <button type="button" className="button button-secondary" onClick={() => onUse(template.id)}>Открыть и подготовить</button>
    </article>)}</div>
    {results.length === 0 && <p className="empty-state">Ничего не найдено. Попробуйте другое слово или категорию.</p>}
  </section>
}
