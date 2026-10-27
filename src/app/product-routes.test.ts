import { describe, expect, it } from 'vitest'
import { primarySectionFor, resolveRoute, routeHash } from './routes'
describe('product routes', () => {
  it('opens catalog and product deep links', () => {
    expect(resolveRoute('#/products').route).toEqual({ kind: 'products' })
    expect(resolveRoute('#/products/link-cable').route).toEqual({ kind: 'product', id: 'link-cable' })
    expect(routeHash({ kind: 'product', id: 'quest-3s' })).toBe('#/products/quest-3s')
  })
  it('opens a direct public games route under products', () => {
    expect(resolveRoute('#/games').route).toEqual({ kind: 'games' })
    expect(routeHash({ kind: 'games' })).toBe('#/games')
    expect(primarySectionFor({ kind: 'games' })).toBe('products')
  })
  it('rejects nonexistent product links safely', () => {
    expect(resolveRoute('#/products/does-not-exist').canonicalHash).toBe('#/products')
  })
  it('selects products tab for product details', () => {
    expect(primarySectionFor({ kind: 'product', id: 'quest-3' })).toBe('products')
  })
})
