# Настройка сервера для отправки заявок на почту

## 📧 SMTP настройки

Ваши данные для отправки почты:

**Сервер:** mail.laboratoriolampone.com.ru  
**Порт SSL/TLS:** 465  
**Пользователь:** reception@laboratoriolampone.com.ru  
**Пароль:** ⚠️ НУЖНО ДОБАВИТЬ В .env

---

## 🚀 Установка и запуск

### 1. Перейдите в папку сервера

```bash
cd server
```

### 2. Установите зависимости

```bash
npm install
```

### 3. Добавьте пароль от почты

Откройте файл `server/.env` и замените `ВСТАВЬТЕ_ПАРОЛЬ_ОТ_ПОЧТЫ` на реальный пароль от ящика reception@laboratoriolampone.com.ru:

```env
SMTP_USER=reception@laboratoriolampone.com.ru
SMTP_PASS=ваш_реальный_пароль_от_почты
```

### 4. Запустите сервер

**Для разработки:**
```bash
npm run dev
```

**Для продакшена:**
```bash
npm start
```

Сервер запустится на порту 3001.

---

## 🔧 Настройка на хостинге

### Вариант 1: VPS (рекомендуется)

Если у вас VPS (109.95.213.99), настройте сервер как systemd service:

#### 1. Создайте файл service

```bash
sudo nano /etc/systemd/system/lampone-email.service
```

#### 2. Добавьте содержимое

```ini
[Unit]
Description=Laboratorio Lampone Email Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/server
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

#### 3. Запустите сервис

```bash
sudo systemctl daemon-reload
sudo systemctl start lampone-email
sudo systemctl enable lampone-email
```

#### 4. Проверьте статус

```bash
sudo systemctl status lampone-email
```

---

### Вариант 2: Nginx reverse proxy

Настройте Nginx для проксирования запросов с сайта на сервер:

```nginx
server {
    listen 80;
    server_name laboratoriolampone.com.ru;

    # Статические файлы сайта
    location / {
        root /path/to/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API для отправки заявок
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Перезапустите Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🧪 Тестирование

### 1. Проверьте работу сервера

```bash
curl http://localhost:3001/api/health
```

Должно вернуть:
```json
{
  "status": "ok",
  "service": "Laboratorio Lampone Email Server",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Отправьте тестовую заявку

Откройте сайт в браузере, заполните форму и отправьте. Проверьте почту reception@laboratoriolampone.com.ru — должно прийти красиво оформленное письмо.

### 3. Проверьте логи

```bash
# Для systemd
sudo journalctl -u lampone-email -f

# Или если запускали вручную
# смотрите в терминал, где запущен сервер
```

---

## 🔒 Безопасность

### ⚠️ ВАЖНО: Никогда не коммитьте .env в git!

Добавьте в `.gitignore`:

```gitignore
server/.env
server/node_modules/
```

### Защита API

Добавьте rate limiting для защиты от спама:

```bash
npm install express-rate-limit
```

Добавьте в `server/index.js`:

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

app.use('/api/send-email', limiter);
```

---

## 🛠️ Решение проблем

### Ошибка: "Invalid login"

**Причина:** Неправильный пароль в .env

**Решение:** Проверьте пароль от почты reception@laboratoriolampone.com.ru

---

### Ошибка: "Connection timeout"

**Причина:** Порт 465 заблокирован фаерволом

**Решение:**
```bash
# Проверьте доступность порта
telnet mail.laboratoriolampone.com.ru 465

# Если не работает, попробуйте порт 587 (TLS)
# Измените в server/index.js:
port: 587,
secure: false,
tls: {
  ciphers: 'SSLv3'
}
```

---

### Ошибка: "Self-signed certificate"

**Причина:** SSL сертификат не доверенный

**Решение:** Уже настроено в коде (`rejectUnauthorized: false`)

---

### Письма не приходят

**Проверьте:**
1. Пароль в .env правильный
2. Сервер запущен (`systemctl status lampone-email`)
3. Nginx проксирует запросы на порт 3001
4. В логах нет ошибок отправки
5. Папка "Спам" в почтовом ящике

---

## 📊 Мониторинг

### Логи в реальном времени

```bash
sudo journalctl -u lampone-email -f
```

### Статистика отправленных писем

Добавьте в `server/index.js`:

```javascript
let emailCount = 0;

// В функции отправки:
emailCount++;
console.log(`📧 Отправлено писем: ${emailCount}`);

// Добавьте endpoint:
app.get('/api/stats', (req, res) => {
  res.json({ emailsSent: emailCount });
});
```

---

## 🔄 Альтернативные варианты

Если SMTP не работает, можно использовать:

### 1. FormSubmit.co (уже настроено как fallback)

Раскомментируйте код с FormSubmit в `src/App.tsx`

### 2. SendGrid

```bash
npm install @sendgrid/mail
```

### 3. Mailgun

```bash
npm install mailgun.js
```

---

## 📞 Поддержка хостинга

Если возникают проблемы с SMTP, обратитесь к хостинг-провайдеру:

**Вопросы для техподдержки:**
- Разрешена ли отправка почты через порт 465?
- Есть ли ограничения на количество писем?
- Не заблокирован ли IP сервера?
- Правильные ли SPF/DKIM записи?

---

## ✅ Чек-лист перед запуском

- [ ] Установлены зависимости (`npm install`)
- [ ] Добавлен пароль в `.env`
- [ ] Сервер запускается без ошибок
- [ ] Тестовая заявка отправлена успешно
- [ ] Письмо пришло на reception@laboratoriolampone.com.ru
- [ ] Настроен systemd service (для VPS)
- [ ] Настроен Nginx reverse proxy
- [ ] Добавлен rate limiting
- [ ] Добавлен `.env` в `.gitignore`

---

**Дата обновления:** Январь 2024  
**Версия:** 1.0
