const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Метод не разрешён' });
  }

  // CORS заголовки
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { name, email, message, budget, confidentiality } = req.body;

    // Валидация
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Заполните обязательные поля: имя, email и цель обращения',
      });
    }

    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Некорректный email адрес',
      });
    }

    // SMTP транспортёр через mail.laboratoriolampone.com.ru
    const transporter = nodemailer.createTransport({
      host: 'mail.laboratoriolampone.com.ru',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // HTML-шаблон письма
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #030712; color: #F1F5F9; padding: 30px;">
        <div style="border-bottom: 1px solid rgba(147, 51, 234, 0.4); padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="font-family: Georgia, serif; font-weight: 300; color: #F1F5F9; margin: 0; font-size: 24px;">
            Новая заявка с сайта
          </h1>
          <p style="color: #E2D8F0; font-size: 14px; margin: 10px 0 0 0;">
            Laboratorio Lampone
          </p>
        </div>

        <div style="background-color: rgba(45, 27, 61, 0.3); border: 1px solid rgba(147, 51, 234, 0.3); padding: 20px; border-radius: 2px;">
          <h2 style="color: #E5DEFF; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0;">
            Данные клиента
          </h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #9333EA; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 150px; vertical-align: top;">
                Имя
              </td>
              <td style="padding: 10px 0; color: #F1F5F9; font-size: 14px;">
                ${name}
              </td>
            </tr>
            <tr style="border-top: 1px solid rgba(147, 51, 234, 0.2);">
              <td style="padding: 10px 0; color: #9333EA; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">
                Email
              </td>
              <td style="padding: 10px 0; font-size: 14px;">
                <a href="mailto:${email}" style="color: #C41E3A; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr style="border-top: 1px solid rgba(147, 51, 234, 0.2);">
              <td style="padding: 10px 0; color: #9333EA; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">
                Бюджет
              </td>
              <td style="padding: 10px 0; color: #F1F5F9; font-size: 14px;">
                ${budget ? budget + ' ₽' : 'Не указан'}
              </td>
            </tr>
            <tr style="border-top: 1px solid rgba(147, 51, 234, 0.2);">
              <td style="padding: 10px 0; color: #9333EA; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">
                Цель
              </td>
              <td style="padding: 10px 0; color: #F1F5F9; font-size: 14px; line-height: 1.6;">
                ${message.replace(/\n/g, '<br>')}
              </td>
            </tr>
            <tr style="border-top: 1px solid rgba(147, 51, 234, 0.2);">
              <td style="padding: 10px 0; color: #9333EA; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">
                Согласие
              </td>
              <td style="padding: 10px 0; color: #F1F5F9; font-size: 14px;">
                ${confidentiality ? '✓ Согласен с условиями' : '✗ Не согласен'}
              </td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(147, 51, 234, 0.2);">
          <p style="color: rgba(226, 216, 240, 0.6); font-size: 11px; margin: 0; line-height: 1.5;">
            Письмо отправлено автоматически с сайта Laboratorio Lampone.<br>
            Ответьте напрямую клиенту: ${email}
          </p>
        </div>
      </div>
    `;

    // Отправка письма
    const info = await transporter.sendMail({
      from: `"Laboratorio Lampone" <${process.env.SMTP_USER}>`,
      to: 'reception@laboratoriolampone.com.ru',
      replyTo: email,
      subject: `Новая заявка с сайта от ${name}`,
      text: `Новая заявка с сайта Laboratorio Lampone\n\nИмя: ${name}\nEmail: ${email}\nБюджет: ${budget || 'Не указан'}\n\nЦель обращения:\n${message}\n\nСогласие на конфиденциальность: ${confidentiality ? 'Да' : 'Нет'}`,
      html: htmlContent,
    });

    console.log('✅ Письмо отправлено:', info.messageId);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: 'Заявка успешно отправлена',
    });
  } catch (error) {
    console.error('❌ Ошибка отправки:', error);
    return res.status(500).json({
      success: false,
      error: 'Ошибка отправки заявки. Попробуйте позже или напишите напрямую на reception@laboratoriolampone.com.ru',
    });
  }
};
