import type { Audience, FlowEvent, FlowFlags, FlowPath, FlowState, GuardResult, Template } from './types'

export const emptyFlags = (): FlowFlags => ({
  stockConfirmed: false,
  deliveryAvailable: false,
  orderVerified: false,
  shippedVerified: false,
  receivedVerified: false,
  handoverConfirmed: false,
  meetingConfirmed: false,
  addressConfirmed: false,
  contactPermission: false,
  handoverCompleted: false,
  reviewRequested: false,
  issueOpen: false,
  compatibilityChecked: false,
  priceConfirmed: false,
  termsConfirmed: false,
})

export function initialFlowState(path: FlowPath): FlowState {
  const stageByPath: Record<FlowPath, string> = {
    new: 'N0', delivery: 'D0', pickup: 'P0', 'after-purchase': 'AFTER',
  }
  return { path, stage: stageByPath[path], audience: 'buyer', fields: {}, flags: emptyFlags() }
}

const clearFlags = (state: FlowState, ...names: (keyof FlowFlags)[]) => {
  const flags = { ...state.flags }
  for (const name of names) flags[name] = false
  return flags
}

export function transition(state: FlowState, event: FlowEvent): FlowState {
  if (event.type === 'set-field') {
    if (state.fields[event.field] === event.value) return state
    const fields = { ...state.fields, [event.field]: event.value }
    let flags = state.flags
    if (event.field === 'product' || event.field === 'variant') {
      flags = clearFlags(state, 'stockConfirmed', 'deliveryAvailable', 'orderVerified', 'shippedVerified', 'receivedVerified', 'compatibilityChecked', 'handoverConfirmed', 'meetingConfirmed', 'addressConfirmed', 'contactPermission', 'handoverCompleted')
    } else if (event.field === 'date' || event.field === 'time') {
      flags = clearFlags(state, 'handoverConfirmed', 'meetingConfirmed', 'handoverCompleted')
    } else if (event.field === 'address') {
      flags = clearFlags(state, 'addressConfirmed', 'meetingConfirmed')
    } else if (event.field === 'handoverName' || event.field === 'handoverPhone') {
      flags = clearFlags(state, 'handoverConfirmed', 'contactPermission', 'meetingConfirmed')
    }
    return { ...state, fields, flags }
  }

  if (event.type === 'confirm') {
    if (event.value && !canSetFlag(state, event.flag)) return state
    return { ...state, flags: { ...state.flags, [event.flag]: event.value } }
  }

  if (event.type === 'set-audience') return { ...state, audience: event.audience }
  if (event.type === 'set-stage') return { ...state, stage: event.stage }

  if (event.type === 'mark-review-requested') {
    if (!state.flags.reviewRequested && canRecommendReview(state)) {
      return { ...state, flags: { ...state.flags, reviewRequested: true } }
    }
  }
  return state
}

export function canRecommendReview(state: FlowState): boolean {
  const postPurchaseVerified = state.path === 'pickup'
    ? state.flags.handoverCompleted
    : state.flags.receivedVerified
  return postPurchaseVerified && !state.flags.issueOpen && !state.flags.reviewRequested
}

function canSetFlag(state: FlowState, flag: keyof FlowFlags): boolean {
  switch (flag) {
    case 'stockConfirmed': return Boolean(state.fields.product?.trim())
    case 'deliveryAvailable': return state.path === 'delivery' && state.flags.stockConfirmed
    case 'orderVerified': return state.path === 'delivery' && state.flags.stockConfirmed && state.flags.deliveryAvailable
    case 'shippedVerified': return state.path === 'delivery' && state.flags.orderVerified
    case 'receivedVerified': return state.path === 'delivery' && state.flags.shippedVerified
    case 'handoverConfirmed':
      return state.path === 'pickup' && state.flags.stockConfirmed && Boolean(state.fields.product?.trim() && state.fields.date?.trim() && state.fields.time?.trim())
    case 'meetingConfirmed':
      return state.path === 'pickup' && state.flags.stockConfirmed && state.flags.handoverConfirmed && Boolean(state.fields.product?.trim() && state.fields.date?.trim() && state.fields.time?.trim())
    case 'addressConfirmed': return Boolean(state.fields.address?.trim())
    case 'contactPermission': return Boolean(state.fields.handoverPhone?.trim())
    case 'handoverCompleted': return state.path === 'pickup' && state.flags.meetingConfirmed && state.flags.handoverConfirmed
    default: return true
  }
}

export function canUseTemplate(template: Template, state: FlowState): GuardResult {
  const reasons: string[] = []
  if (template.audience !== state.audience) {
    reasons.push(template.audience === 'handover' ? 'Переключите аудиторию на «Человеку на точке».' : 'Этот текст предназначен покупателю.')
  }

  for (const guard of template.guardFlags) {
    let passed: boolean
    switch (guard) {
      case 'noIssueOpen': passed = !state.flags.issueOpen; break
      case 'reviewNotRequested': passed = !state.flags.reviewRequested; break
      case 'handoverContext': passed = state.path === 'pickup' && state.audience === 'handover'; break
      case 'receivedVerified': passed = state.path === 'pickup' ? state.flags.handoverCompleted : state.flags.receivedVerified; break
      default: passed = state.flags[guard]
    }
    if (!passed) reasons.push(reasonForGuard(guard))
  }

  for (const field of template.requiredFields) {
    if (!state.fields[field]?.trim()) reasons.push(`Заполните поле «${fieldLabel(field)}».`)
  }

  return { allowed: reasons.length === 0, reasons }
}

function reasonForGuard(flag: string): string {
  const reasons: Record<string, string> = {
    stockConfirmed: 'Сначала подтвердите наличие именно этого товара.',
    deliveryAvailable: 'Проверьте, доступна ли Авито Доставка в объявлении.',
    orderVerified: 'Сначала проверьте заказ в Авито.',
    shippedVerified: 'Сначала проверьте, что заказ передан в доставку.',
    receivedVerified: 'Сначала проверьте, что покупатель получил заказ.',
    handoverConfirmed: 'Получите подтверждение человека на точке.',
    meetingConfirmed: 'Сверьте товар, дату и время встречи.',
    addressConfirmed: 'Уточните адрес и отметьте его как проверенный.',
    contactPermission: 'Убедитесь, что человек разрешил передать контакт.',
    handoverCompleted: 'Отметьте фактическую передачу товара.',
    reviewRequested: 'Просьба об отзыве для этого сценария уже отмечена.',
    issueOpen: 'Сначала разберитесь с проблемой покупателя.',
    compatibilityChecked: 'Проверьте совместимость конкретной модели.',
    priceConfirmed: 'Сверьте цену или скидку перед отправкой.',
    termsConfirmed: 'Сверьте условия гарантии или возврата.',
    noIssueOpen: 'Сначала разберитесь с проблемой покупателя.',
    reviewNotRequested: 'Просьба об отзыве для этого сценария уже отмечена.',
    handoverContext: 'Переключитесь на внутреннее сообщение человеку на точке.',
  }
  return reasons[flag] ?? 'Проверьте условия этого ответа.'
}

function fieldLabel(field: string): string {
  const labels: Record<string, string> = {
    product: 'товар', variant: 'вариант', date: 'дату', time: 'время', address: 'адрес',
    handoverName: 'имя выдающего', handoverPhone: 'телефон выдающего', price: 'цену',
  }
  return labels[field] ?? field
}

export function audienceForPath(path: FlowPath, audience: Audience): boolean {
  return path === 'pickup' || audience === 'buyer'
}
