// ... (предыдущие переменные)

function switchTab(tab) {
    tg.HapticFeedback.impactOccurred('light');
    document.getElementById('page-radar').style.display = tab === 'radar' ? 'block' : 'none';
    document.getElementById('page-market').style.display = tab === 'market' ? 'block' : 'none';
    document.getElementById('page-leaders').style.display = tab === 'leaders' ? 'block' : 'none';
    
    const btns = document.querySelectorAll('.nav-btn');
    btns[0].classList.toggle('active', tab === 'radar');
    btns[1].classList.toggle('active', tab === 'market');
    btns[2].classList.toggle('active', tab === 'leaders');
}

function spawnTarget() {
    const arena = document.getElementById('arena');
    arena.innerHTML = '';
    const dot = document.createElement('div');
    dot.className = 'combat-dot';
    dot.style.top = Math.random() * 70 + 5 + "%";
    dot.style.left = Math.random() * 70 + 5 + "%";
    dot.innerText = "PUSH"; // Теперь PUSH вместо KILL

    dot.onclick = () => {
        tg.HapticFeedback.impactOccurred('heavy');
        myHits++;
        updateBars();
        if (myHits >= goal) endCombat(true);
        else spawnTarget();
    };
    arena.appendChild(dot);
}

// Заглушка для будущей синхронизации с сервером
function syncWithServer() {
    console.log("Syncing balance and rank with global database...");
    // Здесь мы будем вызывать API твоего сервера
}
