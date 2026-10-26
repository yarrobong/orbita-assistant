import { describe, expect, it } from 'vitest'
import { stagesForPath, templateForStage } from './scenario-stages'
import { initialFlowState, transition } from '../domain/flow'

describe('directly selectable scenario situations', () => {
  it('maps all ten delivery statuses to an existing copyable template', () => {
    const situations = stagesForPath('delivery')
    expect(situations).toHaveLength(10)
    for (const stage of situations) {
      expect(stage.id).toMatch(/^D[0-9]$/u)
      expect(templateForStage('delivery', stage.id)).toMatchObject({ id: expect.any(String), audience: 'buyer' })
    }
  })

  it('maps all nine pickup statuses independently, marking only handover messages internal', () => {
    const situations = stagesForPath('pickup')
    expect(situations).toHaveLength(9)
    for (const stage of situations) {
      const template = templateForStage('pickup', stage.id)
      expect(stage.id).toMatch(/^P[0-8]$/u)
      expect(template).not.toBeNull()
      expect(template?.audience).toBe(['P2', 'P6'].includes(stage.id) ? 'handover' : 'buyer')
    }
  })

  it('uses a contact-free address message without changing source catalog entries', () => {
    const template = templateForStage('pickup', 'P5')
    expect(template?.withoutContactBody).toContain('{{address}}')
    expect(template?.neutralAlternative).toMatch(/уточню адрес/u)
    expect(template?.body).toContain('{{handoverPhone}}')
  })

  it('selecting agreement is a direct intent, while missing date and time still has neutral copy', () => {
    const state = transition(initialFlowState('pickup'), { type: 'set-stage', stage: 'P4' })
    const template = templateForStage('pickup', state.stage)
    expect(state.stage).toBe('P4')
    expect(template?.neutralAlternative).toMatch(/уточню дату, время и адрес/u)
  })
})
