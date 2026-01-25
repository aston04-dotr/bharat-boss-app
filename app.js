// Navigation System
function showPage(page) {
    const mainPage = document.getElementById('main-page');
    const marketPage = document.getElementById('market-page');
    const navItems = document.querySelectorAll('.nav-item');

    if (page === 'main') {
        mainPage.style.display = 'block';
        marketPage.style.display = 'none';
        navItems[0].classList.add('active');
        navItems[1].classList.remove('active');
    } else {
        mainPage.style.display = 'none';
        marketPage.style.display = 'block';
        navItems[0].classList.remove('active');
        navItems[1].classList.add('active');
    }
    tg.HapticFeedback.impactOccurred('light');
}

// Market Logic
function buyItem(name, price) {
    if (balance >= price) {
        balance -= price;
        tg.showAlert(`SUCCESS: You purchased ${name}!`);
        updateUI();
    } else {
        tg.showAlert("ACCESS DENIED: Insufficient Influence");
    }
}
