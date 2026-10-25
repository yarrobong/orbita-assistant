import { describe, expect, it } from 'vitest'
import { auditPublicText } from './audit-public-data'

describe('public content privacy audit', () => {
  it('flags handover identity, phone, and exact private address', () => {
    const violations = auditPublicText('Позвоните +7 993 508-71-33. Адрес: Евгения Савкова, 4. Выдаст Ярослав.')
    expect(violations.map((item) => item.rule)).toEqual(['phone', 'pickup-address', 'handover-name'])
  })

  it('allows the approved handover placeholders and general pickup area', () => {
    expect(auditPublicText('Самовывоз в Академическом районе. {{handoverName}}, {{handoverPhone}}.')).toEqual([])
  })
})
