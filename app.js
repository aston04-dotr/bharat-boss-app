const tg = window.Telegram.WebApp;
tg.expand();

let balance = parseInt(localStorage.getItem('balance')) || 10000;
let hitCount = 0;
const targetLimit = 10;
let battleStart = 0;

function updateDisplay() {
    document.getElementById('balance').innerText = balance.toLocaleString();
    localStorage.setItem('balance', balance);
}

function initCombat() {
    hitCount = 0;
    battleStart = Date.now();
    document.getElementById('battle-screen').style.display = 'flex';
    document.getElementById('progress-text').innerText = `TARGETS: 0/${targetLimit}`;
    generateTarget();
}

function generateTarget() {
    const arena = document.getElementById('arena');
    arena.innerHTML = ''; 
    
    const target = document.createElement('div');
    target.className = 'battle-dot';
    target.style.top = Math.random() * 80 + 5 + "%";
    target.style.left = Math.random() * 80 + 5 + "%";
    target.innerText = "AIM";

    target.onclick = () => {
        tg.HapticFeedback.impactOccurred('medium');
        hitCount++;
        document.getElementById('progress-text').innerText = `TARGETS: ${hitCount}/${targetLimit}`;
        
        if (hitCount < targetLimit) {
            generateTarget();
        } else {
            resolveCombat();
        }
    };
    arena.appendChild(target);
}

function resolveCombat() {
    const finalTime = ((Date.now() - battleStart) / 1000).toFixed(2);
    document.getElementById('battle-screen').style.display = 'none';
    
    let reward = 0;
    if (parseFloat(finalTime) < 5.5) {
        reward = 7500;
        tg.showAlert(`EXCELLENT! Time: ${finalTime}s\nReward: +${reward} INF`);
    } else {
        reward = 1500;
        tg.showAlert(`STABILIZED. Time: ${finalTime}s\nReward: +${reward} INF`);
    }
    
    balance += reward;
    updateDisplay();
}

document.getElementById('main-action-btn').onclick = () => {
    tg.HapticFeedback.impactOccurred('heavy');
    initCombat();
};

updateDisplay();
