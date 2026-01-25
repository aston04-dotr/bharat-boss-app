const tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
  tg.ready();
}

const $ = (id) => document.getElementById(id);

let balance = Number(localStorage.getItem("inf_data") || 0);
let hits = 0;
let goal = 15;
let active = false;

// чуть “OS-логика”: ранги
function getRank(b) {
  if (b >= 500000) return "BOSS";
  if (b >= 200000) return "COMMANDER";
  if (b >= 80000) return "AGENT";
  if (b >= 20000) return "RUNNER";
  return "RECRUIT";
}

function updateDisplay() {
  $("balance").innerText = balance.toLocaleString();
  $("rank").innerText = getRank(balance);
  localStorage.setItem("inf_data", String(balance));
}

function haptic(type = "light") {
  try {
    tg?.HapticFeedback?.impactOccurred(type);
  } catch {}
}

function notify(type = "success") {
  try {
    tg?.HapticFeedback?.notificationOccurred(type);
  } catch {}
}

function showPage(pageId) {
  haptic("light");

  $("page-radar").style.display = pageId === "radar" ? "block" : "none";
  $("page-market").style.display = pageId === "market" ? "block" : "none";
  $("page-leaders").style.display = pageId === "leaders" ? "block" : "none";

  document.querySelectorAll(".nav-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.page === pageId);
  });
}

/* ---------- MISSION ---------- */

function startMission() {
  if (active) return;
  active = true;

  // можно чуть усложнить: чем больше баланс — тем выше цель
  goal = 15; // базово как было
  hits = 0;

  $("hits").innerText = String(hits);
  $("goal").innerText = String(goal);

  $("combat-overlay").style.display = "block";
  $("progress-bar").style.width = "0%";

  spawnTarget();
}

function setProgress() {
  const pct = Math.min(100, Math.round((hits / goal) * 100));
  $("progress-bar").style.width = pct + "%";
  $("hits").innerText = String(hits);
}

function spawnTarget() {
  const arena = $("arena");
  arena.innerHTML = "";

  const dot = document.createElement("div");
  dot.className = "combat-dot";
  dot.textContent = "PUSH";

  // безопасные границы по размеру точки (чтобы не вылазило за край)
  const rect = arena.getBoundingClientRect();
  const size = 96;
  const pad = 14;

  const maxX = Math.max(pad, rect.width - size - pad);
  const maxY = Math.max(pad, rect.height - size - pad);

  const x = pad + Math.random() * maxX;
  const y = pad + Math.random() * maxY;

  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;

  // pointerdown быстрее и стабильнее, чем onclick
  dot.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation();

    haptic("heavy");
    hits += 1;
    setProgress();

    if (hits < goal) {
      // чуть “темп” чтобы ощущалось мощно
      requestAnimationFrame(spawnTarget);
    } else {
      endMission();
    }
  });

  arena.appendChild(dot);
}

function endMission() {
  active = false;
  $("combat-overlay").style.display = "none";

  const reward = 10000;
  balance += reward;
  updateDisplay();

  // ✅ фикс: нормальная строка
  const msg = `MISSION SUCCESS!\nEarned: +$${reward.toLocaleString()}`;

  try {
    tg?.showAlert ? tg.showAlert(msg) : alert(msg);
  } catch {
    alert(msg);
  }
}

function abortMission() {
  active = false;
  $("combat-overlay").style.display = "none";
  notify("error");
}

/* ---------- EVENTS ---------- */

$("start-btn").addEventListener("pointerdown", () => {
  notify("success");
  startMission();
});

$("exit-btn").addEventListener("pointerdown", () => {
  abortMission();
});

document.querySelectorAll(".nav-item").forEach((el) => {
  el.addEventListener("pointerdown", () => showPage(el.dataset.page));
});

// init
updateDisplay();
showPage("radar");
