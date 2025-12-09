const gameBox = document.getElementById("game"); 
const player = document.getElementById("player");
const item = document.getElementById("item");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

// MAPA DOS GATINHOS DO JOGO (sentadinhos)
const gatosJogo = {
  gato1: "/img/blackiesat.png",
  gato2: "/img/gingersat.png",
  gato3: "/img/manchalamarromsat.png",
  gato4: "/img/manchinhabegesat.png",
  gato5: "/img/whiteysat.png"
};

const id = localStorage.getItem("gatinhoID");
const fotoGato = gatosJogo[id] || "/img/blackiesat.png";

item.src = fotoGato;

let score = 0;
let lives = 3;
let gameStarted = false;

let playerX = gameBox.clientWidth / 2 - 60;
let speed = 5;

let itemY = -70;
let itemX = Math.random() * (gameBox.clientWidth - 60);

let moveLeft = false;
let moveRight = false;

// controles
document.addEventListener("keydown", (e) => {
  if (!gameStarted) return;
  if (e.key === "ArrowLeft" || e.key === "a") moveLeft = true;
  if (e.key === "ArrowRight" || e.key === "d") moveRight = true;
});

document.addEventListener("keyup", (e) => {
  if (!gameStarted) return;
  if (e.key === "ArrowLeft" || e.key === "a") moveLeft = false;
  if (e.key === "ArrowRight" || e.key === "d") moveRight = false;
});

startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameStarted = true;
});

function updatePlayer() {
  if (moveLeft) playerX -= 8;
  if (moveRight) playerX += 8;

  const maxX = gameBox.clientWidth - 120; // limite da caixinha
  playerX = Math.max(0, Math.min(maxX, playerX));

  player.style.left = playerX + "px";
}

// hitbox do player
function getPlayerHitbox() {
  const p = player.getBoundingClientRect();
  const g = gameBox.getBoundingClientRect();

  return {
    left: p.left - g.left + 10,
    right: p.right - g.left - 10,
    top: p.top - g.top + 5,
    bottom: p.bottom - g.top - 5
  };
}

function getItemHitbox() {
  const i = item.getBoundingClientRect();
  const g = gameBox.getBoundingClientRect();

  return {
    left: i.left - g.left + 5,
    right: i.right - g.left - 5,
    top: i.top - g.top + 5,
    bottom: i.bottom - g.top + 10
  };
}

// colisão AABB
function checkCollision(p, i) {
  return !(
    p.right < i.left ||
    p.left > i.right ||
    p.bottom < i.top ||
    p.top > i.bottom
  );
}

// atualizar item
function updateItem() {
  const currentSpeed = speed + Math.floor(score / 5);
  itemY += currentSpeed;

  item.style.top = itemY + "px";
  item.style.left = itemX + "px";

  const pHitbox = getPlayerHitbox();
  const iHitbox = getItemHitbox();

  // pegou
  if (checkCollision(pHitbox, iHitbox)) {
    score++;
    scoreDisplay.textContent = "Pontos: " + score;
    resetItem();
  }

  // caiu no chão da telinha
  const itemHeight = item.offsetHeight;
  if (itemY > gameBox.clientHeight - itemHeight) {
    loseLife();
    resetItem();
  }
}

// perder vida
function loseLife() {
  lives--;
  livesDisplay.innerHTML = "❤️".repeat(lives);

  if (lives <= 0) {
    alert("Fim de jogo! Pontos: " + score);
    location.reload();
  }
}

// reset item
function resetItem() {
  itemY = -70;
  itemX = Math.random() * (gameBox.clientWidth - 60);
  item.src = fotoGato;
}

// loop principal
function loop() {
  if (gameStarted) {
    updatePlayer();
    updateItem();
  }
  requestAnimationFrame(loop);
}

loop();
