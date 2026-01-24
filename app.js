const tg = window.Telegram.WebApp;
tg.expand(); // Расширяем на весь экран

const body = document.body;
const actionBtn = document.getElementById('main-action-btn');
const statusTitle = document.getElementById('status-title');

// Эмуляция получения роли (в будущем будем брать из БД)
// Пока сделаем случайно для теста
const userRole = Math.random() > 0.5 ? 'bandit' : 'cop';

if (userRole === 'bandit') {
    body.classList.add('bandit-theme');
    statusTitle.innerText = "SYNDICATE TERMINAL";
    actionBtn.innerText = "ГРАБИТЬ";
} else {
    body.classList.add('cop-theme');
    statusTitle.innerText = "ENFORCER UNIT";
    actionBtn.innerText = "ПАТРУЛЬ";
}

actionBtn.addEventListener('click', () => {
    tg.HapticFeedback.impactOccurred('heavy'); // Вибрация при нажатии
    alert(userRole === 'bandit' ? "Вы совершили налет!" : "Вы задержали преступника!");
});