let hearts = 3;
let coins = 0;
let xp = 0;
let playerLevel = 1;
let currentLevel = 1;
let timer = null;
let timeLeft = 15;

const questions = {
  1: {
    question: "Hello = ?",
    answers: ["Привет", "Пока"],
    correct: 0
  },
  2: {
    question: "Cat = ?",
    answers: ["Собака", "Кот"],
    correct: 1
  },
  3: {
    question: "Dog = ?",
    answers: ["Кот", "Собака"],
    correct: 1
  }
  // добавляй новые уровни сюда по мере необходимости
};

//////////////////////////
// СОХРАНЕНИЕ / ЗАГРУЗКА
//////////////////////////

function loadGame() {
  const saved = localStorage.getItem("linguaQuest");
  if (saved) {
    const data = JSON.parse(saved);
    hearts = data.hearts ?? 3;
    coins = data.coins ?? 0;
    xp = data.xp ?? 0;
    playerLevel = data.playerLevel ?? 1;
  }
  updateUI();
}

function saveGame() {
  localStorage.setItem("linguaQuest", JSON.stringify({
    hearts,
    coins,
    xp,
    playerLevel
  }));
}

//////////////////////////
// ЭКРАНЫ
//////////////////////////

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });
  const screen = document.getElementById(screenId);
  if (screen) screen.classList.add("active");
}

//////////////////////////
// ТАЙМЕР
//////////////////////////

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function startTimer() {
  stopTimer();

  timeLeft = 15;
  const timerEl = document.getElementById("timer");
  if (timerEl) timerEl.innerText = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    if (timerEl) timerEl.innerText = timeLeft;

    if (timeLeft <= 0) {
      stopTimer();
      hearts--;
      updateUI();
      saveGame();

      if (hearts <= 0) {
        showScreen("lose");
      } else {
        loadQuestion();
      }
    }
  }, 1000);
}

//////////////////////////
// ВОПРОСЫ И УРОВНИ
//////////////////////////

function loadQuestion() {
  const q = questions[currentLevel];

  // Если вопросов больше нет → завершение игры
  if (!q) {
    stopTimer();
    coins += 100;           // бонус за прохождение всей игры
    saveGame();
    updateUI();
    showScreen("finish");
    return;
  }

  const questionEl = document.getElementById("question");
  const answersDiv = document.getElementById("answers");

  if (questionEl) questionEl.innerText = q.question;
  if (answersDiv) {
    answersDiv.innerHTML = "";

    q.answers.forEach((answer, index) => {
      const btn = document.createElement("button");
      btn.innerText = answer;
      btn.onclick = () => checkAnswer(index);
      answersDiv.appendChild(btn);
    });
  }

  updateUI();
  startTimer();
}

function startLevel(level) {
  currentLevel = level;
  stopTimer();
  loadQuestion();
  showScreen("game");
}

//////////////////////////
// ПРОВЕРКА ОТВЕТА
//////////////////////////

function checkAnswer(index) {
  stopTimer();

  const correct = questions[currentLevel]?.correct;

  if (index === correct) {
    coins += 20;
    xp += 25;
    checkLevelUp();

    currentLevel++;           // сразу переходим к следующему
    loadQuestion();           // если вопросов больше нет → покажет finish
  } else {
    hearts--;
    updateUI();
    saveGame();

    if (hearts <= 0) {
      showScreen("lose");
    } else {
      loadQuestion();         // повтор того же уровня
    }
  }
}

//////////////////////////
// УРОВЕНЬ ИГРОКА
//////////////////////////

function checkLevelUp() {
  const needed = playerLevel * 100;
  if (xp >= needed) {
    xp -= needed;
    playerLevel++;
    alert(`Level Up! 🔥 Теперь уровень ${playerLevel}`);
    saveGame();
    updateUI();
  }
}

//////////////////////////
// НАВИГАЦИЯ И РЕСТАРТ
//////////////////////////

function restartLevel() {
  stopTimer();
  hearts = 3;
  loadQuestion();
  showScreen("game");
  saveGame();
  updateUI();
}

function restartGame() {
  stopTimer();
  currentLevel = 1;
  hearts = 3;
  coins = 0;
  xp = 0;
  playerLevel = 1;
  showScreen("levels");
  saveGame();
  updateUI();
}

//////////////////////////
// МАГАЗИН / РЕКЛАМА
//////////////////////////

function buyHeart() {
  if (coins >= 50) {
    coins -= 50;
    hearts++;
    saveGame();
    updateUI();
  } else {
    alert("Недостаточно монет");
  }
}

function watchAd() {
  alert("Реклама просмотрена! +1 сердце");
  hearts++;
  saveGame();
  updateUI();
  showScreen("game");
  loadQuestion();   // возобновляем текущий вопрос
}

//////////////////////////
// UI
//////////////////////////

function updateUI() {
  const heartsEl = document.getElementById("hearts");
  const coinsEl  = document.getElementById("coins");

  if (heartsEl) heartsEl.innerText = hearts;
  if (coinsEl)  coinsEl.innerText  = coins;
}

//////////////////////////
// ЗАПУСК
//////////////////////////

loadGame();

// Если нужно сразу показать экран уровней при загрузке:
// showScreen("levels");
