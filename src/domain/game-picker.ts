import { questGames, type QuestGame } from '../data/quest-games'

export const MAX_QUEST_GAMES = 15
const gameById = new Map(questGames.map(game => [game.id, game]))

export function addPriorityGame(current: readonly string[], id: string): string[] {
  if (!gameById.has(id) || current.includes(id) || current.length >= MAX_QUEST_GAMES) return [...current]
  return [...current, id]
}
export function removePriorityGame(current: readonly string[], id: string): string[] {
  return current.filter(value => value !== id)
}
export function movePriorityGame(current: readonly string[], id: string, direction: -1 | 1): string[] {
  const index = current.indexOf(id), target = index + direction
  if (index < 0 || target < 0 || target >= current.length) return [...current]
  const changed = [...current]
  ;[changed[index], changed[target]] = [changed[target]!, changed[index]!]
  return changed
}
export function selectedQuestGames(ids: readonly string[]): QuestGame[] {
  return ids.map(id => gameById.get(id)).filter((g): g is QuestGame => Boolean(g))
}
export function formatQuestGamesRequest(ids: readonly string[]): string {
  const chosen = selectedQuestGames(ids).slice(0, MAX_QUEST_GAMES)
  if (!chosen.length) return ''
  return [
    'Игры для установки на Quest — по приоритету:',
    ...chosen.map((g, index) => String(index + 1) + '. ' + g.title),
    '',
    'Пожалуйста, начинайте с игр в начале списка. Понимаю, что количество зависит от свободной памяти шлема, совместимости и доступности игр.',
  ].join('\n')
}
export function makeQuestGamesInvitation(url: string): string {
  return [
    'Здравствуйте! Можете выбрать до 15 игр для Quest из нашего каталога:',
    url,
    '',
    'Расставьте игры по приоритету (самые желанные — первыми) и пришлите мне скопированный список в Авито.',
    'Постараемся установить в этом порядке столько игр, сколько позволит память шлема и доступность игр. Все 15 могут не поместиться. Окончательное количество подтвердим после проверки.',
  ].join('\n')
}
const normalize = (s: string) => s.toLocaleLowerCase('ru-RU').replaceAll('ё', 'е')
export function filterQuestGames(games: readonly QuestGame[], query: string, status: string): QuestGame[] {
  const terms = normalize(query).trim().split(/\s+/u).filter(Boolean)
  return games.filter(game => (status === 'all' || status === game.multiplayer) &&
    terms.every(term => normalize([game.title, game.note, game.description].join(' ')).includes(term)))
}
