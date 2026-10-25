import { describe, expect, it } from 'vitest'
import { flowDefinitions, validateFlowGraph } from './graph'

describe('flow graph integrity', () => {
  it('has reachable nodes, valid edges and a named terminal in every flow', () => {
    for (const flow of flowDefinitions) {
      expect(validateFlowGraph(flow)).toEqual({ valid: true, unreachable: [], invalidEdges: [], missingTerminal: false })
    }
  })
})
