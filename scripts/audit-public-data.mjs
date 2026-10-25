import { readFile, readdir } from 'node:fs/promises'
import { extname, join } from 'node:path'

const rules = [
  { rule: 'phone', pattern: /\+?7[\s(–-]*(?:\d[\s)–-]*){10}/gu },
  { rule: 'pickup-address', pattern: /(?:Евгения\s+)?Савкова,?\s*4/giu },
  { rule: 'handover-name', pattern: /\bЯрослав\b/giu },
]

export function auditPublicText(text) {
  return rules.flatMap(({ rule, pattern }) => {
    pattern.lastIndex = 0
    return [...text.matchAll(pattern)].map((match) => ({ rule, match: match[0] }))
  })
}

async function collectFiles(target) {
  const entries = await readdir(target, { withFileTypes: true }).catch((error) => {
    if (error.code === 'ENOENT') return []
    throw error
  })
  const paths = []
  for (const entry of entries) {
    const path = join(target, entry.name)
    if (entry.isDirectory()) paths.push(...await collectFiles(path))
    else if (['.html', '.js', '.css', '.json', '.webmanifest', '.ts', '.tsx'].includes(extname(path))) paths.push(path)
  }
  return paths
}

async function main() {
  const targets = process.argv.slice(2)
  const files = (await Promise.all(targets.map(collectFiles))).flat()
  const findings = []
  for (const file of files) {
    const text = await readFile(file, 'utf8')
    for (const finding of auditPublicText(text)) findings.push({ file, ...finding })
  }
  if (findings.length) {
    for (const finding of findings) console.error(`${finding.file}: ${finding.rule}: ${finding.match}`)
    process.exitCode = 1
    return
  }
  console.log(`Public data audit passed (${files.length} files).`)
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) await main()
