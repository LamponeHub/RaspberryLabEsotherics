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

// ============================================
// НАСТРОЙКИ ЮKASSA
// ============================================
// ВАЖНО: Замените эти значения на свои!
// Получить можно в личном кабинете ЮKassa: https://yookassa.ru

$SHOP_ID = '1492767'; // Ваш shopId
$SECRET_KEY = 'live_zdi75CJx4g7BkpBeI4kSjK2B2lVy5JcKTD2QpG6XGAU'; // Ваш секретный ключ

// URL возврата после оплаты
$RETURN_URL = 'https://laboratoriolampone.com.ru/payment-success.html';

// ============================================
// ПОЛУЧАЕМ ДАННЫЕ ИЗ ЗАПРОСА
// ============================================
$input = json_decode(file_get_contents('php://input'), true);

// Валидация данных
if (empty($input['amount']) || empty($input['description']) || empty($input['service'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Необходимо указать сумму, описание и услугу'
    ]);
    exit();
}

// Проверка суммы
$amount = floatval($input['amount']);
if ($amount < 100 || $amount > 1000000) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Сумма должна быть от 100 до 1 000 000 рублей'
    ]);
    exit();
}

// Email клиента (опционально)
$email = !empty($input['email']) ? $input['email'] : 'reception@laboratoriolampone.com.ru';

// ============================================
// СОЗДАЁМ ПЛАТЁЖ ЧЕРЕЗ ЮKASSA API
// ============================================

// Данные платежа
$paymentData = [
    'amount' => [
        'value' => number_format($amount, 2, '.', ''),
        'currency' => 'RUB'
    ],
    'confirmation' => [
        'type' => 'redirect',
        'return_url' => $RETURN_URL
    ],
    'capture' => true,
    'description' => 'Оплата услуги: ' . htmlspecialchars($input['service']),
    'receipt' => [
        'customer' => [
            'email' => $email
        ],
        'items' => [
            [
                'description' => htmlspecialchars($input['service']),
                'quantity' => '1.00',
                'amount' => [
                    'value' => number_format($amount, 2, '.', ''),
                    'currency' => 'RUB'
                ],
                'vat_code' => 1, // Без НДС
                'payment_mode' => 'full_payment',
                'payment_subject' => 'service'
            ]
        ]
    ],
    'metadata' => [
        'service' => $input['service'],
        'description' => $input['description']
    ]
];

// Инициализируем cURL
$ch = curl_init('https://api.yookassa.ru/v3/payments');

// Заголовки запроса
$headers = [
    'Content-Type: application/json',
    'Idempotence-Key: ' . uniqid('lampone_', true)
];

// Настройки cURL
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($paymentData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_USERPWD, "$SHOP_ID:$SECRET_KEY");
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

// Выполняем запрос
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);

curl_close($ch);

// Проверяем ошибки cURL
if ($curlError) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка подключения к платёжному шлюзу',
        'details' => $curlError
    ]);
    exit();
}

// Декодируем ответ
$result = json_decode($response, true);

// Проверяем HTTP код
if ($httpCode !== 200) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка создания платежа',
        'details' => isset($result['description']) ? $result['description'] : 'Неизвестная ошибка',
        'code' => $httpCode
    ]);
    exit();
}

// Проверяем что платёж создан
if (!isset($result['id']) || !isset($result['confirmation']['confirmation_url'])) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Некорректный ответ от платёжного шлюза'
    ]);
    exit();
}

// Возвращаем URL для оплаты
echo json_encode([
    'success' => true,
    'payment_id' => $result['id'],
    'confirmation_url' => $result['confirmation']['confirmation_url'],
    'amount' => $amount,
    'status' => $result['status']
]);
?>
