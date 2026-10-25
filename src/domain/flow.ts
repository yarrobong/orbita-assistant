import type { Audience, FlowEvent, FlowFlags, FlowPath, FlowState, GuardResult, Template } from './types'

export const emptyFlags = (): FlowFlags => ({
  stockConfirmed: false,
  deliveryAvailable: false,
  orderVerified: false,
  shippedVerified: false,
  arrivedVerified: false,
  receivedVerified: false,
  handoverConfirmed: false,
  buyerMessagePrepared: false,
  buyerNotified: false,
  addressConfirmed: false,
  contactPermission: false,
  handoverCompleted: false,
  reviewRequested: false,
  issueOpen: false,
  compatibilityChecked: false,
  variantChecked: false,
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
      flags = clearFlags(state, 'stockConfirmed', 'deliveryAvailable', 'orderVerified', 'shippedVerified', 'arrivedVerified', 'receivedVerified', 'compatibilityChecked', 'variantChecked', 'handoverConfirmed', 'buyerMessagePrepared', 'buyerNotified', 'addressConfirmed', 'contactPermission', 'handoverCompleted')
      delete fields.stockStatus
      if (event.field === 'product') delete fields.variant
    } else if (event.field === 'date' || event.field === 'time') {
      flags = clearFlags(state, 'handoverConfirmed', 'buyerMessagePrepared', 'buyerNotified', 'handoverCompleted')
    } else if (event.field === 'address') {
      flags = clearFlags(state, 'addressConfirmed', 'buyerMessagePrepared', 'buyerNotified')
    } else if (event.field === 'handoverName') {
      flags = clearFlags(state, 'handoverConfirmed', 'contactPermission', 'buyerMessagePrepared', 'buyerNotified')
    } else if (event.field === 'handoverPhone') {
      flags = clearFlags(state, 'contactPermission', 'buyerMessagePrepared', 'buyerNotified')
    } else if (event.field === 'stockStatus') {
      flags = clearFlags(state, 'stockConfirmed', 'handoverConfirmed', 'buyerMessagePrepared', 'buyerNotified')
    }
    return { ...state, fields, flags }
  }

  if (event.type === 'confirm') {
    if (event.value && !canSetFlag(state, event.flag)) return state
    return {
      ...state,
      stage: event.flag === 'issueOpen' ? (event.value ? 'DX' : state.path === 'delivery' ? 'D0' : state.path === 'pickup' ? 'P0' : state.path === 'new' ? 'N0' : 'AFTER') : state.stage,
      flags: { ...state.flags, [event.flag]: event.value },
    }
  }

  if (event.type === 'set-audience') return { ...state, audience: event.audience }
  if (event.type === 'set-stage') return canEnterStage(state, event.stage)
    ? { ...state, stage: event.stage, ...(state.path === 'pickup' && event.stage === 'P4' ? { audience: 'buyer' as const } : {}) }
    : state

  if (event.type === 'mark-review-requested') {
    if (!state.flags.reviewRequested && canRecommendReview(state)) {
      return { ...state, flags: { ...state.flags, reviewRequested: true } }
    }
  }
  return state
}

export function canEnterStage(state: FlowState, target: string): boolean {
  if (target === 'DX') return true
  const prefix = state.path === 'delivery' ? 'D' : state.path === 'pickup' ? 'P' : state.path === 'new' ? 'N' : 'AFTER'
  if (!target.startsWith(prefix)) return false
  const currentRank = Number(state.stage.slice(prefix.length))
  const targetRank = Number(target.slice(prefix.length))
  if (Number.isInteger(currentRank) && Number.isInteger(targetRank) && targetRank <= currentRank) return true
  if (state.path === 'delivery') {
    return /^D[0-7]$/u.test(target)
  }
  if (state.path === 'pickup') {
    switch (target) {
      case 'P1': return true
      case 'P2':
      case 'P3': return pickupSlotReady(state)
      case 'P4': return pickupHandoverReady(state)
      case 'P5': return state.flags.buyerNotified
      case 'P6': return state.flags.buyerNotified
      case 'P7': return canRecommendReview(state)
    }
  }
  return state.path === 'new' ? target === 'N1' : target === 'AFTER'
}

export function pickupSlotReady(state: FlowState): boolean {
  return state.path === 'pickup' && Boolean(state.fields.product?.trim() && state.fields.date?.trim() && state.fields.time?.trim())
}

export function pickupHandoverReady(state: FlowState): boolean {
  return pickupSlotReady(state) && state.flags.stockConfirmed && state.flags.handoverConfirmed
}

export function pickupConfirmationReady(state: FlowState): boolean {
  return pickupHandoverReady(state)
    && state.flags.addressConfirmed
    && state.flags.contactPermission
}

export function canRecommendReview(state: FlowState): boolean {
  const postPurchaseVerified = state.path === 'pickup'
    ? state.flags.handoverCompleted
    : state.flags.receivedVerified
  return postPurchaseVerified && !state.flags.issueOpen && !state.flags.reviewRequested
}

function canSetFlag(state: FlowState, flag: keyof FlowFlags): boolean {
  switch (flag) {
    case 'variantChecked': return Boolean(state.fields.variant?.trim())
    case 'stockConfirmed': return Boolean(state.fields.product?.trim())
    case 'deliveryAvailable': return state.path === 'delivery'
    case 'orderVerified':
    case 'shippedVerified':
    case 'arrivedVerified':
    case 'receivedVerified': return (state.path === 'delivery' && Boolean(state.fields.product?.trim())) || (flag === 'receivedVerified' && state.path === 'after-purchase')
    case 'handoverConfirmed':
      return state.path === 'pickup' && state.flags.stockConfirmed && Boolean(state.fields.product?.trim() && state.fields.date?.trim() && state.fields.time?.trim() && state.fields.handoverName?.trim())
    case 'buyerMessagePrepared': return pickupConfirmationReady(state)
    case 'buyerNotified': return pickupConfirmationReady(state) && state.flags.buyerMessagePrepared
    case 'addressConfirmed': return state.path === 'pickup' && Boolean(state.fields.address?.trim())
    case 'contactPermission': return state.path === 'pickup' && Boolean(state.fields.handoverName?.trim() && state.fields.handoverPhone?.trim())
    case 'handoverCompleted': return pickupConfirmationReady(state) && state.flags.buyerNotified
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
      case 'stockAvailable': passed = state.flags.stockConfirmed && ['available', 'mixed'].includes(state.fields.stockStatus ?? ''); break
      case 'stockUnavailable': passed = state.flags.stockConfirmed && ['unavailable', 'mixed'].includes(state.fields.stockStatus ?? ''); break
      case 'variantChecked': passed = state.flags.variantChecked; break
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
    handoverConfirmed: 'Укажите человека на точке и получите подтверждение товара и времени.',
    buyerMessagePrepared: 'Сначала подготовьте сообщение покупателю после всех проверок.',
    buyerNotified: 'Отметьте сообщение как отправленное покупателю после фактической отправки.',
    addressConfirmed: 'Уточните адрес и отметьте его как проверенный.',
    contactPermission: 'Убедитесь, что человек разрешил передать контакт.',
    handoverCompleted: 'Отметьте фактическую передачу товара.',
    reviewRequested: 'Просьба об отзыве для этого сценария уже отмечена.',
    issueOpen: 'Сначала разберитесь с проблемой покупателя.',
    stockAvailable: 'Отметьте, что нужный вариант точно есть в наличии.',
    stockUnavailable: 'Отметьте, что нужного варианта действительно нет.',
    variantChecked: 'Проверьте остаток именно нужного цвета или варианта.',
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
