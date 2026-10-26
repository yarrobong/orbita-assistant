import { describe, expect, it } from 'vitest'
import { products, knowledgeArticles } from '../data/products'
import { buildProductAnswer, filterProducts, productCompatibility } from './product-assistant'

describe('catalogue and knowledge', () => {
  it('contains unique products and articles', () => {
    expect(new Set(products.map(p => p.id)).size).toBe(products.length)
    expect(new Set(knowledgeArticles.map(a => a.id)).size).toBe(knowledgeArticles.length)
    expect(products.length).toBeGreaterThanOrEqual(12)
  })
  it('requires citation for manufacturer facts', () => {
    expect(products.filter(p => p.category === 'headset').every(p => p.sourceUrl?.startsWith('https://'))).toBe(true)
  })
  it('keeps unknown compatibility unconfirmed', () => {
    const mount = products.find(p => p.id === 'mount-quest3')!
    expect(productCompatibility(mount, 'quest3s')).toBe('check')
    expect(buildProductAnswer(mount, 'compatibility', 'quest3s')).toContain('не подтверждена')
  })
  it('confirms documented Quest Link model support', () => {
    const cable = products.find(p => p.id === 'link-cable')!
    expect(productCompatibility(cable, 'quest3s')).toBe('confirmed')
    expect(buildProductAnswer(cable, 'compatibility', 'quest3s')).toContain('совместим')
  })
  it('never invents availability, dates, or prices', () => {
    for (const p of products) for (const question of ['features', 'contents', 'condition', 'comparison', 'compatibility'] as const) {
      const answer = buildProductAnswer(p, question, 'quest3')
      expect(answer).not.toMatch(/\{\{[^}]+\}\}/u)
      expect(answer).not.toMatch(/в наличии|отправим сегодня|гарантия 14 дней/u)
    }
  })
  it('filters russian product names locally', () => {
    expect(filterProducts(products, 'кейС', 'all').length).toBeGreaterThan(0)
    expect(filterProducts(products, '', 'headset').length).toBe(3)
  })
})
