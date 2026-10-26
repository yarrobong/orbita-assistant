import { Component, type ErrorInfo, type ReactNode, useEffect, useRef, useState } from 'react'
import { APP_BASE } from '../lib/config'
import { templateCatalog } from '../data/templates'
import { initialFlowState, transition } from '../domain/flow'
import type { FlowPath, FlowState, Template } from '../domain/types'
import CopyComposer from '../components/CopyComposer'
import Icon from '../components/Icon'
import FlowScreen from '../features/FlowScreen'
import HomeScreen from '../features/HomeScreen'
import SettingsScreen from '../features/SettingsScreen'
import TemplateLibrary from '../features/TemplateLibrary'
import QuickAnswers from '../features/QuickAnswers'
import ProductKnowledge from '../features/ProductKnowledge'
import { copyText } from '../lib/clipboard'
import { normalizeRecentIds, rememberTemplate } from '../lib/template-preferences'
import { searchTemplates } from '../lib/search'
import { primarySectionFor, resolveRoute, routeHash, type AppRoute } from './routes'
import '../styles/app.css'

type AppErrorBoundaryProps = { children: ReactNode }
type AppErrorBoundaryState = { failed: boolean }
class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { failed: false }
  static getDerivedStateFromError(): AppErrorBoundaryState { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('ORBITA Assistant crashed', error, info.componentStack) }
  render() { return this.state.failed ? <main className="error-page"><h1>Произошла ошибка</h1><p>Перезагрузите приложение. Ваши локальные шаблоны останутся на устройстве.</p><button className="button button-primary" onClick={() => window.location.reload()}>Перезагрузить</button></main> : this.props.children }
}

const navItems = [
  { id: 'home', label: 'Главная', icon: 'home' },
  { id: 'answers', label: 'Ответы', icon: 'answers' },
  { id: 'products', label: 'Товары', icon: 'products' },
  { id: 'settings', label: 'Настройки', icon: 'settings' },
] as const
const currentRoute = () => resolveRoute(window.location.hash)
const replaceHash = (hash: string) => window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`)
const safeReadFavorites = (): string[] => {
  try { const value: unknown = JSON.parse(localStorage.getItem('orbita:favorites') ?? '[]'); return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string' && templateCatalog.some((template) => template.id === id)) : [] } catch { return [] }
}
type LastScenario = { path: string; stage: string; reviewRequested: boolean; issueOpen: boolean }
const safeReadLastScenario = (): LastScenario | null => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('orbita:last-scenario') ?? 'null')
    if (!value || typeof value !== 'object') return null
    const candidate = value as Record<string, unknown>
    const allowedPaths = ['new', 'delivery', 'pickup', 'after-purchase']
    if (typeof candidate.path !== 'string' || !allowedPaths.includes(candidate.path) || typeof candidate.stage !== 'string' || !/^(N[0-2]|D[0-9]|P[0-8]|AFTER|AFTER_REVIEW|AFTER_ISSUE|HELP|REVIEW|DONE|DX|PX)$/u.test(candidate.stage)) return null
    return { path: candidate.path, stage: candidate.stage, reviewRequested: candidate.reviewRequested === true, issueOpen: candidate.issueOpen === true }
  } catch { return null }
}

const safeReadRecentIds = (): string[] => {
  try { return normalizeRecentIds(JSON.parse(localStorage.getItem('orbita:recent-templates') ?? '[]')) } catch { return [] }
}

function TemplateUse({ template, onBack, onCopied, embedded = false, backLabel = 'Все ответы' }: { template: Template; onBack: () => void; onCopied: () => void; embedded?: boolean; backLabel?: string }) {
  const path = template.category === 'pickup' ? 'pickup' : template.category === 'delivery' ? 'delivery' : 'new'
  const canSwitchAudience = template.audience === 'handover' || template.guardFlags.includes('handoverContext')
  const [state, setState] = useState(() => initialFlowState(path))
  const update = (event: Parameters<typeof transition>[1]) => setState((current) => transition(current, event))
  return <section className={`template-use${embedded ? ' is-embedded' : ''}`}><button className="back-link" type="button" onClick={onBack}>← {backLabel}</button><header className="page-heading"><h1>{template.title}</h1></header><CopyComposer template={template} state={state} onFieldChange={(field, value) => update({ type: 'set-field', field, value })} onConfirm={(flag, value) => update({ type: 'confirm', flag, value })} onAudienceChange={canSwitchAudience ? (audience) => update({ type: 'set-audience', audience }) : undefined} showDetails onCopied={onCopied} showTitle={false} /></section>
}

function AppShell() {
  const [route, setRoute] = useState<AppRoute>(() => currentRoute().route)
  const [selectionOrigin, setSelectionOrigin] = useState<'quick' | 'library'>(() => currentRoute().route.kind === 'quick' ? 'quick' : 'library')
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState(safeReadFavorites)
  const [recentIds, setRecentIds] = useState(safeReadRecentIds)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const desktopSearchRef = useRef<HTMLInputElement>(null)
  const mobileSearchRef = useRef<HTMLInputElement>(null)
  const mobileSearchCloseRef = useRef<HTMLButtonElement>(null)
  const mobileSearchTriggerRef = useRef<HTMLButtonElement>(null)
  const wasMobileSearchOpen = useRef(false)
  const [lastScenario, setLastScenario] = useState<LastScenario | null>(safeReadLastScenario)
  const [liveFlow, setLiveFlow] = useState<FlowState | null>(() => {
    const initial = currentRoute().route
    if (initial.kind !== 'flow') return null
    const flow = initialFlowState(initial.path)
    const saved = safeReadLastScenario()
    if (saved?.path === initial.path) {
      flow.stage = saved.stage
      flow.flags.reviewRequested = saved.reviewRequested
      flow.flags.issueOpen = saved.issueOpen
      if (initial.path === 'after-purchase' && saved.issueOpen) flow.stage = 'AFTER_ISSUE'
    }
    return flow
  })
  const [updateWorker, setUpdateWorker] = useState<ServiceWorker | null>(null)
  useEffect(() => {
    const sync = () => {
      const resolved = currentRoute()
      if (window.location.hash !== resolved.canonicalHash) replaceHash(resolved.canonicalHash)
      setRoute(resolved.route)
      if (resolved.route.kind === 'quick') setSelectionOrigin('quick')
      else if (resolved.route.kind === 'answers') setSelectionOrigin('library')
      if (resolved.route.kind === 'flow') {
        const flowRoute = resolved.route
        setLiveFlow((current) => current?.path === flowRoute.path ? current : initialFlowState(flowRoute.path))
      }
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  useEffect(() => { localStorage.setItem('orbita:favorites', JSON.stringify(favorites)) }, [favorites])
  useEffect(() => { localStorage.setItem('orbita:recent-templates', JSON.stringify(normalizeRecentIds(recentIds))) }, [recentIds])
  useEffect(() => { if (lastScenario) localStorage.setItem('orbita:last-scenario', JSON.stringify(lastScenario)) }, [lastScenario])
  useEffect(() => {
    if (mobileSearchOpen) { mobileSearchRef.current?.focus(); wasMobileSearchOpen.current = true }
    else if (wasMobileSearchOpen.current) { mobileSearchTriggerRef.current?.focus(); wasMobileSearchOpen.current = false }
  }, [mobileSearchOpen])
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileSearchOpen) { setMobileSearchOpen(false); return }
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        if (window.innerWidth < 760) setMobileSearchOpen(true)
        else desktopSearchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileSearchOpen])
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    let registration: ServiceWorkerRegistration | undefined
    let disposed = false
    let controlledAtStart = navigator.serviceWorker.controller !== null
    const onControllerChange = () => {
      if (controlledAtStart) window.location.reload()
      controlledAtStart = true
    }
    const onWorkerStateChange = (event: Event) => {
      const worker = event.currentTarget as ServiceWorker
      if (worker.state === 'installed' && navigator.serviceWorker.controller) setUpdateWorker(registration?.waiting ?? worker)
    }
    const onUpdateFound = () => registration?.installing?.addEventListener('statechange', onWorkerStateChange)
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)
    void navigator.serviceWorker.ready.then((readyRegistration) => {
      if (disposed) return
      registration = readyRegistration
      if (registration.waiting) setUpdateWorker(registration.waiting)
      registration.addEventListener('updatefound', onUpdateFound)
      if (navigator.onLine) void registration.update().catch(() => undefined)
    }).catch(() => undefined)
    return () => {
      disposed = true
      registration?.removeEventListener('updatefound', onUpdateFound)
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
    }
  }, [])

  const navigate = (next: AppRoute) => {
    const hash = routeHash(next)
    if (next.kind === 'answers') setSelectionOrigin('library')
    else if (next.kind === 'quick') setSelectionOrigin('quick')
    window.location.hash = hash
    setRoute(next)
  }
  const openTemplate = (id: string, origin: 'quick' | 'library') => { setSelectionOrigin(origin); navigate({ kind: 'template', id }) }
  const open = (id: string) => {
    if (id === 'templates' || id === 'answers') { navigate({ kind: 'answers' }); return }
    if (id === 'quick') { navigate({ kind: 'quick' }); return }
    if (id === 'products') { navigate({ kind: 'products' }); return }
    const path = (['new', 'delivery', 'pickup', 'after-purchase'].includes(id) ? id : 'new') as FlowPath
    const stage = ({ new: 'N0', delivery: 'D0', pickup: 'P0', 'after-purchase': 'AFTER_REVIEW' } as Record<FlowPath, string>)[path]
    const next = { path: id, stage, reviewRequested: false, issueOpen: false }
    setLiveFlow(initialFlowState(path))
    setLastScenario(next)
    localStorage.setItem('orbita:last-scenario', JSON.stringify(next))
    navigate({ kind: 'flow', path })
  }
  const favorite = (id: string) => setFavorites((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])
  const markTemplateUsed = (id: string) => setRecentIds((current) => rememberTemplate(current, id))
  const selected = route.kind === 'template' ? templateCatalog.find((template) => template.id === route.id) : undefined
  const navRoute = primarySectionFor(route)
  const searchResults = query.trim() ? searchTemplates(templateCatalog, query).slice(0, 6) : []
  const selectSearchResult = (id: string) => { setMobileSearchOpen(false); openTemplate(id, 'library') }
  const handleGlobalSearch = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); if (searchResults[0]) selectSearchResult(searchResults[0].id); else navigate({ kind: 'answers' }) }
  const isTemplateSelection = route.kind === 'template'
  const selectedQuickId = isTemplateSelection && selectionOrigin === 'quick' ? route.id : undefined
  const selectedLibraryId = isTemplateSelection && selectionOrigin === 'library' ? route.id : undefined
  const showQuickAnswers = route.kind === 'quick' || selectedQuickId !== undefined
  const showTemplateLibrary = route.kind === 'answers' || selectedLibraryId !== undefined

  return <div className="app-frame" data-app-base={APP_BASE}>
    <aside className="sidebar" inert={mobileSearchOpen}><a className="brand" href="#/home" onClick={(event) => { event.preventDefault(); navigate({ kind: 'home' }) }}><span className="brand-mark" aria-hidden="true">O</span><span><strong>ORBITA</strong><small>Assistant</small></span></a>
      <nav aria-label="Основная навигация" className="primary-nav">{navItems.map((item) => <button aria-current={navRoute === item.id ? 'page' : undefined} className={`nav-item${navRoute === item.id ? ' is-active' : ''}`} key={item.id} type="button" onClick={() => navigate({ kind: item.id as 'home' | 'answers' | 'products' | 'settings' })}><span className="nav-icon"><Icon name={item.icon} /></span>{item.label}</button>)}</nav>
      <div className="sidebar-note">Локально на этом устройстве</div>
    </aside>
    <div className="workspace"><header className="topbar"><div className="mobile-brand"><span className="brand-mark" aria-hidden="true">O</span><strong>ORBITA Assistant</strong></div>
      <div className="desktop-search-wrap"><form className="search-form" role="search" onSubmit={handleGlobalSearch}><span className="search-icon"><Icon name="search" size={21} /></span><input ref={desktopSearchRef} aria-label="Быстрый поиск" placeholder="Что нужно ответить?" type="search" value={query} onChange={(event) => setQuery(event.target.value)} /><kbd aria-hidden="true">⌘ K</kbd></form>{searchResults.length > 0 && <div className="search-results" role="listbox" aria-label="Результаты поиска">{searchResults.map((template) => <button role="option" aria-selected="false" key={template.id} type="button" onClick={() => selectSearchResult(template.id)}>{template.title}</button>)}</div>}</div>
      <button ref={mobileSearchTriggerRef} className="mobile-search-trigger" aria-label="Открыть поиск" type="button" onClick={() => setMobileSearchOpen(true)}><Icon name="search" size={22} /></button></header>
      {mobileSearchOpen && <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Поиск ответов" onKeyDown={(event) => { if (event.key !== 'Tab') return; const focusable = event.currentTarget.querySelectorAll<HTMLElement>('input:not([disabled]), button:not([disabled])'); const first = focusable.item(0); const last = focusable.item(focusable.length - 1); if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() } }}><form className="mobile-search-form" role="search" onSubmit={handleGlobalSearch}><input ref={mobileSearchRef} aria-label="Поиск по ответам" placeholder="Что нужно ответить?" type="search" value={query} onChange={(event) => setQuery(event.target.value)} /><button ref={mobileSearchCloseRef} className="button button-secondary" type="button" onClick={() => setMobileSearchOpen(false)}>Закрыть</button></form>{searchResults.length > 0 && <div className="search-results search-results-mobile" role="listbox" aria-label="Результаты поиска">{searchResults.map((template) => <button role="option" aria-selected="false" key={template.id} type="button" onClick={() => selectSearchResult(template.id)}>{template.title}</button>)}</div>}</div>}
      {updateWorker && <aside className="update-notice" role="status"><p>Доступно обновление. Скопируйте введённый текст перед перезапуском.</p><button className="button button-primary" type="button" onClick={() => updateWorker.postMessage({ type: 'ACTIVATE_UPDATE' })}>Обновить приложение</button><button className="update-dismiss" type="button" onClick={() => setUpdateWorker(null)}>Позже</button></aside>}
      <main className="main-content" inert={mobileSearchOpen}>
        {route.kind === 'home' && <HomeScreen onOpen={open} onUseTemplate={(id) => navigate({ kind: 'template', id })} favorites={favorites} recentIds={recentIds} lastScenario={lastScenario} onContinue={() => { if (lastScenario) navigate({ kind: 'flow', path: lastScenario.path as FlowPath }) }} />}
        {showQuickAnswers && <div className={`master-detail answer-workspace${selectedQuickId ? ' has-selection' : ''}`}><div className="master-pane"><QuickAnswers selectedTemplateId={selectedQuickId} onChoose={(id) => openTemplate(id, 'quick')} /></div>{selectedQuickId && selected && <div className="detail-pane"><TemplateUse embedded backLabel="Быстрые ответы" template={selected} onBack={() => navigate({ kind: 'quick' })} onCopied={() => markTemplateUsed(selected.id)} /></div>}{route.kind === 'quick' && <div className="detail-empty">Выберите ситуацию, чтобы открыть сообщение.</div>}</div>}
        {route.kind === 'flow' && <FlowScreen key={route.path} kind={route.path} flowState={liveFlow?.path === route.path ? liveFlow : initialFlowState(route.path)} onFlowStateChange={setLiveFlow} initialStage={lastScenario?.path === route.path ? lastScenario.stage : undefined} initialReviewRequested={lastScenario?.path === route.path && lastScenario.reviewRequested} initialIssueOpen={lastScenario?.path === route.path && lastScenario.issueOpen} onBack={() => navigate({ kind: 'home' })} onStageChange={(path, stage) => setLastScenario((current) => ({ path, stage, reviewRequested: current?.path === path && current.reviewRequested, issueOpen: current?.path === path && current.issueOpen }))} onStatusChange={(state) => setLastScenario({ path: state.path, stage: state.stage, reviewRequested: state.flags.reviewRequested, issueOpen: state.flags.issueOpen })} />}
        {showTemplateLibrary && <div className={`master-detail answer-workspace${selectedLibraryId ? ' has-selection' : ''}`}><div className="master-pane"><TemplateLibrary embedded selectedId={selectedLibraryId} favorites={favorites} recentIds={recentIds} query={query} onQueryChange={setQuery} onFavorite={favorite} onUse={(id) => openTemplate(id, 'library')} onCopy={(_id, text) => copyText(text)} onCopied={markTemplateUsed} /></div>{selectedLibraryId && selected && <div className="detail-pane"><TemplateUse embedded template={selected} onBack={() => navigate({ kind: 'answers' })} onCopied={() => markTemplateUsed(selected.id)} /></div>}{route.kind === 'answers' && <div className="detail-empty">Выберите ответ, чтобы прочитать и подготовить сообщение.</div>}</div>}
        {(route.kind === 'products' || route.kind === 'product') && <ProductKnowledge selectedId={route.kind === 'product' ? route.id : undefined} onSelect={(id) => navigate({ kind: 'product', id })} onBack={() => navigate({ kind: 'products' })} />}
        {route.kind === 'settings' && <SettingsScreen onClear={() => { setFavorites([]); setRecentIds([]); setLastScenario(null); setLiveFlow(null); localStorage.removeItem('orbita:last-scenario'); localStorage.removeItem('orbita:recent-templates'); navigate({ kind: 'home' }) }} />}
      </main>
    </div>
  </div>
}

export default function App() { return <AppErrorBoundary><AppShell /></AppErrorBoundary> }
