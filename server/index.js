const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.SITE_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка SMTP-транспортёра через mail.laboratoriolampone.com.ru
const transporter = nodemailer.createTransport({
  host: 'mail.laboratoriolampone.com.ru',
  port: 465, // SSL/TLS порт
  secure: true, // true для 465, false для других портов
  auth: {
    user: process.env.SMTP_USER, // reception@laboratoriolampone.com.ru
    pass: process.env.SMTP_PASS, // пароль от почтового ящика
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Проверка подключения к SMTP при старте
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Ошибка подключения к SMTP:', error);
  } else {
    console.log('✅ SMTP-сервер подключён и готов к отправке писем');
  }
});

// Endpoint для отправки заявок с формы
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, message, budget, confidentiality } = req.body;

    // Валидация данных
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Заполните обязательные поля: имя, email и цель обращения'
      });
    }

    // Формируем HTML-письмо
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #030712; color: #F1F5F9; padding: 30px;">
        <div style="border-bottom: 1px solid rgba(147, 51, 234, 0.4); padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="font-family: 'Cormorant Garamond', serif; font-weight: 300; color: #F1F5F9; margin: 0;">
            Новая заявка с сайта
          </h1>
          <p style="color: #E2D8F0; font-size: 14px; margin: 10px 0 0 0;">
            Laboratorio Lampone
          </p>
        </div>

        <div style="background-color: rgba(45, 27, 61, 0.3); border: 1px solid rgba(147, 51, 234, 0.3); padding: 20px; border-radius: 2px;">
          <h2 style="color: #E5DEFF; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0;">
            Данные клиента
          </h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #9333EA; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 150px;">
                Имя
              </td>
              <td style="padding: 10px 0; color: #F1F5F9;">
                ${name}
              </td>
            </tr>
            <tr style="border-top: 1px solid rgba(147, 51, 234, 0.2);">
              <td style="padding: 10px 0; color: #9333EA; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                Email
              </td>
              <td style="padding: 10px 0;">
                <a href="mailto:${email}" style="color: #C41E3A; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr style="border-top: 1px solid rgba(147, 51, 234, 0.2);">
              <td style="padding: 10px 0; color: #9333EA; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                Бюджет
              </td>
              <td style="padding: 10px 0; color: #F1F5F9;">
                ${budget ? budget + ' ₽' : 'Не указан'}
              </td>
            </tr>
            <tr style="border-top: 1px solid rgba(147, 51, 234, 0.2);">
              <td style="padding: 10px 0; color: #9333EA; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">
                Цель обращения
              </td>
              <td style="padding: 10px 0; color: #F1F5F9; line-height: 1.6;">
                ${message.replace(/\n/g, '<br>')}
              </td>
            </tr>
            <tr style="border-top: 1px solid rgba(147, 51, 234, 0.2);">
              <td style="padding: 10px 0; color: #9333EA; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
                Конфиденциальность
              </td>
              <td style="padding: 10px 0; color: #F1F5F9;">
                ${confidentiality ? '✓ Согласен' : '✗ Не согласен'}
              </td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(147, 51, 234, 0.2);">
          <p style="color: rgba(226, 216, 240, 0.6); font-size: 12px; margin: 0;">
            Это письмо отправлено автоматически с сайта Laboratorio Lampone.
            <br>
            Ответьте напрямую на email клиента: ${email}
          </p>
        </div>
      </div>
    `;

    // Отправляем письмо
    const info = await transporter.sendMail({
      from: `"Laboratorio Lampone" <${process.env.SMTP_USER}>`,
      to: 'reception@laboratoriolampone.com.ru',
      replyTo: email, // Ответ будет приходить от клиента
      subject: `Новая заявка с сайта от ${name}`,
      text: `Новая заявка с сайта Laboratorio Lampone\n\nИмя: ${name}\nEmail: ${email}\nБюджет: ${budget || 'Не указан'}\n\nЦель обращения:\n${message}\n\nСогласие на конфиденциальность: ${confidentiality ? 'Да' : 'Нет'}`,
      html: htmlContent,
    });

    console.log('✅ Письмо отправлено:', info.messageId);

    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Заявка успешно отправлена'
    });

  } catch (error) {
    console.error('❌ Ошибка отправки письма:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка отправки заявки. Попробуйте позже или напишите напрямую на reception@laboratoriolampone.com.ru'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Laboratorio Lampone Email Server',
    timestamp: new Date().toISOString()
  });
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📧 SMTP: mail.laboratoriolampone.com.ru:465`);
  console.log(`👤 Пользователь: ${process.env.SMTP_USER}`);
});
