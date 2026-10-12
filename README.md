# Laboratorio Lampone — Сайт

Премиальный сайт для студии астрологии и таро с SEO-оптимизацией и аналитикой.

## 🚀 Настройка аналитики

### Google Analytics (GA4)

1. Создайте аккаунт в [Google Analytics](https://analytics.google.com/)
2. Создайте свойство (property) для вашего сайта
3. Скопируйте ID потока данных (начинается с `G-`)
4. Откройте `index.html` и замените `G-XXXXXXXXXX` на ваш ID (2 места)

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ВАШ_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-ВАШ_ID');
</script>
```

### Яндекс.Метрика

1. Создайте счётчик в [Яндекс.Метрике](https://metrika.yandex.ru/)
2. Скопируйте номер счётчика (8 цифр)
3. Откройте `index.html` и замените `12345678` на ваш номер (3 места)

```html
ym(ВАШ_НОМЕР, "init", {
  clickmap:true,
  trackLinks:true,
  accurateTrackBounce:true,
  webvisor:true
});
```

И в noscript:
```html
<noscript><div><img src="https://mc.yandex.ru/watch/ВАШ_НОМЕР" ... /></div></noscript>
```

## 📊 SEO-оптимизация

### Что уже настроено:

✅ **Мета-теги:**
- Title, description, keywords
- Open Graph (Facebook, VK, Telegram)
- Twitter Cards
- Canonical URL
- Robots (index, follow)

✅ **Структурированные данные (Schema.org):**
- ProfessionalService
- OfferCatalog с 6 услугами
- Цены в рублях

✅ **Техническое SEO:**
- robots.txt
- sitemap.xml
- Семантическая HTML-разметка
- Alt-теги для изображений
- Favicon

### Что нужно сделать:

1. **Замените домен** в `index.html`:
   - `https://laboratoriolampone.com.ru/` → ваш реальный домен
   - В Open Graph тегах
   - В canonical URL
   - В Schema.org разметке

2. **Создайте OG-изображение** (1200x630px):
   - Сохраните как `public/og-image.jpg`
   - Обновите URL в мета-тегах

3. **Обновите sitemap.xml**:
   - Замените дату на текущую
   - Добавьте страницы, если появятся

4. **Отправьте sitemap в поисковые системы**:
   - [Яндекс.Вебмастер](https://webmaster.yandex.ru/)
   - [Google Search Console](https://search.google.com/search-console/)

## 🎨 Структура проекта

```
/
├── index.html              # Главная страница с SEO и аналитикой
├── public/
│   ├── robots.txt         # Правила для поисковых ботов
│   ├── sitemap.xml        # Карта сайта
│   └── favicon.svg        # Иконка сайта
└── src/
    ├── App.tsx            # Основной компонент React
    ├── index.css          # Стили Tailwind
    └── main.tsx           # Точка входа
```

## 📱 Услуги на сайте

1. **Натальная Карта** — 5 000 — 8 000 ₽
2. **Таро-Консультация** — 5 000 — 10 000 ₽
3. **Прогностическая Сессия** — 12 000 — 20 000 ₽
4. **Бизнес-Астрология** — от 25 000 ₽
5. **Корпоративная Астрология** — от 35 000 ₽
6. **Стратегическое Планирование** — от 50 000 ₽

## 💳 Оплата

- **Email для заявок:** reception@laboratoriolampone.com.ru
- **Банк:** АО «Альфа-Банк»
- **Получатель:** Варганова Полина Андреевна
- **Счёт:** 40817810906280007147

## 🔧 Разработка

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для продакшена
npm run build
```

## 📈 Проверка SEO

После деплоя проверьте:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Яндекс.Вебмастер](https://webmaster.yandex.ru/)
- [Google Search Console](https://search.google.com/search-console/)
- [Schema.org Validator](https://validator.schema.org/)
- [Open Graph Check](https://www.opengraph.xyz/)

## 🎯 Рекомендации

1. **Контент:** Регулярно обновляйте контент (блог, кейсы)
2. **Скорость:** Оптимизируйте изображения (WebP/AVIF)
3. **Мобильная версия:** Тестируйте на разных устройствах
4. **Аналитика:** Настройте цели в GA4 и Яндекс.Метрике
5. **Реклама:** Подключите Яндекс.Директ и Google Ads

---

**Версия:** 1.0  
**Дата:** 2024-01-15  
**Автор:** Laboratorio Lampone
