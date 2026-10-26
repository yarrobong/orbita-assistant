import { templateCatalog } from '../data/templates'
import { categoryLabel } from '../lib/template-preferences'
import Icon, { type IconName } from '../components/Icon'

type Props = {
  onOpen: (id: string) => void
  onUseTemplate: (id: string) => void
  favorites: string[]
  recentIds: string[]
  lastScenario?: { path: string; stage: string } | null
  onContinue?: () => void
}

const actions = [
  { id: 'quick', title: 'Ответить покупателю', detail: 'Выбрать готовый ответ', icon: 'reply' },
  { id: 'delivery', title: 'Авито Доставка', detail: 'Подготовить сообщение по заказу', icon: 'delivery' },
  { id: 'pickup', title: 'Самовывоз', detail: 'Ответить о встрече и выдаче', icon: 'pickup' },
  { id: 'after-purchase', title: 'После покупки', detail: 'Помочь или попросить отзыв', icon: 'after' },
] as const

export default function HomeScreen({ onOpen, onUseTemplate, favorites, recentIds, lastScenario, onContinue }: Props) {
  const fastAccessIds = [...new Set([...recentIds, ...favorites])].slice(0, 4)
  const fastAccess = fastAccessIds.map((id) => templateCatalog.find((template) => template.id === id)).filter((template) => template !== undefined)
  return <>
    <section className="home-intro" aria-labelledby="page-title">
      <h1 id="page-title">Подготовить сообщение</h1>
      <p className="lead">Выберите ситуацию или найдите ответ в базе.</p>
    </section>
    <section className="home-actions" aria-label="Выберите ситуацию">
      {actions.map((action) => <button className="home-action" key={action.id} type="button" onClick={() => onOpen(action.id)}>
        <span className="home-action-icon" aria-hidden="true"><Icon name={action.icon as IconName} size={20} /></span>
        <span className="home-action-copy"><strong>{action.title}</strong><small>{action.detail}</small></span>
        <span className="home-action-arrow" aria-hidden="true"><Icon name="arrow" size={17} /></span>
      </button>)}
    </section>
    {fastAccess.length > 0 && <section className="home-fast-access" aria-labelledby="fast-access-title"><div className="section-heading"><h2 id="fast-access-title">Недавние и избранные</h2><button className="text-button" type="button" onClick={() => onOpen('answers')}>Все ответы</button></div><div className="fast-access-list">{fastAccess.map((template) => <button className="fast-access-item" type="button" key={template.id} onClick={() => onUseTemplate(template.id)}><span><small>{categoryLabel(template.category)}</small><strong>{template.title}</strong></span><span aria-hidden="true">›</span></button>)}</div></section>}
    {lastScenario && <section className="resume-row" aria-label="Последняя ситуация"><div><strong>Последняя ситуация</strong><small>{({ new: 'Новый покупатель', delivery: 'Авито Доставка', pickup: 'Самовывоз', 'after-purchase': 'После покупки' } as Record<string, string>)[lastScenario.path] ?? 'Сценарий'}</small></div><button className="text-button" type="button" onClick={onContinue}>Продолжить</button></section>}
  </>
}
