import { describe, expect, it } from 'vitest'
import { renderTemplate } from './render-template'
import { templateCatalog } from '../data/templates'
import { searchTemplates } from '../lib/search'
import { canUseTemplate, initialFlowState, transition } from './flow'

describe('source-grounded template catalog', () => {
  it('contains the original base answer set and keeps private pickup details out', () => {
    expect(templateCatalog.filter((item) => item.source === 'Все ответы')).toHaveLength(52)
    expect(templateCatalog.filter((item) => item.source === 'Автоответы — безопасные')).toHaveLength(22)
    expect(templateCatalog.filter((item) => item.source === 'Сценарии сделок')).toHaveLength(29)
    expect(templateCatalog.filter((item) => item.source === 'Топ-15')).toHaveLength(15)
    const publicText = JSON.stringify(templateCatalog)
    expect(publicText).not.toMatch(/\+7\s?\d{3}\s?\d{3}[- ]?\d{2}[- ]?\d{2}/)
    expect(publicText).not.toMatch(/Евгения Савкова,?\s*4/i)
    expect(templateCatalog.filter((item) => item.category === 'delivery').length).toBeGreaterThan(0)
    expect(templateCatalog.filter((item) => item.category === 'pickup').length).toBeGreaterThan(0)
    expect(searchTemplates(templateCatalog, 'самовывоз', 'pickup').length).toBeGreaterThan(0)
  })

  it('keeps a thank-you after a received review separate from a review request', () => {
    const thankYou = templateCatalog.find((item) => item.id === 'scenario-24')!
    const request = templateCatalog.find((item) => item.id === 'scenario-23')!
    expect(thankYou.guardFlags).not.toContain('reviewNotRequested')
    expect(request.guardFlags).toContain('reviewNotRequested')
  })

  it('allows safe intent questions to be copied before their future facts are known', () => {
    for (const id of ['R04', 'R20', 'auto-09', 'top-14', 'top-15']) {
      const template = templateCatalog.find((item) => item.id === id)!
      expect(template.guardFlags).toEqual([])
      expect(canUseTemplate(template, initialFlowState('new')).allowed).toBe(true)
    }
  })

  it('requires verification only for the factual delivery and pickup confirmations', () => {
    const guards = (id: string) => templateCatalog.find((item) => item.id === id)!.guardFlags

    expect(guards('top-05')).toContain('shippedVerified')
    expect(guards('R44')).toContain('arrivedVerified')
    expect(guards('R45')).toContain('receivedVerified')
    expect(guards('scenario-08')).toContain('shippedVerified')
    expect(guards('scenario-09')).toContain('arrivedVerified')
    expect(guards('scenario-11')).toContain('receivedVerified')
    expect(guards('scenario-14')).not.toContain('stockConfirmed')
    expect(guards('scenario-17')).not.toContain('meetingConfirmed')
    expect(guards('top-10')).not.toContain('meetingConfirmed')
    expect(guards('scenario-18')).toContain('buyerNotified')
  })

  it('does not expose in-stock or out-of-stock claims until that exact status is confirmed', () => {
    const available = templateCatalog.find((item) => item.id === 'R01')!
    const unavailable = templateCatalog.find((item) => item.id === 'R07')!
    let state = initialFlowState('new')
    expect(canUseTemplate(available, state).allowed).toBe(false)
    expect(canUseTemplate(unavailable, state).allowed).toBe(false)
    state = transition(state, { type: 'set-field', field: 'product', value: 'Геймпад' })
    state = transition(state, { type: 'set-field', field: 'stockStatus', value: 'available' })
    state = transition(state, { type: 'confirm', flag: 'stockConfirmed', value: true })
    expect(canUseTemplate(available, state).allowed).toBe(true)
    expect(canUseTemplate(unavailable, state).allowed).toBe(false)
  })

  it.each([
    ['авито доставкой', 'Авито Доставка'],
    ['самовывоз', 'Самовывоз'],
    ['отзыв', 'отзыв после доставки'],
    ['quest 3s', 'Quest 3S'],
    ['белый геймпад', 'белые геймпады Xbox'],
  ])('finds %s in a normalized local search', (query, expectedTitlePart) => {
    expect(searchTemplates(templateCatalog, query).some((item) => `${item.title} ${item.body}`.toLowerCase().includes(expectedTitlePart.toLowerCase()))).toBe(true)
  })

  it('does not return an unresolved token in text and blocks copy until required values exist', () => {
    const template = { body: 'Забрать {{product}} {{date}} в {{time}}', requiredFields: ['product', 'date', 'time'] }
    const missing = renderTemplate(template, { product: 'Геймпад' })
    expect(missing.copyable).toBe(false)
    expect(missing.text).not.toMatch(/\{\{.*?\}\}/)
    expect(missing.missing).toEqual(['date', 'time'])
    const complete = renderTemplate(template, { product: 'Геймпад', date: 'завтра', time: '17:00' })
    expect(complete.copyable).toBe(true)
    expect(complete.text).toBe('Забрать Геймпад завтра в 17:00')
  })
})
