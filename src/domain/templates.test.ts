import { describe, expect, it } from 'vitest'
import { renderTemplate } from './render-template'
import { templateCatalog } from '../data/templates'
import { searchTemplates } from '../lib/search'

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
