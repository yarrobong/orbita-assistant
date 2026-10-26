import type { Product, KnowledgeArticle } from './product-types'

// Only manufacturer-documented facts are authoritative. Sale-specific facts require manual checks.
export const products: Product[] = [
  {
    "id": "quest-3",
    "title": "Meta Quest 3",
    "category": "headset",
    "description": "Автономный VR/MR-шлем с pancake-оптикой.",
    "facts": [
      "2064 × 2208 пикселей на глаз",
      "Snapdragon XR2 Gen 2, 8 ГБ RAM",
      "Цветной passthrough; поддержка PC VR через Quest Link"
    ],
    "notes": [
      "Объём памяти, состояние и комплект конкретного экземпляра нужно сверять с объявлением."
    ],
    "sourceUrl": "https://developers.meta.com/vr/resources/compare-devices/",
    "compatibility": null
  },
  {
    "id": "quest-3s",
    "title": "Meta Quest 3S",
    "category": "headset",
    "description": "Автономный VR/MR-шлем с Fresnel-оптикой.",
    "facts": [
      "1832 × 1920 пикселей на глаз",
      "Snapdragon XR2 Gen 2, 8 ГБ RAM",
      "Цветной passthrough; поддержка PC VR через Quest Link"
    ],
    "notes": [
      "Объём памяти, состояние и комплект конкретного экземпляра нужно сверять с объявлением."
    ],
    "sourceUrl": "https://developers.meta.com/vr/resources/compare-devices/",
    "compatibility": null
  },
  {
    "id": "quest-2",
    "title": "Meta Quest 2",
    "category": "headset",
    "description": "Автономный VR-шлем предыдущего поколения.",
    "facts": [
      "1832 × 1920 пикселей на глаз",
      "Snapdragon XR2 Gen 1, 6 ГБ RAM",
      "Монохромный passthrough; поддержка PC VR через Quest Link"
    ],
    "notes": [
      "Состояние, комплектность и поддержка конкретной игры требуют отдельной проверки."
    ],
    "sourceUrl": "https://developers.meta.com/vr/resources/device-optimization-comparison/",
    "compatibility": null
  },
  {
    "id": "battery-strap-10000",
    "title": "Ремешок с аккумулятором 10 000 мА·ч",
    "category": "strap",
    "description": "Дополнительное крепление с внешним аккумулятором.",
    "facts": [
      "Заявленная ёмкость: 10 000 мА·ч; характеристика из описания товара, не лабораторный замер."
    ],
    "notes": [
      "Точную модель, совместимость, комплектность и исправность батареи необходимо проверить.",
      "В отдельных экземплярах комплект может быть неполным."
    ],
    "sourceUrl": null,
    "compatibility": null
  },
  {
    "id": "quest-2-strap-used",
    "title": "Ремешок для Quest 2, б/у",
    "category": "strap",
    "description": "Подержанный ремешок для Quest 2.",
    "facts": [
      "В известном экземпляре отсутствуют резинки; проверьте актуальное состояние перед продажей."
    ],
    "notes": [
      "Крепление к другим моделям Quest не подтверждено."
    ],
    "sourceUrl": null,
    "compatibility": {
      "quest2": "claimed",
      "quest3": "unknown",
      "quest3s": "unknown"
    }
  },
  {
    "id": "bobovr-c3",
    "title": "BOBOVR C3",
    "category": "accessory",
    "description": "Аксессуар BOBOVR, точную модель и назначение необходимо уточнить.",
    "facts": [],
    "notes": [
      "Проверьте заводской артикул, назначение и совместимость до ответа покупателю."
    ],
    "sourceUrl": null,
    "compatibility": null
  },
  {
    "id": "dock-b2",
    "title": "Зарядная станция + аккумулятор B2",
    "category": "power",
    "description": "Комплект станции и сменного аккумулятора.",
    "facts": [
      "По описанию предложения — станция и один аккумулятор B2."
    ],
    "notes": [
      "Сверьте фактическую комплектность и подходящие устройства перед отправкой."
    ],
    "sourceUrl": null,
    "compatibility": null
  },
  {
    "id": "link-cable",
    "title": "Оригинальный Link-кабель",
    "category": "cable",
    "description": "Кабель для подключения совместимого шлема к ПК.",
    "facts": [
      "Quest Link поддерживает Quest 2, Quest 3 и Quest 3S.",
      "Для проводного PC VR необходим совместимый Windows-ПК и подходящий USB-порт."
    ],
    "notes": [
      "Подлинность, длину и состояние конкретного кабеля сверяйте с объявлением."
    ],
    "sourceUrl": "https://developers.meta.com/vr/documentation/unity/unity-link/",
    "compatibility": {
      "quest2": "verified",
      "quest3": "verified",
      "quest3s": "verified"
    }
  },
  {
    "id": "xbox-gamepad",
    "title": "Геймпад Xbox Wireless Controller",
    "category": "controller",
    "description": "Геймпад Xbox, ассортимент цветов и ревизий уточняется.",
    "facts": [],
    "notes": [
      "Не путать совместимость с Xbox One, ПК и VR-гарнитурами: проверьте ревизию.",
      "Цвет и наличие не подтверждены автоматически."
    ],
    "sourceUrl": null,
    "compatibility": null
  },
  {
    "id": "case-universal",
    "title": "Универсальный кейс для VR-шлема",
    "category": "case",
    "description": "Защитный кейс для перевозки VR-оборудования.",
    "facts": [],
    "notes": [
      "Совместимость зависит от внутренних размеров и установленного ремешка.",
      "Без измерений не обещайте, что шлем поместится."
    ],
    "sourceUrl": null,
    "compatibility": null
  },
  {
    "id": "case-quest-3s",
    "title": "Кейс для Quest 3S",
    "category": "case",
    "description": "Кейс, указанный в ассортименте для Quest 3S.",
    "facts": [],
    "notes": [
      "Совместимость с конкретным ремешком и комплектацией нужно проверить.",
      "Не переносите совместимость на Quest 3 или Quest 2 без подтверждения."
    ],
    "sourceUrl": null,
    "compatibility": {
      "quest2": "unknown",
      "quest3": "unknown",
      "quest3s": "claimed"
    }
  },
  {
    "id": "mount-quest3",
    "title": "Крепление для Quest 3 / 3S",
    "category": "mount",
    "description": "Крепёжный аксессуар для VR-шлема.",
    "facts": [],
    "notes": [
      "По названию предложения заявлена совместимость с Quest 3 и Quest 3S; до подтверждения покупателю необходимо проверить артикул.",
      "Для Quest 2 совместимость не установлена."
    ],
    "sourceUrl": null,
    "compatibility": {
      "quest2": "unknown",
      "quest3": "claimed",
      "quest3s": "claimed"
    }
  },
  {
    "id": "quest3-covers",
    "title": "Чехлы для Quest 3",
    "category": "accessory",
    "description": "Защитные накладки для аксессуаров Quest 3.",
    "facts": [],
    "notes": [
      "Проверьте комплект накладок и совместимость с конкретной моделью."
    ],
    "sourceUrl": null,
    "compatibility": {
      "quest2": "unknown",
      "quest3": "claimed",
      "quest3s": "unknown"
    }
  }
]

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    "id": "quest-3-vs-3s",
    "title": "Чем отличаются Quest 3 и Quest 3S",
    "group": "Выбор шлема",
    "text": "У обоих шлемов Snapdragon XR2 Gen 2, 8 ГБ RAM и цветной passthrough. Quest 3 имеет более высокое разрешение (2064 × 2208 на глаз) и pancake-оптику; Quest 3S — 1832 × 1920 и Fresnel-оптику. Для выбора важны бюджет и комфорт чтения/резкость изображения.",
    "sourceUrl": "https://developers.meta.com/vr/resources/compare-devices/"
  },
  {
    "id": "standalone-vr",
    "title": "Можно ли пользоваться Quest без ПК",
    "group": "Работа со шлемом",
    "text": "Quest 2, Quest 3 и Quest 3S — автономные устройства. Поддерживаемые игры и приложения запускаются на самом шлеме. Для игр PC VR необходим совместимый компьютер и подключение через Quest Link либо Air Link.",
    "sourceUrl": "https://developers.meta.com/vr/documentation/unity/unity-link/"
  },
  {
    "id": "pcvr-link",
    "title": "Как подключить Quest к ПК",
    "group": "Работа со шлемом",
    "text": "Quest Link поддерживает Quest 2, Quest 3 и Quest 3S. Для проводного подключения нужен совместимый Windows-ПК и подходящий USB-кабель. Air Link использует беспроводное подключение. Перед обещанием поддержки игры или ПК проверьте их требования.",
    "sourceUrl": "https://developers.meta.com/vr/documentation/unity/unity-link/"
  },
  {
    "id": "quest2-difference",
    "title": "Чем Quest 2 отличается от Quest 3",
    "group": "Выбор шлема",
    "text": "Quest 2 использует Snapdragon XR2 Gen 1, 6 ГБ RAM и монохромный passthrough. У Quest 3 Snapdragon XR2 Gen 2, 8 ГБ RAM, более высокое разрешение и цветной passthrough. Совместимость конкретных новых игр с Quest 2 нужно проверять отдельно.",
    "sourceUrl": "https://developers.meta.com/vr/resources/device-optimization-comparison/"
  },
  {
    "id": "case-check",
    "title": "Как проверить, поместится ли шлем в кейс",
    "group": "Аксессуары",
    "text": "Проверьте внутренние размеры кейса, форму шлема, тип установленного ремешка и наличие контроллеров. Не делайте вывод о совместимости только по названию модели, особенно если установлен увеличенный ремешок с батареей.",
    "sourceUrl": null
  },
  {
    "id": "strap-check",
    "title": "Как проверять совместимость ремешка",
    "group": "Аксессуары",
    "text": "Сверьте точный артикул крепления и список совместимых моделей производителя. У Quest 2, Quest 3 и Quest 3S отличаются посадочные элементы; без проверки нельзя утверждать, что любой ремешок взаимозаменяем.",
    "sourceUrl": null
  },
  {
    "id": "honest-sales",
    "title": "Как отвечать, если характеристика неизвестна",
    "group": "Общение с покупателем",
    "text": "Не выдумывайте размеры, остатки, сроки, гарантию, комплектность и совместимость. Уточните модель устройства покупателя и артикул товара, проверьте фотографию или спецификацию, затем сообщите подтверждённый результат.",
    "sourceUrl": null
  },
  {
    "id": "quest3s-apps",
    "title": "Игры Quest 3 и Quest 3S",
    "group": "Работа со шлемом",
    "text": "Meta указывает, что Quest 3S использует общую библиотеку приложений Quest 3. Доступность конкретной игры зависит от её требований и региона, поэтому не обещайте определённый каталог без проверки.",
    "sourceUrl": "https://about.fb.com/news/2024/09/meta-quest-3s-our-most-affordable-mixed-reality-headset/"
  }
]
