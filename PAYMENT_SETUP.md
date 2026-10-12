# Инструкция по подключению платёжного шлюза ЮKassa

## 📋 Что нужно сделать

### 1. Регистрация в ЮKassa

1. Перейдите на [yookassa.ru](https://yookassa.ru/)
2. Нажмите "Подключиться"
3. Заполните анкету:
   - Название организации
   - ИНН/ОГРН
   - Контактные данные
   - Описание бизнеса
4. Дождитесь проверки (обычно 1-3 рабочих дня)
5. Получите доступ в личный кабинет

### 2. Получение ключей API

После регистрации в личном кабинете ЮKassa:

1. Перейдите в раздел **"Настройки" → "Ключи API"**
2. Создайте **секретный ключ** (secret key)
3. Скопируйте:
   - **Shop ID** (идентификатор магазина)
   - **Secret Key** (секретный ключ)

### 3. Настройка на сайте

#### Вариант А: Простая интеграция (без бэкенда)

Если у вас нет серверной части, можно использовать **готовые платёжные формы** ЮKassa:

1. В личном кабинете ЮKassa перейдите в **"Интеграция" → "Платёжные формы"**
2. Создайте новую платёжную форму
3. Скопируйте URL формы
4. В файле `src/App.tsx` замените:

```typescript
// Найдите строку:
const paymentUrl = `https://yookassa.ru/`;

// Замените на ваш URL платёжной формы:
const paymentUrl = `https://yookassa.ru/integration/payments/form/ВАША_ФОРМА_ID`;
```

#### Вариант Б: Полная интеграция (с бэкендом)

Для полноценной интеграции нужен серверный код. Пример на Node.js:

**1. Установите зависимости:**

```bash
npm install yookassa express cors dotenv
```

**2. Создайте файл `server.js`:**

```javascript
const express = require('express');
const cors = require('cors');
const YooKassa = require('yookassa');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Инициализация ЮKassa
const yooKassa = new YooKassa({
  shopId: process.env.YOOKASSA_SHOP_ID,
  secretKey: process.env.YOOKASSA_SECRET_KEY
});

// Создание платежа
app.post('/api/create-payment', async (req, res) => {
  try {
    const { amount, description, service } = req.body;

    const payment = await yooKassa.createPayment({
      amount: {
        value: amount.toString(),
        currency: 'RUB'
      },
      confirmation: {
        type: 'redirect',
        return_url: 'https://laboratoriolampone.com.ru/payment-success'
      },
      capture: true,
      description: `Оплата услуги: ${description} (${service})`,
      metadata: {
        service: service
      }
    }, {
      Idempotence-Key: Date.now().toString()
    });

    res.json({
      payment_id: payment.id,
      confirmation_url: payment.confirmation.confirmation_url
    });
  } catch (error) {
    console.error('Ошибка создания платежа:', error);
    res.status(500).json({ error: 'Ошибка создания платежа' });
  }
});

// Вебхук для уведомлений о платежах
app.post('/api/payment-webhook', async (req, res) => {
  const event = req.body;
  
  if (event.event === 'payment.succeeded') {
    const payment = event.object;
    console.log('Платёж успешен:', payment.id);
    
    // Здесь можно:
    // - Отправить email клиенту
    // - Обновить статус в базе данных
    // - Отправить уведомление в Telegram/Slack
  }
  
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
```

**3. Создайте файл `.env`:**

```env
YOOKASSA_SHOP_ID=ваш_shop_id
YOOKASSA_SECRET_KEY=ваш_secret_key
```

**4. Обновите фронтенд (`src/App.tsx`):**

```typescript
const handleОплата = async () => {
  if (!выбраннаяУслуга || !сумма) {
    alert('Пожалуйста, выберите услугу и укажите сумму');
    return;
  }

  try {
    // Запрос к вашему бэкенду
    const response = await fetch('https://ваш-сервер.com/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: parseInt(сумма),
        description: выбраннаяУслуга,
        service: выбраннаяУслуга
      })
    });

    const data = await response.json();
    
    // Перенаправление на страницу оплаты
    window.location.href = data.confirmation_url;
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Произошла ошибка при создании платежа');
  }
};
```

### 4. Настройка вебхуков

В личном кабинете ЮKassa:

1. Перейдите в **"Настройки" → "Вебхуки"**
2. Добавьте URL: `https://ваш-сервер.com/api/payment-webhook`
3. Выберите события:
   - `payment.succeeded` — платёж успешен
   - `payment.canceled` — платёж отменён
   - `payment.waiting_for_capture` — ожидает подтверждения

### 5. Тестирование

ЮKassa предоставляет **тестовый режим**:

1. В личном кабинете включите тестовый режим
2. Используйте тестовые карты:
   - **Успешная оплата:** `5555 5555 5555 4444`
   - **Отклонённая:** `5555 5555 5555 4477`
3. Любые данные (срок, CVC)

### 6. Переключение на продакшен

Когда всё протестировано:

1. Отключите тестовый режим в ЮKassa
2. Обновите URL в коде с тестового на продакшен
3. Проверьте работу с реальными платежами (небольшая сумма)

## 🔒 Безопасность

### Что НЕЛЬЗЯ делать:

❌ Хранить секретный ключ в фронтенде  
❌ Передавать секретный ключ через git  
❌ Логировать данные карт  

### Что НУЖНО делать:

✅ Хранить ключи только в `.env`  
✅ Добавить `.env` в `.gitignore`  
✅ Использовать HTTPS  
✅ Настроить вебхуки для проверки платежей  
✅ Валидировать суммы на сервере  

## 📊 Отслеживание платежей

### Варианты уведомлений:

**1. Email уведомления:**

```javascript
const nodemailer = require('nodemailer');

async function sendPaymentEmail(payment, email) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password'
    }
  });

  await transporter.sendMail({
    from: 'reception@laboratoriolampone.com.ru',
    to: email,
    subject: 'Оплата получена — Laboratorio Lampone',
    html: `
      <h2>Спасибо за оплату!</h2>
      <p>Мы получили ваш платёж и свяжемся с вами в течение 48 часов.</p>
      <p>Сумма: ${payment.amount.value} ₽</p>
    `
  });
}
```

**2. Telegram уведомления:**

```javascript
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('YOUR_BOT_TOKEN');

async function notifyTelegram(payment) {
  await bot.sendMessage(
    'YOUR_CHAT_ID',
    `💰 Новый платёж!\n\nСумма: ${payment.amount.value} ₽\nУслуга: ${payment.metadata.service}`
  );
}
```

## 💳 Альтернативные платёжные системы

Если ЮKassa не подходит, рассмотрите:

### Tinkoff Касса
- Комиссия: 2.7%
- Быстрое подключение
- [tinkoff.ru/business/services/acquiring/](https://www.tinkoff.ru/business/services/acquiring/)

### Robokassa
- Комиссия: 2.7-4%
- Много способов оплаты
- [robokassa.com](https://robokassa.com/)

### CloudPayments
- Комиссия: 2.8%
- Рекуррентные платежи
- [cloudpayments.ru](https://cloudpayments.ru/)

## 📞 Поддержка ЮKassa

- Документация: [yookassa.ru/developers](https://yookassa.ru/developers/)
- Email: support@yookassa.ru
- Телефон: 8 (800) 707-03-39

---

**Важно:** Перед запуском обязательно протестируйте все сценарии оплаты в тестовом режиме!
