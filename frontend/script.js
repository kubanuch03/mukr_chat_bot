// Находим нужные элементы на странице
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');
console.log('Поиск chatForm:', chatForm);
const BACKEND_URL = 'http://localhost:8987/text/'; 

// Добавляем слушателя события "submit" (отправка) на форму
chatForm.addEventListener('submit', function(event) {
    console.log('Форма отправлена!');
    // Предотвращаем стандартное поведение формы (перезагрузку страницы)
    event.preventDefault();

    // Получаем текст из поля ввода и убираем лишние пробелы по краям
    const userMessageText = messageInput.value.trim();

    // Если сообщение не пустое
    if (userMessageText !== '') {
        // 1. Отображаем сообщение пользователя СРАЗУ
        addMessage(userMessageText, 'user');

        // 2. Очищаем поле ввода
        messageInput.value = '';

        // 3. Отправляем сообщение на бэкенд
        sendMessageToBackend(userMessageText);
    }
});

// Функция для отправки сообщения на бэкенд
function sendMessageToBackend(text) {
    console.log(`Отправка на бэкенд: ${text}`); // Лог для отладки

    fetch(BACKEND_URL, {
        method: 'POST', // Используем метод POST
        headers: {
            'Content-Type': 'application/json', // Указываем, что отправляем JSON
            // 'Accept': 'application/json' // Опционально: указываем, что ожидаем JSON в ответ
        },
        body: JSON.stringify({ text: text }) // Формируем тело запроса в виде JSON строки
    })
    .then(response => {
        // Проверяем, успешен ли ответ (статус 2xx)
        if (!response.ok) {
            // Если статус не 2xx (например, 404, 500), создаем ошибку
            console.error('Ошибка сети или сервера:', response.status, response.statusText);
            // Выводим сообщение об ошибке в чат
            addMessage(`Ошибка ответа сервера: ${response.status}`, 'bot');
            // Выбрасываем ошибку, чтобы попасть в .catch()
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Пытаемся прочитать ответ как JSON
        // Если бэкенд не возвращает JSON или вообще ничего не возвращает, эта часть может вызвать ошибку
        // или вернуть null/undefined. Адаптируй под реальный ответ твоего бэкенда.
        return response.json(); // Или response.text() если бэкенд отдает просто текст
    })
    .then(data => {
        // Бэкенд успешно ответил и вернул JSON
        console.log('Ответ от бэкенда:', data);

        // Предполагаем, что бэкенд возвращает JSON вида {"response": "текст ответа бота"}
        // ИЛИ {"text": "текст ответа бота"} - адаптируй под твой формат ответа
        const botResponse = data.response || data.text; // Попробуй найти ответ в поле 'response' или 'text'

        if (botResponse) {
            addMessage(botResponse, 'bot');
        } else {
            // Если бэкенд ответил успешно (2xx), но не прислал ожидаемый текст
            console.log('Бэкенд ответил, но не содержит ожидаемого поля ответа.');
            // Можно добавить заглушку или ничего не делать
             addMessage("Получен ответ от сервера, но не могу его отобразить.", 'bot');
        }
    })
    .catch(error => {
        // Обрабатываем ошибки сети (не удалось подключиться) или ошибки из .then()
        console.error('Ошибка при отправке или обработке запроса:', error);
        // Выводим сообщение об ошибке в чат (кроме случаев, когда уже вывели ошибку HTTP)
        if (!error.message.includes('HTTP error')) {
             addMessage('Не удалось связаться с ботом. Проверьте консоль.', 'bot');
        }
    });
}

// Функция для добавления нового сообщения в чат (осталась без изменений)
function addMessage(text, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


