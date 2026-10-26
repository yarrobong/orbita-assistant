export type QuestModel = 'quest2' | 'quest3' | 'quest3s'
export type Compatibility = 'verified' | 'claimed' | 'unknown'
export type ProductCategory = 'headset' | 'strap' | 'case' | 'power' | 'cable' | 'mount' | 'controller' | 'accessory'
export type Product = {
  id: string
  title: string
  category: ProductCategory
  description: string
  facts: string[]
  notes: string[]
  sourceUrl: string | null
  compatibility: Partial<Record<QuestModel, Compatibility>> | null
}
export type KnowledgeArticle = {
  id: string
  title: string
  group: string
  text: string
  sourceUrl: string | null
}
export type BuyerQuestion = 'compatibility' | 'features' | 'contents' | 'condition' | 'comparison'
