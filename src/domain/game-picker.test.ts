import { describe, expect, it } from 'vitest'
import { questGames } from '../data/quest-games'
import { MAX_QUEST_GAMES, addPriorityGame, removePriorityGame, movePriorityGame, formatQuestGamesRequest, makeQuestGamesInvitation, filterQuestGames } from './game-picker'

describe('Quest game priority builder', () => {
  it('imports 216 spreadsheet games and multiplayer notes', () => {
    expect(questGames).toHaveLength(216)
    expect(questGames.filter(g => g.multiplayer === 'yes')).toHaveLength(120)
    expect(questGames.filter(g => g.multiplayer === 'partial')).toHaveLength(17)
    expect(questGames.filter(g => g.multiplayer === 'no')).toHaveLength(79)
    expect(new Set(questGames.map(g => g.id)).size).toBe(216)
  })
  it('caps at 15 and ignores unknown or duplicate IDs', () => {
    const chosen = questGames.slice(0, MAX_QUEST_GAMES).reduce((a,g) => addPriorityGame(a,g.id), [] as string[])
    expect(chosen).toHaveLength(15)
    expect(addPriorityGame(chosen,questGames[15]!.id)).toEqual(chosen)
    expect(addPriorityGame(chosen,chosen[0]!)).toEqual(chosen)
    expect(addPriorityGame([],'fake')).toEqual([])
  })
  it('reorders and removes independently of search', () => {
    let ids = ['g001','g002','g003']
    ids = movePriorityGame(ids,'g003',-1)
    expect(ids).toEqual(['g001','g003','g002'])
    expect(movePriorityGame(ids,'g001',-1)).toEqual(ids)
    expect(removePriorityGame(ids,'g003')).toEqual(['g001','g002'])
  })
  it('formats priority and notes memory uncertainty', () => {
    const m = formatQuestGamesRequest(['g003','g001'])
    expect(m).toContain('1. A Lullaby of Colors')
    expect(m).toContain('2. 2MD - VR Football Unleashed')
    expect(m).toContain('свободной памяти')
    expect(formatQuestGamesRequest([])).toBe('')
  })
  it('produces seller invitation with game chooser link', () => {
    const m = makeQuestGamesInvitation('https://example.org/#/games')
    expect(m).toContain('https://example.org/#/games')
    expect(m).toContain('до 15 игр')
    expect(m).toContain('Все 15 могут не поместиться')
  })
  it('supports user source multiplayer status filter', () => {
    expect(filterQuestGames(questGames,'','partial')).toHaveLength(17)
    expect(filterQuestGames(questGames,'Fisherman','all').some(g=>g.title.includes("Fisherman's"))).toBe(true)
  })
})
