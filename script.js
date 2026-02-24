let hearts = localStorage.getItem("hearts") ? parseInt(localStorage.getItem("hearts")) : 3;
let xp = localStorage.getItem("xp") ? parseInt(localStorage.getItem("xp")) : 0;
let coins = localStorage.getItem("coins") ? parseInt(localStorage.getItem("coins")) : 100;
let currentLevel = localStorage.getItem("currentLevel") ? parseInt(localStorage.getItem("currentLevel")) : 1;
let time = 30;

// ---------------- MAP ----------------

function initMap(){
  for(let i=1;i<=3;i++){
    let unlocked = localStorage.getItem("level_"+i+"_unlocked");
    if(i === 1){
      document.getElementById("level1").disabled = false;
    } else if(unlocked === "true"){
      document.getElementById("level"+i).disabled = false;
    } else {
      document.getElementById("level"+i).disabled = true;
    }
  }
}

function openLevel(level){
  localStorage.setItem("currentLevel", level);
  window.location.href = "level.html";
}

// ---------------- LEVEL ----------------

function startLevel(){
  updateUI();
}

function updateUI(){
  if(document.getElementById("hearts")){
    document.getElementById("hearts").innerText = hearts;
    document.getElementById("xp").innerText = xp;
    document.getElementById("coins").innerText = coins;
    document.getElementById("timer").innerText = time;
  }
}

function correct(){
  xp += 20;
  coins += 20;

  completeLevel();

  alert("Level Complete!");
  window.location.href = "index.html";
}

function wrong(){
  hearts--;
  save();
  updateUI();
}

function completeLevel(){
  let level = parseInt(localStorage.getItem("currentLevel"));
  localStorage.setItem("level_"+level+"_completed","true");
  localStorage.setItem("level_"+(level+1)+"_unlocked","true");
  save();
}

function save(){
  localStorage.setItem("hearts", hearts);
  localStorage.setItem("xp", xp);
  localStorage.setItem("coins", coins);
}

setInterval(function(){
  if(time > 0){
    time--;
    updateUI();
  }
},1000);
