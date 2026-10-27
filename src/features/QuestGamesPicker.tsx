import { useMemo, useState } from 'react'
import { questGames } from '../data/quest-games'
import { addPriorityGame, filterQuestGames, formatQuestGamesRequest, makeQuestGamesInvitation, MAX_QUEST_GAMES, movePriorityGame, removePriorityGame, selectedQuestGames } from '../domain/game-picker'
import { copyText } from '../lib/clipboard'
import '../styles/quest-games.css'

const multiplayerNames: Record<string, string> = { yes: 'Да', no: 'Нет', partial: 'Частично', unknown: 'Не указано' }
const statuses = [
  { value: 'all', label: 'Все статусы' },
  { value: 'yes', label: 'Да' },
  { value: 'partial', label: 'Частично' },
  { value: 'no', label: 'Нет' },
]

export default function QuestGamesPicker({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [selection, setSelection] = useState<string[]>([])
  const [notice, setNotice] = useState('')
  const filtered = useMemo(() => filterQuestGames(questGames, search, status), [search, status])
  const chosen = selectedQuestGames(selection)
  const request = formatQuestGamesRequest(selection)
  const invitationUrl = window.location.origin + window.location.pathname + '#/games'

  const toggle = (id: string) => {
    if (selection.includes(id)) {
      setSelection(previous => removePriorityGame(previous, id))
      setNotice('Игра убрана из списка.')
    } else if (selection.length === MAX_QUEST_GAMES) {
      setNotice('Выбрано максимум 15 игр. Сначала уберите одну из списка.')
    } else {
      setSelection(previous => addPriorityGame(previous, id))
      setNotice('Игра добавлена. Выбрано ' + (selection.length + 1) + ' из 15.')
    }
  }
  const copy = async (message: string, success: string) => {
    const copied = await copyText(message)
    setNotice(copied ? success : 'Копирование недоступно. Выделите текст и скопируйте вручную.')
  }

  return <section className="quest-games-page" aria-labelledby="quest-games-title">
    <button className="back-link quest-games-back" type="button" onClick={onBack}>← Товары и знания</button>
    <header className="quest-games-header">
      <h1 id="quest-games-title">Игры для Quest</h1>
      <p>Выберите до 15 игр и расставьте их по приоритету. Самые желанные — в начале списка.</p>
      <p>Постараемся установить по порядку столько игр, сколько поместится в свободную память шлема и будет доступно для установки. Все 15 могут не поместиться.</p>
    </header>
    <div className="quest-games-layout">
      <section aria-labelledby="quest-games-catalog-title" className="quest-games-catalog">
        <div className="quest-games-title-row"><h2 id="quest-games-catalog-title">Каталог игр</h2><span>{filtered.length} из {questGames.length}</span></div>
        <div className="quest-games-filters">
          <label>Найти игру<input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Название или описание" /></label>
          <label>Мультиплеер<select value={status} onChange={event => setStatus(event.target.value)}>{statuses.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        </div>
        <p className="quest-games-note">Статус мультиплеера — из предоставленной таблицы, не актуальная онлайн-проверка. Работа сети может измениться.</p>
        <div className="quest-games-list">
          {filtered.map(game => {
            const index = selection.indexOf(game.id)
            const selected = index !== -1
            return <div className={'quest-games-entry' + (selected ? ' is-selected' : '')} key={game.id}>
              <div className="quest-games-entry-copy">
                <strong>{game.title}</strong>
                <small>Мультиплеер по таблице: {multiplayerNames[game.multiplayer]}</small>
                {game.description && <p>{game.description}</p>}
                {game.note && <p className="quest-games-entry-note">Примечание: {game.note}</p>}
              </div>
              <button type="button" className="quest-games-add" onClick={() => toggle(game.id)} aria-pressed={selected} aria-label={selected ? '№ ' + (index + 1) + ' · Убрать игру ' + game.title : 'Добавить игру ' + game.title} disabled={!selected && selection.length >= MAX_QUEST_GAMES}>{selected ? '№ ' + (index + 1) + ' · Убрать' : 'Добавить'}</button>
            </div>
          })}
          {filtered.length === 0 && <p className="quest-games-note">Ничего не найдено. Измените поиск или фильтр.</p>}
        </div>
      </section>
      <aside className="quest-games-priority" aria-labelledby="quest-games-priority-title">
        <div className="quest-games-title-row"><h2 id="quest-games-priority-title">Приоритет установки</h2><strong>{chosen.length} / 15</strong></div>
        {chosen.length ? <ol className="quest-games-chosen">{chosen.map((game, index) => <li key={game.id}>
          <span className="quest-games-rank">{index + 1}</span>
          <span className="quest-games-chosen-name">{game.title}</span>
          <div className="quest-games-order">
            <button type="button" aria-label={'Поднять ' + game.title + ' выше'} disabled={index === 0} onClick={() => { setSelection(old => movePriorityGame(old, game.id, -1)); setNotice('Порядок изменён.') }}>↑</button>
            <button type="button" aria-label={'Опустить ' + game.title + ' ниже'} disabled={index === chosen.length - 1} onClick={() => { setSelection(old => movePriorityGame(old, game.id, 1)); setNotice('Порядок изменён.') }}>↓</button>
            <button type="button" aria-label={'Удалить ' + game.title + ' из списка'} onClick={() => toggle(game.id)}>×</button>
          </div>
        </li>)}</ol> : <p className="quest-games-empty">Пока ничего не выбрано. Добавьте игры из каталога, затем поменяйте их порядок стрелками.</p>}
        {chosen.length > 0 && <button type="button" className="quest-games-clear" onClick={() => { setSelection([]); setNotice('Список очищен.') }}>Очистить список</button>}
        <label className="quest-games-copy-label" htmlFor="quest-games-request">Ваш список для отправки в Авито</label>
        <textarea id="quest-games-request" value={request} readOnly rows={Math.max(5, Math.min(19,chosen.length+5))} placeholder="Здесь появится список с нумерацией по приоритету."/>
        <button className="button button-primary quest-games-copy" type="button" disabled={!chosen.length} onClick={() => void copy(request, 'Список скопирован. Отправьте его в переписке Авито.')}>Копировать список игр</button>
        <div className="quest-games-invite">
          <h3>Для продавца: пригласить покупателя</h3>
          <p>Кнопка скопирует сообщение со ссылкой на подборщик. Покупатель сам выберет игры и пришлёт список.</p>
          <button className="button button-secondary" type="button" onClick={() => void copy(makeQuestGamesInvitation(invitationUrl), 'Приглашение со ссылкой скопировано.')}>Копировать приглашение</button>
        </div>
        <p className="quest-games-note">Список не отправляется автоматически и не сохраняется на сервере. Установка зависит от доступных лицензий, совместимости и свободной памяти.</p>
        <p className="quest-games-status" role="status" aria-live="polite">{notice}</p>
      </aside>
    </div>
  </section>
}
