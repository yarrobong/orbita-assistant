import { describe, expect, it } from 'vitest'
import { validateImport } from './validate-import'

const valid = JSON.stringify({ version: 1, templates: [{
  id: 'local.reply', title: 'Ответ', category: 'general', stage: 'R1', audience: 'buyer', body: 'Здравствуйте.',
  tags: [], requiredFields: [], guardFlags: [], checklist: [], defaultPriority: 5, revision: 1,
}] })

describe('local catalog import validation', () => {
  it('rejects invalid JSON and malformed template fields', () => {
    expect(validateImport('{').valid).toBe(false)
    expect(validateImport(JSON.stringify({ version: 1, templates: [{ id: 4, body: true }] })).valid).toBe(false)
  })

  it('rejects oversized messages before applying an import', () => {
    const tooLong = JSON.stringify({ version: 1, templates: [{ ...JSON.parse(valid).templates[0], body: 'x'.repeat(5001) }] })
    expect(validateImport(tooLong).valid).toBe(false)
  })

  it('rejects duplicate template IDs and buyer/private keys', () => {
    const record = JSON.parse(valid).templates[0]
    expect(validateImport(JSON.stringify({ version: 1, templates: [record, record] })).valid).toBe(false)
    expect(validateImport(JSON.stringify({ version: 1, customerPhone: 'secret', templates: [] })).valid).toBe(false)
  })

  it('accepts a complete versioned template catalog', () => {
    expect(validateImport(valid)).toEqual({ valid: true, templates: JSON.parse(valid).templates, errors: [] })
  })
})
