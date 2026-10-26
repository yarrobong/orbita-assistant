import { useState } from 'react'
import { templateCatalog } from '../data/templates'
import { stagesForPath, templateForStage } from '../data/scenario-stages'
import { initialFlowState, transition } from '../domain/flow'
import type { FlowPath, FlowState, Template } from '../domain/types'
import CopyComposer from '../components/CopyComposer'

type Props = { kind: string; initialStage?: string; initialReviewRequested?: boolean; initialIssueOpen?: boolean; flowState?: FlowState; onFlowStateChange?: (state: FlowState) => void; onBack: () => void; onStageChange?: (path: FlowPath, stage: string) => void; onStatusChange?: (state: FlowState) => void }
const byId = (id: string) => templateCatalog.find((template) => template.id === id)!
const titleByPath: Record<FlowPath, string> = { new: 'Новый покупатель', delivery: 'Авито Доставка', pickup: 'Самовывоз', 'after-purchase': 'После покупки' }

export default function FlowScreen({ kind, initialStage, initialReviewRequested, initialIssueOpen, flowState, onFlowStateChange, onBack, onStageChange, onStatusChange }: Props) {
  const path = (['new', 'delivery', 'pickup', 'after-purchase'].includes(kind) ? kind : 'new') as FlowPath
  const [localState, setLocalState] = useState(() => {
    const initial = initialFlowState(path)
    return { ...initial, ...(initialStage ? { stage: initialStage } : {}), flags: { ...initial.flags, reviewRequested: Boolean(initialReviewRequested), issueOpen: Boolean(initialIssueOpen) } }
  })
  const state = flowState ?? localState
  const [newChoice, setNewChoice] = useState('')
  const update = (event: Parameters<typeof transition>[1]) => {
    const next = transition(state, event)
    if (next.stage !== state.stage) onStageChange?.(next.path, next.stage)
    if (next.flags.reviewRequested !== state.flags.reviewRequested || next.flags.issueOpen !== state.flags.issueOpen) onStatusChange?.(next)
    if (!flowState) setLocalState(next)
    onFlowStateChange?.(next)
  }
  const stage = state.stage
  const stageOptions = stagesForPath(path)
  let active: Template | null = null
  if (path === 'delivery' || path === 'pickup') active = templateForStage(path, stage)
  if (path === 'after-purchase') active = byId(stage === 'AFTER_ISSUE' ? 'R51' : 'scenario-22')
  if (path === 'new' && newChoice) {
    const id = newChoice === 'availability' ? 'auto-02' : newChoice === 'delivery' ? 'top-02' : newChoice === 'pickup' ? 'scenario-12' : newChoice === 'compatibility' ? 'R04' : 'R02'
    active = byId(id)
    if (newChoice === 'pickup') active = { ...active, body: 'Здравствуйте! Самовывоз можно обсудить. Напишите удобные день и время — уточню, получится ли организовать выдачу.' }
  }
  const change = (field: string, value: string) => update({ type: 'set-field', field, value })
  const stageChange = (next: string) => update({ type: 'set-stage', stage: next })
  const reviewChoice = (next: 'AFTER_REVIEW' | 'AFTER_ISSUE') => {
    if (next === 'AFTER_ISSUE') update({ type: 'confirm', flag: 'issueOpen', value: true })
    else if (state.flags.issueOpen) update({ type: 'confirm', flag: 'issueOpen', value: false })
    else stageChange(next)
  }
  const isReviewStage = (path === 'after-purchase' && stage !== 'AFTER_ISSUE')
    || (path === 'delivery' && stage === 'D8')
    || (path === 'pickup' && stage === 'P8')

  return <section className="flow-screen" aria-labelledby="flow-title">
    <button className="back-link" type="button" onClick={onBack}>← Главная</button>
    <header className="page-heading"><p className="eyebrow">СЦЕНАРИЙ</p><h1 id="flow-title">{titleByPath[path]}</h1></header>

    {path === 'new' && <div className="choice-list" role="group" aria-label="Что спросил покупатель">
      <p className="section-label">Какая сейчас ситуация?</p>
      {[
        ['availability', 'Уточнить наличие'], ['delivery', 'Уточнить Авито Доставку'], ['pickup', 'Обсудить самовывоз'], ['compatibility', 'Проверить совместимость'], ['other', 'Другой вопрос'],
      ].map(([value, label]) => <button className="choice-button" aria-pressed={newChoice === value} type="button" key={value} onClick={() => setNewChoice(value!)}>{label}<span aria-hidden="true">›</span></button>)}
    </div>}

    {(path === 'delivery' || path === 'pickup') && <>
      <p className="section-label situation-label">Какая сейчас ситуация?</p>
      <div className="scenario-options" role="group" aria-label={path === 'delivery' ? 'Ситуации доставки' : 'Ситуации самовывоза'}>
        {stageOptions.map((option) => <button key={option.id} type="button" aria-pressed={stage === option.id} onClick={() => stageChange(option.id)}>{option.label}</button>)}
      </div>
    </>}

    {path === 'after-purchase' && <>
      <p className="review-reminder">Просить отзыв следует после получения товара. Если у покупателя возникла проблема — сначала помогите с ней.</p>
      <div className="scenario-options after-purchase-options" role="group" aria-label="Вариант после покупки">
        <button type="button" aria-pressed={stage !== 'AFTER_ISSUE'} onClick={() => reviewChoice('AFTER_REVIEW')}>Попросить отзыв</button>
        <button type="button" aria-pressed={stage === 'AFTER_ISSUE'} onClick={() => reviewChoice('AFTER_ISSUE')}>Есть проблема — сначала помочь</button>
      </div>
    </>}

    {active && <>
      <CopyComposer key={`${path}-${stage}-${active.id}`} template={active} state={state} onFieldChange={change} onConfirm={(flag, value) => update({ type: 'confirm', flag, value })} showGuardControls={false} showDetails={path !== 'new' && (active.requiredFields.length > 0 || active.guardFlags.includes('contactPermission'))} showEditToggle={path !== 'new'} />
      {isReviewStage && <button
        className="text-button review-requested-toggle"
        type="button"
        aria-pressed={state.flags.reviewRequested}
        onClick={() => update(state.flags.reviewRequested
          ? { type: 'confirm', flag: 'reviewRequested', value: false }
          : { type: 'mark-review-requested' })}
      >{state.flags.reviewRequested ? 'Отметка об отзыве поставлена' : 'Уже попросил отзыв'}</button>}
    </>}
  </section>
}
