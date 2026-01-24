const tg = window.Telegram.WebApp;
tg.expand();

const targets = [
    { name: "STREET THUG", risk: "LOW", reward: 800 },
    { name: "CYBER HEIST", risk: "MEDIUM", reward: 2500 },
    { name: "DATA BREACH", risk: "HIGH", reward: 12000 },
    { name: "SYNDICATE BOSS", risk: "CRITICAL", reward: 45000 }
];

let balance = parseInt(localStorage.getItem('balance')) || 15000;
let currentTarget = targets[0];

function updateUI() {
    document.getElementById('balance').innerText = balance.toLocaleString();
    localStorage.setItem('balance', balance);
}

function scanForTargets() {
    currentTarget = targets[Math.floor(Math.random() * targets.length)];
    document.getElementById('target-name').innerText = currentTarget.name;
    document.getElementById('risk-level').innerText = currentTarget.risk;
}

document.getElementById('main-action-btn').addEventListener('click', () => {
    tg.HapticFeedback.impactOccurred('medium');
    
    // Simulate tactical success
    tg.showConfirm(`CONFIRM NEUTRALIZATION: ${currentTarget.name}?`, (confirmed) => {
        if (confirmed) {
            balance += currentTarget.reward;
            updateUI();
            scanForTargets();
        }
    });
});

scanForTargets();
updateUI();
