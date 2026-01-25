const tg = window.Telegram.WebApp;
tg.expand();

let balance = parseInt(localStorage.getItem('inf_data')) || 0;
let hits = 0;
const goal = 15;

function updateDisplay() {
    document.getElementById('balance').innerText = balance.toLocaleString();
    localStorage.setItem('inf_data', balance);
}

function showPage(pageId) {
    tg.HapticFeedback.impactOccurred('light');
    document.getElementById('page-radar').style.display = (pageId === 'radar') ? 'block' : 'none';
    document.getElementById('page-market').style.display = (pageId === 'market') ? 'block' : 'none';
    document.getElementById('page-leaders').style.display = (pageId === 'leaders') ? 'block' : 'none';
    
    const items = document.querySelectorAll('.nav-item');
    items[0].classList.toggle('active', pageId === 'radar');
    items[1].classList.toggle('active', pageId === 'market');
    items[2].classList.toggle('active', pageId === 'leaders');
}

function startMission() {
    hits = 0;
    document.getElementById('combat-overlay').style.display = 'block';
    document.getElementById('progress-bar').style.width = "0%";
    spawnTarget();
}

function spawnTarget() {
    const arena = document.getElementById('arena');
    arena.innerHTML = '';
    const dot = document.createElement('div');
    dot.className = 'combat-dot';
    dot.style.top = Math.random() * 80 + 5 + "%";
    dot.style.left = Math.random() * 80 + 5 + "%";
    dot.innerText = "PUSH"; // ЗАМЕНЕНО НА PUSH

    dot.onclick = (e) => {
        e.stopPropagation();
        tg.HapticFeedback.impactOccurred('heavy');
        hits++;
        document.getElementById('progress-bar').style.width = (hits / goal * 100) + "%";
        
        if (hits < goal) {
            spawnTarget();
        } else {
            endMission();
        }
    };
    arena.appendChild(dot);
}

function endMission() {
    document.getElementById('combat-overlay').style.display = 'none';
    const reward = 10000;
    balance += reward;
    tg.showAlert(`MISSION SUCCESS!\nEarned: +$${reward.toLocaleString()}`);
    updateDisplay();
}

document.getElementById('start-btn').onclick = () => {
    tg.HapticFeedback.notificationOccurred('success');
    startMission();
};

// Start UI
updateDisplay();
