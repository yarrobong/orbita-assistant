import { describe, expect, it } from 'vitest'
import { templateCatalog } from './templates'
import { quickAnswers, silentChatAnswers } from './quick-answers'

describe('quick answers use the existing source catalog', () => {
  it('covers each requested intent with a stable source template', () => {
    expect(quickAnswers.map(({ label }) => label)).toEqual([
      'Есть ли товар в наличии?', 'Можно ли доставкой?', 'Можно ли самовывозом?',
      'Сделаете фотографии?', 'Подойдёт ли аксессуар?', 'Возможен ли торг?',
      'Когда отправите?', 'Спасибо за покупку',
    ])
    for (const answer of quickAnswers) expect(templateCatalog.some(({ id }) => id === answer.templateId)).toBe(true)
  })

  it('offers five optional first-contact messages without repeated follow-ups', () => {
    expect(silentChatAnswers).toHaveLength(5)
    for (const answer of silentChatAnswers) {
      const template = templateCatalog.find(({ id }) => id === answer.templateId)
      expect(template).toBeDefined()
      expect(template?.guardFlags).toEqual([])
      expect(template?.requiredFields).toEqual([])
      expect(template?.audience).toBe('buyer')
      expect(template?.body).not.toMatch(/(?:вижу|заметил|отследил|увидел).{0,50}(?:чат|переписк|заход|откр)/iu)
    }
  })
})
