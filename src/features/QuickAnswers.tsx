import { quickAnswers, silentChatAnswers } from '../data/quick-answers'
import Icon from '../components/Icon'

type Props = { onChoose: (templateId: string) => void; selectedTemplateId?: string }

export default function QuickAnswers({ onChoose, selectedTemplateId }: Props) {
  return <section className="quick-answers" aria-labelledby="quick-answers-title">
    <header className="section-heading"><h1 id="quick-answers-title">Быстрые ответы</h1></header>
    <div className="quick-answer-list">{quickAnswers.map(({ label, templateId }) => <button className="quick-answer-button" type="button" key={templateId} aria-pressed={selectedTemplateId === templateId} onClick={() => onChoose(templateId)}>{label}<Icon name="arrow" size={18} /></button>)}</div>
    <section className="quick-answers-silent" aria-labelledby="silent-chat-title">
      <h2 id="silent-chat-title">Покупатель ещё ничего не написал</h2>
      <p className="lead">Можно написать первым — необязательно. Лучше одно короткое приветствие без повторных напоминаний.</p>
      <div className="quick-answer-list">{silentChatAnswers.map(({ label, templateId }) => <button className="quick-answer-button" type="button" key={templateId} aria-pressed={selectedTemplateId === templateId} onClick={() => onChoose(templateId)}>{label}<Icon name="arrow" size={18} /></button>)}</div>
    </section>
  </section>
}
