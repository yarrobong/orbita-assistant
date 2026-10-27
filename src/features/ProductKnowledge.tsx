import { useMemo, useRef, useState } from 'react'
import { products, knowledgeArticles } from '../data/products'
import type { BuyerQuestion, Product, QuestModel } from '../data/product-types'
import { buildProductAnswer, filterProducts, modelLabels, productCompatibility, questionLabels } from '../domain/product-assistant'
import { copyText } from '../lib/clipboard'
import '../styles/products.css'

type Props = { selectedId?: string; onSelect: (id: string) => void; onBack: () => void; onOpenGames: () => void }

const categories = [
  ['all', 'Все товары'], ['headset', 'Шлемы'], ['strap', 'Ремешки'],
  ['case', 'Кейсы'], ['power', 'Зарядка'], ['cable', 'Кабели'],
  ['mount', 'Крепления'], ['controller', 'Геймпады'], ['accessory', 'Прочее'],
] as const

function ReplyBuilder({ product }: { product: Product }) {
  const [question, setQuestion] = useState<BuyerQuestion>('compatibility')
  const [model, setModel] = useState<QuestModel | ''>('')
  const [edited, setEdited] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const textarea = useRef<HTMLTextAreaElement>(null)
  const suggested = buildProductAnswer(product, question, model || undefined)
  const message = edited ?? suggested
  const switchQuestion = (next: BuyerQuestion) => { setQuestion(next); setEdited(null); setStatus('') }
  const switchModel = (next: QuestModel | '') => { setModel(next); setEdited(null); setStatus('') }
  const copy = async () => {
    if (!message.trim()) return
    if (await copyText(message)) setStatus('Скопировано')
    else {
      textarea.current?.focus()
      textarea.current?.select()
      setStatus('Не удалось скопировать автоматически. Текст выделен для ручного копирования.')
    }
  }
  return <section className="product-assistant" aria-labelledby="product-assistant-heading">
    <h3 id="product-assistant-heading">Ответ покупателю</h3>
    <div className="product-answer-controls">
      <label>Что спрашивают?
        <select aria-label="Вопрос покупателя" value={question} onChange={event => switchQuestion(event.target.value as BuyerQuestion)}>
          {(Object.keys(questionLabels) as BuyerQuestion[]).map(key => <option key={key} value={key}>{questionLabels[key]}</option>)}
        </select>
      </label>
      {question === 'compatibility' && product.category !== 'headset' && <label>Модель покупателя
        <select aria-label="Модель шлема покупателя" value={model} onChange={event => switchModel(event.target.value as QuestModel | '')}>
          <option value="">Не указана</option>
          {(Object.keys(modelLabels) as QuestModel[]).map(key => <option key={key} value={key}>{modelLabels[key]}</option>)}
        </select>
      </label>}
    </div>
    <label className="product-answer-label" htmlFor={'product-answer-' + product.id}>Готовый текст — можно редактировать</label>
    <textarea ref={textarea} id={'product-answer-' + product.id} aria-label="Подготовленный ответ покупателю" rows={4} value={message} onChange={event => { setEdited(event.target.value); setStatus('') }}/>
    <div className="product-answer-actions">
      <button type="button" className="button button-primary" onClick={() => void copy()}>Копировать ответ</button>
      {edited !== null && <button type="button" className="button button-secondary" onClick={() => { setEdited(null); setStatus('') }}>Вернуть исходный</button>}
      <span role="status" aria-live="polite">{status}</span>
    </div>
    <p className="product-disclaimer">Сообщение не отправляется автоматически. Наличие, цены и состояние проверяй по конкретному объявлению.</p>
  </section>
}

function ProductDetail({ product, onBack }: { product: Product; onBack: () => void }) {
  const [target, setTarget] = useState<QuestModel>('quest3s')
  const compat = productCompatibility(product, target)
  return <section className="product-detail" aria-labelledby="product-title">
    <button type="button" className="back-link product-back" onClick={onBack}>← Все товары</button>
    <p className="product-kicker">{categories.find(c => c[0] === product.category)?.[1] || 'Товар'}</p>
    <h2 id="product-title">{product.title}</h2>
    <p className="product-description">{product.description}</p>
    {product.facts.length > 0 && <section className="product-facts"><h3>Что известно</h3><ul>{product.facts.map(fact => <li key={fact}>{fact}</li>)}</ul></section>}
    {product.category !== 'headset' && <section className="product-compat"><h3>Совместимость</h3>
      <div className="product-compat-row"><label htmlFor="product-compat-model">Шлем</label><select id="product-compat-model" value={target} onChange={e=>setTarget(e.target.value as QuestModel)}>{(Object.keys(modelLabels) as QuestModel[]).map(key=><option value={key} key={key}>{modelLabels[key]}</option>)}</select></div>
      <p className={compat === 'confirmed' ? 'product-compat-positive' : 'product-compat-unknown'}>{compat === 'confirmed' ? 'Подтверждено документацией для указанного назначения' : 'Нужно проверить конкретную модель / артикул. Не обещать совместимость.'}</p>
    </section>}
    {product.notes.length > 0 && <section className="product-notes"><h3>Уточнить перед продажей</h3><ul>{product.notes.map(note=><li key={note}>{note}</li>)}</ul></section>}
    {product.sourceUrl && <p className="product-source"><a href={product.sourceUrl} target="_blank" rel="noopener noreferrer">Источник характеристик ↗</a></p>}
    <ReplyBuilder key={product.id} product={product}/>
  </section>
}

export default function ProductKnowledge({ selectedId, onSelect, onBack, onOpenGames }: Props) {
  const [view, setView] = useState<'products' | 'knowledge'>('products')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [articleId, setArticleId] = useState(knowledgeArticles[0]?.id ?? '')
  const selectedProduct = products.find(p => p.id === selectedId)
  const selectedArticle = knowledgeArticles.find(a => a.id === articleId)
  const filtered = useMemo(() => filterProducts(products, query, category), [query, category])
  const filteredArticles = useMemo(() => knowledgeArticles.filter(a => (a.title + ' ' + a.text + ' ' + a.group).toLocaleLowerCase('ru-RU').includes(query.toLocaleLowerCase('ru-RU'))), [query])

  return <section className="products-page" aria-label="Товары и знания">
    <header className="product-page-heading">
      <h1>Товары и знания</h1>
      <p>Характеристики, совместимость и готовые ответы без догадок.</p>
    </header>
    <div className="product-view-tabs" role="group" aria-label="Раздел товаров">
      <button type="button" aria-pressed={view === 'products'} onClick={()=>setView('products')}>Каталог товаров</button>
      <button type="button" aria-pressed={view === 'knowledge'} onClick={()=>setView('knowledge')}>База знаний</button>
      <button type="button" onClick={onOpenGames}>Игры Quest · выбрать до 15</button>
    </div>
    {view === 'products' ? <div className={'product-layout' + (selectedProduct ? ' product-has-selection' : '')}>
      <div className="product-master">
        <label className="product-search"><span className="sr-only">Поиск товаров</span><input type="search" placeholder="Поиск: кейс, Quest 3S, кабель…" value={query} onChange={e=>setQuery(e.target.value)} /></label>
        <div className="product-category-filter"><label htmlFor="product-category">Категория</label><select id="product-category" value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c[0]} value={c[0]}>{c[1]}</option>)}</select></div>
        <p className="product-count">{filtered.length} товаров в справочнике · наличие не отслеживается</p>
        <div className="product-list">{filtered.map(p=><button type="button" className={'product-list-item' + (p.id === selectedId ? ' is-selected' : '')} aria-current={p.id === selectedId ? 'page' : undefined} onClick={()=>onSelect(p.id)} key={p.id}><strong>{p.title}</strong><small>{p.description}</small></button>)}</div>
        {filtered.length===0 && <p className="empty-state">Ничего не найдено. Измени запрос или категорию.</p>}
      </div>
      <div className="product-detail-pane">{selectedProduct ? <ProductDetail product={selectedProduct} onBack={onBack}/> : <div className="product-empty">Выбери товар слева, чтобы увидеть сведения и подготовить ответ покупателю.</div>}</div>
    </div> : <div className="product-layout knowledge-layout">
      <div className="product-master">
        <label className="product-search"><span className="sr-only">Поиск по базе знаний</span><input type="search" placeholder="Поиск по базе знаний" value={query} onChange={e=>setQuery(e.target.value)} /></label>
        <div className="product-list">{filteredArticles.map(a=><button type="button" key={a.id} aria-current={a.id===articleId?'page':undefined} onClick={()=>setArticleId(a.id)} className={'product-list-item'+(a.id===articleId?' is-selected':'')}><small>{a.group}</small><strong>{a.title}</strong></button>)}</div>
        {filteredArticles.length===0 && <p className="empty-state">Статьи не найдены.</p>}
      </div>
      <div className="product-detail-pane">{selectedArticle && <article className="product-article"><p className="product-kicker">{selectedArticle.group}</p><h2>{selectedArticle.title}</h2><p>{selectedArticle.text}</p>{selectedArticle.sourceUrl ? <a href={selectedArticle.sourceUrl} target="_blank" rel="noopener noreferrer">Проверить официальный источник ↗</a> : <p className="product-disclaimer">Практическая памятка, не заявление производителя.</p>}</article>}</div>
    </div>}
  </section>
}
