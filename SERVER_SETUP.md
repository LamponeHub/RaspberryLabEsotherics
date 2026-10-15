# Серверная часть для интеграции с ЮKassa

## ⚠️ БЕЗОПАСНОСТЬ

**НИКОГДА не размещайте секретный ключ в клиентском коде!**

Секретный ключ должен храниться ТОЛЬКО на сервере в файле `.env`

## 📦 Установка

```bash
# Создайте папку для сервера
mkdir server
cd server

# Инициализация Node.js проекта
npm init -y

# Установка зависимостей
npm install express cors yookassa dotenv
```

## 📁 Структура проекта

```
laboratorio-lampone/
├── src/                    # Frontend (React)
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── server/                 # Backend (Node.js)
│   ├── index.js
│   ├── .env               # Секретные ключи (НЕ коммитить в git!)
│   └── package.json
├── .gitignore             # Добавить .env
└── package.json           # Frontend
```

## 🔧 Настройка сервера

### 1. Создайте файл `server/.env`:

```env
# ЮKassa credentials
YOOKASSA_SHOP_ID=1492767
YOOKASSA_SECRET_KEY=live_zdi75CJx4g7BkpBeI4kSjK2B2lVy5JcKTD2QpG6XGAU

# URL вашего сайта
SITE_URL=https://laboratoriolampone.com.ru

# Порт сервера
PORT=3001
```

### 2. Создайте файл `server/index.js`:

```javascript
const express = require('express');
const cors = require('cors');
const YooKassa = require('yookassa');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.SITE_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Инициализация ЮKassa
const yooKassa = new YooKassa({
  shopId: process.env.YOOKASSA_SHOP_ID,
  secretKey: process.env.YOOKASSA_SECRET_KEY
});

// Создание платежа
app.post('/api/create-payment', async (req, res) => {
  try {
    const { amount, description, service, email } = req.body;

    // Валидация данных
    if (!amount || !description || !service) {
      return res.status(400).json({ 
        error: 'Необходимо указать сумму, описание и услугу' 
      });
    }

    // Создание платежа
    const payment = await yooKassa.createPayment({
      amount: {
        value: amount.toString(),
        currency: 'RUB'
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.SITE_URL}/payment-success`
      },
      capture: true,
      description: `Оплата услуги: ${description} (${service})`,
      receipt: {
        customer: {
          email: email || 'reception@laboratoriolampone.com.ru'
        },
        items: [
          {
            description: service,
            quantity: '1.00',
            amount: {
              value: amount.toString(),
              currency: 'RUB'
            },
            vat_code: 1, // Без НДС
            payment_mode: 'full_payment',
            payment_subject: 'service'
          }
        ]
      }
    }, {
      Idempotence-Key: Date.now().toString()
    });

    // Отправляем URL для оплаты
    res.json({
      success: true,
      payment_id: payment.id,
      confirmation_url: payment.confirmation.confirmation_url
    });

  } catch (error) {
    console.error('Ошибка создания платежа:', error);
    res.status(500).json({ 
      error: 'Ошибка создания платежа',
      details: error.message 
    });
  }
});

// Вебхук для уведомлений о платежах
app.post('/api/payment-webhook', async (req, res) => {
  try {
    const event = req.body;
    
    // Проверка подписи (опционально, но рекомендуется)
    // const signature = req.headers['x-yookassa-signature'];
    // const isValid = yooKassa.verifyWebhookSignature(event, signature);
    
    if (event.event === 'payment.succeeded') {
      const payment = event.object;
      console.log('✅ Платёж успешен:', payment.id);
      console.log('Сумма:', payment.amount.value, '₽');
      console.log('Email:', payment.receipt?.customer?.email);
      
      // Здесь можно:
      // 1. Отправить email клиенту
      // 2. Обновить статус в базе данных
      // 3. Отправить уведомление в Telegram
      
    } else if (event.event === 'payment.canceled') {
      const payment = event.object;
      console.log('❌ Платёж отменён:', payment.id);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка обработки вебхука:', error);
    res.status(500).json({ error: 'Ошибка обработки вебхука' });
  }
});

// Проверка статуса платежа
app.get('/api/payment-status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await yooKassa.getPayment(paymentId);
    
    res.json({
      success: true,
      status: payment.status,
      amount: payment.amount.value,
      description: payment.description
    });
  } catch (error) {
    console.error('Ошибка проверки статуса:', error);
    res.status(500).json({ error: 'Ошибка проверки статуса' });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📧 ЮKassa Shop ID: ${process.env.YOOKASSA_SHOP_ID}`);
});
```

### 3. Обновите `package.json` для сервера:

```json
{
  "name": "laboratorio-lampone-server",
  "version": "1.0.0",
  "description": "Backend для Laboratorio Lampone",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "yookassa": "^1.0.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### 4. Обновите `.gitignore`:

```gitignore
# Зависимости
node_modules/
server/node_modules/

# Секреты
.env
server/.env

# Сборка
dist/
build/

# Логи
*.log
npm-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

## 🔄 Обновление фронтенда

### Обновите `src/App.tsx` — функция `handleОплата`:

```typescript
const handleОплата = async () => {
  if (!выбраннаяУслуга || !сумма) {
    alert('Пожалуйста, выберите услугу и укажите сумму');
    return;
  }

  try {
    // Запрос к вашему серверу
    const response = await fetch('https://ваш-сервер.com/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: parseInt(сумма),
        description: выбраннаяУслуга,
        service: выбраннаяУслуга,
        email: данныеФормы.email // если есть
      })
    });

    const data = await response.json();
    
    if (data.success && data.confirmation_url) {
      // Перенаправление на страницу оплаты ЮKassa
      window.location.href = data.confirmation_url;
    } else {
      alert('Ошибка создания платежа: ' + (data.error || 'Неизвестная ошибка'));
    }
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Произошла ошибка при создании платежа. Попробуйте позже.');
  }
};
```

## 🚀 Деплой сервера

### Вариант 1: VPS (Virtual Private Server)

1. Арендуйте VPS (Timeweb, Beget, Reg.ru)
2. Установите Node.js
3. Загрузите код сервера
4. Настройте nginx как reverse proxy
5. Получите SSL сертификат (Let's Encrypt)

### Вариант 2: Облачные платформы

- **Railway.app** — бесплатный тариф
- **Render.com** — бесплатный тариф
- **Heroku** — платный, но простой

### Вариант 3: Vercel Serverless Functions

Создайте папку `api/` в корне проекта:

```
api/
└── create-payment.js
```

```javascript
// api/create-payment.js
const YooKassa = require('yookassa');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const yooKassa = new YooKassa({
    shopId: process.env.YOOKASSA_SHOP_ID,
    secretKey: process.env.YOOKASSA_SECRET_KEY
  });

  // ... остальной код создания платежа
}
```

## 🔒 Настройка вебхуков в ЮKassa

1. Войдите в личный кабинет ЮKassa
2. Перейдите в **"Настройки" → "Уведомления"**
3. Добавьте URL вебхука:
   ```
   https://ваш-сервер.com/api/payment-webhook
   ```
4. Выберите события:
   - ✅ `payment.succeeded`
   - ✅ `payment.canceled`
   - ✅ `payment.waiting_for_capture`

## 🧪 Тестирование

### Тестовые карты ЮKassa:

- **Успешная оплата:** `5555 5555 5555 4444`
- **Отклонённая:** `5555 5555 5555 4477`
- **3D Secure:** `5555 5555 5555 4444` (код: `123`)

Любые данные:
- Срок: `12/25` (или любая будущая дата)
- CVC: `123`

## 📊 Проверка работы

1. Запустите сервер: `npm run dev`
2. Откройте сайт
3. Выберите услугу
4. Введите сумму
5. Нажмите "Перейти к оплате"
6. Должно перенаправить на страницу ЮKassa
7. Используйте тестовую карту
8. Проверьте вебхук в логах сервера

## ⚠️ Важно перед продакшеном

1. ✅ Проверьте работу в тестовом режиме
2. ✅ Настройте вебхуки
3. ✅ Получите SSL сертификат (HTTPS обязательно!)
4. ✅ Настройте уведомления о платежах
5. ✅ Протестируйте все сценарии (успех, отказ, ошибка)
6. ✅ Настройте логи и мониторинг

## 📞 Поддержка

- Документация ЮKassa: https://yookassa.ru/developers/
- Email: support@yookassa.ru
- Телефон: 8 (800) 707-03-39

---

**Безопасность превыше всего! Никогда не коммитьте .env в git!**
