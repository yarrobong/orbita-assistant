import { templateCatalog } from '../data/templates'
import { products } from '../data/products'
import type { FlowPath } from '../domain/types'

export type AppRoute =
  | { kind: 'home' }
  | { kind: 'answers' }
  | { kind: 'products' }
  | { kind: 'games' }
  | { kind: 'product'; id: string }
  | { kind: 'settings' }
  | { kind: 'quick' }
  | { kind: 'flow'; path: FlowPath }
  | { kind: 'template'; id: string }

export type PrimarySection = 'home' | 'answers' | 'products' | 'settings'
export type ResolvedRoute = { route: AppRoute; canonicalHash: string }

const flowPaths: FlowPath[] = ['new', 'delivery', 'pickup', 'after-purchase']
const validTemplateIds = new Set(templateCatalog.map((template) => template.id))
const validProductIds = new Set(products.map((product) => product.id))

export function routeHash(route: AppRoute): string {
  switch (route.kind) {
    case 'home': return '#/home'
    case 'answers': return '#/answers'
    case 'products': return '#/products'
    case 'games': return '#/games'
    case 'product': return `#/products/${encodeURIComponent(route.id)}`
    case 'settings': return '#/settings'
    case 'quick': return '#/quick'
    case 'flow': return `#/flow/${route.path}`
    case 'template': return `#/template/${encodeURIComponent(route.id)}`
  }
}

export function resolveRoute(hash: string): ResolvedRoute {
  const normalized = hash.replace(/^#\/?/u, '').split(/[?&]/u, 1)[0] ?? ''
  if (!normalized || normalized === 'home') return { route: { kind: 'home' }, canonicalHash: '#/home' }
  if (normalized === 'flows') return { route: { kind: 'home' }, canonicalHash: '#/home' }
  if (normalized === 'templates' || normalized === 'use-template') return { route: { kind: 'answers' }, canonicalHash: '#/answers' }
  if (normalized === 'answers') return { route: { kind: 'answers' }, canonicalHash: '#/answers' }
  if (normalized === 'products') return { route: { kind: 'products' }, canonicalHash: '#/products' }
  if (normalized === 'games') return { route: { kind: 'games' }, canonicalHash: '#/games' }
  const productMatch = normalized.match(/^products\/([^/]+)$/u)
  if (productMatch) {
    let id = productMatch[1]!
    try { id = decodeURIComponent(id) } catch { return { route: { kind: 'products' }, canonicalHash: '#/products' } }
    if (validProductIds.has(id)) return { route: { kind: 'product', id }, canonicalHash: routeHash({ kind: 'product', id }) }
    return { route: { kind: 'products' }, canonicalHash: '#/products' }
  }
  if (normalized === 'settings') return { route: { kind: 'settings' }, canonicalHash: '#/settings' }
  if (normalized === 'quick') return { route: { kind: 'quick' }, canonicalHash: '#/quick' }

  const flowMatch = normalized.match(/^flow\/([^/]+)$/u)
  if (flowMatch && flowPaths.includes(flowMatch[1] as FlowPath)) {
    const path = flowMatch[1] as FlowPath
    return { route: { kind: 'flow', path }, canonicalHash: routeHash({ kind: 'flow', path }) }
  }

  const templateMatch = normalized.match(/^template\/([^/]+)$/u)
  if (templateMatch) {
    let id = templateMatch[1]!
    try { id = decodeURIComponent(id) } catch { return { route: { kind: 'answers' }, canonicalHash: '#/answers' } }
    if (validTemplateIds.has(id)) return { route: { kind: 'template', id }, canonicalHash: routeHash({ kind: 'template', id }) }
    return { route: { kind: 'answers' }, canonicalHash: '#/answers' }
  }

  return { route: { kind: 'home' }, canonicalHash: '#/home' }
}

export function primarySectionFor(route: AppRoute): PrimarySection {
  if (route.kind === 'settings') return 'settings'
  if (route.kind === 'products' || route.kind === 'product' || route.kind === 'games') return 'products'
  if (route.kind === 'answers' || route.kind === 'template') return 'answers'
  return 'home'
}
