export type FlowNode = { id: string; next: string[]; terminal?: boolean }
export type FlowDefinition = { id: string; start: string; nodes: FlowNode[] }
export type GraphValidation = { valid: boolean; unreachable: string[]; invalidEdges: string[]; missingTerminal: boolean }

const linearNodes = (prefix: string, labels: string[], terminalName: string): FlowNode[] => {
  const ids = labels.map((label) => `${prefix}${label}`)
  const nodes = ids.map((id, index) => {
    const next = index === ids.length - 1 ? [] : [ids[index + 1]!]
    if (prefix === 'D') next.push(terminalName)
    if (prefix === 'P' && index < ids.length - 1) next.push(terminalName)
    if (prefix === 'P' && index === 2) next.push(ids[1]!)
    return { id, next, ...(next.length === 0 ? { terminal: true } : {}) }
  })
  return nodes.concat([{ id: terminalName, next: [], terminal: true }])
}

export const flowDefinitions: FlowDefinition[] = [
  {
    id: 'new-buyer', start: 'N0', nodes: [
      { id: 'N0', next: ['N1'] }, { id: 'N1', next: ['N2'] },
      { id: 'N2', next: [], terminal: true },
    ],
  },
  { id: 'delivery', start: 'D0', nodes: linearNodes('D', ['0', '1', '2', '3', '4', '5', '6', '7'], 'DX') },
  { id: 'pickup', start: 'P0', nodes: linearNodes('P', ['0', '1', '2', '3', '4', '5', '6', '7'], 'PX') },
  {
    id: 'after-purchase', start: 'AFTER', nodes: [
      { id: 'AFTER', next: ['HELP', 'REVIEW', 'DONE'] }, { id: 'HELP', next: ['DONE'] },
      { id: 'REVIEW', next: ['DONE'] }, { id: 'DONE', next: [], terminal: true },
    ],
  },
]

export function validateFlowGraph(flow: FlowDefinition): GraphValidation {
  const ids = new Set(flow.nodes.map((node) => node.id))
  const invalidEdges = flow.nodes.flatMap((node) => node.next.filter((next) => !ids.has(next)).map((next) => `${node.id} -> ${next}`))
  const visited = new Set<string>()
  const visit = (id: string) => {
    if (visited.has(id)) return
    visited.add(id)
    const node = flow.nodes.find((candidate) => candidate.id === id)
    node?.next.forEach(visit)
  }
  if (ids.has(flow.start)) visit(flow.start)
  const unreachable = flow.nodes.filter((node) => !visited.has(node.id)).map((node) => node.id)
  const missingTerminal = !flow.nodes.some((node) => node.terminal && node.next.length === 0)
  return { valid: ids.has(flow.start) && invalidEdges.length === 0 && unreachable.length === 0 && !missingTerminal, unreachable, invalidEdges, missingTerminal }
}
