const tg = window.Telegram.WebApp;
tg.expand();

const RANKS = ["RECRUIT", "OPERATIVE", "AGENT", "SPECIALIST", "COMMANDER", "OVERLORD"];

// Persistent data loading
let balance = parseInt(localStorage.getItem('user_inf')) || 0;
let level = parseInt(localStorage.getItem('user_lvl')) || 0;
let hits = 0;
let startTime = 0;

function updateDisplay() {
    document.getElementById('balance').innerText = balance.toLocaleString();
    document.getElementById('rank-name').innerText = RANKS[Math.min(level, RANKS.length - 1)];
    
    // Save to device memory
    localStorage.setItem('user_inf', balance);
    localStorage.setItem('user_lvl', level);
}

function startCombat() {
    hits = 0;
    startTime = Date.now();
    document.getElementById('battle-screen').style.display = 'block';
    document.getElementById('progress-text').innerText = `REMAINING: 10`;
    spawnTarget();
}

function spawnTarget() {
    const arena = document.getElementById('arena');
    arena.innerHTML = ''; 
    const dot = document.createElement('div');
    dot.className = 'battle-dot';
    dot.style.top = Math.random() * 80 + 5 + "%";
    dot.style.left = Math.random() * 80 + 5 + "%";
    dot.innerText = "KILL";

    dot.onclick = (e) => {
        e.stopPropagation();
        tg.HapticFeedback.impactOccurred('medium');
        hits++;
        document.getElementById('progress-text').innerText = `REMAINING: ${10 - hits}`;
        if (hits < 10) spawnTarget();
        else finishCombat();
    };
    arena.appendChild(dot);
}

function finishCombat() {
    const totalTime = (Date.now() - startTime) / 1000;
    document.getElementById('battle-screen').style.display = 'none';
    
    let reward = totalTime < 5.0 ? 5000 : 1200;
    balance += reward;
    
    // Rank up logic (every 50k INF)
    if (balance > (level + 1) * 50000) level++;
    
    tg.showAlert(`MISSION REPORT\nTime: ${totalTime.toFixed(2)}s\nReward: +${reward} INF`);
    updateDisplay();
}

document.getElementById('main-action-btn').onclick = () => {
    tg.HapticFeedback.impactOccurred('heavy');
    startCombat();
};

updateDisplay();
