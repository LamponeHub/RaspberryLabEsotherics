# ⚡ Быстрый старт — 5 минут до работающих заявок

## 🎯 Что нужно сделать

### 1. Создайте аккаунт на Vercel (2 минуты)

1. Перейдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub или Email
3. Это бесплатно!

### 2. Задеплойте проект (1 минута)

**Вариант А: Через GitHub (рекомендуется)**

```bash
# Создайте репозиторий
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ВАШ_USERNAME/laboratorio-lampone.git
git push -u origin main
```

На Vercel:
- "Add New..." → "Project"
- Import Git Repository → выберите ваш репозиторий
- Framework Preset: **Vite**
- Нажмите "Deploy"

**Вариант Б: Через CLI**

```bash
npm i -g vercel
vercel login
vercel
```

### 3. Добавьте SMTP пароль (1 минута)

На Vercel:
1. **Settings** → **Environment Variables**
2. Добавьте:

```
SMTP_USER = reception@laboratoriolampone.com.ru
SMTP_PASS = ваш_пароль_от_почты
SITE_URL = https://laboratoriolampone.com.ru
```

3. Выберите **все окружения** (Production, Preview, Development)
4. Нажмите "Save"

### 4. Передеплойте (30 секунд)

1. **Deployments** → последний деплой → "..." → "Redeploy"
2. Подтвердите

### 5. Привяжите домен (1 минута)

1. **Settings** → **Domains**
2. Добавьте `laboratoriolampone.com.ru`
3. У регистратора домена добавьте CNAME:

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

4. Подождите 5-30 минут

---

## ✅ Готово!

Теперь заявки с формы будут приходить на `reception@laboratoriolampone.com.ru`

---

## 🧪 Тестирование

1. Откройте сайт
2. Заполните форму
3. Нажмите "Отправить запрос"
4. Проверьте почту — письмо должно прийти через 5-10 секунд

---

## 🆘 Если что-то не работает

### Письма не приходят

1. Проверьте папку "Спам"
2. Проверьте логи на Vercel: **Deployments** → Function Logs
3. Убедитесь что пароль правильный

### Ошибка "Invalid login"

- Неправильный пароль в Environment Variables
- Проверьте что пароль именно от почты, а не от аккаунта хостинга

### Ошибка "Connection timeout"

- SMTP сервер недоступен
- Обратитесь к хостинг-провайдеру почты

---

## 📚 Подробные инструкции

- `VERCEL_DEPLOY.md` — полная инструкция по деплою
- `SMTP_SETUP.md` — настройка SMTP-сервера
- `PAYMENT_SETUP.md` — интеграция с ЮKassa
- `PRICE_LIST.md` — прайс-лист услуг

---

## 💡 Что дальше?

1. ✅ Настройте Google Analytics (замените `G-XXXXXXXXXX` в `index.html`)
2. ✅ Настройте Яндекс.Метрику (замените `12345678` в `index.html`)
3. ✅ Создайте OG-изображение (1200x630px) и сохраните как `public/og-image.jpg`
4. ✅ Отправьте sitemap в Яндекс.Вебмастер и Google Search Console

---

**Готово! Теперь заявки будут приходить прямо на почту!** 🎉
