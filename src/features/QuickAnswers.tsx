import { quickAnswers } from '../data/quick-answers'

type Props = { onChoose: (templateId: string) => void }

export default function QuickAnswers({ onChoose }: Props) {
  return <section className="quick-answers" aria-labelledby="quick-answers-title">
    <header className="section-heading"><h2 id="quick-answers-title">Что спросил покупатель?</h2><p>Выберите ситуацию, чтобы подготовить ответ.</p></header>
    <div className="quick-answer-list">{quickAnswers.map(({ label, templateId }) => <button className="quick-answer-button" type="button" key={templateId} onClick={() => onChoose(templateId)}>{label}<span aria-hidden="true">›</span></button>)}</div>
  </section>
}
