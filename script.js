let hearts = 3;
let coins = 0;
let xp = 0;
let playerLevel = 1;
let currentLevel = 1;
let timer;
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
};

//////////////////////////
// ЗАГРУЗКА СОХРАНЕНИЯ
//////////////////////////

function loadGame() {
  const saved = JSON.parse(localStorage.getItem("linguaQuest"));

  if (saved) {
    hearts = saved.hearts;
    coins = saved.coins;
    xp = saved.xp;
    playerLevel = saved.playerLevel;
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

  document.getElementById(screenId).classList.add("active");
}

//////////////////////////
// УРОВНИ
//////////////////////////

function startLevel(level) {
  currentLevel = level;
  loadQuestion();
  showScreen("game");
  startTimer();
}

function loadQuestion() {
  const q = questions[currentLevel];
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

//////////////////////////
// ТАЙМЕР
//////////////////////////

function startTimer() {
  timeLeft = 15;
  document.getElementById("question").innerText += ` (${timeLeft}s)`;

  clearInterval(timer);

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("question").innerText =
      questions[currentLevel].question + ` (${timeLeft}s)`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      hearts--;
      if (hearts <= 0) {
        showScreen("lose");
      } else {
        loadQuestion();
        startTimer();
      }
      updateUI();
    }
  }, 1000);
}

//////////////////////////
// ПРОВЕРКА ОТВЕТА
//////////////////////////

function checkAnswer(index) {
  clearInterval(timer);

  if (index === questions[currentLevel].correct) {
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
// УРОВЕНЬ ИГРОКА
//////////////////////////

function checkLevelUp() {
  if (xp >= playerLevel * 100) {
    xp = 0;
    playerLevel++;
    alert("Level Up! 🔥 Now level " + playerLevel);
  }
}

//////////////////////////
// ДАЛЬШЕ
//////////////////////////

///! function nextLevel() {
 // currentLevel++;
  //if (questions[currentLevel]) {
   // loadQuestion();
  //  showScreen("game");
  //  startTimer();
  //} else {
   // showScreen("levels");
  //}////
//}

function nextLevel() {
  currentLevel++;

  if (questions[currentLevel]) {
    loadQuestion();
    showScreen("game");
    startTimer();
  } else {
    coins += 100; // бонус за прохождение
    saveGame();
    updateUI();
    showScreen("finish");
  }
}

function restartLevel() {
  hearts = 3;
  saveGame();
  loadQuestion();
  showScreen("game");
  startTimer();
}

//////////////////////////
// МАГАЗИН
//////////////////////////

function buyHeart() {
  if (coins >= 50) {
    coins -= 50;
    hearts++;
    saveGame();
    updateUI();
  } else {
    alert("Not enough coins");
  }
}

//////////////////////////
// UNITY ADS (ЗАГЛУШКА)
//////////////////////////

function watchAd() {
  alert("Ad Watched! +1 Heart");

  // Когда подключим Unity Ads:
  // unityInstance.showAd("rewardedVideo");

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
}

//////////////////////////
// ЗАПУСК
//////////////////////////

loadGame();
