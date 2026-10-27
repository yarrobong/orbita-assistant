import type { Template } from '../domain/types'

export const templateCatalog: Template[] = [
  {
    "id": "top-01",
    "title": "Наличие + выбор получения",
    "category": "general",
    "stage": "TOP",
    "audience": "buyer",
    "body": "Здравствуйте! Да, актуально, товар в наличии. Вам удобнее оформить Авито Доставку или забрать самостоятельно?",
    "tags": [
      "Наличие + выбор получения"
    ],
    "requiredFields": [],
    "guardFlags": [
      "stockConfirmed",
      "stockAvailable"
    ],
    "checklist": [
      "Наличие обязательно проверить."
    ],
    "defaultPriority": 1,
    "revision": 1,
    "source": "Топ-15",
    "usage": "Покупатель спрашивает, актуально ли объявление"
  },
  {
    "id": "top-02",
    "title": "Доставка — оформление",
    "category": "delivery",
    "stage": "TOP",
    "audience": "buyer",
    "body": "Здравствуйте! Да, если в объявлении доступна Авито Доставка, можете оформить заказ прямо здесь. Стоимость и сроки Авито покажет при оформлении.",
    "tags": [
      "Доставка — оформление"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Проверить, доступна ли доставка."
    ],
    "defaultPriority": 2,
    "revision": 1,
    "source": "Топ-15",
    "usage": "Покупатель спрашивает про доставку"
  },
  {
    "id": "top-03",
    "title": "Заказ оформлен",
    "category": "general",
    "stage": "TOP",
    "audience": "buyer",
    "body": "Здравствуйте! Спасибо за заказ! Подготовим товар к отправке. Как только передадим его в доставку, сообщим.",
    "tags": [
      "Заказ оформлен"
    ],
    "requiredFields": [],
    "guardFlags": ["orderVerified"],
    "checklist": [
      "Проверить, что заказ получен."
    ],
    "defaultPriority": 3,
    "revision": 1,
    "source": "Топ-15",
    "usage": "Заказ появился в личном кабинете"
  },
  {
    "id": "top-04",
    "title": "Отправите сегодня?",
    "category": "general",
    "stage": "TOP",
    "audience": "buyer",
    "body": "Понимаю. Уточню, получится ли передать заказ сегодня, и напишу вам. Пока не хочу обещать срок без подтверждения.",
    "tags": [
      "Отправите сегодня?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не обещать отправку до проверки."
    ],
    "defaultPriority": 4,
    "revision": 1,
    "source": "Топ-15",
    "usage": "Покупатель просит срочную отправку"
  },
  {
    "id": "top-05",
    "title": "Заказ отправили",
    "category": "general",
    "stage": "TOP",
    "audience": "buyer",
    "body": "Здравствуйте! Заказ передали в доставку. Теперь его статус и ориентировочную дату получения можно отслеживать в Авито. Если появятся вопросы — пишите.",
    "tags": [
      "Заказ отправили"
    ],
    "requiredFields": [],
    "guardFlags": ["shippedVerified"],
    "checklist": [
      "Статус действительно «отправлен»."
    ],
    "defaultPriority": 5,
    "revision": 1,
    "source": "Топ-15",
    "usage": "Заказ передан в службу доставки"
  },
  {
    "id": "top-06",
    "title": "Заказ в пункте выдачи",
    "category": "general",
    "stage": "TOP",
    "audience": "buyer",
    "body": "Здравствуйте! Вижу, что заказ прибыл в пункт выдачи. Забрать его можно в срок, указанный в Авито. Если будут вопросы по товару, пишите.",
    "tags": [
      "Заказ в пункте выдачи"
    ],
    "requiredFields": [],
    "guardFlags": ["arrivedVerified"],
    "checklist": [
      "Проверить статус; не навязываться."
    ],
    "defaultPriority": 6,
    "revision": 1,
    "source": "Топ-15",
    "usage": "Авито показывает прибытие заказа"
  },
  {
    "id": "top-07",
    "title": "Отзыв после доставки",
    "category": "delivery",
    "stage": "TOP",
    "audience": "buyer",
    "body": "Спасибо за покупку! Надеемся, всё подошло. Если будет минутка, будем признательны за честный отзыв на Авито. Если возникнут вопросы — обязательно пишите.",
    "tags": [
      "Отзыв после доставки"
    ],
    "requiredFields": [],
    "guardFlags": [
      "receivedVerified",
      "noIssueOpen",
      "reviewNotRequested"
    ],
    "checklist": [
      "Только после получения. Один раз."
    ],
    "defaultPriority": 7,
    "revision": 1,
    "source": "Топ-15",
    "usage": "Покупатель действительно получил товар"
  },
  {
    "id": "top-08",
    "title": "Самовывоз — запрос времени",
    "category": "pickup",
    "stage": "TOP",
    "audience": "buyer",
    "body": "Здравствуйте! Самовывоз возможен в Екатеринбурге, в Академическом районе. Подскажите, пожалуйста, в какой день и во сколько вам удобно подъехать? Я сначала согласую возможность выдачи и подтвержу время.",
    "tags": [
      "Самовывоз — запрос времени"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Никаких подтверждений заранее."
    ],
    "defaultPriority": 8,
    "revision": 1,
    "source": "Топ-15",
    "usage": "Покупатель спрашивает где/когда забрать"
  },
  {
    "id": "top-09",
    "title": "Время ещё уточняется",
    "category": "general",
    "stage": "TOP",
    "audience": "buyer",
    "body": "Хорошо, уточню, сможет ли человек выдать товар {{date}} в {{time}}, и вернусь с подтверждением. Пока не выезжайте, пожалуйста.",
    "tags": [
      "Время ещё уточняется"
    ],
    "requiredFields": [
      "date",
      "time"
    ],
    "guardFlags": [],
    "checklist": [
      "Только после ответа выдающего подтверждать встречу."
    ],
    "defaultPriority": 9,
    "revision": 1,
    "source": "Топ-15",
    "usage": "Покупатель предложил конкретное время"
  },
  {
    "id": "top-10",
    "title": "Самовывоз подтверждён",
    "category": "pickup",
    "stage": "TOP",
    "audience": "buyer",
    "body": "Отлично, самовывоз подтвердили на {{date}} в {{time}}. Адрес: {{address}}. Товар выдаст {{handoverName}}, {{handoverPhone}}. Пожалуйста, предупредите минимум за час до приезда. Если планы изменятся — напишите заранее.",
    "tags": [
      "Самовывоз подтверждён"
    ],
    "requiredFields": [
      "date",
      "time",
      "address",
      "handoverName",
      "handoverPhone"
    ],
    "guardFlags": [
      "contactPermission",
      "stockConfirmed",
      "handoverConfirmed",
      "addressConfirmed"
    ],
    "checklist": [
      "Сверить товар, выдающего, время, контакт и согласие дать номер."
    ],
    "defaultPriority": 10,
    "revision": 1,
    "source": "Топ-15",
    "usage": "Выдающий подтвердил товар, дату, время"
  },
  {
    "id": "top-11",
    "title": "Время не подошло",
    "category": "general",
    "stage": "TOP",
    "audience": "buyer",
    "body": "К сожалению, в предложенное время выдать товар не получится. Подскажите, какие ещё дата и время вам удобны? Уточню возможность и подтвержу один из вариантов.",
    "tags": [
      "Время не подошло"
    ],
    "requiredFields": [],
    "guardFlags": ["arrivedVerified"],
    "checklist": [
      "Не предлагать несогласованный слот."
    ],
    "defaultPriority": 11,
    "revision": 1,
    "source": "Топ-15",
    "usage": "Выдающий не может принять в желаемое время"
  },
  {
    "id": "top-12",
    "title": "Другой цвет",
    "category": "general",
    "stage": "TOP",
    "audience": "buyer",
    "body": "К сожалению, чёрные закончились, но в наличии есть белые. Если такой вариант вам подходит, можно оформить доставку или согласовать самовывоз.",
    "tags": [
      "Другой цвет"
    ],
    "requiredFields": [],
    "guardFlags": ["stockConfirmed", "stockUnavailable", "stockAvailable", "variantChecked", "compatibilityChecked"],
    "checklist": [
      "Проверить белый вариант и совместимость."
    ],
    "defaultPriority": 12,
    "revision": 1,
    "source": "Топ-15",
    "usage": "Запрошенный цвет закончился"
  },
  {
    "id": "top-13",
    "title": "Фото завтра",
    "category": "general",
    "stage": "TOP",
    "audience": "buyer",
    "body": "Дополнительные фотографии смогу сделать завтра. Подскажите, какую именно часть товара хотите посмотреть? Тогда отправлю нужные ракурсы.",
    "tags": [
      "Фото завтра"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Только если фото реально будут завтра."
    ],
    "defaultPriority": 13,
    "revision": 1,
    "source": "Топ-15",
    "usage": "Покупатель попросил дополнительные фото"
  },
  {
    "id": "top-14",
    "title": "Совместимость — уточнить",
    "category": "general",
    "stage": "TOP",
    "audience": "buyer",
    "body": "Подскажите, пожалуйста, точную модель устройства. Проверю совместимость этого аксессуара, чтобы не ошибиться.",
    "tags": [
      "Совместимость — уточнить"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не утверждать совместимость без проверки."
    ],
    "defaultPriority": 14,
    "revision": 1,
    "source": "Топ-15",
    "usage": "Покупатель спрашивает, подойдёт ли аксессуар"
  },
  {
    "id": "top-15",
    "title": "Торг",
    "category": "general",
    "stage": "TOP",
    "audience": "buyer",
    "body": "Спасибо за предложение! Напишите, пожалуйста, на какую сумму рассчитываете. Уточню, возможен ли такой вариант.",
    "tags": [
      "Торг"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не обещать скидку без согласования."
    ],
    "defaultPriority": 15,
    "revision": 1,
    "source": "Топ-15",
    "usage": "Покупатель просит скидку"
  },
  {
    "id": "R01",
    "title": "Товар в наличии",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Здравствуйте! Да, товар в наличии. Можем оформить доставку через Авито или договориться о самовывозе. Как вам удобнее?",
    "tags": [
      "Общие",
      "Товар в наличии"
    ],
    "requiredFields": [],
    "guardFlags": ["stockConfirmed", "stockAvailable"],
    "checklist": [
      "Проверить наличие."
    ],
    "defaultPriority": 101,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Товар в наличии"
  },
  {
    "id": "R02",
    "title": "Актуально ли объявление?",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Здравствуйте! Да, объявление актуально. Если есть вопросы по товару — с удовольствием отвечу.",
    "tags": [
      "Общие",
      "Актуально ли объявление?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Проверить актуальность."
    ],
    "defaultPriority": 102,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Актуально ли объявление?"
  },
  {
    "id": "R03",
    "title": "Вопрос о цене",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Здравствуйте! Цена указана в объявлении — {{price}} ₽. Если нужны подробности по комплекту или доставке, подскажу.",
    "tags": [
      "Общие",
      "Вопрос о цене"
    ],
    "requiredFields": [
      "price"
    ],
    "guardFlags": [
      "priceConfirmed"
    ],
    "checklist": [
      "Проверить цену в объявлении."
    ],
    "defaultPriority": 103,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Вопрос о цене"
  },
  {
    "id": "R04",
    "title": "Уточнить модель",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Подскажите, пожалуйста, какая у вас модель шлема: Quest 2, Quest 3 или Quest 3S? Тогда смогу точно подсказать по совместимости.",
    "tags": [
      "Общие",
      "Уточнить модель"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [],
    "defaultPriority": 104,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Уточнить модель"
  },
  {
    "id": "R05",
    "title": "Ответ задержался",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Здравствуйте! Извините за задержку с ответом. Если вопрос ещё актуален, готов помочь.",
    "tags": [
      "Общие",
      "Ответ задержался"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [],
    "defaultPriority": 105,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Ответ задержался"
  },
  {
    "id": "R06",
    "title": "Отложить товар",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Можем обсудить бронь до {{dateTime}}. Уточните, пожалуйста, когда планируете забрать или оформить заказ.",
    "tags": [
      "Общие",
      "Отложить товар"
    ],
    "requiredFields": [
      "dateTime"
    ],
    "guardFlags": [],
    "checklist": [
      "Не обещать бронь без согласования."
    ],
    "defaultPriority": 106,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Отложить товар"
  },
  {
    "id": "R07",
    "title": "Товар закончился",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Здравствуйте! К сожалению, эта модель уже закончилась. Могу предложить {{alternative}}, если вам подходит.",
    "tags": [
      "Общие",
      "Товар закончился"
    ],
    "requiredFields": [
      "alternative"
    ],
    "guardFlags": ["stockConfirmed", "stockUnavailable"],
    "checklist": [
      "Уточнить наличие замены."
    ],
    "defaultPriority": 107,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Товар закончился"
  },
  {
    "id": "R08",
    "title": "Есть белые геймпады Xbox",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Здравствуйте! Геймпад в чёрном цвете закончился, но есть белые. Если интересно, могу отправить фото и уточнить комплектацию.",
    "tags": [
      "Общие",
      "Есть белые геймпады Xbox"
    ],
    "requiredFields": [],
    "guardFlags": ["stockConfirmed", "stockUnavailable", "stockAvailable", "variantChecked"],
    "checklist": [
      "Проверить остаток."
    ],
    "defaultPriority": 108,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Есть белые геймпады Xbox"
  },
  {
    "id": "R09",
    "title": "Фото будут завтра",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Дополнительные фотографии смогу сделать только завтра. Если вам удобно, отправлю их сюда, в переписку.",
    "tags": [
      "Общие",
      "Фото будут завтра"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Отправлять, когда фото завтра действительно возможны."
    ],
    "defaultPriority": 109,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Фото будут завтра"
  },
  {
    "id": "R10",
    "title": "Попросили видео",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Видео товара могу отправить {{when}}. Подскажите, что именно хотите посмотреть: внешний вид, комплект или работу устройства?",
    "tags": [
      "Общие",
      "Попросили видео"
    ],
    "requiredFields": [
      "when"
    ],
    "guardFlags": [],
    "checklist": [
      "Согласовать срок."
    ],
    "defaultPriority": 110,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Попросили видео"
  },
  {
    "id": "R11",
    "title": "Комплект и активация",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "Здравствуйте! Цена указана за полный комплект шлема с активацией. Если хотите, дополнительно расскажу, что входит в комплект и какие настройки выполнены.",
    "tags": [
      "Шлемы Quest",
      "Комплект и активация"
    ],
    "requiredFields": [],
    "guardFlags": [
      "priceConfirmed"
    ],
    "checklist": [
      "Проверить состав конкретного комплекта."
    ],
    "defaultPriority": 111,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Комплект и активация"
  },
  {
    "id": "R12",
    "title": "15 игр в комплекте",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "Да, в предложении предусмотрены настройка шлема и установка 15 игр. Список игр и детали установки можем согласовать перед покупкой.",
    "tags": [
      "Шлемы Quest",
      "15 игр в комплекте"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Только для соответствующего объявления."
    ],
    "defaultPriority": 112,
    "revision": 1,
    "source": "Все ответы",
    "usage": "15 игр в комплекте"
  },
  {
    "id": "R13",
    "title": "Региональная версия",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "Версия шлема — европейская. Если нужно, уточню информацию по конкретной модели и её комплектации.",
    "tags": [
      "Шлемы Quest",
      "Региональная версия"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Только для соответствующей партии."
    ],
    "defaultPriority": 113,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Региональная версия"
  },
  {
    "id": "R14",
    "title": "Почему упаковка вскрыта",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "Шлемы перевозили в ручной клади, поэтому заводскую упаковку пришлось вскрыть. При этом состояние и комплектность конкретного шлема можем показать на дополнительных фото.",
    "tags": [
      "Шлемы Quest",
      "Почему упаковка вскрыта"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не утверждать «новый» без проверки."
    ],
    "defaultPriority": 114,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Почему упаковка вскрыта"
  },
  {
    "id": "R15",
    "title": "Работает ли без ПК",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "Да, Quest можно использовать самостоятельно, без ПК. Для некоторых игр и режимов подключение к компьютеру предусмотрено отдельно.",
    "tags": [
      "Шлемы Quest",
      "Работает ли без ПК"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [],
    "defaultPriority": 115,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Работает ли без ПК"
  },
  {
    "id": "R16",
    "title": "Quest 3 или Quest 3S",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "Обе модели работают самостоятельно. У Quest 3 более чёткая оптика и выше комфорт изображения; Quest 3S — более доступный вариант. Если расскажете, для чего берёте шлем, помогу выбрать.",
    "tags": [
      "Шлемы Quest",
      "Quest 3 или Quest 3S"
    ],
    "requiredFields": [],
    "guardFlags": ["stockConfirmed", "stockAvailable", "stockUnavailable", "variantChecked"],
    "checklist": [],
    "defaultPriority": 116,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Quest 3 или Quest 3S"
  },
  {
    "id": "R17",
    "title": "Проверка перед покупкой",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "При самовывозе можно согласовать осмотр комплекта и внешнего состояния. Напишите, когда вам удобно приехать.",
    "tags": [
      "Шлемы Quest",
      "Проверка перед покупкой"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Возможность включения уточнять отдельно."
    ],
    "defaultPriority": 117,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Проверка перед покупкой"
  },
  {
    "id": "R18",
    "title": "Гарантия на шлем",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "По условиям гарантии и обслуживания именно этого шлема лучше уточнить отдельно — не хочу обещать то, что не смогу подтвердить.",
    "tags": [
      "Шлемы Quest",
      "Гарантия на шлем"
    ],
    "requiredFields": [],
    "guardFlags": [
      "termsConfirmed"
    ],
    "checklist": [
      "Не путать с гарантией аксессуаров."
    ],
    "defaultPriority": 118,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Гарантия на шлем"
  },
  {
    "id": "R19",
    "title": "Совместимость Quest 3 / 3S",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Здравствуйте! Этот аксессуар подходит для Meta Quest 3 и Quest 3S. Если хотите, могу дополнительно показать крепление на фото.",
    "tags": [
      "Аксессуары",
      "Совместимость Quest 3 / 3S"
    ],
    "requiredFields": [],
    "guardFlags": [
      "compatibilityChecked"
    ],
    "checklist": [
      "Только для совместимой позиции."
    ],
    "defaultPriority": 119,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Совместимость Quest 3 / 3S"
  },
  {
    "id": "R20",
    "title": "Уточнить совместимость",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Подскажите модель вашего шлема. Проверю совместимость именно с вашим устройством, чтобы не ошибиться.",
    "tags": [
      "Аксессуары",
      "Уточнить совместимость"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [],
    "defaultPriority": 120,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Уточнить совместимость"
  },
  {
    "id": "R21",
    "title": "Ремешок с АКБ 10 000 мА·ч",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Есть ремешок с аккумулятором 10 000 мА·ч. Перед покупкой уточню комплектность именно того экземпляра, который будем отправлять.",
    "tags": [
      "Аксессуары",
      "Ремешок с АКБ 10 000 мА·ч"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Комплектность может быть неполной."
    ],
    "defaultPriority": 121,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Ремешок с АКБ 10 000 мА·ч"
  },
  {
    "id": "R22",
    "title": "Б/у ремешок Quest 2",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Ремешок для Quest 2, б/у. Обратите внимание: резинок в комплекте нет. При необходимости пришлю дополнительные фотографии.",
    "tags": [
      "Аксессуары",
      "Б/у ремешок Quest 2"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не скрывать отсутствие резинок."
    ],
    "defaultPriority": 122,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Б/у ремешок Quest 2"
  },
  {
    "id": "R23",
    "title": "Зарядная станция + B2",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "В комплекте зарядная станция и один аккумулятор B2. Если нужна фотография комплекта — отправлю.",
    "tags": [
      "Аксессуары",
      "Зарядная станция + B2"
    ],
    "requiredFields": [],
    "guardFlags": [
      "stockConfirmed",
      "stockAvailable"
    ],
    "checklist": [
      "Проверить наличие."
    ],
    "defaultPriority": 123,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Зарядная станция + B2"
  },
  {
    "id": "R24",
    "title": "Оригинальный Link-кабель",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Это оригинальный Link-кабель. Могу дополнительно уточнить длину и состояние именно этого экземпляра.",
    "tags": [
      "Аксессуары",
      "Оригинальный Link-кабель"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Проверить характеристики и состояние."
    ],
    "defaultPriority": 124,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Оригинальный Link-кабель"
  },
  {
    "id": "R25",
    "title": "Гарантия аксессуара",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "На этот аксессуар действует гарантия 14 дней. Если возникнут вопросы после получения, напишите нам — разберёмся.",
    "tags": [
      "Аксессуары",
      "Гарантия аксессуара"
    ],
    "requiredFields": [],
    "guardFlags": [
      "termsConfirmed"
    ],
    "checklist": [
      "Только для аксессуаров с таким условием."
    ],
    "defaultPriority": 125,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Гарантия аксессуара"
  },
  {
    "id": "R26",
    "title": "Несколько экземпляров",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Да, в наличии несколько экземпляров. Перед отправкой проверим комплектность и состояние выбранного товара.",
    "tags": [
      "Аксессуары",
      "Несколько экземпляров"
    ],
    "requiredFields": [],
    "guardFlags": ["stockConfirmed", "stockAvailable"],
    "checklist": [
      "Проверить текущий остаток."
    ],
    "defaultPriority": 126,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Несколько экземпляров"
  },
  {
    "id": "R27",
    "title": "Состояние б/у товара",
    "category": "product",
    "stage": "R",
    "audience": "buyer",
    "body": "Состояние товара указано в объявлении. Если хотите, могу отдельно показать места, которые вас интересуют, чтобы всё было понятно до покупки.",
    "tags": [
      "Аксессуары",
      "Состояние б/у товара"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [],
    "defaultPriority": 127,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Состояние б/у товара"
  },
  {
    "id": "R28",
    "title": "Цены на настройку",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "Настройка Quest: активация и первый запуск — 790 ₽; установка до 10 игр — 2 490 ₽; настройка под ключ — 3 490 ₽. Подскажите модель шлема и что хотите сделать — подберу вариант.",
    "tags": [
      "Настройка Quest",
      "Цены на настройку"
    ],
    "requiredFields": [],
    "guardFlags": [
      "stockConfirmed",
      "priceConfirmed"
    ],
    "checklist": [
      "Проверить актуальность прайса."
    ],
    "defaultPriority": 128,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Цены на настройку"
  },
  {
    "id": "R29",
    "title": "Какие игры доступны",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "Есть большой каталог игр. Напишите модель шлема и какие жанры интересуют — подскажу доступные варианты и согласуем список заранее.",
    "tags": [
      "Настройка Quest",
      "Какие игры доступны"
    ],
    "requiredFields": [],
    "guardFlags": [
      "stockConfirmed"
    ],
    "checklist": [
      "Не обещать конкретную игру без проверки."
    ],
    "defaultPriority": 129,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Какие игры доступны"
  },
  {
    "id": "R30",
    "title": "Как проходит настройка",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "Сначала уточняем модель шлема и ваши пожелания, затем согласуем состав работ и стоимость. После настройки покажем, что сделано, и объясним, как пользоваться.",
    "tags": [
      "Настройка Quest",
      "Как проходит настройка"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [],
    "defaultPriority": 130,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Как проходит настройка"
  },
  {
    "id": "R31",
    "title": "Удалённая настройка",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "Часть задач по настройке Quest можно выполнить удалённо. Напишите модель шлема и что именно нужно настроить — уточню, получится ли помочь без личной встречи.",
    "tags": [
      "Настройка Quest",
      "Удалённая настройка"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не обещать удалённую установку всего."
    ],
    "defaultPriority": 131,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Удалённая настройка"
  },
  {
    "id": "R32",
    "title": "Режим разработчика",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "Поможем с настройкой режима разработчика на Quest. Для начала уточним модель шлема и состояние аккаунта.",
    "tags": [
      "Настройка Quest",
      "Режим разработчика"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Проверить техническую возможность."
    ],
    "defaultPriority": 132,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Режим разработчика"
  },
  {
    "id": "R33",
    "title": "Quest Link с компьютером",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "Поможем разобраться с Quest Link и подключением к компьютеру. Для начала напишите модель шлема и характеристики ПК, чтобы оценить совместимость.",
    "tags": [
      "Настройка Quest",
      "Quest Link с компьютером"
    ],
    "requiredFields": [],
    "guardFlags": [
      "compatibilityChecked",
      "priceConfirmed"
    ],
    "checklist": [],
    "defaultPriority": 133,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Quest Link с компьютером"
  },
  {
    "id": "R34",
    "title": "Обновления шлема",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "Можем проверить версию системы и варианты обновления. Сначала уточним модель, текущую версию и какую проблему вы хотите решить.",
    "tags": [
      "Настройка Quest",
      "Обновления шлема"
    ],
    "requiredFields": [],
    "guardFlags": [
      "stockConfirmed"
    ],
    "checklist": [],
    "defaultPriority": 134,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Обновления шлема"
  },
  {
    "id": "R35",
    "title": "Wi-Fi / роутер",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "Поможем разобраться с подключением шлема к Wi-Fi и настройками сети. Напишите модель роутера и опишите проблему — предложу решение.",
    "tags": [
      "Настройка Quest",
      "Wi-Fi / роутер"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [],
    "defaultPriority": 135,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Wi-Fi / роутер"
  },
  {
    "id": "R36",
    "title": "Проблема после настройки",
    "category": "quest",
    "stage": "R",
    "audience": "buyer",
    "body": "Напишите, пожалуйста, что именно не работает, и по возможности пришлите фото или текст ошибки. Постараемся помочь разобраться.",
    "tags": [
      "Настройка Quest",
      "Проблема после настройки"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Проверить условия поддержки заказа."
    ],
    "defaultPriority": 136,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Проблема после настройки"
  },
  {
    "id": "R37",
    "title": "Самовывоз — адрес",
    "category": "delivery",
    "stage": "R",
    "audience": "buyer",
    "body": "Самовывоз в Екатеринбурге: адрес, который сообщу после подтверждения встречи. Время необходимо согласовать заранее. Пожалуйста, напишите или позвоните минимум за час до приезда.",
    "tags": [
      "Доставка",
      "Самовывоз — адрес"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Самовывоз по договорённости."
    ],
    "defaultPriority": 137,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Самовывоз — адрес"
  },
  {
    "id": "R38",
    "title": "Контакт выдачи",
    "category": "delivery",
    "stage": "R",
    "audience": "buyer",
    "body": "Товар выдаст {{handoverName}}, телефон: {{handoverPhone}}. Пожалуйста, согласуйте время заранее и предупредите его минимум за час до приезда.",
    "tags": [
      "Доставка",
      "Контакт выдачи"
    ],
    "requiredFields": [
      "handoverName",
      "handoverPhone"
    ],
    "guardFlags": [
      "contactPermission"
    ],
    "checklist": [
      "Согласовать человека на выдаче."
    ],
    "defaultPriority": 138,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Контакт выдачи"
  },
  {
    "id": "R39",
    "title": "Выдача до 20:00",
    "category": "delivery",
    "stage": "R",
    "audience": "buyer",
    "body": "Забрать можно по предварительной договорённости, ориентировочно до 20:00. Напишите, во сколько планируете приехать, чтобы мы подтвердили время.",
    "tags": [
      "Доставка",
      "Выдача до 20:00"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не подтверждать без согласования."
    ],
    "defaultPriority": 139,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Выдача до 20:00"
  },
  {
    "id": "R40",
    "title": "Авито Доставка",
    "category": "delivery",
    "stage": "R",
    "audience": "buyer",
    "body": "Да, можно оформить Авито Доставку прямо через объявление. Срок и стоимость доставки будут показаны при оформлении заказа.",
    "tags": [
      "Доставка",
      "Авито Доставка"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Проверить, включена ли доставка."
    ],
    "defaultPriority": 140,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Авито Доставка"
  },
  {
    "id": "R41",
    "title": "Отправка в другие города",
    "category": "delivery",
    "stage": "R",
    "audience": "buyer",
    "body": "Отправляем заказы в другие города через доступные способы доставки Авито. Выберите удобный пункт выдачи при оформлении заказа.",
    "tags": [
      "Доставка",
      "Отправка в другие города"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Проверить ограничения категории."
    ],
    "defaultPriority": 141,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Отправка в другие города"
  },
  {
    "id": "R42",
    "title": "Оформляйте заказ",
    "category": "delivery",
    "stage": "R",
    "audience": "buyer",
    "body": "Да, можете оформлять заказ через Авито. Как только заказ появится у нас, подготовим товар к отправке.",
    "tags": [
      "Доставка",
      "Оформляйте заказ"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не обещать конкретный день отправки."
    ],
    "defaultPriority": 142,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Оформляйте заказ"
  },
  {
    "id": "R43",
    "title": "Можно отправить быстрее?",
    "category": "delivery",
    "stage": "R",
    "audience": "buyer",
    "body": "Понимаю. Постараемся подготовить заказ как можно быстрее, но точный срок смогу подтвердить после оформления и проверки доступного времени отправки.",
    "tags": [
      "Доставка",
      "Можно отправить быстрее?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [],
    "defaultPriority": 143,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Можно отправить быстрее?"
  },
  {
    "id": "R44",
    "title": "Посылка прибыла",
    "category": "delivery",
    "stage": "R",
    "audience": "buyer",
    "body": "Здравствуйте! Вижу, что заказ прибыл в пункт выдачи. Будем рады, если сможете забрать его в удобное время. Если возникнут вопросы — пишите.",
    "tags": [
      "Доставка",
      "Посылка прибыла"
    ],
    "requiredFields": [],
    "guardFlags": ["arrivedVerified"],
    "checklist": [
      "Проверить статус заказа."
    ],
    "defaultPriority": 144,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Посылка прибыла"
  },
  {
    "id": "R45",
    "title": "Заказ получен",
    "category": "delivery",
    "stage": "R",
    "audience": "buyer",
    "body": "Здравствуйте! Спасибо за покупку. Надеюсь, всё подошло. Если появятся вопросы по товару — обращайтесь.",
    "tags": [
      "Доставка",
      "Заказ получен"
    ],
    "requiredFields": [],
    "guardFlags": ["receivedVerified", "noIssueOpen"],
    "checklist": [],
    "defaultPriority": 145,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Заказ получен"
  },
  {
    "id": "R46",
    "title": "Торг — пока без скидки",
    "category": "general",
    "stage": "R",
    "audience": "buyer",
    "body": "Спасибо за предложение! Пока цена актуальная, снижать не планируем. Если предложение заинтересует по текущей цене, будем рады оформить заказ.",
    "tags": [
      "Продажи",
      "Торг — пока без скидки"
    ],
    "requiredFields": [],
    "guardFlags": [
      "priceConfirmed"
    ],
    "checklist": [
      "Сверить согласованный минимум."
    ],
    "defaultPriority": 146,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Торг — пока без скидки"
  },
  {
    "id": "R47",
    "title": "Небольшой торг",
    "category": "general",
    "stage": "R",
    "audience": "buyer",
    "body": "Небольшой торг можем обсудить. Напишите, какую цену предлагаете, и я уточню возможность.",
    "tags": [
      "Продажи",
      "Небольшой торг"
    ],
    "requiredFields": [],
    "guardFlags": [
      "priceConfirmed"
    ],
    "checklist": [
      "Только если торг разрешён."
    ],
    "defaultPriority": 147,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Небольшой торг"
  },
  {
    "id": "R48",
    "title": "Скидка за несколько товаров",
    "category": "general",
    "stage": "R",
    "audience": "buyer",
    "body": "Если планируете взять несколько позиций, напишите какие именно. Проверю наличие и посмотрю, какую общую цену можем предложить.",
    "tags": [
      "Продажи",
      "Скидка за несколько товаров"
    ],
    "requiredFields": [],
    "guardFlags": [
      "stockConfirmed",
      "priceConfirmed"
    ],
    "checklist": [
      "Не обещать скидку."
    ],
    "defaultPriority": 148,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Скидка за несколько товаров"
  },
  {
    "id": "R49",
    "title": "Покупатель перестал отвечать",
    "category": "general",
    "stage": "R",
    "audience": "buyer",
    "body": "Здравствуйте! Подскажите, ваш вопрос по товару ещё актуален? Если нужна дополнительная информация, с удовольствием помогу.",
    "tags": [
      "Продажи",
      "Покупатель перестал отвечать"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Одно ненавязчивое напоминание."
    ],
    "defaultPriority": 149,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Покупатель перестал отвечать"
  },
  {
    "id": "R50",
    "title": "Попросить отзыв",
    "category": "after-purchase",
    "stage": "R",
    "audience": "buyer",
    "body": "Спасибо за покупку! Если всё понравилось, будем очень признательны за отзыв на Авито. Для нас это действительно важно.",
    "tags": [
      "После покупки",
      "Попросить отзыв"
    ],
    "requiredFields": [],
    "guardFlags": [
      "receivedVerified",
      "noIssueOpen",
      "reviewNotRequested"
    ],
    "checklist": [
      "Просить честный отзыв."
    ],
    "defaultPriority": 150,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Попросить отзыв"
  },
  {
    "id": "R51",
    "title": "Проблема с товаром",
    "category": "after-purchase",
    "stage": "R",
    "audience": "buyer",
    "body": "Здравствуйте! Спасибо, что написали. Опишите, пожалуйста, проблему и, если возможно, приложите фото или видео. Проверим ситуацию и предложим решение.",
    "tags": [
      "После покупки",
      "Проблема с товаром"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [],
    "defaultPriority": 151,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Проблема с товаром"
  },
  {
    "id": "R52",
    "title": "Спасибо за отзыв",
    "category": "after-purchase",
    "stage": "R",
    "audience": "buyer",
    "body": "Спасибо, что нашли время оставить отзыв! Очень приятно, что вы поделились впечатлением. Будем рады помочь снова.",
    "tags": [
      "После покупки",
      "Спасибо за отзыв"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [],
    "defaultPriority": 152,
    "revision": 1,
    "source": "Все ответы",
    "usage": "Спасибо за отзыв"
  },
  {
    "id": "auto-01",
    "title": "Приветствие",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Здравствуйте! Спасибо за сообщение. Если вопрос по товару — напишите, что именно хотите уточнить. Если по настройке Quest — укажите модель шлема и задачу. Отвечу лично, как только смогу.",
    "tags": [
      "Общие",
      "Приветствие"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не обещает конкретное время"
    ],
    "defaultPriority": 201,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "Включить"
  },
  {
    "id": "auto-02",
    "title": "Товар в наличии?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Здравствуйте! Наличие конкретного экземпляра уточню и отвечу здесь. Если рассматриваете несколько вариантов, напишите какие.",
    "tags": [
      "Товары",
      "Товар в наличии?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не подтверждает остатки автоматически"
    ],
    "defaultPriority": 202,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "Включить"
  },
  {
    "id": "auto-03",
    "title": "Какая окончательная цена?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Актуальная цена указана в объявлении. Если нужна другая комплектация или дополнительные услуги, уточню итоговую стоимость отдельно.",
    "tags": [
      "Общие",
      "Какая окончательная цена?"
    ],
    "requiredFields": [],
    "guardFlags": [
      "priceConfirmed"
    ],
    "checklist": [
      "Не обещает скидку или старую цену"
    ],
    "defaultPriority": 203,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "Включить"
  },
  {
    "id": "auto-04",
    "title": "Отправляете Авито Доставкой?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Если в объявлении доступна Авито Доставка, можно оформить заказ через него. Стоимость и срок доставки Авито покажет при оформлении.",
    "tags": [
      "Общие",
      "Отправляете Авито Доставкой?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не обещает доставку для каждого товара"
    ],
    "defaultPriority": 204,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "Включить"
  },
  {
    "id": "auto-05",
    "title": "Можно забрать самовывозом?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Самовывоз обсуждаем заранее. Напишите, пожалуйста, в какой день и во сколько вам удобно приехать — проверю возможность выдачи.",
    "tags": [
      "Общие",
      "Можно забрать самовывозом?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не подтверждает точное время"
    ],
    "defaultPriority": 205,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "Включить"
  },
  {
    "id": "auto-06",
    "title": "Где вы находитесь?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Обычно самовывоз возможен в Екатеринбурге, в районе Академический. Точный адрес и согласованное время подтвержу в переписке.",
    "tags": [
      "Общие",
      "Где вы находитесь?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не отправляет адрес без согласования"
    ],
    "defaultPriority": 206,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "Включить"
  },
  {
    "id": "auto-07",
    "title": "Когда можно забрать?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Выдача по предварительной договорённости. Напишите удобные день и время — подтвердим, когда сможем передать товар.",
    "tags": [
      "Общие",
      "Когда можно забрать?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не обещает график"
    ],
    "defaultPriority": 207,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "Включить"
  },
  {
    "id": "auto-08",
    "title": "Когда отправите заказ?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Срок подготовки зависит от заказа и способа доставки. После оформления смогу уточнить, когда получится передать его в доставку.",
    "tags": [
      "Общие",
      "Когда отправите заказ?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не обещает отправку сегодня"
    ],
    "defaultPriority": 208,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "Включить"
  },
  {
    "id": "auto-09",
    "title": "Возможен торг?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Спасибо за предложение! Напишите, пожалуйста, какую цену предлагаете. Уточню, возможен ли такой вариант.",
    "tags": [
      "Общие",
      "Возможен торг?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не обещает снижение цены"
    ],
    "defaultPriority": 209,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "Включить"
  },
  {
    "id": "auto-10",
    "title": "Можно дополнительные фото?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Дополнительные фото по возможности сделаю. Напишите, какой ракурс или деталь вас интересует, — проверю, когда смогу отправить.",
    "tags": [
      "Товары",
      "Можно дополнительные фото?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не обещает фото сегодня"
    ],
    "defaultPriority": 210,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "Включить"
  },
  {
    "id": "auto-11",
    "title": "Что входит в комплект?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Комплектация зависит от конкретной позиции. Напишите, какую деталь хотите уточнить, — проверю состав комплекта перед покупкой.",
    "tags": [
      "Товары",
      "Что входит в комплект?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не обещает полный комплект всем товарам"
    ],
    "defaultPriority": 211,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "Включить"
  },
  {
    "id": "auto-12",
    "title": "Какое состояние?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Состояние конкретного товара указано в объявлении. Если остались вопросы, напишите, что важно проверить, — уточню и при необходимости пришлю фото.",
    "tags": [
      "Товары",
      "Какое состояние?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не утверждает «новый» автоматически"
    ],
    "defaultPriority": 212,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "Включить"
  },
  {
    "id": "auto-13",
    "title": "Подойдёт для Quest 2 / 3 / 3S?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Совместимость зависит от аксессуара и модели шлема. Напишите модель вашего Quest и название аксессуара — проверю перед покупкой.",
    "tags": [
      "Товары",
      "Подойдёт для Quest 2 / 3 / 3S?"
    ],
    "requiredFields": [],
    "guardFlags": [
      "compatibilityChecked"
    ],
    "checklist": [
      "Для аксессуаров Quest"
    ],
    "defaultPriority": 213,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "По категории"
  },
  {
    "id": "auto-14",
    "title": "Есть гарантия?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Условия гарантии зависят от конкретного товара. Перед покупкой уточню срок и условия для выбранной позиции.",
    "tags": [
      "Товары",
      "Есть гарантия?"
    ],
    "requiredFields": [],
    "guardFlags": [
      "termsConfirmed"
    ],
    "checklist": [
      "Не распространяет 14 дней на все шлемы"
    ],
    "defaultPriority": 214,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "Включить"
  },
  {
    "id": "auto-15",
    "title": "Есть другой цвет?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Цвета и остатки могут меняться. Напишите, какой цвет нужен, — проверю доступные варианты.",
    "tags": [
      "Товары",
      "Есть другой цвет?"
    ],
    "requiredFields": [],
    "guardFlags": [
      "stockConfirmed"
    ],
    "checklist": [
      "Геймпады и товары с цветами"
    ],
    "defaultPriority": 215,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "По категории"
  },
  {
    "id": "auto-16",
    "title": "Сколько стоит настройка Quest?",
    "category": "general",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Стоимость зависит от того, что именно нужно сделать. В объявлении указаны варианты услуг; напишите модель Quest и задачу — уточню подходящий вариант и итоговую стоимость.",
    "tags": [
      "Услуги",
      "Сколько стоит настройка Quest?"
    ],
    "requiredFields": [],
    "guardFlags": [
      "stockConfirmed"
    ],
    "checklist": [
      "Только для услуг настройки Quest"
    ],
    "defaultPriority": 216,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "По категории"
  },
  {
    "id": "auto-17",
    "title": "Можно настроить удалённо?",
    "category": "general",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Некоторые задачи по настройке Quest можно выполнить удалённо. Напишите модель шлема и опишите, что нужно сделать, — уточню, возможно ли это в вашем случае.",
    "tags": [
      "Услуги",
      "Можно настроить удалённо?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Только для услуг Quest"
    ],
    "defaultPriority": 217,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "По категории"
  },
  {
    "id": "auto-18",
    "title": "Какие игры можно установить?",
    "category": "general",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Список совместимых игр зависит от модели шлема и выбранного способа установки. Напишите интересующие названия или жанры — уточню доступные варианты.",
    "tags": [
      "Услуги",
      "Какие игры можно установить?"
    ],
    "requiredFields": [],
    "guardFlags": [
      "stockConfirmed",
      "compatibilityChecked",
      "termsConfirmed"
    ],
    "checklist": [
      "Не гарантирует доступность конкретной игры"
    ],
    "defaultPriority": 218,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "По категории"
  },
  {
    "id": "auto-19",
    "title": "Нужно отправить пароль или код?",
    "category": "safety",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Нет, присылать пароли, коды подтверждения или платёжные данные в чат не нужно. Если для настройки потребуется вход в ваш аккаунт, данные вы введёте самостоятельно.",
    "tags": [
      "Безопасность",
      "Нужно отправить пароль или код?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Только для услуг с аккаунтами"
    ],
    "defaultPriority": 219,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "По категории"
  },
  {
    "id": "auto-20",
    "title": "Можно оплатить по ссылке?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Для заказа с Авито Доставкой используйте оформление и оплату внутри Авито. Не переходите по сторонним платёжным ссылкам и не отправляйте коды подтверждения.",
    "tags": [
      "Общие",
      "Можно оплатить по ссылке?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "При вопросах об оплате"
    ],
    "defaultPriority": 220,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "По категории"
  },
  {
    "id": "auto-21",
    "title": "Можно забронировать?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Бронь возможна только после согласования. Напишите, пожалуйста, до какого дня нужно отложить товар, — уточню возможность.",
    "tags": [
      "Общие",
      "Можно забронировать?"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не обещает бронь"
    ],
    "defaultPriority": 221,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "Включить"
  },
  {
    "id": "auto-22",
    "title": "Если товар не подойдёт?",
    "category": "product",
    "stage": "AUTO",
    "audience": "buyer",
    "body": "Условия возврата зависят от товара и способа получения. Расскажите, что именно беспокоит, — уточню порядок действий до оформления.",
    "tags": [
      "Общие",
      "Если товар не подойдёт?"
    ],
    "requiredFields": [],
    "guardFlags": [
      "termsConfirmed"
    ],
    "checklist": [
      "Не ограничивает права покупателя"
    ],
    "defaultPriority": 222,
    "revision": 1,
    "source": "Автоответы — безопасные",
    "usage": "Включить"
  },
  {
    "id": "scenario-01",
    "title": "Первый ответ: товар актуален",
    "category": "general",
    "stage": "СТАРТ",
    "audience": "buyer",
    "body": "Здравствуйте! Да, товар в наличии. Вам удобнее оформить Авито Доставку или забрать самостоятельно?",
    "tags": [
      "СТАРТ",
      "Первый ответ: товар актуален"
    ],
    "requiredFields": [],
    "guardFlags": [
      "stockConfirmed"
    ],
    "checklist": [
      "Наличие именно этого товара подтверждено."
    ],
    "defaultPriority": 301,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "После проверки остатка"
  },
  {
    "id": "scenario-02",
    "title": "Уточнить потребность",
    "category": "general",
    "stage": "СТАРТ",
    "audience": "buyer",
    "body": "Здравствуйте! Подскажите, пожалуйста, какая модель устройства у вас и что именно важно уточнить? Так смогу ответить точнее.",
    "tags": [
      "СТАРТ",
      "Уточнить потребность"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не задавать вопрос, если ответ уже виден в чате."
    ],
    "defaultPriority": 302,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Когда вопрос неполный"
  },
  {
    "id": "scenario-03",
    "title": "Товар закончился",
    "category": "general",
    "stage": "СТАРТ",
    "audience": "buyer",
    "body": "К сожалению, этот вариант закончился. Могу предложить {{alternative}}, если вам подойдёт.",
    "tags": [
      "СТАРТ",
      "Товар закончился"
    ],
    "requiredFields": [
      "alternative"
    ],
    "guardFlags": [
      "stockConfirmed"
    ],
    "checklist": [
      "Альтернатива реально есть."
    ],
    "defaultPriority": 303,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "После проверки остатков"
  },
  {
    "id": "scenario-04",
    "title": "Предложить оформить",
    "category": "delivery",
    "stage": "ДОСТАВКА",
    "audience": "buyer",
    "body": "Да, можно оформить Авито Доставку через объявление. Стоимость и сроки Авито покажет при оформлении.",
    "tags": [
      "ДОСТАВКА",
      "Предложить оформить"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "В объявлении доступна доставка и товар есть."
    ],
    "defaultPriority": 304,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Когда доставка доступна"
  },
  {
    "id": "scenario-05",
    "title": "После оформления заказа",
    "category": "delivery",
    "stage": "ДОСТАВКА",
    "audience": "buyer",
    "body": "Здравствуйте! Спасибо за заказ! Подготовим товар к отправке. Как только передадим его в доставку, сообщим.",
    "tags": [
      "ДОСТАВКА",
      "После оформления заказа"
    ],
    "requiredFields": [],
    "guardFlags": [
      "stockConfirmed"
    ],
    "checklist": [
      "Проверить наличие заказа и дедлайн передачи."
    ],
    "defaultPriority": 305,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "После появления заказа у продавца"
  },
  {
    "id": "scenario-06",
    "title": "Просит отправить сегодня",
    "category": "delivery",
    "stage": "ДОСТАВКА",
    "audience": "buyer",
    "body": "Понимаю. Уточню, получится ли передать заказ сегодня, и напишу вам. Пока не хочу обещать срок без подтверждения.",
    "tags": [
      "ДОСТАВКА",
      "Просит отправить сегодня"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Уточнить возможность и дедлайн Авито."
    ],
    "defaultPriority": 306,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Покупатель указал срочный срок"
  },
  {
    "id": "scenario-07",
    "title": "Сегодня отправить нельзя",
    "category": "delivery",
    "stage": "ДОСТАВКА",
    "audience": "buyer",
    "body": "Сегодня передать заказ не получится. Постараемся отправить {{date}}, если успеем в срок Авито. Подойдёт такой вариант?",
    "tags": [
      "ДОСТАВКА",
      "Сегодня отправить нельзя"
    ],
    "requiredFields": [
      "date"
    ],
    "guardFlags": [
      "stockConfirmed"
    ],
    "checklist": [
      "Сначала сверить сроки и реальную возможность."
    ],
    "defaultPriority": 307,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "После фактической проверки возможности"
  },
  {
    "id": "scenario-08",
    "title": "Отправили",
    "category": "delivery",
    "stage": "ДОСТАВКА",
    "audience": "buyer",
    "body": "Здравствуйте! Заказ передали в доставку. Статус и ориентировочную дату получения можно отслеживать в Авито. Если будут вопросы — пишите.",
    "tags": [
      "ДОСТАВКА",
      "Отправили"
    ],
    "requiredFields": [],
    "guardFlags": ["shippedVerified"],
    "checklist": [
      "Статус отправки подтверждён."
    ],
    "defaultPriority": 308,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Только после передачи перевозчику"
  },
  {
    "id": "scenario-09",
    "title": "Прибыл в ПВЗ",
    "category": "delivery",
    "stage": "ДОСТАВКА",
    "audience": "buyer",
    "body": "Здравствуйте! Вижу, что заказ прибыл в пункт выдачи. Забрать его можно в срок, указанный в Авито. Если будут вопросы, пишите.",
    "tags": [
      "ДОСТАВКА",
      "Прибыл в ПВЗ"
    ],
    "requiredFields": [],
    "guardFlags": ["arrivedVerified"],
    "checklist": [
      "Не отправлять при задержке в пути."
    ],
    "defaultPriority": 309,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "После уведомления о прибытии"
  },
  {
    "id": "scenario-10",
    "title": "Запрос по отслеживанию",
    "category": "delivery",
    "stage": "ДОСТАВКА",
    "audience": "buyer",
    "body": "Актуальный статус и ориентировочный срок доставки можно посмотреть на странице заказа в Авито. Если там есть задержка или ошибка, напишите — разберёмся.",
    "tags": [
      "ДОСТАВКА",
      "Запрос по отслеживанию"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не придумывать сроки."
    ],
    "defaultPriority": 310,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Спрашивает, где посылка"
  },
  {
    "id": "scenario-11",
    "title": "Спасибо после доставки",
    "category": "delivery",
    "stage": "ДОСТАВКА",
    "audience": "buyer",
    "body": "Спасибо за покупку! Надеемся, всё подошло. Если возникнут вопросы по товару — пишите.",
    "tags": [
      "ДОСТАВКА",
      "Спасибо после доставки"
    ],
    "requiredFields": [],
    "guardFlags": ["receivedVerified", "noIssueOpen"],
    "checklist": [
      "Убедиться, что заказ действительно получен."
    ],
    "defaultPriority": 311,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Статус подтверждает получение"
  },
  {
    "id": "scenario-12",
    "title": "Первый запрос",
    "category": "pickup",
    "stage": "САМОВЫВОЗ",
    "audience": "buyer",
    "body": "Здравствуйте! Самовывоз возможен в Екатеринбурге, в Академическом районе. Напишите, пожалуйста, удобные день и время — я сначала уточню возможность выдачи, после этого подтвержу встречу.",
    "tags": [
      "САМОВЫВОЗ",
      "Первый запрос"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не давать обещаний без согласования."
    ],
    "defaultPriority": 312,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Когда просит адрес, день или часы"
  },
  {
    "id": "scenario-13",
    "title": "Покупатель указал дату и время",
    "category": "pickup",
    "stage": "САМОВЫВОЗ",
    "audience": "buyer",
    "body": "Хорошо, уточню, сможет ли человек выдать товар {{date}} в {{time}}, и вернусь с подтверждением. Пока не выезжайте, пожалуйста.",
    "tags": [
      "САМОВЫВОЗ",
      "Покупатель указал дату и время"
    ],
    "requiredFields": [
      "date",
      "time"
    ],
    "guardFlags": [],
    "checklist": [
      "Пока нет согласования — встреча не назначена."
    ],
    "defaultPriority": 313,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "До связи с выдающим"
  },
  {
    "id": "scenario-14",
    "title": "Согласовать с человеком на точке",
    "category": "pickup",
    "stage": "САМОВЫВОЗ",
    "audience": "handover",
    "body": "Привет! Покупатель хочет забрать {{product}} {{date}} в {{time}} на место выдачи. Он у тебя есть? Сможешь выдать и встретить в это время? Напиши, пожалуйста, подтверждение.",
    "tags": [
      "САМОВЫВОЗ",
      "Согласовать с человеком на точке"
    ],
    "requiredFields": [
      "product",
      "date",
      "time"
    ],
    "guardFlags": ["handoverContext"],
    "checklist": [
      "Проверить фактическое наличие у выдающего."
    ],
    "defaultPriority": 314,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "После предложения покупателя"
  },
  {
    "id": "scenario-15",
    "title": "Нет ответа от выдающего",
    "category": "pickup",
    "stage": "САМОВЫВОЗ",
    "audience": "buyer",
    "body": "Пока не удалось подтвердить выдачу на это время. Я уточняю возможность и обязательно напишу до того, как вам ехать.",
    "tags": [
      "САМОВЫВОЗ",
      "Нет ответа от выдающего"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не обещать быстрый ответ или готовность."
    ],
    "defaultPriority": 315,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Если подтверждение задерживается"
  },
  {
    "id": "scenario-16",
    "title": "Выдающий не может",
    "category": "pickup",
    "stage": "САМОВЫВОЗ",
    "audience": "buyer",
    "body": "К сожалению, в предложенное время выдать товар не получится. Назовите, пожалуйста, ещё пару удобных вариантов — уточню, когда сможем встретить.",
    "tags": [
      "САМОВЫВОЗ",
      "Выдающий не может"
    ],
    "requiredFields": [],
    "guardFlags": [
      "stockConfirmed"
    ],
    "checklist": [
      "Не предлагать неподтверждённый час."
    ],
    "defaultPriority": 316,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "После отрицательного подтверждения"
  },
  {
    "id": "scenario-17",
    "title": "Встреча подтверждена",
    "category": "pickup",
    "stage": "САМОВЫВОЗ",
    "audience": "buyer",
    "body": "Самовывоз подтвердили на {{date}} в {{time}}. Адрес: {{address}}. Товар выдаст {{handoverName}}, телефон {{handoverPhone}}. Пожалуйста, предупредите минимум за час до приезда. Если планы изменятся — напишите заранее.",
    "tags": [
      "САМОВЫВОЗ",
      "Встреча подтверждена"
    ],
    "requiredFields": [
      "date",
      "time",
      "address",
      "handoverName",
      "handoverPhone"
    ],
    "guardFlags": [
      "contactPermission",
      "stockConfirmed",
      "handoverConfirmed",
      "addressConfirmed"
    ],
    "checklist": [
      "Подтверждение выдающего + разрешение передать контакт."
    ],
    "defaultPriority": 317,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Выдающий подтвердил товар/слот/контакт"
  },
  {
    "id": "scenario-18",
    "title": "Напоминание за час",
    "category": "pickup",
    "stage": "САМОВЫВОЗ",
    "audience": "buyer",
    "body": "Напоминаю, пожалуйста, перед выездом предупредите минимум за час по указанному номеру или здесь в чате, чтобы вас точно встретили.",
    "tags": [
      "САМОВЫВОЗ",
      "Напоминание за час"
    ],
    "requiredFields": [],
    "guardFlags": ["stockConfirmed", "handoverConfirmed", "buyerNotified", "addressConfirmed", "contactPermission"],
    "checklist": [
      "Не отправлять, если поездка отменена."
    ],
    "defaultPriority": 318,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Если выезд уже согласован"
  },
  {
    "id": "scenario-19",
    "title": "Покупатель приехал",
    "category": "pickup",
    "stage": "САМОВЫВОЗ",
    "audience": "handover",
    "body": "Покупатель по {{product}} приехал и ждёт на месте. Сможешь его встретить? Если нужен конкретный подъезд, напиши.",
    "tags": [
      "САМОВЫВОЗ",
      "Покупатель приехал"
    ],
    "requiredFields": [
      "product"
    ],
    "guardFlags": [],
    "checklist": [
      "Не придумывать подъезд, этаж и номер квартиры."
    ],
    "defaultPriority": 319,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Если покупатель сообщил, что на месте"
  },
  {
    "id": "scenario-20",
    "title": "Уточнить вход",
    "category": "pickup",
    "stage": "САМОВЫВОЗ",
    "audience": "buyer",
    "body": "Сейчас уточню у человека на месте, куда именно подойти, и напишу. Пожалуйста, подождите подтверждения.",
    "tags": [
      "САМОВЫВОЗ",
      "Уточнить вход"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Адрес входа уточнить у выдающего."
    ],
    "defaultPriority": 320,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Когда нужны подъезд/домофон"
  },
  {
    "id": "scenario-21",
    "title": "После передачи товара",
    "category": "pickup",
    "stage": "САМОВЫВОЗ",
    "audience": "buyer",
    "body": "Спасибо, что приехали! Надеемся, товар подошёл. Если появятся вопросы — обращайтесь.",
    "tags": [
      "САМОВЫВОЗ",
      "После передачи товара"
    ],
    "requiredFields": [],
    "guardFlags": ["handoverCompleted"],
    "checklist": [
      "Товар действительно передан."
    ],
    "defaultPriority": 321,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Выдающий подтвердил успешную продажу"
  },
  {
    "id": "scenario-22",
    "title": "Отзыв после доставки",
    "category": "after-purchase",
    "stage": "ОТЗЫВЫ",
    "audience": "buyer",
    "body": "Спасибо за покупку! Если будет минутка, будем благодарны за честный отзыв на Авито. Если возникнут вопросы с товаром, обязательно напишите.",
    "tags": [
      "ОТЗЫВЫ",
      "Отзыв после доставки"
    ],
    "requiredFields": [],
    "guardFlags": [
      "receivedVerified",
      "noIssueOpen",
      "reviewNotRequested"
    ],
    "checklist": [
      "Только после подтверждённого получения, один раз."
    ],
    "defaultPriority": 322,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Заказ получен, проблем не заявлено"
  },
  {
    "id": "scenario-23",
    "title": "Отзыв после самовывоза",
    "category": "after-purchase",
    "stage": "ОТЗЫВЫ",
    "audience": "buyer",
    "body": "Спасибо за покупку! Если всё подошло и будет минутка, оставьте, пожалуйста, честный отзыв на Авито. Нам это очень помогает.",
    "tags": [
      "ОТЗЫВЫ",
      "Отзыв после самовывоза"
    ],
    "requiredFields": [],
    "guardFlags": [
      "receivedVerified",
      "noIssueOpen",
      "reviewNotRequested"
    ],
    "checklist": [
      "Убедиться, что продажа состоялась, один раз."
    ],
    "defaultPriority": 323,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Товар передан и покупатель ушёл"
  },
  {
    "id": "scenario-24",
    "title": "Если уже поблагодарили",
    "category": "after-purchase",
    "stage": "ОТЗЫВЫ",
    "audience": "buyer",
    "body": "Спасибо за отзыв! Рады, что всё понравилось. Если что-то понадобится — пишите.",
    "tags": [
      "ОТЗЫВЫ",
      "Если уже поблагодарили"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не просить повторно."
    ],
    "defaultPriority": 324,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "После уже полученного отзыва"
  },
  {
    "id": "scenario-25",
    "title": "Фото только завтра",
    "category": "general",
    "stage": "ВОПРОСЫ",
    "audience": "buyer",
    "body": "Дополнительные фотографии смогу сделать завтра. Подскажите, что именно хотите посмотреть?",
    "tags": [
      "ВОПРОСЫ",
      "Фото только завтра"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Только если возможность реальна."
    ],
    "defaultPriority": 325,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Покупатель просит другой ракурс"
  },
  {
    "id": "scenario-26",
    "title": "Совместимость аксессуара",
    "category": "general",
    "stage": "ВОПРОСЫ",
    "audience": "buyer",
    "body": "Напишите точную модель устройства и название аксессуара — проверю совместимость, чтобы не ошибиться.",
    "tags": [
      "ВОПРОСЫ",
      "Совместимость аксессуара"
    ],
    "requiredFields": [],
    "guardFlags": [
      "compatibilityChecked"
    ],
    "checklist": [
      "Не утверждать «3 и 3S одинаковые» наугад."
    ],
    "defaultPriority": 326,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Когда модель неясна"
  },
  {
    "id": "scenario-27",
    "title": "Цвет закончился, есть другой",
    "category": "general",
    "stage": "ВОПРОСЫ",
    "audience": "buyer",
    "body": "К сожалению, чёрные закончились, но есть белые. Если такой цвет подходит, можно оформить доставку или согласовать самовывоз.",
    "tags": [
      "ВОПРОСЫ",
      "Цвет закончился, есть другой"
    ],
    "requiredFields": [],
    "guardFlags": [
      "stockConfirmed"
    ],
    "checklist": [
      "Проверить наличие и тип устройства."
    ],
    "defaultPriority": 327,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Проверено наличие альтернативы"
  },
  {
    "id": "scenario-28",
    "title": "Торг",
    "category": "general",
    "stage": "ВОПРОСЫ",
    "audience": "buyer",
    "body": "Спасибо за предложение! Напишите, пожалуйста, на какую цену рассчитываете — уточню, можно ли её согласовать.",
    "tags": [
      "ВОПРОСЫ",
      "Торг"
    ],
    "requiredFields": [],
    "guardFlags": [
      "priceConfirmed"
    ],
    "checklist": [
      "Не обещать снижение."
    ],
    "defaultPriority": 328,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Предложили другую цену"
  },
  {
    "id": "scenario-29",
    "title": "Вопрос по аккаунту Meta",
    "category": "general",
    "stage": "ВОПРОСЫ",
    "audience": "buyer",
    "body": "Поможем с активацией и настройкой аккаунта Meta. Для безопасности пароли и коды подтверждения лучше не отправлять в чат — вход выполните сами, а мы подскажем шаги.",
    "tags": [
      "ВОПРОСЫ",
      "Вопрос по аккаунту Meta"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Не запрашивать пароли/коды."
    ],
    "defaultPriority": 329,
    "revision": 1,
    "source": "Сценарии сделок",
    "usage": "Клиент спрашивает, как проходит настройка"
  },
  {
    "id": "silent-01",
    "title": "Начать разговор — ненавязчиво",
    "category": "general",
    "stage": "ПЕРВОЕ СООБЩЕНИЕ",
    "audience": "buyer",
    "body": "Здравствуйте! Если возникнут вопросы по объявлению, с удовольствием подскажу.",
    "tags": [
      "Покупатель открыл чат, но не написал",
      "молчит",
      "первое сообщение",
      "начать диалог",
      "нет сообщения",
      "зашёл в чат",
      "Начать разговор — ненавязчиво"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Отправлять вручную, максимум одно ненавязчивое приветствие. Не упоминать, что вы видели открытие чата, и не писать повторно без ответа."
    ],
    "defaultPriority": 330,
    "revision": 1,
    "source": "ORBITA — начало диалога",
    "usage": "Самое ненавязчивое первое сообщение"
  },
  {
    "id": "silent-02",
    "title": "Начать разговор — короткий вопрос",
    "category": "general",
    "stage": "ПЕРВОЕ СООБЩЕНИЕ",
    "audience": "buyer",
    "body": "Здравствуйте! Подскажите, пожалуйста, интересует ли вас что-то конкретное по товару? Буду рад ответить на вопросы.",
    "tags": [
      "Покупатель открыл чат, но не написал",
      "молчит",
      "первое сообщение",
      "начать диалог",
      "нет сообщения",
      "зашёл в чат",
      "Начать разговор — короткий вопрос"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Отправлять вручную, максимум одно ненавязчивое приветствие. Не упоминать, что вы видели открытие чата, и не писать повторно без ответа."
    ],
    "defaultPriority": 331,
    "revision": 1,
    "source": "ORBITA — начало диалога",
    "usage": "Покупатель пока не написал, можно мягко предложить помощь"
  },
  {
    "id": "silent-03",
    "title": "Помочь выбрать товар",
    "category": "general",
    "stage": "ПЕРВОЕ СООБЩЕНИЕ",
    "audience": "buyer",
    "body": "Здравствуйте! Если сравниваете варианты или хотите уточнить характеристики и совместимость, напишите — помогу разобраться.",
    "tags": [
      "Покупатель открыл чат, но не написал",
      "молчит",
      "первое сообщение",
      "начать диалог",
      "нет сообщения",
      "зашёл в чат",
      "Помочь выбрать товар"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Отправлять вручную, максимум одно ненавязчивое приветствие. Не упоминать, что вы видели открытие чата, и не писать повторно без ответа."
    ],
    "defaultPriority": 332,
    "revision": 1,
    "source": "ORBITA — начало диалога",
    "usage": "Для покупателей VR-шлемов и аксессуаров"
  },
  {
    "id": "silent-04",
    "title": "Подсказать способы получения",
    "category": "general",
    "stage": "ПЕРВОЕ СООБЩЕНИЕ",
    "audience": "buyer",
    "body": "Здравствуйте! Если интересует доставка или самовывоз, подскажу, какие варианты доступны для этого товара.",
    "tags": [
      "Покупатель открыл чат, но не написал",
      "молчит",
      "первое сообщение",
      "начать диалог",
      "нет сообщения",
      "зашёл в чат",
      "Подсказать способы получения"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Отправлять вручную, максимум одно ненавязчивое приветствие. Не упоминать, что вы видели открытие чата, и не писать повторно без ответа."
    ],
    "defaultPriority": 333,
    "revision": 1,
    "source": "ORBITA — начало диалога",
    "usage": "Когда покупателю могут быть важны способы получения"
  },
  {
    "id": "silent-05",
    "title": "Уточнить фото и комплектацию",
    "category": "general",
    "stage": "ПЕРВОЕ СООБЩЕНИЕ",
    "audience": "buyer",
    "body": "Здравствуйте! Если хотите узнать больше о состоянии или комплектации товара, напишите, что именно интересует. При необходимости уточню возможность дополнительных фотографий.",
    "tags": [
      "Покупатель открыл чат, но не написал",
      "молчит",
      "первое сообщение",
      "начать диалог",
      "нет сообщения",
      "зашёл в чат",
      "Уточнить фото и комплектацию"
    ],
    "requiredFields": [],
    "guardFlags": [],
    "checklist": [
      "Отправлять вручную, максимум одно ненавязчивое приветствие. Не упоминать, что вы видели открытие чата, и не писать повторно без ответа."
    ],
    "defaultPriority": 334,
    "revision": 1,
    "source": "ORBITA — начало диалога",
    "usage": "Для товаров, о которых часто просят дополнительные сведения"
  }
]
