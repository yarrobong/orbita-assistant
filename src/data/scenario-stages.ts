import { templateCatalog } from './templates'
import type { FlowPath, Template } from '../domain/types'

export type ScenarioStage = { id: string; label: string; templateId: string; title?: string; body?: string; neutralAlternative?: string; requiredFields?: string[]; audience?: Template['audience']; withoutContactBody?: string; guardFlags?: Template['guardFlags'] }

const delivery: ScenarioStage[] = [
  { id: 'D0', label: 'Спрашивает о доставке', templateId: 'top-02', title: 'Уточнить доставку' },
  { id: 'D1', label: 'Хочет оформить заказ', templateId: 'top-02', title: 'Как оформить заказ', body: 'Здравствуйте! Если в объявлении доступна Авито Доставка, можете оформить заказ прямо здесь. Стоимость и сроки Авито покажет при оформлении.' },
  { id: 'D2', label: 'Заказ оформлен', templateId: 'top-03' },
  { id: 'D3', label: 'Спрашивает о сроках отправки', templateId: 'top-04', title: 'Уточнить срок отправки' },
  { id: 'D4', label: 'Заказ отправлен', templateId: 'top-05' },
  { id: 'D5', label: 'Посылка в пути', templateId: 'scenario-10' },
  { id: 'D6', label: 'Посылка в пункте выдачи', templateId: 'top-06', body: 'Здравствуйте! Заказ прибыл в пункт выдачи. Срок и условия получения указаны на странице заказа в Авито. Если появятся вопросы, напишите.' },
  { id: 'D7', label: 'Покупатель получил товар', templateId: 'scenario-11' },
  { id: 'D8', label: 'Попросить отзыв', templateId: 'top-07' },
  { id: 'D9', label: 'Проблема с заказом', templateId: 'R51' },
]
const pickup: ScenarioStage[] = [
  { id: 'P0', label: 'Интересуется самовывозом', templateId: 'scenario-12', body: 'Здравствуйте! Самовывоз можно обсудить. Напишите удобные день и время — уточню, получится ли организовать выдачу.', title: 'Уточнить возможность самовывоза' },
  { id: 'P1', label: 'Предложил дату и время', templateId: 'scenario-13', neutralAlternative: 'Уточню, получится ли организовать выдачу в это время, и вернусь с ответом. Пока не выезжайте, пожалуйста.' },
  { id: 'P2', label: 'Уточнить с человеком на точке', templateId: 'scenario-14', audience: 'handover', neutralAlternative: 'Привет! Покупатель интересуется самовывозом. Сможешь уточнить, получится ли организовать выдачу? Напиши удобное время, пожалуйста.' },
  { id: 'P3', label: 'Выдающий не может в это время', templateId: 'scenario-16' },
  { id: 'P4', label: 'Время и выдача согласованы', templateId: 'scenario-17', title: 'Подтвердить согласованную выдачу', body: 'Самовывоз согласовали на {{date}} в {{time}}. Адрес: {{address}}. Если планы изменятся, напишите мне заранее.', requiredFields: ['date', 'time', 'address'], guardFlags: ['stockConfirmed', 'handoverConfirmed', 'addressConfirmed'], neutralAlternative: 'Я уточню дату, время и адрес и напишу вам. Пожалуйста, пока не выезжайте.' },
  { id: 'P5', label: 'Передать адрес и инструкции', templateId: 'scenario-17', title: 'Адрес и инструкции', body: 'Адрес: {{address}}. Выдающий: {{handoverName}}, телефон {{handoverPhone}}. Пожалуйста, напишите перед выездом.', withoutContactBody: 'Адрес: {{address}}. Пожалуйста, напишите перед выездом, чтобы уточнить детали.', requiredFields: ['address'], guardFlags: ['contactPermission'], neutralAlternative: 'Я уточню адрес и инструкции и напишу вам. Пожалуйста, пока не выезжайте.' },
  { id: 'P6', label: 'Покупатель приехал', templateId: 'scenario-19', audience: 'handover', neutralAlternative: 'Привет! Покупатель приехал и ждёт на месте. Сможешь его встретить? Напиши, пожалуйста.' },
  { id: 'P7', label: 'Товар передан', templateId: 'scenario-21' },
  { id: 'P8', label: 'Попросить отзыв', templateId: 'scenario-23' },
]

export const stagesForPath = (path: FlowPath): ScenarioStage[] => path === 'delivery' ? delivery : path === 'pickup' ? pickup : []
export function templateForStage(path: FlowPath, stage: string): Template | null {
  const item = stagesForPath(path).find((candidate) => candidate.id === stage)
  if (!item) return null
  const source = templateCatalog.find((template) => template.id === item.templateId)
  if (!source) return null
  return { ...source, ...(item.title ? { title: item.title } : {}), ...(item.body ? { body: item.body } : {}), ...(item.neutralAlternative ? { neutralAlternative: item.neutralAlternative } : {}), ...(item.requiredFields ? { requiredFields: item.requiredFields } : {}), ...(item.audience ? { audience: item.audience } : {}), ...(item.withoutContactBody ? { withoutContactBody: item.withoutContactBody } : {}), ...(item.guardFlags ? { guardFlags: item.guardFlags } : {}) }
}
