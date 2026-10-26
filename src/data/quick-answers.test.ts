import { describe, expect, it } from 'vitest'
import { templateCatalog } from './templates'
import { quickAnswers } from './quick-answers'

describe('quick answers use the existing source catalog', () => {
  it('covers each requested intent with a stable source template', () => {
    expect(quickAnswers.map(({ label }) => label)).toEqual([
      'Есть ли товар в наличии?', 'Можно ли доставкой?', 'Можно ли самовывозом?',
      'Сделаете фотографии?', 'Подойдёт ли аксессуар?', 'Возможен ли торг?',
      'Когда отправите?', 'Спасибо за покупку',
    ])
    for (const answer of quickAnswers) expect(templateCatalog.some(({ id }) => id === answer.templateId)).toBe(true)
  })
})
