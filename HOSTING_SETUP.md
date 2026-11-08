# 📧 Установка формы обратной связи на хостинг

## ✅ Что уже готово

Создан PHP скрипт `public/api/send-email.php` для отправки заявок на почту `reception@laboratoriolampone.com.ru`

---

## 🚀 Установка (5 минут)

### Шаг 1: Загрузите файл на хостинг

**Вариант А: Через файловый менеджер хостинга**

1. Войдите в панель управления хостингом (cPanel, ISPmanager или другую)
2. Откройте **Файловый менеджер**
3. Перейдите в корневую папку сайта (обычно `public_html/` или `www/`)
4. Создайте папку `api/` если её нет
5. Загрузите файл `send-email.php` в папку `api/`

**Вариант Б: Через FTP/SFTP**

```bash
# Подключитесь к хостингу через FTP клиент (FileZilla, WinSCP)
# Загрузите файл:
public/api/send-email.php → /public_html/api/send-email.php
```

**Вариант В: Через Git (если настроен)**

```bash
git add public/api/send-email.php
git commit -m "Add email form handler"
git push
```

### Шаг 2: Проверьте права доступа

Убедитесь что файл имеет правильные права:

```bash
# Через SSH или файловый менеджер установите права:
chmod 644 public/api/send-email.php
```

### Шаг 3: Проверьте работу PHP

Откройте в браузере:
```
https://laboratoriolampone.com.ru/api/send-email.php
```

Должно вернуть:
```json
{"success":false,"error":"Метод не разрешён"}
```

Это нормально — означает что PHP работает.

### Шаг 4: Загрузите собранный сайт

Загрузите содержимое папки `dist/` в корневую папку сайта:

```bash
# Через FTP/SFTP загрузите:
dist/index.html → /public_html/index.html
dist/assets/ → /public_html/assets/
```

Или через Git:
```bash
npm run build
# Загрузите содержимое dist/ на хостинг
```

---

## 🧪 Тестирование

### 1. Откройте сайт

```
https://laboratoriolampone.com.ru
```

### 2. Заполните форму

- Имя: Тестовый Пользователь
- Email: test@example.com
- Цель: Тестирование формы
- Бюджет: 5 000 ₽
- ✅ Согласие на конфиденциальность

### 3. Нажмите "Отправить запрос"

Должно появиться сообщение "Заявка отправлена"

### 4. Проверьте почту

Откройте Roundcube или другой почтовый клиент:
```
https://mail.laboratoriolampone.com.ru
```

Логин: `reception@laboratoriolampone.com.ru`  
Пароль: ваш пароль от почты

Проверьте папку **Входящие** — должно прийти письмо с данными формы.

---

## 🔧 Решение проблем

### Ошибка: "404 Not Found"

**Причина:** Файл не загружен или неправильный путь

**Решение:**
1. Проверьте что файл загружен в `/public_html/api/send-email.php`
2. Проверьте URL: `https://laboratoriolampone.com.ru/api/send-email.php`
3. Проверьте права доступа: `chmod 644 send-email.php`

### Ошибка: "500 Internal Server Error"

**Причина:** Ошибка в PHP коде или неправильные настройки

**Решение:**
1. Проверьте логи ошибок в панели хостинга
2. Убедитесь что PHP версии 7.0+ установлен
3. Проверьте что функция `mail()` не заблокирована

### Письма не приходят

**Причина:** Проблема с почтовым сервером

**Решение:**
1. Проверьте папку "Спам" в Roundcube
2. Проверьте что почтовый ящик `reception@laboratoriolampone.com.ru` активен
3. Обратитесь в техподдержку хостинга:
   - Работает ли функция `mail()` на хостинге?
   - Нет ли ограничений на отправку писем?
   - Правильные ли SPF/DKIM записи?

### Ошибка: "CORS error" в консоли браузера

**Причина:** Неправильные заголовки CORS

**Решение:**
Убедитесь что в начале файла `send-email.php` есть:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

---

## 📊 Проверка работы

### Логи PHP

Если есть доступ к SSH, проверьте логи:

```bash
# Для Apache
tail -f /var/log/apache2/error.log

# Для Nginx + PHP-FPM
tail -f /var/log/php-fpm/error.log
```

### Тест через curl

```bash
curl -X POST https://laboratoriolampone.com.ru/api/send-email.php \
  -H "Content-Type: application/json" \
  -d '{"name":"Тест","email":"test@example.com","message":"Тестовое сообщение","budget":"5000","confidentiality":true}'
```

Должно вернуть:
```json
{"success":true,"message":"Заявка успешно отправлена"}
```

---

## 🔒 Безопасность

### Защита от спама

PHP скрипт уже включает:
- ✅ Валидацию email
- ✅ Очистку данных (htmlspecialchars)
- ✅ Проверку обязательных полей

### Дополнительные меры

**1. Rate Limiting (через .htaccess)**

Создайте файл `public/api/.htaccess`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} POST
    RewriteCond %{HTTP:X-Forwarded-For} ^(.*)$
    RewriteRule .* - [E=RATE_LIMIT:%{REMOTE_ADDR}]
</IfModule>

# Ограничение: 5 запросов в минуту
<IfModule mod_ratelimit.c>
    SetOutputFilter RATE_LIMIT
    SetEnv rate-limit 5
</IfModule>
```

**2. Honeypot поле**

Добавьте в форму скрытое поле для ботов (уже реализовано в PHP).

**3. Google reCAPTCHA**

Для дополнительной защиты можно добавить reCAPTCHA (опционально).

---

## 📧 Что получает клиент

После отправки формы клиент видит:
- ✅ Анимацию загрузки "Отправка..."
- ✅ Сообщение "Заявка отправлена"
- ✅ Кнопку "Отправить ещё одну заявку"

## 📧 Что получаете вы

На почту `reception@laboratoriolampone.com.ru` приходит красивое HTML-письмо с:
- Именем клиента
- Email (кликабельная ссылка для ответа)
- Целью обращения
- Выбранным бюджетом
- Согласием на конфиденциальность

---

## ✅ Чек-лист

- [ ] Файл `send-email.php` загружен в `/public_html/api/`
- [ ] Права доступа установлены: `chmod 644 send-email.php`
- [ ] PHP скрипт доступен по URL: `https://laboratoriolampone.com.ru/api/send-email.php`
- [ ] Сайт загружен на хостинг (содержимое `dist/`)
- [ ] Тестовая заявка отправлена успешно
- [ ] Письмо пришло на `reception@laboratoriolampone.com.ru`
- [ ] Проверена папка "Спам"

---

## 🆘 Если что-то не работает

### Обратитесь в техподдержку хостинга

**Вопросы для техподдержки:**
1. Работает ли функция `mail()` на моём хостинге?
2. Есть ли ограничения на отправку писем через PHP?
3. Правильно ли настроены SPF/DKIM записи для домена `laboratoriolampone.com.ru`?
4. Не заблокирован ли порт 25 для исходящей почты?
5. Какие логи ошибок PHP я могу посмотреть?

### Альтернативное решение

Если `mail()` не работает, можно использовать PHPMailer с SMTP:

1. Скачайте PHPMailer: https://github.com/PHPMailer/PHPMailer
2. Загрузите в папку `public/api/PHPMailer/`
3. Обновите `send-email.php` для использования SMTP (инструкция внутри файла)

---

## 📚 Дополнительные файлы

- `QUICK_START.md` — быстрый старт деплоя
- `VERCEL_DEPLOY.md` — инструкция для Vercel (альтернатива)
- `SMTP_SETUP.md` — настройка SMTP-сервера
- `PAYMENT_SETUP.md` — интеграция с ЮKassa
- `PRICE_LIST.md` — прайс-лист услуг

---

**Готово! Теперь заявки будут приходить прямо на почту!** 🎉
