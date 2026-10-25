import { Component, type ErrorInfo, type ReactNode } from 'react'
import { APP_BASE } from '../lib/config'
import '../styles/app.css'

type AppErrorBoundaryProps = { children: ReactNode }
type AppErrorBoundaryState = { failed: boolean }

class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ORBITA Assistant crashed', error, info.componentStack)
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="error-page">
          <h1>Произошла ошибка</h1>
          <p>Перезагрузите приложение. Ваши локальные шаблоны останутся на устройстве.</p>
          <button className="button button-primary" onClick={() => window.location.reload()}>
            Перезагрузить
          </button>
        </main>
      )
    }
    return this.props.children
  }
}

const navItems = [
  { id: 'home', label: 'Главная', icon: '⌂' },
  { id: 'flows', label: 'Сценарии', icon: '↗' },
  { id: 'answers', label: 'Ответы', icon: '▤' },
  { id: 'settings', label: 'Настройки', icon: '⚙' },
]

const actions = [
  { id: 'new', title: 'Новый покупатель', detail: 'Первый ответ и выбор способа получения', icon: '↗' },
  { id: 'delivery', title: 'Авито Доставка', detail: 'Проверить и пройти этапы заказа', icon: '⇢' },
  { id: 'pickup', title: 'Самовывоз', detail: 'Согласовать дату и выдачу товара', icon: '⌖' },
  { id: 'after', title: 'После покупки', detail: 'Помощь, завершение и честный отзыв', icon: '✓' },
  { id: 'answers', title: 'Все ответы', detail: 'Найти шаблон по вопросу покупателя', icon: '⌕' },
]

function AppShell() {
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => event.preventDefault()

  return (
    <div className="app-frame" data-app-base={APP_BASE}>
      <aside className="sidebar">
        <a className="brand" href={APP_BASE} aria-label="ORBITA Assistant — главная">
          <span className="brand-mark" aria-hidden="true">O</span>
          <span><strong>ORBITA</strong><small>Assistant</small></span>
        </a>
        <nav aria-label="Основная навигация" className="primary-nav">
          {navItems.map((item, index) => (
            <button className={`nav-item${index === 0 ? ' is-active' : ''}`} key={item.id} type="button">
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">Локально на этом устройстве</div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark" aria-hidden="true">O</span><strong>ORBITA Assistant</strong></div>
          <form className="search-form" role="search" onSubmit={handleSearch}>
            <span aria-hidden="true" className="search-icon">⌕</span>
            <input aria-label="Поиск ответа" placeholder="Что нужно ответить?" type="search" />
            <kbd aria-hidden="true">⌘ K</kbd>
          </form>
          <button className="settings-button" aria-label="Настройки" type="button">⚙</button>
        </header>

        <main className="main-content">
          <section className="home-intro" aria-labelledby="page-title">
            <p className="eyebrow">ПОМОЩНИК ПО ПЕРЕПИСКАМ ORBITA</p>
            <h1 id="page-title">ORBITA Assistant</h1>
            <p className="lead">Выберите, что происходит сейчас — подготовим следующий ответ.</p>
          </section>

          <section className="action-grid" aria-label="Выберите ситуацию">
            {actions.map((action, index) => (
              <button className={`action-card${index === 0 ? ' action-card-primary' : ''}`} key={action.id} type="button">
                <span className="action-icon" aria-hidden="true">{action.icon}</span>
                <span className="action-copy"><strong>{action.title}</strong><small>{action.detail}</small></span>
                <span className="action-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </section>
          <p className="privacy-note"><span className="privacy-dot" /> Тексты и отметки хранятся только в этом браузере. Ничего не отправляется в Авито.</p>
        </main>

      </div>
    </div>
  )
}

export default function App() {
  return <AppErrorBoundary><AppShell /></AppErrorBoundary>
}
