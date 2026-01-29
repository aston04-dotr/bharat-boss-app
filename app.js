const tg = window.Telegram.WebApp;
const socket = io();
tg.expand();

// Находим кнопку и счетчик денег
const missionBtn = document.getElementById('mission-btn');
const balanceDisplay = document.querySelector('.stat-value'); // Это твой баланс $ 0

let balance = 0;

missionBtn.onclick = () => {
    // 1. Отправляем сигнал на твой макбук
    socket.emit('click');
    
    // 2. Увеличиваем баланс в приложении
    balance += 10;
    balanceDisplay.textContent = `$ ${balance}`;
    
    // 3. Вибрация телефона (чтобы чувствовался клик)
    tg.HapticFeedback.impactOccurred('medium');
};

// Слушаем ответ от сервера (если сервер пришлет подтверждение)
socket.on('update_balance', (data) => {
    balance = data.new_balance;
    balanceDisplay.textContent = `$ ${balance}`;
});
