const tg = window.Telegram.WebApp;
const socket = io('https://atrociously-notionate-idalia.ngrok-free.dev');
tg.expand();

let balance = parseInt(localStorage.getItem('syndicate_inf')) || 0;
let myHits = 0, enemyHits = 0;
const goal = 15;
let botBrain;

function updateUI() {
    document.getElementById('balance').innerText = balance.toLocaleString();
    localStorage.setItem('syndicate_inf', balance);
}

function startCombat() {
    myHits = 0; enemyHits = 0;
    document.getElementById('combat-overlay').style.display = 'block';
    updateBars();
    spawnTarget();
    
    // Бот начинает "думать" и нажимать
    botBrain = setInterval(() => {
        if (Math.random() > 0.4) { // Бот иногда ошибается, давая тебе шанс
            enemyHits++;
            updateBars();
            if (enemyHits >= goal) endCombat(false);
        }
    }, 550); // Скорость бота
}

function updateBars() {
    // Твоя полоска
    document.getElementById('your-bar').style.width = (myHits / goal * 100) + "%";
    document.getElementById('your-count').innerText = `${myHits}/${goal}`;
    // Полоска бота
    document.getElementById('enemy-bar').style.width = (enemyHits / goal * 100) + "%";
    document.getElementById('enemy-count').innerText = `${enemyHits}/${goal}`;
}

function spawnTarget() {
    const arena = document.getElementById('arena');
    arena.innerHTML = '';
    const dot = document.createElement('div');
    dot.className = 'combat-dot';
    dot.style.top = Math.random() * 80 + 5 + "%";
    dot.style.left = Math.random() * 80 + 5 + "%";
    dot.innerText = "PUSH";

    dot.onclick = (e) => {
        e.stopPropagation();
        tg.HapticFeedback.impactOccurred('heavy');
        myHits++;
        updateBars();
        if (myHits >= goal) endCombat(true);
        else spawnTarget();
    };
    arena.appendChild(dot);
}

function endCombat(win) {
    clearInterval(botBrain);
    document.getElementById('combat-overlay').style.display = 'none';
    if (win) {
        balance += 15000;
        tg.showAlert("SUCCESS: Target Intercepted! +$15,000");
    } else {
        balance = Math.max(0, balance - 5000);
        tg.showAlert("FAILED: Target Escaped! -$5,000");
    }
    updateUI();
}

document.getElementById('start-btn').onclick = () => {
    tg.HapticFeedback.notificationOccurred('success');
    startCombat();
};

updateUI();
