export const quickAnswers = [
  { label: 'Есть ли товар в наличии?', templateId: 'auto-02' },
  { label: 'Можно ли доставкой?', templateId: 'auto-04' },
  { label: 'Можно ли самовывозом?', templateId: 'auto-05' },
  { label: 'Сделаете фотографии?', templateId: 'auto-10' },
  { label: 'Подойдёт ли аксессуар?', templateId: 'R20' },
  { label: 'Возможен ли торг?', templateId: 'auto-09' },
  { label: 'Когда отправите?', templateId: 'auto-08' },
  { label: 'Спасибо за покупку', templateId: 'scenario-11' },
] as const

/** Non-automated, optional first-contact messages. Never imply activity tracking. */
export const silentChatAnswers = [
  { label: 'Начать разговор — ненавязчиво', templateId: 'silent-01' },
  { label: 'Начать разговор — короткий вопрос', templateId: 'silent-02' },
  { label: 'Помочь выбрать товар', templateId: 'silent-03' },
  { label: 'Подсказать способы получения', templateId: 'silent-04' },
  { label: 'Уточнить фото и комплектацию', templateId: 'silent-05' },
] as const
