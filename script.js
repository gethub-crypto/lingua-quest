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
  }
  // добавляй остальные вопросы сюда
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
  stopTimer();           // гарантированно убираем старый таймер

  timeLeft = 15;
  document.getElementById("timer").innerText = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;

    if (timeLeft <= 0) {
      stopTimer();
      hearts--;
      updateUI();
      saveGame();

      if (hearts <= 0) {
        showScreen("lose");
      } else {
        loadQuestion();
        startTimer();
      }
    }
  }, 1000);
}

//////////////////////////
// ВОПРОСЫ
//////////////////////////

function loadQuestion() {
  const q = questions[currentLevel];
  if (!q) {
    // если вопроса нет — завершаем игру
    coins += 100;
    saveGame();
    updateUI();
    showScreen("finish");
    return;
  }

  document.getElementById("question").innerText = q.question;

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.innerText = answer;
    btn.onclick = () => checkAnswer(index);
    answersDiv.appendChild(btn);
  });

  updateUI();
}

function startLevel(level) {
  currentLevel = level;
  stopTimer();
  loadQuestion();
  showScreen("game");
  startTimer();
}

//////////////////////////
// ПРОВЕРКА ОТВЕТА
//////////////////////////

function checkAnswer(index) {
  stopTimer();

  const correct = questions[currentLevel].correct;

  if (index === correct) {
    coins += 20;
    xp += 25;
    checkLevelUp();
    showScreen("win");
  } else {
    hearts--;
    if (hearts <= 0) {
      showScreen("lose");
    } else {
      loadQuestion();
      startTimer();
    }
  }

  saveGame();
  updateUI();
}

//////////////////////////
// ПРОГРЕСС УРОВНЯ ИГРОКА
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
// НАВИГАЦИЯ
//////////////////////////

function nextLevel() {
  currentLevel++;
  stopTimer();
  loadQuestion();
  showScreen("game");
  if (questions[currentLevel]) {
    startTimer();
  }
}

function restartLevel() {
  stopTimer();
  hearts = 3;
  loadQuestion();
  showScreen("game");
  startTimer();
  saveGame();
  updateUI();
}

function restartGame() {
  stopTimer();
  currentLevel = 1;
  hearts = 3;
  xp = 0;
  coins = 0;
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
  // Здесь будет реальная реклама
  alert("Реклама просмотрена! +1 сердце");

  hearts++;
  saveGame();
  updateUI();
  showScreen("game");
  startTimer();
}

//////////////////////////
// UI
//////////////////////////

function updateUI() {
  document.getElementById("hearts").innerText = hearts;
  document.getElementById("coins").innerText = coins;
  // если есть xp и level в интерфейсе — тоже обновляй
  // document.getElementById("xp").innerText = xp;
  // document.getElementById("level").innerText = playerLevel;
}

//////////////////////////
// ЗАПУСК ИГРЫ
//////////////////////////

loadGame();

// Если хочешь сразу начинать с экрана уровней или главного меню — раскомментируй:
// showScreen("levels");
