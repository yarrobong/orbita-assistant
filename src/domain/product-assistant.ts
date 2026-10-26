import type { BuyerQuestion, Product, QuestModel } from '../data/product-types'

export const modelLabels: Record<QuestModel, string> = {
  quest2: 'Quest 2',
  quest3: 'Quest 3',
  quest3s: 'Quest 3S',
}

export const questionLabels: Record<BuyerQuestion, string> = {
  compatibility: 'Совместимость',
  features: 'Характеристики',
  contents: 'Комплектация',
  condition: 'Состояние',
  comparison: 'Сравнение моделей',
}

export function productCompatibility(product: Product, model: QuestModel): 'confirmed' | 'check' {
  return product.compatibility?.[model] === 'verified' ? 'confirmed' : 'check'
}

export function buildProductAnswer(product: Product, question: BuyerQuestion, model?: QuestModel): string {
  const prefix = 'Здравствуйте! '
  if (question === 'compatibility') {
    if (product.category === 'headset') return prefix + 'Это самостоятельный VR-шлем. Если вам нужно подключение к ПК, подскажите характеристики компьютера — проверим требования Quest Link и нужных игр.'
    if (!model) return prefix + 'Подскажите, пожалуйста, какая у вас модель шлема: Quest 2, Quest 3 или Quest 3S? Проверю совместимость конкретного аксессуара.'
    if (productCompatibility(product, model) === 'confirmed') {
      return prefix + 'По документации производителя ' + product.title + ' совместим с ' + modelLabels[model] + ' для указанного назначения. Перед покупкой также уточним состояние и комплектность конкретного экземпляра.'
    }
    return prefix + 'Для ' + modelLabels[model] + ' совместимость этого аксессуара пока не подтверждена. Уточню точный артикул и крепление конкретного экземпляра, чтобы не ввести вас в заблуждение.'
  }
  if (question === 'features') {
    if (product.sourceUrl && product.facts.length > 0) {
      return prefix + 'Основные характеристики ' + product.title + ': ' + product.facts.join('; ') + '. Если интересно, могу уточнить состояние и комплектность конкретного экземпляра.'
    }
    return prefix + 'Уточню точную модель и характеристики ' + product.title + ' по маркировке, чтобы дать достоверную информацию. Подскажите, какой параметр вас интересует?'
  }
  if (question === 'contents') return prefix + 'Комплектацию конкретного экземпляра ' + product.title + ' уточню перед покупкой. Если нужно, могу показать, что входит в комплект, на фотографиях.'
  if (question === 'condition') return prefix + 'Уточню состояние конкретного экземпляра ' + product.title + '. При необходимости пришлю дополнительные фото, чтобы вы могли оценить товар до покупки.'
  if (product.id === 'quest-3' || product.id === 'quest-3s') {
    return prefix + 'Quest 3 и Quest 3S работают автономно, оба используют Snapdragon XR2 Gen 2. У Quest 3 более высокая чёткость изображения и pancake-оптика; у Quest 3S оптика Fresnel. Подскажите, что для вас важнее — качество изображения или бюджет?'
  }
  return prefix + 'Напишите, пожалуйста, с какой именно моделью хотите сравнить ' + product.title + '. Сверю характеристики и совместимость, чтобы ответить точно.'
}

export function filterProducts(products: Product[], query: string, category: string): Product[] {
  const norm = (s: string) => s.toLocaleLowerCase('ru-RU').replaceAll('ё', 'е')
  const terms = norm(query).trim().split(/\s+/u).filter(Boolean)
  return products.filter((p) =>
    (category === 'all' || p.category === category) &&
    terms.every((term) => norm([p.title, p.description, ...p.facts, ...p.notes].join(' ')).includes(term)),
  )
}
