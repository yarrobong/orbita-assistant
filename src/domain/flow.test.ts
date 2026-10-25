import { describe, expect, it } from 'vitest'
import { canUseTemplate, initialFlowState, transition } from './flow'
import type { Template } from './types'

const pickupConfirmation: Template = {
  id: 'pickup.confirmed', title: 'Самовывоз подтверждён', category: 'pickup', stage: 'P4',
  audience: 'buyer', body: 'Самовывоз согласовали {{date}} в {{time}}. Адрес: {{address}}. Выдаст {{handoverName}}, {{handoverPhone}}.',
  tags: ['самовывоз'], requiredFields: ['date', 'time', 'address', 'handoverName', 'handoverPhone'],
  guardFlags: ['stockConfirmed', 'handoverConfirmed', 'meetingConfirmed', 'addressConfirmed', 'contactPermission'],
  checklist: [], defaultPriority: 1, revision: 1, source: 'Сценарии сделок', usage: 'После подтверждения выдачи',
}

const reviewTemplate: Template = {
  id: 'delivery.review', title: 'Попросить отзыв', category: 'after-purchase', stage: 'D7',
  audience: 'buyer', body: 'Будем благодарны за честный отзыв.', tags: ['отзыв'], requiredFields: [],
  guardFlags: ['receivedVerified', 'noIssueOpen', 'reviewNotRequested'], checklist: [], defaultPriority: 1, revision: 1,
  source: 'Сценарии сделок', usage: 'Только после получения',
}

function markDeliveryReceived() {
  let state = initialFlowState('delivery')
  state = transition(state, { type: 'set-field', field: 'product', value: 'Геймпад' })
  state = transition(state, { type: 'confirm', flag: 'stockConfirmed', value: true })
  state = transition(state, { type: 'confirm', flag: 'deliveryAvailable', value: true })
  state = transition(state, { type: 'confirm', flag: 'orderVerified', value: true })
  state = transition(state, { type: 'confirm', flag: 'shippedVerified', value: true })
  state = transition(state, { type: 'confirm', flag: 'arrivedVerified', value: true })
  return transition(state, { type: 'confirm', flag: 'receivedVerified', value: true })
}

describe('guarded scenario state', () => {
  it('keeps pickup confirmation unavailable until every handover check is set', () => {
    let state = initialFlowState('pickup')
    state = transition(state, { type: 'set-field', field: 'product', value: 'Ремешок Quest' })
    state = transition(state, { type: 'set-field', field: 'date', value: '30 октября' })
    state = transition(state, { type: 'set-field', field: 'time', value: '17:00' })
    state = transition(state, { type: 'set-field', field: 'address', value: 'Локальный адрес' })
    state = transition(state, { type: 'set-field', field: 'handoverName', value: 'Анна' })
    state = transition(state, { type: 'set-field', field: 'handoverPhone', value: '+7 900 000-00-00' })
    for (const flag of ['stockConfirmed', 'handoverConfirmed', 'meetingConfirmed', 'addressConfirmed', 'contactPermission'] as const) {
      expect(canUseTemplate(pickupConfirmation, state).allowed).toBe(false)
      state = transition(state, { type: 'confirm', flag, value: true })
    }
    expect(canUseTemplate(pickupConfirmation, state)).toEqual({ allowed: true, reasons: [] })
  })

  it('invalidates handover and slot approval when date or time changes', () => {
    let state = initialFlowState('pickup')
    state = transition(state, { type: 'set-field', field: 'product', value: 'Ремешок' })
    state = transition(state, { type: 'set-field', field: 'date', value: '30 октября' })
    state = transition(state, { type: 'set-field', field: 'time', value: '17:00' })
    state = transition(state, { type: 'confirm', flag: 'stockConfirmed', value: true })
    state = transition(state, { type: 'confirm', flag: 'handoverConfirmed', value: true })
    state = transition(state, { type: 'confirm', flag: 'meetingConfirmed', value: true })
    state = transition(state, { type: 'set-field', field: 'date', value: '31 октября' })
    expect(state.flags.handoverConfirmed).toBe(false)
    expect(state.flags.meetingConfirmed).toBe(false)
    expect(state.flags.stockConfirmed).toBe(true)
  })

  it('allows a review only after verified receipt and with no open issue', () => {
    let state = initialFlowState('delivery')
    expect(canUseTemplate(reviewTemplate, state).allowed).toBe(false)
    state = markDeliveryReceived()
    expect(canUseTemplate(reviewTemplate, state).allowed).toBe(true)
    state = transition(state, { type: 'confirm', flag: 'issueOpen', value: true })
    expect(canUseTemplate(reviewTemplate, state).allowed).toBe(false)
  })

  it('requires completed handover, not a delivery receipt flag, for pickup review', () => {
    let state = initialFlowState('pickup')
    state = transition(state, { type: 'confirm', flag: 'receivedVerified', value: true })
    expect(canUseTemplate(reviewTemplate, state).allowed).toBe(false)
    state = transition(state, { type: 'set-field', field: 'product', value: 'Ремешок' })
    state = transition(state, { type: 'set-field', field: 'date', value: '30 октября' })
    state = transition(state, { type: 'set-field', field: 'time', value: '17:00' })
    state = transition(state, { type: 'set-field', field: 'address', value: 'Адрес выдачи' })
    state = transition(state, { type: 'set-field', field: 'handoverPhone', value: '+7 900 000-00-00' })
    state = transition(state, { type: 'confirm', flag: 'stockConfirmed', value: true })
    state = transition(state, { type: 'confirm', flag: 'handoverConfirmed', value: true })
    state = transition(state, { type: 'confirm', flag: 'meetingConfirmed', value: true })
    state = transition(state, { type: 'confirm', flag: 'addressConfirmed', value: true })
    state = transition(state, { type: 'confirm', flag: 'contactPermission', value: true })
    state = transition(state, { type: 'confirm', flag: 'handoverCompleted', value: true })
    expect(canUseTemplate(reviewTemplate, state).allowed).toBe(true)
  })

  it('requires verified order and shipment before delivery receipt can be marked', () => {
    let state = initialFlowState('delivery')
    state = transition(state, { type: 'set-field', field: 'product', value: 'Геймпад' })
    state = transition(state, { type: 'confirm', flag: 'stockConfirmed', value: true })
    state = transition(state, { type: 'confirm', flag: 'deliveryAvailable', value: true })
    state = transition(state, { type: 'confirm', flag: 'shippedVerified', value: true })
    state = transition(state, { type: 'confirm', flag: 'receivedVerified', value: true })
    expect(state.flags.shippedVerified).toBe(false)
    expect(state.flags.receivedVerified).toBe(false)
    state = transition(state, { type: 'confirm', flag: 'orderVerified', value: true })
    state = transition(state, { type: 'confirm', flag: 'shippedVerified', value: true })
    state = transition(state, { type: 'confirm', flag: 'arrivedVerified', value: true })
    state = transition(state, { type: 'confirm', flag: 'receivedVerified', value: true })
    expect(state.flags.receivedVerified).toBe(true)
  })

  it('does not mark handover availability until stock and a concrete slot are confirmed', () => {
    let state = initialFlowState('pickup')
    state = transition(state, { type: 'confirm', flag: 'handoverConfirmed', value: true })
    expect(state.flags.handoverConfirmed).toBe(false)
    state = transition(state, { type: 'set-field', field: 'product', value: 'Геймпад' })
    state = transition(state, { type: 'set-field', field: 'date', value: '30 октября' })
    state = transition(state, { type: 'set-field', field: 'time', value: '17:00' })
    state = transition(state, { type: 'confirm', flag: 'stockConfirmed', value: true })
    state = transition(state, { type: 'confirm', flag: 'handoverConfirmed', value: true })
    expect(state.flags.handoverConfirmed).toBe(true)
  })

  it('keeps stage P4 locked until product, time, handover, address and contact checks all match', () => {
    let state = initialFlowState('pickup')
    state = transition(state, { type: 'set-stage', stage: 'P4' })
    expect(state.stage).toBe('P0')
    state = transition(state, { type: 'set-field', field: 'product', value: 'Ремешок' })
    state = transition(state, { type: 'set-field', field: 'date', value: '30 октября' })
    state = transition(state, { type: 'set-field', field: 'time', value: '17:00' })
    state = transition(state, { type: 'set-field', field: 'address', value: 'Адрес на устройстве' })
    state = transition(state, { type: 'set-field', field: 'handoverName', value: 'Локально' })
    state = transition(state, { type: 'set-field', field: 'handoverPhone', value: '+7 900 000-00-00' })
    for (const flag of ['stockConfirmed', 'handoverConfirmed', 'meetingConfirmed', 'addressConfirmed', 'contactPermission'] as const) {
      state = transition(state, { type: 'confirm', flag, value: true })
    }
    state = transition(state, { type: 'set-stage', stage: 'P4' })
    expect(state.stage).toBe('P4')
  })

  it('requires verified arrival and receipt before delivery reaches D6 or D7', () => {
    let state = initialFlowState('delivery')
    state = transition(state, { type: 'set-stage', stage: 'D6' })
    expect(state.stage).toBe('D0')
    state = transition(state, { type: 'set-field', field: 'product', value: 'Геймпад' })
    for (const flag of ['stockConfirmed', 'deliveryAvailable', 'orderVerified', 'shippedVerified', 'arrivedVerified', 'receivedVerified'] as const) {
      state = transition(state, { type: 'confirm', flag, value: true })
    }
    state = transition(state, { type: 'set-stage', stage: 'D7' })
    expect(state.stage).toBe('D7')
  })

  it('resets stock and handover checks when the product changes', () => {
    let state = initialFlowState('pickup')
    state = transition(state, { type: 'set-field', field: 'product', value: 'Ремешок' })
    state = transition(state, { type: 'confirm', flag: 'stockConfirmed', value: true })
    state = transition(state, { type: 'confirm', flag: 'handoverConfirmed', value: true })
    state = transition(state, { type: 'set-field', field: 'product', value: 'Другой товар' })
    expect(state.flags.stockConfirmed).toBe(false)
    expect(state.flags.handoverConfirmed).toBe(false)
    expect(state.fields.product).toBe('Другой товар')
  })

  it('distinguishes a checked in-stock item from an unchecked or unavailable item', () => {
    const available: Template = { ...pickupConfirmation, guardFlags: ['stockConfirmed', 'stockAvailable'], requiredFields: [] }
    const unavailable: Template = { ...pickupConfirmation, guardFlags: ['stockConfirmed', 'stockUnavailable'], requiredFields: [] }
    let state = initialFlowState('new')
    state = transition(state, { type: 'set-field', field: 'product', value: 'Геймпад' })
    expect(canUseTemplate(available, state).allowed).toBe(false)
    state = transition(state, { type: 'set-field', field: 'stockStatus', value: 'available' })
    expect(canUseTemplate(available, state).allowed).toBe(false)
    state = transition(state, { type: 'confirm', flag: 'stockConfirmed', value: true })
    expect(canUseTemplate(available, state).allowed).toBe(true)
    expect(canUseTemplate(unavailable, state).allowed).toBe(false)
    state = transition(state, { type: 'set-field', field: 'stockStatus', value: 'unavailable' })
    expect(state.flags.stockConfirmed).toBe(false)
    expect(canUseTemplate(unavailable, state).allowed).toBe(false)
  })

  it('keeps internal handover copy unavailable in the buyer audience', () => {
    const internal: Template = {
      ...pickupConfirmation, id: 'pickup.ask-handover', title: 'Согласовать с человеком на точке',
      audience: 'handover', requiredFields: [], guardFlags: ['handoverContext'],
    }
    let state = initialFlowState('pickup')
    expect(canUseTemplate(internal, state).allowed).toBe(false)
    state = transition(state, { type: 'set-audience', audience: 'handover' })
    expect(canUseTemplate(internal, state).allowed).toBe(true)
  })

  it('marks a review as requested at most once and prevents a second copy', () => {
    let state = markDeliveryReceived()
    state = transition(state, { type: 'mark-review-requested' })
    expect(state.flags.reviewRequested).toBe(true)
    expect(canUseTemplate(reviewTemplate, state).allowed).toBe(false)
  })

  it('does not mark a review request sent while a problem is open', () => {
    let state = markDeliveryReceived()
    state = transition(state, { type: 'confirm', flag: 'issueOpen', value: true })
    state = transition(state, { type: 'mark-review-requested' })
    expect(state.flags.reviewRequested).toBe(false)
  })
})
