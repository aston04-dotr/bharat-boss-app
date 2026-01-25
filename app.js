const tg = window.Telegram.WebApp;
tg.expand();

let balance = parseInt(localStorage.getItem('inf_db')) || 10000;
let botSpeed = 600; // Базовая скорость бота
let myHits = 0, enemyHits = 0;
const goal = 15;
let botTimer;

function updateUI() {
    document.getElementById('balance').innerText = balance.toLocaleString();
    localStorage.setItem('inf_db', balance);
}

function buyItem(id, price) {
    if (balance >= price) {
        balance -= price;
        if (id === 'JAMMER') botSpeed += 200; // Замедляем бота
        tg.showAlert(`SUCCESS: ${id} ACQUIRED!`);
        updateUI();
    } else {
        tg.showAlert("LACK OF FUNDS");
    }
}

function switchTab(tab) {
    document.getElementById('page-radar').style.display = tab === 'radar' ? 'block' : 'none';
    document.getElementById('page-market').style.display = tab === 'market' ? 'block' : 'none';
    tg.HapticFeedback.impactOccurred('light');
}

function startCombat() {
    myHits = 0; enemyHits = 0;
    document.getElementById('combat-screen').style.display = 'block';
    spawnTarget();
    
    // Smart Bot: он делает паузы, имитируя человека
    botTimer = setInterval(() => {
        if (Math.random() > 0.3) { // 30% шанс, что бот "промахнется"
            enemyHits++;
            updateBars();
            if (enemyHits >= goal) endCombat(false);
        }
    }, botSpeed);
}

function updateBars() {
    document.getElementById('your-bar').style.width = (myHits / goal * 100) + "%";
    document.getElementById('enemy-bar').style.width = (enemyHits / goal * 100) + "%";
}

function spawnTarget() {
    const arena = document.getElementById('arena');
    arena.innerHTML = '';
    const dot = document.createElement('div');
    dot.className = 'combat-dot';
    dot.style.top = Math.random() * 70 + 5 + "%";
    dot.style.left = Math.random() * 70 + 5 + "%";
    dot.innerText = "KILL";

    dot.onclick = () => {
        tg.HapticFeedback.impactOccurred('heavy');
        myHits++;
        updateBars();
        if (myHits >= goal) endCombat(true);
        else spawnTarget();
    };
    arena.appendChild(dot);
}

function endCombat(win) {
    clearInterval(botTimer);
    document.getElementById('combat-screen').style.display = 'none';
    if (win) {
        balance += 12000;
        tg.showAlert("MISSION SUCCESS +$12,000");
    } else {
        balance = Math.max(0, balance - 4000);
        tg.showAlert("MISSION FAILED -$4,000");
    }
    updateUI();
}

document.getElementById('action-btn').onclick = () => startCombat();
updateUI();
