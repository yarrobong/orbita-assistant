import { describe, expect, it } from 'vitest'
import { canUseTemplate, initialFlowState, transition } from './flow'
import { templateCatalog } from '../data/templates'
import type { FlagName, Template } from './types'

const pickupConfirmation: Template = {
  id: 'pickup.confirmed', title: 'Самовывоз подтверждён', category: 'pickup', stage: 'P4',
  audience: 'buyer', body: 'Самовывоз согласовали {{date}} в {{time}}. Адрес: {{address}}. Выдаст {{handoverName}}, {{handoverPhone}}.',
  tags: ['самовывоз'], requiredFields: ['date', 'time', 'address', 'handoverName', 'handoverPhone'],
  guardFlags: ['stockConfirmed', 'handoverConfirmed', 'buyerMessagePrepared', 'addressConfirmed', 'contactPermission'],
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
  it.each(Array.from({ length: 10 }, (_, index) => `D${index}`))('opens delivery situation %s from a fresh state', (stage) => {
    const state = transition(initialFlowState('delivery'), { type: 'set-stage', stage })
    expect(state.stage).toBe(stage)
  })

  it.each(Array.from({ length: 9 }, (_, index) => `P${index}`))('opens pickup situation %s from a fresh state', (stage) => {
    const state = transition(initialFlowState('pickup'), { type: 'set-stage', stage })
    expect(state.stage).toBe(stage)
  })

  it('treats a selected factual template as intent without a second confirmation', () => {
    const shipped = templateCatalog.find(({ id }) => id === 'top-05')!
    expect(canUseTemplate(shipped, initialFlowState('delivery'))).toEqual({ allowed: true, reasons: [] })
  })

  it('keeps internal handover messages unavailable until the internal audience is selected', () => {
    const internal = templateCatalog.find(({ id }) => id === 'scenario-14')!
    expect(canUseTemplate(internal, initialFlowState('pickup')).allowed).toBe(false)
    const selected = transition(initialFlowState('pickup'), { type: 'set-stage', stage: 'P2' })
    expect(selected.audience).toBe('handover')
    expect(canUseTemplate(internal, selected).allowed).toBe(true)
  })

  it('prepares the internal handover request without a prior stock confirmation', () => {
    const template = templateCatalog.find(({ id }) => id === 'scenario-14')!
    let state = initialFlowState('pickup')
    state = transition(state, { type: 'set-audience', audience: 'handover' })
    state = transition(state, { type: 'set-field', field: 'product', value: 'Ремешок Quest' })
    state = transition(state, { type: 'set-field', field: 'date', value: '30 октября' })
    state = transition(state, { type: 'set-field', field: 'time', value: '17:00' })

    expect(state.flags.stockConfirmed).toBe(false)
    expect(canUseTemplate(template, state)).toEqual({ allowed: true, reasons: [] })
  })

  it.each(['scenario-17', 'top-10'])('prepares buyer confirmation before the buyer is notified (%s)', (id) => {
    const template = templateCatalog.find((candidate) => candidate.id === id)!
    let state = initialFlowState('pickup')
    for (const [field, value] of Object.entries({ product: 'Ремешок Quest', date: '30 октября', time: '17:00', address: 'Локальный адрес', handoverName: 'Анна', handoverPhone: '+7 900 000-00-00' })) {
      state = transition(state, { type: 'set-field', field, value })
    }
    for (const flag of ['stockConfirmed', 'handoverConfirmed', 'addressConfirmed', 'contactPermission'] as const) {
      state = transition(state, { type: 'confirm', flag, value: true })
    }

    expect(state.flags).toHaveProperty('buyerNotified', false)
    expect(canUseTemplate(template, state)).toEqual({ allowed: true, reasons: [] })
  })

  it('separates preparing a buyer message from marking that buyer as notified', () => {
    let state = initialFlowState('pickup')
    const confirm = (flag: FlagName) => { state = transition(state, { type: 'confirm', flag, value: true }) }
    state = transition(state, { type: 'set-field', field: 'product', value: 'Ремешок Quest' })
    state = transition(state, { type: 'set-field', field: 'date', value: '30 октября' })
    state = transition(state, { type: 'set-field', field: 'time', value: '17:00' })
    state = transition(state, { type: 'set-field', field: 'address', value: 'Локальный адрес' })
    state = transition(state, { type: 'set-field', field: 'handoverName', value: 'Анна' })
    state = transition(state, { type: 'set-field', field: 'handoverPhone', value: '+7 900 000-00-00' })
    confirm('stockConfirmed')
    confirm('handoverConfirmed')
    confirm('addressConfirmed')
    confirm('contactPermission')
    state = transition(state, { type: 'confirm', flag: 'buyerNotified' as FlagName, value: true })
    expect(state.flags).toHaveProperty('buyerNotified', false)

    confirm('buyerMessagePrepared' as FlagName)
    confirm('buyerNotified' as FlagName)
    expect(state.flags).toHaveProperty('buyerMessagePrepared', true)
    expect(state.flags).toHaveProperty('buyerNotified', true)
    expect(state.flags.handoverCompleted).toBe(false)
  })

  it('allows an independently verified delivery status without forcing prior stages', () => {
    let state = initialFlowState('delivery')
    state = transition(state, { type: 'set-field', field: 'product', value: 'Геймпад' })
    state = transition(state, { type: 'confirm', flag: 'arrivedVerified', value: true })

    expect(state.flags.arrivedVerified).toBe(true)
    expect(state.flags.orderVerified).toBe(false)
    expect(state.flags.shippedVerified).toBe(false)
  })

  it('starts a new deal with empty fields and no confirmations or buyer notification', () => {
    const previous = initialFlowState('pickup')
    const nextDeal = initialFlowState('pickup')

    expect(nextDeal.fields).toEqual({})
    expect(nextDeal.flags).toEqual(previous.flags)
    expect(nextDeal.flags).toHaveProperty('buyerNotified', false)
  })

  it('keeps the selected pickup message available without operational checkboxes', () => {
    let state = initialFlowState('pickup')
    state = transition(state, { type: 'set-field', field: 'product', value: 'Ремешок Quest' })
    state = transition(state, { type: 'set-field', field: 'date', value: '30 октября' })
    state = transition(state, { type: 'set-field', field: 'time', value: '17:00' })
    state = transition(state, { type: 'set-field', field: 'address', value: 'Локальный адрес' })
    state = transition(state, { type: 'set-field', field: 'handoverName', value: 'Анна' })
    state = transition(state, { type: 'set-field', field: 'handoverPhone', value: '+7 900 000-00-00' })
    for (const flag of ['stockConfirmed', 'handoverConfirmed', 'addressConfirmed', 'contactPermission'] as const) {
      expect(canUseTemplate(pickupConfirmation, state).allowed).toBe(true)
      state = transition(state, { type: 'confirm', flag, value: true })
    }
    state = transition(state, { type: 'confirm', flag: 'buyerMessagePrepared' as FlagName, value: true })
    expect(canUseTemplate(pickupConfirmation, state)).toEqual({ allowed: true, reasons: [] })
  })

  it('invalidates handover and slot approval when date or time changes', () => {
    let state = initialFlowState('pickup')
    state = transition(state, { type: 'set-field', field: 'product', value: 'Ремешок' })
    state = transition(state, { type: 'set-field', field: 'date', value: '30 октября' })
    state = transition(state, { type: 'set-field', field: 'time', value: '17:00' })
    state = transition(state, { type: 'confirm', flag: 'stockConfirmed', value: true })
    state = transition(state, { type: 'confirm', flag: 'handoverConfirmed', value: true })
    state = transition(state, { type: 'set-field', field: 'address', value: 'Адрес' })
    state = transition(state, { type: 'set-field', field: 'handoverName', value: 'Анна' })
    state = transition(state, { type: 'set-field', field: 'handoverPhone', value: '+7 900 000-00-00' })
    state = transition(state, { type: 'confirm', flag: 'addressConfirmed', value: true })
    state = transition(state, { type: 'confirm', flag: 'contactPermission', value: true })
    state = transition(state, { type: 'confirm', flag: 'buyerMessagePrepared' as FlagName, value: true })
    state = transition(state, { type: 'confirm', flag: 'buyerNotified' as FlagName, value: true })
    state = transition(state, { type: 'set-field', field: 'date', value: '31 октября' })
    expect(state.flags.handoverConfirmed).toBe(false)
    expect(state.flags).toHaveProperty('buyerMessagePrepared', false)
    expect(state.flags).toHaveProperty('buyerNotified', false)
    expect(state.flags.stockConfirmed).toBe(true)
  })

  it('keeps review messages accessible before receipt and while an issue is open', () => {
    let state = initialFlowState('delivery')
    expect(canUseTemplate(reviewTemplate, state).allowed).toBe(true)
    state = markDeliveryReceived()
    expect(canUseTemplate(reviewTemplate, state).allowed).toBe(true)
    state = transition(state, { type: 'confirm', flag: 'issueOpen', value: true })
    expect(canUseTemplate(reviewTemplate, state).allowed).toBe(true)
  })

  it('opens pickup review from a fresh state without completing the handover funnel', () => {
    let state = initialFlowState('pickup')
    state = transition(state, { type: 'confirm', flag: 'receivedVerified', value: true })
    expect(canUseTemplate(reviewTemplate, state).allowed).toBe(true)
    state = transition(state, { type: 'set-field', field: 'product', value: 'Ремешок' })
    state = transition(state, { type: 'set-field', field: 'date', value: '30 октября' })
    state = transition(state, { type: 'set-field', field: 'time', value: '17:00' })
    state = transition(state, { type: 'set-field', field: 'address', value: 'Адрес выдачи' })
    state = transition(state, { type: 'set-field', field: 'handoverName', value: 'Мария' })
    state = transition(state, { type: 'set-field', field: 'handoverPhone', value: '+7 900 000-00-00' })
    state = transition(state, { type: 'confirm', flag: 'stockConfirmed', value: true })
    state = transition(state, { type: 'confirm', flag: 'handoverConfirmed', value: true })
    state = transition(state, { type: 'confirm', flag: 'addressConfirmed', value: true })
    state = transition(state, { type: 'confirm', flag: 'contactPermission', value: true })
    state = transition(state, { type: 'confirm', flag: 'buyerMessagePrepared' as FlagName, value: true })
    state = transition(state, { type: 'confirm', flag: 'buyerNotified' as FlagName, value: true })
    state = transition(state, { type: 'confirm', flag: 'handoverCompleted', value: true })
    expect(canUseTemplate(reviewTemplate, state).allowed).toBe(true)
  })

  it('allows delivery status checks without forcing earlier stages', () => {
    let state = initialFlowState('delivery')
    state = transition(state, { type: 'set-field', field: 'product', value: 'Геймпад' })
    state = transition(state, { type: 'confirm', flag: 'arrivedVerified', value: true })
    state = transition(state, { type: 'confirm', flag: 'shippedVerified', value: true })
    state = transition(state, { type: 'confirm', flag: 'receivedVerified', value: true })
    expect(state.flags.orderVerified).toBe(false)
    expect(state.flags.deliveryAvailable).toBe(false)
    expect(state.flags.shippedVerified).toBe(true)
    expect(state.flags.arrivedVerified).toBe(true)
    expect(state.flags.receivedVerified).toBe(true)
  })

  it('does not mark handover availability until stock and a concrete slot are confirmed', () => {
    let state = initialFlowState('pickup')
    state = transition(state, { type: 'confirm', flag: 'handoverConfirmed', value: true })
    expect(state.flags.handoverConfirmed).toBe(false)
    state = transition(state, { type: 'set-field', field: 'product', value: 'Геймпад' })
    state = transition(state, { type: 'set-field', field: 'date', value: '30 октября' })
    state = transition(state, { type: 'set-field', field: 'time', value: '17:00' })
    state = transition(state, { type: 'set-field', field: 'handoverName', value: 'Мария' })
    state = transition(state, { type: 'confirm', flag: 'stockConfirmed', value: true })
    state = transition(state, { type: 'confirm', flag: 'handoverConfirmed', value: true })
    expect(state.flags.handoverConfirmed).toBe(true)
  })

  it('requires the named handover person before confirming a pickup slot', () => {
    let state = initialFlowState('pickup')
    for (const [field, value] of Object.entries({ product: 'Геймпад', date: '30 октября', time: '17:00' })) {
      state = transition(state, { type: 'set-field', field, value })
    }
    state = transition(state, { type: 'confirm', flag: 'stockConfirmed', value: true })
    state = transition(state, { type: 'confirm', flag: 'handoverConfirmed', value: true })
    expect(state.flags.handoverConfirmed).toBe(false)
    state = transition(state, { type: 'set-field', field: 'handoverName', value: 'Мария' })
    state = transition(state, { type: 'confirm', flag: 'handoverConfirmed', value: true })
    expect(state.flags.handoverConfirmed).toBe(true)
  })

  it('requires both handover name and phone before confirming permission to share the contact', () => {
    let state = initialFlowState('pickup')
    state = transition(state, { type: 'set-field', field: 'handoverPhone', value: '+7 900 000-00-00' })
    state = transition(state, { type: 'confirm', flag: 'contactPermission', value: true })
    expect(state.flags.contactPermission).toBe(false)
    state = transition(state, { type: 'set-field', field: 'handoverName', value: 'Мария' })
    state = transition(state, { type: 'confirm', flag: 'contactPermission', value: true })
    expect(state.flags.contactPermission).toBe(true)
  })

  it('opens pickup confirmation stage directly from a fresh state', () => {
    let state = initialFlowState('pickup')
    state = transition(state, { type: 'set-stage', stage: 'P4' })
    expect(state.stage).toBe('P4')
    state = transition(state, { type: 'set-field', field: 'product', value: 'Ремешок' })
    state = transition(state, { type: 'set-field', field: 'date', value: '30 октября' })
    state = transition(state, { type: 'set-field', field: 'time', value: '17:00' })
    state = transition(state, { type: 'set-field', field: 'address', value: 'Адрес на устройстве' })
    state = transition(state, { type: 'set-field', field: 'handoverName', value: 'Локально' })
    state = transition(state, { type: 'set-field', field: 'handoverPhone', value: '+7 900 000-00-00' })
    for (const flag of ['stockConfirmed', 'handoverConfirmed', 'addressConfirmed', 'contactPermission'] as const) {
      state = transition(state, { type: 'confirm', flag, value: true })
    }
    state = transition(state, { type: 'confirm', flag: 'buyerMessagePrepared' as FlagName, value: true })
    state = transition(state, { type: 'set-stage', stage: 'P4' })
    expect(state.stage).toBe('P4')
  })

  it('allows selecting an independent delivery situation without asserting its status', () => {
    let state = initialFlowState('delivery')
    state = transition(state, { type: 'set-stage', stage: 'D6' })
    expect(state.stage).toBe('D6')
    expect(state.flags.receivedVerified).toBe(false)
    state = transition(state, { type: 'set-field', field: 'product', value: 'Геймпад' })
    state = transition(state, { type: 'confirm', flag: 'receivedVerified', value: true })
    expect(state.flags.receivedVerified).toBe(true)
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

  it('does not gate a selected stock response on informational stock flags', () => {
    const available: Template = { ...pickupConfirmation, guardFlags: ['stockConfirmed', 'stockAvailable'], requiredFields: [] }
    const unavailable: Template = { ...pickupConfirmation, guardFlags: ['stockConfirmed', 'stockUnavailable'], requiredFields: [] }
    let state = initialFlowState('new')
    state = transition(state, { type: 'set-field', field: 'product', value: 'Геймпад' })
    expect(canUseTemplate(available, state).allowed).toBe(true)
    state = transition(state, { type: 'set-field', field: 'stockStatus', value: 'available' })
    expect(canUseTemplate(available, state).allowed).toBe(true)
    state = transition(state, { type: 'confirm', flag: 'stockConfirmed', value: true })
    expect(canUseTemplate(available, state).allowed).toBe(true)
    expect(canUseTemplate(unavailable, state).allowed).toBe(true)
    state = transition(state, { type: 'set-field', field: 'stockStatus', value: 'unavailable' })
    expect(state.flags.stockConfirmed).toBe(false)
    expect(canUseTemplate(unavailable, state).allowed).toBe(true)
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

  it('records the optional review marker without hiding the review template', () => {
    let state = markDeliveryReceived()
    state = transition(state, { type: 'mark-review-requested' })
    expect(state.flags.reviewRequested).toBe(true)
    expect(canUseTemplate(reviewTemplate, state).allowed).toBe(true)
  })

  it('keeps review available when there is a problem so the UI can show issue-first guidance', () => {
    let state = markDeliveryReceived()
    state = transition(state, { type: 'confirm', flag: 'issueOpen', value: true })
    state = transition(state, { type: 'mark-review-requested' })
    expect(state.flags.reviewRequested).toBe(true)
    expect(canUseTemplate(reviewTemplate, state).allowed).toBe(true)
  })
})
