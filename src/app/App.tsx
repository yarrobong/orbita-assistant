import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from 'react'
import { APP_BASE } from '../lib/config'
import { templateCatalog } from '../data/templates'
import { initialFlowState, transition } from '../domain/flow'
import type { FlowPath, FlowState, Template } from '../domain/types'
import CopyComposer from '../components/CopyComposer'
import FlowScreen from '../features/FlowScreen'
import HomeScreen from '../features/HomeScreen'
import SettingsScreen from '../features/SettingsScreen'
import TemplateLibrary from '../features/TemplateLibrary'
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
  { id: 'home', label: 'Главная', icon: '⌂' },
  { id: 'answers', label: 'Ответы', icon: '▤' },
  { id: 'settings', label: 'Настройки', icon: '⚙' },
]
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
  const [route, setRoute] = useState<AppRoute>(() => currentRoute().route)
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState(safeReadFavorites)
  const [lastScenario, setLastScenario] = useState<LastScenario | null>(safeReadLastScenario)
  const [liveFlow, setLiveFlow] = useState<FlowState | null>(() => {
    const initial = currentRoute().route
    return initial.kind === 'flow' ? initialFlowState(initial.path) : null
  })
  const [updateWorker, setUpdateWorker] = useState<ServiceWorker | null>(null)
  useEffect(() => {
    const sync = () => {
      const resolved = currentRoute()
      if (window.location.hash !== resolved.canonicalHash) replaceHash(resolved.canonicalHash)
      setRoute(resolved.route)
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

  const navigate = (next: AppRoute) => {
    const hash = routeHash(next)
    window.location.hash = hash
    setRoute(next)
  }
  const open = (id: string) => {
    if (id === 'templates' || id === 'answers') { navigate({ kind: 'answers' }); return }
    const path = (['new', 'delivery', 'pickup', 'after-purchase'].includes(id) ? id : 'new') as FlowPath
    const stage = ({ new: 'N0', delivery: 'D0', pickup: 'P0', 'after-purchase': 'AFTER' } as Record<FlowPath, string>)[path]
    const next = { path: id, stage, reviewRequested: false, issueOpen: false }
    setLiveFlow(initialFlowState(path))
    setLastScenario(next)
    localStorage.setItem('orbita:last-scenario', JSON.stringify(next))
    navigate({ kind: 'flow', path })
  }
  const favorite = (id: string) => setFavorites((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])
  const selected = route.kind === 'template' ? templateCatalog.find((template) => template.id === route.id) : undefined
  const navRoute = primarySectionFor(route)
  const handleGlobalSearch = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); navigate({ kind: 'answers' }) }

  return <div className="app-frame" data-app-base={APP_BASE}>
    <aside className="sidebar"><a className="brand" href="#/home" onClick={(event) => { event.preventDefault(); navigate({ kind: 'home' }) }}><span className="brand-mark" aria-hidden="true">O</span><span><strong>ORBITA</strong><small>Assistant</small></span></a>
      <nav aria-label="Основная навигация" className="primary-nav">{navItems.map((item) => <button aria-current={navRoute === item.id ? 'page' : undefined} className={`nav-item${navRoute === item.id ? ' is-active' : ''}`} key={item.id} type="button" onClick={() => navigate({ kind: item.id as 'home' | 'answers' | 'settings' })}><span className="nav-icon" aria-hidden="true">{item.icon}</span>{item.label}</button>)}</nav>
      <div className="sidebar-note">Локально на этом устройстве</div>
    </aside>
    <div className="workspace"><header className="topbar"><div className="mobile-brand"><span className="brand-mark" aria-hidden="true">O</span><strong>ORBITA Assistant</strong></div>
      <form className="search-form" role="search" onSubmit={handleGlobalSearch}><span aria-hidden="true" className="search-icon">⌕</span><input aria-label="Быстрый поиск" placeholder="Что нужно ответить?" type="search" value={query} onChange={(event) => setQuery(event.target.value)} /><kbd aria-hidden="true">⌘ K</kbd></form>
      <button className="settings-button" aria-label="Настройки" type="button" onClick={() => navigate({ kind: 'settings' })}>⚙</button></header>
      {updateWorker && <aside className="update-notice" role="status"><p>Доступно обновление. Скопируйте введённый текст перед перезапуском.</p><button className="button button-primary" type="button" onClick={() => updateWorker.postMessage({ type: 'ACTIVATE_UPDATE' })}>Обновить приложение</button><button className="update-dismiss" type="button" onClick={() => setUpdateWorker(null)}>Позже</button></aside>}
      <main className="main-content">
        {route.kind === 'home' && <HomeScreen onOpen={open} lastScenario={lastScenario} onContinue={() => { if (lastScenario) navigate({ kind: 'flow', path: lastScenario.path as FlowPath }) }} />}
        {route.kind === 'quick' && <section><header className="page-heading"><p className="eyebrow">БЫСТРЫЙ ОТВЕТ</p><h1>Что спросил покупатель?</h1></header></section>}
        {route.kind === 'flow' && <FlowScreen kind={route.path} flowState={liveFlow?.path === route.path ? liveFlow : initialFlowState(route.path)} onFlowStateChange={setLiveFlow} initialStage={lastScenario?.path === route.path ? lastScenario.stage : undefined} initialReviewRequested={lastScenario?.path === route.path && lastScenario.reviewRequested} initialIssueOpen={lastScenario?.path === route.path && lastScenario.issueOpen} onBack={() => navigate({ kind: 'home' })} onStageChange={(path, stage) => setLastScenario((current) => ({ path, stage, reviewRequested: current?.path === path && current.reviewRequested, issueOpen: current?.path === path && current.issueOpen }))} onStatusChange={(state) => setLastScenario({ path: state.path, stage: state.stage, reviewRequested: state.flags.reviewRequested, issueOpen: state.flags.issueOpen })} />}
        {route.kind === 'answers' && <TemplateLibrary favorites={favorites} query={query} onQueryChange={setQuery} onFavorite={favorite} onUse={(id) => navigate({ kind: 'template', id })} />}
        {route.kind === 'template' && selected && <TemplateUse template={selected} onBack={() => navigate({ kind: 'answers' })} />}
        {route.kind === 'settings' && <SettingsScreen onClear={() => { setFavorites([]); setLastScenario(null); setLiveFlow(null); localStorage.removeItem('orbita:last-scenario'); navigate({ kind: 'home' }) }} />}
      </main>
    </div>
  </div>
}

export default function App() { return <AppErrorBoundary><AppShell /></AppErrorBoundary> }
