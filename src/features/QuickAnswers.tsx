import { quickAnswers } from '../data/quick-answers'
import Icon from '../components/Icon'

type Props = { onChoose: (templateId: string) => void; selectedTemplateId?: string }

export default function QuickAnswers({ onChoose, selectedTemplateId }: Props) {
  return <section className="quick-answers" aria-labelledby="quick-answers-title">
    <header className="section-heading"><h1 id="quick-answers-title">Быстрые ответы</h1></header>
    <div className="quick-answer-list">{quickAnswers.map(({ label, templateId }) => <button className="quick-answer-button" type="button" key={templateId} aria-pressed={selectedTemplateId === templateId} onClick={() => onChoose(templateId)}>{label}<Icon name="arrow" size={18} /></button>)}</div>
  </section>
}
