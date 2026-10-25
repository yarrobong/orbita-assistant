type Props = { onClear: () => void }
export default function SettingsScreen({ onClear }: Props) {
  return <section aria-labelledby="page-title"><header className="page-heading"><p className="eyebrow">ПРИЛОЖЕНИЕ</p><h1 id="page-title">Настройки</h1><p className="lead">ORBITA Assistant работает в этом браузере.</p></header>
    <article className="settings-card"><h2>Данные и приватность</h2><p>Избранное и выбранный экран хранятся локально. Тексты переписок, контакты и адреса не отправляются на сервер и не сохраняются после закрытия вкладки.</p><p>Шаблоны ответа встроены в приложение. Отправка выполняется вами вручную в Авито.</p><button type="button" className="button button-secondary" onClick={onClear}>Сбросить избранное и экран</button></article>
    <article className="settings-card"><h2>Установка и офлайн-доступ</h2><p><strong>iPhone:</strong> откройте сайт в Safari, нажмите «Поделиться» → «На экран Домой».</p><p><strong>Mac:</strong> в поддерживаемом браузере выберите установку ORBITA Assistant из адресной строки или меню браузера.</p><p><strong>Windows:</strong> в Edge или Chrome выберите «Установить приложение» в меню браузера.</p><p>Сначала откройте приложение при подключённом интернете. После загрузки оболочка и встроенные шаблоны доступны офлайн. При новой версии можно обновиться из уведомления или закрыть приложение: тогда версия применится при следующем открытии.</p></article>
    <p className="settings-version">ORBITA Assistant · версия 1.0.0</p>
  </section>
}
