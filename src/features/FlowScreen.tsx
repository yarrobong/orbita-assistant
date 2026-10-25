import { useMemo, useState } from 'react'
import { templateCatalog } from '../data/templates'
import { canEnterStage, canRecommendReview, initialFlowState, transition } from '../domain/flow'
import type { FlagName, FlowPath, FlowState, Template } from '../domain/types'
import CopyComposer from '../components/CopyComposer'

type Props = { kind: string; initialStage?: string; initialReviewRequested?: boolean; initialIssueOpen?: boolean; flowState?: FlowState; onFlowStateChange?: (state: FlowState) => void; onBack: () => void; onStageChange?: (path: FlowPath, stage: string) => void; onStatusChange?: (state: FlowState) => void }
const byId = (id: string) => templateCatalog.find((template) => template.id === id)!
const titleByPath: Record<FlowPath, string> = { new: 'Новый покупатель', delivery: 'Авито Доставка', pickup: 'Самовывоз', 'after-purchase': 'После покупки' }

function FlowStepper({ state, onStage }: { state: FlowState; onStage: (stage: string) => void }) {
  const labels = state.path === 'delivery'
    ? [['D0', 'Доставка'], ['D1', 'Заказ'], ['D2', 'Срок'], ['D4', 'Отправлено'], ['D5', 'В пути / ПВЗ'], ['D6', 'Получение'], ['D7', 'Отзыв']]
    : [['P0', 'Запрос'], ['P1', 'Время'], ['P3', 'Согласование'], ['P4', 'Покупатель'], ['P5', 'Встреча'], ['P6', 'Выдача'], ['P7', 'Отзыв']]
  if (state.path === 'new' || state.path === 'after-purchase') return null
  return <ol className="flow-steps" aria-label="Этапы сценария">{labels.map(([id, label]) => {
    const available = canEnterStage(state, id!) || state.stage === id
    return <li key={id}><button type="button" disabled={!available} aria-current={state.stage === id ? 'step' : undefined} onClick={() => onStage(id!)}>{label}</button></li>
  })}</ol>
}

function Confirm({ state, flag, label, onChange }: { state: FlowState; flag: FlagName; label: string; onChange: (flag: FlagName, value: boolean) => void }) {
  return <label className="check-row"><input type="checkbox" checked={state.flags[flag]} onChange={(event) => onChange(flag, event.target.checked)} />{label}</label>
}

export default function FlowScreen({ kind, initialStage, initialReviewRequested, initialIssueOpen, flowState, onFlowStateChange, onBack, onStageChange, onStatusChange }: Props) {
  const path = (['new', 'delivery', 'pickup', 'after-purchase'].includes(kind) ? kind : 'new') as FlowPath
  const [localState, setLocalState] = useState(() => {
    const initial = initialFlowState(path)
    return { ...initial, ...(initialStage ? { stage: initialStage } : {}), flags: { ...initial.flags, reviewRequested: Boolean(initialReviewRequested), issueOpen: Boolean(initialIssueOpen) } }
  })
  const state = flowState ?? localState
  const [newChoice, setNewChoice] = useState('')
  const [issueMode, setIssueMode] = useState(false)
  const update = (event: Parameters<typeof transition>[1]) => {
    const next = transition(state, event)
    if (next.stage !== state.stage) onStageChange?.(next.path, next.stage)
    if (next.flags.reviewRequested !== state.flags.reviewRequested || next.flags.issueOpen !== state.flags.issueOpen) onStatusChange?.(next)
    if (!flowState) setLocalState(next)
    onFlowStateChange?.(next)
  }
  const chooseTemplate = (id: string): Template => byId(id)
  const stage = state.stage
  const active = useMemo(() => {
    if (path === 'new') {
      if (newChoice === 'availability') return chooseTemplate(state.fields.stockStatus === 'available' ? 'top-01' : state.fields.stockStatus === 'unavailable' ? 'R07' : 'auto-02')
      if (newChoice === 'delivery') return chooseTemplate('top-02')
      if (newChoice === 'pickup') return chooseTemplate('scenario-12')
      if (newChoice === 'compatibility') return chooseTemplate('R04')
      if (newChoice === 'other') return chooseTemplate('R02')
      return null
    }
    if (path === 'delivery') {
      if (issueMode || state.flags.issueOpen || stage === 'DX') return chooseTemplate('R51')
      const ids: Record<string, string> = { D0: 'top-02', D1: 'top-03', D2: 'top-04', D3: 'scenario-10', D4: 'top-05', D5: state.flags.arrivedVerified ? 'top-06' : 'scenario-10', D6: 'scenario-11', D7: 'top-07' }
      return chooseTemplate(ids[stage] ?? 'top-02')
    }
    if (path === 'pickup') {
      if (issueMode || state.flags.issueOpen || stage === 'DX') return chooseTemplate('R51')
      const ids: Record<string, string> = {
        P0: 'scenario-12', P1: 'scenario-13', P2: 'scenario-13',
        P3: state.audience === 'handover' ? 'scenario-14' : 'scenario-15',
        P4: 'scenario-17', P5: 'scenario-18', P6: 'scenario-21', P7: 'scenario-23',
      }
      return chooseTemplate(ids[stage] ?? 'scenario-12')
    }
    if (issueMode || state.flags.issueOpen) return chooseTemplate('R51')
    return state.flags.receivedVerified ? chooseTemplate('top-07') : chooseTemplate('scenario-11')
  }, [path, newChoice, state, stage, issueMode])

  const change = (field: string, value: string) => update({ type: 'set-field', field, value })
  const confirm = (flag: FlagName, value: boolean) => update({ type: 'confirm', flag, value })
  const markSent = () => {
    if (!active || !canRecommendReview(state)) return
    update({ type: 'mark-review-requested' })
  }
  const stageChange = (next: string) => update({ type: 'set-stage', stage: next })
  const renderField = (name: string, label: string, placeholder?: string, inputMode?: 'tel') => <label className="field-label" key={name}><span>{label}</span><input value={state.fields[name] ?? ''} onChange={(event) => change(name, event.target.value)} autoComplete="off" placeholder={placeholder} inputMode={inputMode} /></label>

  return <section className="flow-screen" aria-labelledby="flow-title">
    <button className="back-link" type="button" onClick={onBack}>← Главная</button>
    <header className="page-heading"><p className="eyebrow">СЦЕНАРИЙ</p><h1 id="flow-title">{titleByPath[path]}</h1><p className="lead">Проверяйте только факты текущего шага.</p></header>
    <FlowStepper state={state} onStage={stageChange} />

    {path === 'new' && !newChoice && <div className="choice-list" aria-label="Что спросил покупатель">
      <p className="section-label">Что нужно уточнить?</p>
      {[
        ['availability', 'Уточнить наличие'], ['delivery', 'Уточнить Авито Доставку'], ['pickup', 'Обсудить самовывоз'], ['compatibility', 'Проверить совместимость'], ['other', 'Другой вопрос'],
      ].map(([value, label]) => <button className="choice-button" type="button" key={value} onClick={() => setNewChoice(value!)}>{label}<span aria-hidden="true">›</span></button>)}
    </div>}

    {path === 'new' && newChoice === 'availability' && <div className="check-panel"><label className="field-label"><span>Какой товар проверили?</span><input value={state.fields.product ?? ''} onChange={(event) => change('product', event.target.value)} autoComplete="off" /></label><label className="field-label"><span>Результат проверки остатка</span><select aria-label="Результат проверки остатка" value={state.fields.stockStatus ?? ''} onChange={(event) => change('stockStatus', event.target.value)}><option value="">Ещё не проверял</option><option value="available">Этот товар есть</option><option value="unavailable">Этого товара нет</option></select></label>
      {state.fields.stockStatus && <Confirm state={state} flag="stockConfirmed" label="Я проверил именно этот товар" onChange={confirm} />}
    </div>}

    {path === 'delivery' && ['D1', 'D4', 'D5', 'D6'].includes(stage) && <div className="check-panel">
      {renderField('product', 'Товар / заказ')}
      {stage === 'D1' && <Confirm state={state} flag="orderVerified" label="Проверил, что заказ оформлен в Авито" onChange={confirm} />}
      {stage === 'D4' && <Confirm state={state} flag="shippedVerified" label="Проверил статус передачи заказа в доставку" onChange={confirm} />}
      {stage === 'D5' && <Confirm state={state} flag="arrivedVerified" label="Проверил, что заказ прибыл в пункт выдачи" onChange={confirm} />}
      {stage === 'D6' && <Confirm state={state} flag="receivedVerified" label="Проверил в Авито, что покупатель получил заказ" onChange={confirm} />}
    </div>}

    {path === 'pickup' && ['P1', 'P2', 'P3'].includes(stage) && <div className="check-panel">
      {stage === 'P1' && <p className="section-label">Укажите предложенные покупателем дату и время.</p>}
      {stage === 'P3' && <p className="section-label">Запросите подтверждение у человека на точке. Наличие не нужно отмечать заранее.</p>}
      <div className="field-grid">{renderField('product', 'Товар')}{renderField('date', 'Дата', 'Например, 30 октября')}{renderField('time', 'Время', 'Например, 17:00')}</div>
      {stage === 'P3' && <>
        {renderField('handoverName', 'Кто подтвердит выдачу')}
        <Confirm state={state} flag="stockConfirmed" label="Выдающий подтвердил наличие именно этого товара" onChange={confirm} />
        <Confirm state={state} flag="handoverConfirmed" label="Выдающий подтвердил выдачу в выбранное время" onChange={confirm} />
      </>}
    </div>}

    {path === 'pickup' && stage === 'P4' && <div className="check-panel">
      <p className="section-label">Точка выдачи согласована. Проверьте адрес и контакт перед сообщением покупателю.</p>
      <div className="field-grid">{renderField('address', 'Адрес')}{renderField('handoverName', 'Кто выдаст')}{renderField('handoverPhone', 'Контакт выдающего', undefined, 'tel')}</div>
      <Confirm state={state} flag="addressConfirmed" label="Адрес проверен" onChange={confirm} />
      <Confirm state={state} flag="contactPermission" label="Выдающий разрешил передать контакт покупателю" onChange={confirm} />
    </div>}

    {path === 'pickup' && stage === 'P6' && <div className="check-panel"><Confirm state={state} flag="handoverCompleted" label="Товар фактически передан покупателю" onChange={confirm} /></div>}
    {path === 'after-purchase' && <div className="check-panel"><Confirm state={state} flag="receivedVerified" label="Покупатель подтвердил получение товара" onChange={confirm} /><Confirm state={state} flag="issueOpen" label="Есть нерешённая проблема покупателя" onChange={confirm} /></div>}
    <div className="flow-tools"><button type="button" className="button button-secondary" onClick={() => { setIssueMode(!issueMode); confirm('issueOpen', !issueMode) }}>{issueMode ? 'Вернуться к сценарию' : 'Есть проблема с заказом'}</button></div>
    {active && <CopyComposer key={active.id} template={active} state={state} onFieldChange={change} onConfirm={confirm} onAudienceChange={path === 'pickup' && ['P3', 'P4'].includes(stage) ? (audience) => update({ type: 'set-audience', audience }) : undefined} onCopied={path === 'pickup' && stage === 'P4' ? () => confirm('buyerMessagePrepared', true) : undefined} showGuardControls={false} showRequiredFields={path === 'new'} />}
    {path === 'pickup' && stage === 'P4' && state.flags.buyerMessagePrepared && <div className="send-confirm">
      {state.flags.buyerNotified ? <p role="status">Покупатель уведомлён. Если ответа нет, переходите к следующему шагу.</p> : <><p>После фактической отправки сообщения отметьте это здесь.</p><button type="button" className="button button-primary" onClick={() => confirm('buyerNotified', true)}>Я отправил сообщение покупателю</button></>}
    </div>}
    {active && (active.id === 'top-07' || active.id === 'scenario-23') && <div className="send-confirm"><p>После того как вы действительно отправили просьбу в Авито, отметьте это здесь. Копирование не отправляет сообщение.</p><button type="button" className="button button-primary" disabled={!canRecommendReview(state) || state.flags.reviewRequested} onClick={markSent}>{state.flags.reviewRequested ? 'Просьба уже отмечена' : 'Я отправил сообщение'}</button></div>}
  </section>
}
