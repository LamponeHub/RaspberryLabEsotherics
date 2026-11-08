# 🚀 Деплой на Vercel с SMTP интеграцией

## ✅ Что уже настроено

- ✅ Serverless Function для отправки писем (`api/send-email.js`)
- ✅ SMTP через `mail.laboratoriolampone.com.ru:465`
- ✅ Fallback на FormSubmit.co если SMTP недоступен
- ✅ Конфигурация Vercel (`vercel.json`)

---

## 📋 Пошаговая инструкция

### Шаг 1: Зарегистрируйтесь на Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub, GitLab или Email
3. Бесплатный тариф включает:
   - 100 GB bandwidth/месяц
   - 100,000 serverless function invocations/месяц
   - Бесплатные SSL сертификаты

### Шаг 2: Подключите репозиторий

**Вариант А: Через GitHub (рекомендуется)**

```bash
# Создайте репозиторий на GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ВАШ_USERNAME/laboratorio-lampone.git
git push -u origin main
```

Затем на Vercel:
1. "Add New..." → "Project"
2. Import Git Repository → выберите ваш репозиторий
3. Framework Preset: Vite
4. Нажмите "Deploy"

**Вариант Б: Через Vercel CLI**

```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите в аккаунт
vercel login

# Задеплойте проект
vercel
```

### Шаг 3: Настройте переменные окружения

**Это КРИТИЧЕСКИ ВАЖНО для работы почты!**

1. На Vercel откройте ваш проект
2. Перейдите в **Settings** → **Environment Variables**
3. Добавьте следующие переменные:

| Название | Значение |
|----------|----------|
| `SMTP_USER` | `reception@laboratoriolampone.com.ru` |
| `SMTP_PASS` | `ВАШ_ПАРОЛЬ_ОТ_ПОЧТЫ` |
| `SITE_URL` | `https://laboratoriolampone.com.ru` |

⚠️ **ВАЖНО:** Выберите все окружения (Production, Preview, Development)

4. Нажмите "Save"

### Шаг 4: Передеплойте проект

После добавления переменных окружения нужно передеплоить:

1. Перейдите в **Deployments**
2. Найдите последний деплой
3. Нажмите "..." → "Redeploy"
4. Подтвердите

### Шаг 5: Привяжите домен

1. Перейдите в **Settings** → **Domains**
2. Добавьте `laboratoriolampone.com.ru`
3. Vercel покажет DNS записи для настройки
4. У вашего регистратора доменов добавьте:

```
Type: CNAME
Name: @ (или laboratoriolampone.com.ru)
Value: cname.vercel-dns.com

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

5. Подождите 5-30 минут для применения DNS

---

## 🧪 Тестирование

### 1. Проверьте API endpoint

Откройте в браузере:
```
https://laboratoriolampone.com.ru/api/send-email
```

Должно вернуть:
```json
{"success":false,"error":"Метод не разрешён"}
```

Это нормально — означает что API работает.

### 2. Отправьте тестовую заявку

1. Откройте сайт
2. Заполните форму
3. Нажмите "Отправить запрос"
4. Проверьте почту `reception@laboratoriolampone.com.ru`

---

## 🔧 Решение проблем

### Ошибка: "Invalid login"

**Причина:** Неправильный пароль в переменных окружения

**Решение:**
1. Проверьте пароль от почты (не от аккаунта хостинга!)
2. Убедитесь что переменные добавлены для Production
3. Передеплойте проект

### Ошибка: "Connection timeout"

**Причина:** SMTP сервер недоступен или порт заблокирован

**Решение:**
1. Проверьте что SMTP сервер работает: `telnet mail.laboratoriolampone.com.ru 465`
2. Обратитесь к хостинг-провайдеру почты
3. Попробуйте порт 587 (измените в `api/send-email.js`)

### Письма не приходят

**Проверьте:**
1. Папку "Спам" в почтовом ящике
2. Логи на Vercel: **Deployments** → последний деплой → **Function Logs**
3. Правильность DNS записей SPF/DKIM

### Ошибка: "Module not found: nodemailer"

**Решение:**
```bash
cd api
npm install
cd ..
git add api/package-lock.json
git commit -m "Add nodemailer dependency"
git push
```

---

## 📊 Мониторинг

### Логи на Vercel

1. Откройте проект на Vercel
2. Перейдите в **Deployments**
3. Выберите последний деплой
4. Нажмите **Function Logs**

Там будут видны все отправки писем и ошибки.

### Альтернатива: Sentry

Для продвинутого мониторинга ошибок добавьте Sentry:

```bash
npm install @sentry/react @sentry/tracing
```

---

## 🔒 Безопасность

### Rate Limiting

Добавьте защиту от спама в `api/send-email.js`:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // 5 запросов с одного IP
  message: {
    success: false,
    error: 'Слишком много запросов. Попробуйте позже.'
  }
});

// Примените к роуту
app.use('/api/send-email', limiter);
```

### Honeypot

Добавьте скрытое поле в форму для защиты от ботов:

```tsx
<input
  type="text"
  name="website"
  style={{ display: 'none' }}
  tabIndex={-1}
  autoComplete="off"
  value={данныеФормы.website}
  onChange={(e) => setДанныеФормы({ ...данныеФормы, website: e.target.value })}
/>
```

Если поле заполнено — это бот.

---

## 💰 Стоимость Vercel

**Бесплатный тариф (Hobby):**
- ✅ 100 GB bandwidth/месяц
- ✅ 100,000 function invocations/месяц
- ✅ Бесплатные SSL сертификаты
- ✅ Автоматические деплои из Git
- ✅ Preview deployments

**Для вашего сайта этого более чем достаточно!**

Если превысите лимиты:
- Pro тариф: $20/месяц
- 1 TB bandwidth
- 1M function invocations

---

## 📞 Поддержка

### Vercel
- Документация: [vercel.com/docs](https://vercel.com/docs)
- Поддержка: [vercel.com/support](https://vercel.com/support)

### SMTP
- Обратитесь к хостинг-провайдеру почты
- Проверьте логи на Vercel

---

## ✅ Чек-лист перед запуском

- [ ] Зарегистрировались на Vercel
- [ ] Подключили репозиторий
- [ ] Добавили переменные окружения (SMTP_USER, SMTP_PASS)
- [ ] Передеплоили проект
- [ ] Привязали домен laboratoriolampone.com.ru
- [ ] Настроили DNS записи
- [ ] Протестировали отправку заявки
- [ ] Письмо пришло на почту
- [ ] Проверили логи на Vercel

---

## 🎯 Альтернативы Vercel

Если не хотите использовать Vercel:

### Netlify
- Аналогичный функционал
- Netlify Functions вместо Vercel Functions
- Бесплатный тариф

### Cloudflare Pages
- Бесплатный тариф
- Cloudflare Workers для API
- Отличная производительность

### Собственный VPS
- Полный контроль
- Требует настройки сервера
- Инструкция в `SMTP_SETUP.md`

---

**Дата обновления:** Январь 2024  
**Версия:** 1.0
