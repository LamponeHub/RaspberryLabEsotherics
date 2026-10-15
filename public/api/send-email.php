<?php
// Настройки CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Обработка preflight запроса
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Разрешаем только POST запросы
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Метод не разрешён']);
    exit();
}

// Получаем данные из JSON запроса
$input = json_decode(file_get_contents('php://input'), true);

// Валидация данных
if (empty($input['name']) || empty($input['email']) || empty($input['message'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Заполните обязательные поля: имя, email и цель обращения'
    ]);
    exit();
}

// Проверка email
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Некорректный email адрес'
    ]);
    exit();
}

// Очищаем данные
$name = htmlspecialchars($input['name'], ENT_QUOTES, 'UTF-8');
$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars($input['message'], ENT_QUOTES, 'UTF-8');
$budget = !empty($input['budget']) ? htmlspecialchars($input['budget'], ENT_QUOTES, 'UTF-8') . ' ₽' : 'Не указан';
$confidentiality = !empty($input['confidentiality']) ? '✓ Согласен' : '✗ Не согласен';

// Email для получения заявок
$to = 'reception@laboratoriolampone.com.ru';

// Тема письма
$subject = "=?UTF-8?B?" . base64_encode("Новая заявка с сайта от $name") . "?=";

// HTML шаблон письма
$htmlMessage = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #030712; color: #F1F5F9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 30px; }
        .header { border-bottom: 1px solid rgba(147, 51, 234, 0.4); padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { font-family: Georgia, serif; font-weight: 300; color: #F1F5F9; margin: 0; font-size: 24px; }
        .header p { color: #E2D8F0; font-size: 14px; margin: 10px 0 0 0; }
        .content { background-color: rgba(45, 27, 61, 0.3); border: 1px solid rgba(147, 51, 234, 0.3); padding: 20px; border-radius: 2px; }
        .content h2 { color: #E5DEFF; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 10px 0; font-size: 14px; vertical-align: top; }
        .label { color: #9333EA; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 150px; }
        .value { color: #F1F5F9; }
        .divider { border-top: 1px solid rgba(147, 51, 234, 0.2); }
        a { color: #C41E3A; text-decoration: none; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(147, 51, 234, 0.2); }
        .footer p { color: rgba(226, 216, 240, 0.6); font-size: 11px; margin: 0; line-height: 1.5; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Новая заявка с сайта</h1>
            <p>Laboratorio Lampone</p>
        </div>

        <div class="content">
            <h2>Данные клиента</h2>
            
            <table>
                <tr>
                    <td class="label">Имя</td>
                    <td class="value">' . $name . '</td>
                </tr>
                <tr class="divider">
                    <td class="label">Email</td>
                    <td class="value"><a href="mailto:' . $email . '">' . $email . '</a></td>
                </tr>
                <tr class="divider">
                    <td class="label">Бюджет</td>
                    <td class="value">' . $budget . '</td>
                </tr>
                <tr class="divider">
                    <td class="label">Цель обращения</td>
                    <td class="value">' . nl2br($message) . '</td>
                </tr>
                <tr class="divider">
                    <td class="label">Согласие</td>
                    <td class="value">' . $confidentiality . '</td>
                </tr>
            </table>
        </div>

        <div class="footer">
            <p>
                Письмо отправлено автоматически с сайта Laboratorio Lampone.<br>
                Ответьте напрямую клиенту: ' . $email . '
            </p>
        </div>
    </div>
</body>
</html>';

// Текстовая версия письма (для клиентов без HTML)
$textMessage = "Новая заявка с сайта Laboratorio Lampone\n\n";
$textMessage .= "Имя: $name\n";
$textMessage .= "Email: $email\n";
$textMessage .= "Бюджет: $budget\n\n";
$textMessage .= "Цель обращения:\n$message\n\n";
$textMessage .= "Согласие на конфиденциальность: $confidentiality\n";

// Заголовки письма
$headers = array(
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: Laboratorio Lampone <reception@laboratoriolampone.com.ru>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'X-Priority: 3'
);

// Отправка письма
$mailSent = mail($to, $subject, $htmlMessage, implode("\r\n", $headers));

if ($mailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Заявка успешно отправлена'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка отправки заявки. Попробуйте позже или напишите напрямую на reception@laboratoriolampone.com.ru'
    ]);
}
?>
