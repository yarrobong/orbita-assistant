type Props = { onOpen: (id: string) => void; lastScenario?: { path: string; stage: string } | null; onContinue?: () => void }

const actions = [
  { id: 'new', title: 'Новый покупатель', detail: 'Ответить на вопрос и выбрать дальнейший шаг', icon: '↗' },
  { id: 'delivery', title: 'Авито Доставка', detail: 'Проверить заказ и подготовить ответ по этапу', icon: '⇢' },
  { id: 'pickup', title: 'Самовывоз', detail: 'Согласовать товар, дату и выдачу', icon: '⌖' },
  { id: 'after-purchase', title: 'После покупки', detail: 'Помочь покупателю или попросить отзыв', icon: '✓' },
  { id: 'templates', title: 'Все ответы', detail: 'Найти готовый ответ по вопросу', icon: '⌕' },
]

export default function HomeScreen({ onOpen, lastScenario, onContinue }: Props) {
  return <>
    <section className="home-intro" aria-labelledby="page-title">
      <p className="eyebrow">ПОМОЩНИК ПО ПЕРЕПИСКАМ ORBITA</p>
      <h1 id="page-title">ORBITA Assistant</h1>
      <p className="lead">Выберите ситуацию — подготовим следующий ответ.</p>
    </section>
    <section className="action-grid" aria-label="Выберите ситуацию">
      {actions.map((action, index) => <button className={`action-card${index === 0 ? ' action-card-primary' : ''}`} key={action.id} type="button" onClick={() => onOpen(action.id)}>
        <span className="action-icon" aria-hidden="true">{action.icon}</span>
        <span className="action-copy"><strong>{action.title}</strong><small>{action.detail}</small></span>
        <span className="action-arrow" aria-hidden="true">↗</span>
      </button>)}
    </section>
    {lastScenario && <section className="resume-card"><div><strong>Продолжить последний сценарий</strong><small>{({ new: 'Новый покупатель', delivery: 'Авито Доставка', pickup: 'Самовывоз', 'after-purchase': 'После покупки' } as Record<string, string>)[lastScenario.path] ?? 'Сценарий'} · проверку статусов потребуется подтвердить заново</small></div><button className="button button-secondary" type="button" onClick={onContinue}>Продолжить</button></section>}
    <p className="privacy-note"><span className="privacy-dot" /> Тексты и отметки хранятся только в этом браузере. Ничего не отправляется в Авито.</p>
  </>
}
