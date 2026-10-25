import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from 'react'
import { APP_BASE } from '../lib/config'
import { templateCatalog } from '../data/templates'
import { initialFlowState, transition } from '../domain/flow'
import type { Template } from '../domain/types'
import CopyComposer from '../components/CopyComposer'
import FlowScreen from '../features/FlowScreen'
import HomeScreen from '../features/HomeScreen'
import SettingsScreen from '../features/SettingsScreen'
import TemplateLibrary from '../features/TemplateLibrary'
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
  { id: 'home', label: 'Главная', icon: '⌂' }, { id: 'flows', label: 'Сценарии', icon: '↗' },
  { id: 'templates', label: 'Ответы', icon: '▤' }, { id: 'settings', label: 'Настройки', icon: '⚙' },
]
const pathFromHash = () => window.location.hash.replace(/^#\/?/u, '') || 'home'
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
    if (typeof candidate.path !== 'string' || !allowedPaths.includes(candidate.path) || typeof candidate.stage !== 'string' || !/^(N[0-2]|D[0-7]|P[0-7]|AFTER|HELP|REVIEW|DONE|DX|PX)$/u.test(candidate.stage)) return null
    return { path: candidate.path, stage: candidate.stage, reviewRequested: candidate.reviewRequested === true, issueOpen: candidate.issueOpen === true }
  } catch { return null }
}

function TemplateUse({ template, onBack }: { template: Template; onBack: () => void }) {
  const path = template.category === 'pickup' ? 'pickup' : template.category === 'delivery' ? 'delivery' : 'new'
  const [state, setState] = useState(() => initialFlowState(path))
  const update = (event: Parameters<typeof transition>[1]) => setState((current) => transition(current, event))
  return <section><button className="back-link" type="button" onClick={onBack}>← Все ответы</button><header className="page-heading"><p className="eyebrow">ШАБЛОН ИЗ БАЗЫ</p><h1>{template.title}</h1></header><CopyComposer template={template} state={state} onFieldChange={(field, value) => update({ type: 'set-field', field, value })} onConfirm={(flag, value) => update({ type: 'confirm', flag, value })} onAudienceChange={(audience) => update({ type: 'set-audience', audience })} /></section>
}

function AppShell() {
  const [route, setRoute] = useState(pathFromHash)
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState(safeReadFavorites)
  const [lastScenario, setLastScenario] = useState<LastScenario | null>(safeReadLastScenario)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [updateWorker, setUpdateWorker] = useState<ServiceWorker | null>(null)
  useEffect(() => {
    const sync = () => setRoute(pathFromHash())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  useEffect(() => { localStorage.setItem('orbita:favorites', JSON.stringify(favorites)) }, [favorites])
  useEffect(() => { if (lastScenario) localStorage.setItem('orbita:last-scenario', JSON.stringify(lastScenario)) }, [lastScenario])
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

  const navigate = (next: string) => { window.location.hash = `/${next}`; setRoute(next) }
  const open = (id: string) => {
    if (id === 'templates') { navigate('templates'); return }
    const stage = ({ new: 'N0', delivery: 'D0', pickup: 'P0', 'after-purchase': 'AFTER' } as Record<string, string>)[id] ?? 'N0'
    const next = { path: id, stage, reviewRequested: false, issueOpen: false }
    setLastScenario(next)
    localStorage.setItem('orbita:last-scenario', JSON.stringify(next))
    navigate(`flow/${id}`)
  }
  const favorite = (id: string) => setFavorites((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])
  const selected = templateCatalog.find((template) => template.id === selectedTemplate)
  const navRoute = route === 'home' ? 'home' : route.startsWith('flow/') ? 'flows' : route === 'settings' ? 'settings' : 'templates'
  const handleGlobalSearch = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); navigate('templates') }

  return <div className="app-frame" data-app-base={APP_BASE}>
    <aside className="sidebar"><a className="brand" href="#/home" onClick={(event) => { event.preventDefault(); navigate('home') }}><span className="brand-mark" aria-hidden="true">O</span><span><strong>ORBITA</strong><small>Assistant</small></span></a>
      <nav aria-label="Основная навигация" className="primary-nav">{navItems.map((item) => <button className={`nav-item${navRoute === item.id ? ' is-active' : ''}`} key={item.id} type="button" onClick={() => navigate(item.id)}><span className="nav-icon" aria-hidden="true">{item.icon}</span>{item.label}</button>)}</nav>
      <div className="sidebar-note">Локально на этом устройстве</div>
    </aside>
    <div className="workspace"><header className="topbar"><div className="mobile-brand"><span className="brand-mark" aria-hidden="true">O</span><strong>ORBITA Assistant</strong></div>
      <form className="search-form" role="search" onSubmit={handleGlobalSearch}><span aria-hidden="true" className="search-icon">⌕</span><input aria-label="Быстрый поиск" placeholder="Что нужно ответить?" type="search" value={query} onChange={(event) => setQuery(event.target.value)} /><kbd aria-hidden="true">⌘ K</kbd></form>
      <button className="settings-button" aria-label="Настройки" type="button" onClick={() => navigate('settings')}>⚙</button></header>
      {updateWorker && <aside className="update-notice" role="status"><p>Доступно обновление. Скопируйте введённый текст перед перезапуском.</p><button className="button button-primary" type="button" onClick={() => updateWorker.postMessage({ type: 'ACTIVATE_UPDATE' })}>Обновить приложение</button><button className="update-dismiss" type="button" onClick={() => setUpdateWorker(null)}>Позже</button></aside>}
      <main className="main-content">
        {route === 'home' && <HomeScreen onOpen={open} lastScenario={lastScenario} onContinue={() => { if (lastScenario) navigate(`flow/${lastScenario.path}`) }} />}
        {route === 'flows' && <section><header className="page-heading"><p className="eyebrow">БЫСТРЫЙ СТАРТ</p><h1>Сценарии</h1><p className="lead">Выберите этап переписки, чтобы подготовить следующий ответ.</p></header><div className="action-grid">{['new', 'delivery', 'pickup', 'after-purchase'].map((id) => <button key={id} className="action-card" onClick={() => open(id)} type="button"><span className="action-copy"><strong>{{ new: 'Новый покупатель', delivery: 'Авито Доставка', pickup: 'Самовывоз', 'after-purchase': 'После покупки' }[id]}</strong></span><span className="action-arrow">↗</span></button>)}</div></section>}
        {route.startsWith('flow/') && <FlowScreen key={route} kind={route.slice(5)} initialStage={lastScenario?.path === route.slice(5) ? lastScenario.stage : undefined} initialReviewRequested={lastScenario?.path === route.slice(5) && lastScenario.reviewRequested} initialIssueOpen={lastScenario?.path === route.slice(5) && lastScenario.issueOpen} onBack={() => navigate('home')} onStageChange={(path, stage) => setLastScenario((current) => ({ path, stage, reviewRequested: current?.path === path && current.reviewRequested, issueOpen: current?.path === path && current.issueOpen }))} onStatusChange={(state) => setLastScenario({ path: state.path, stage: state.stage, reviewRequested: state.flags.reviewRequested, issueOpen: state.flags.issueOpen })} />}
        {route === 'templates' && <TemplateLibrary favorites={favorites} query={query} onQueryChange={setQuery} onFavorite={favorite} onUse={(id) => { setSelectedTemplate(id); navigate('use-template') }} />}
        {route === 'use-template' && selected && <TemplateUse template={selected} onBack={() => navigate('templates')} />}
        {route === 'settings' && <SettingsScreen onClear={() => { setFavorites([]); setLastScenario(null); localStorage.removeItem('orbita:last-scenario'); setSelectedTemplate(''); navigate('home') }} />}
        {!['home', 'flows', 'templates', 'settings', 'use-template'].includes(route) && !route.startsWith('flow/') && <HomeScreen onOpen={open} />}
      </main>
    </div>
  </div>
}

export default function App() { return <AppErrorBoundary><AppShell /></AppErrorBoundary> }
