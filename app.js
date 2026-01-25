const tg = window.Telegram.WebApp;
tg.expand();

let balance = parseInt(localStorage.getItem('inf_db')) || 0;
let role = "POLICE"; // Можно менять на "BANDIT"
let myHits = 0;
let enemyHits = 0;
const goal = 12;
let botInterval;

function updateUI() {
    document.getElementById('balance').innerText = balance.toLocaleString();
    localStorage.setItem('inf_db', balance);
}

function switchTab(tab) {
    tg.HapticFeedback.impactOccurred('light');
    document.getElementById('page-radar').style.display = tab === 'radar' ? 'block' : 'none';
    document.getElementById('page-market').style.display = tab === 'market' ? 'block' : 'none';
    const btns = document.querySelectorAll('.nav-btn');
    btns[0].classList.toggle('active', tab === 'radar');
    btns[1].classList.toggle('active', tab === 'market');
}

function startCombat() {
    myHits = 0; enemyHits = 0;
    document.getElementById('combat-screen').style.display = 'block';
    spawnTarget();
    
    // Enemy Bot Simulation
    botInterval = setInterval(() => {
        enemyHits++;
        updateBars();
        if (enemyHits >= goal) endCombat(false);
    }, Math.random() * 300 + 400);
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
    dot.style.top = Math.random() * 75 + "%";
    dot.style.left = Math.random() * 70 + "%";
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
    clearInterval(botInterval);
    document.getElementById('combat-screen').style.display = 'none';
    if (win) {
        balance += 15000;
        tg.showAlert("TARGET NEUTRALIZED! +$15,000");
    } else {
        balance = Math.max(0, balance - 5000);
        tg.showAlert("TARGET ESCAPED! -$5,000");
    }
    updateUI();
}

document.getElementById('action-btn').onclick = () => startCombat();
updateUI();
