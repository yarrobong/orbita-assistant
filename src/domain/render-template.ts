export type RenderResult = { text: string; missing: string[]; copyable: boolean }

export function renderTemplate(
  template: { body: string; requiredFields: string[] },
  fields: Record<string, string | undefined>,
): RenderResult {
  const variables = [...template.body.matchAll(/\{\{([a-zA-Z]+)\}\}/gu)].map((match) => match[1]!)
  const required = new Set([...template.requiredFields, ...variables])
  const missing = [...required].filter((field) => !fields[field]?.trim())
  const text = template.body.replace(/\{\{([a-zA-Z]+)\}\}/gu, (_, field: string) => fields[field]?.trim() ?? '—')
  return { text, missing, copyable: missing.length === 0 }
}
