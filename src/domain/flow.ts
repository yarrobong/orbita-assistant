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
    new: 'N0', delivery: 'D0', pickup: 'P0', 'after-purchase': 'AFTER_REVIEW',
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
      stage: event.flag === 'issueOpen' ? (event.value ? (state.path === 'after-purchase' ? 'AFTER_ISSUE' : 'DX') : state.path === 'delivery' ? 'D0' : state.path === 'pickup' ? 'P0' : state.path === 'new' ? 'N0' : 'AFTER_REVIEW') : state.stage,
      flags: { ...state.flags, [event.flag]: event.value },
    }
  }

  if (event.type === 'set-audience') return { ...state, audience: event.audience }
  if (event.type === 'set-stage') return canEnterStage(state, event.stage)
    ? { ...state, stage: event.stage, audience: state.path === 'pickup' && ['P2', 'P6'].includes(event.stage) ? 'handover' : 'buyer' }
    : state

  if (event.type === 'mark-review-requested') {
    if (!state.flags.reviewRequested && canRecommendReview(state)) {
      return { ...state, flags: { ...state.flags, reviewRequested: true } }
    }
  }
  return state
}

export function canEnterStage(state: FlowState, target: string): boolean {
  const allowed = state.path === 'delivery'
    ? Array.from({ length: 10 }, (_, index) => `D${index}`)
    : state.path === 'pickup'
      ? Array.from({ length: 9 }, (_, index) => `P${index}`)
      : state.path === 'new'
        ? ['N0', 'N1']
        : ['AFTER', 'AFTER_REVIEW', 'AFTER_ISSUE']
  return allowed.includes(target) || target === 'DX'
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
  return !state.flags.reviewRequested
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
  if (template.guardFlags.includes('handoverContext') && state.path !== 'pickup') {
    reasons.push('Это внутреннее сообщение доступно только в сценарии самовывоза.')
  }

  return { allowed: reasons.length === 0, reasons }
}

export function audienceForPath(path: FlowPath, audience: Audience): boolean {
  return path === 'pickup' || audience === 'buyer'
}
