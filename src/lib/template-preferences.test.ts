import { describe, expect, it } from 'vitest'
import { templateCatalog } from '../data/templates'
import { categoryLabel, normalizeRecentIds, rememberTemplate } from './template-preferences'

describe('template preferences', () => {
  it('shows Russian category labels instead of internal enum names', () => {
    expect(categoryLabel('product')).toBe('Товар')
    expect(categoryLabel('after-purchase')).toBe('После покупки')
  })

  it('stores only known template IDs in recency order without duplicates', () => {
    const known = templateCatalog[0]!.id
    expect(normalizeRecentIds([known, 'private text', known])).toEqual([known])
    expect(rememberTemplate([known, 'R08'], 'R08')).toEqual(['R08', known])
    expect(rememberTemplate([], 'buyer phone: +7 999')).toEqual([])
  })
})
