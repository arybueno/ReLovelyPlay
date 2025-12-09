import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Espera o Firebase carregar
const wait = setInterval(() => {
  if (window.auth && window.db) {
    clearInterval(wait);
    iniciarJogo();
  }
}, 50);

function iniciarJogo() {
  const gameBox = document.getElementById("game");
  const player = document.getElementById("player");
  const item = document.getElementById("item");
  const scoreDisplay = document.getElementById("score");
  const livesDisplay = document.getElementById("lives");
  const startScreen = document.getElementById("startScreen");
  const startButton = document.getElementById("startButton");

  const gatosJogo = {
    gato1: "/img/blackiesat.png",
    gato2: "/img/gingersat.png",
    gato3: "/img/manchalamarromsat.png",
    gato4: "/img/manchinhabegesat.png",
    gato5: "/img/whiteysat.png"
  };

  const id = localStorage.getItem("gatinhoID") || "gato1";
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
  let currentUser = null;

  const auth = window.auth;
  const db = window.db;

  // Verifica se tem usuário logado
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
  });

  // Controles
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

  // Funções
  function updatePlayer() {
    if (moveLeft) playerX -= 8;
    if (moveRight) playerX += 8;

    const maxX = gameBox.clientWidth - 120;
    playerX = Math.max(0, Math.min(maxX, playerX));
    player.style.left = playerX + "px";
  }

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

  function checkCollision(p, i) {
    return !(p.right < i.left || p.left > i.right || p.bottom < i.top || p.top > i.bottom);
  }

  function updateItem() {
    const currentSpeed = speed + Math.floor(score / 5);
    itemY += currentSpeed;

    item.style.top = itemY + "px";
    item.style.left = itemX + "px";

    const pHitbox = getPlayerHitbox();
    const iHitbox = getItemHitbox();

    if (checkCollision(pHitbox, iHitbox)) {
      score++;
      scoreDisplay.textContent = "Pontos: " + score;
      resetItem();
    }

    if (itemY > gameBox.clientHeight - item.offsetHeight) {
      loseLife();
      resetItem();
    }
  }

  async function loseLife() {
    lives--;
    livesDisplay.innerHTML = "❤️".repeat(lives);

    if (lives <= 0) {
      gameStarted = false;
      mostrarPopup(
        "Fim de jogo! 😿",
        `Conseguiu ${score} pontos!`,
        fotoGato,
        () => reiniciarJogo()
      );
      await adicionarPontos(score);
    }
  }

  function resetItem() {
    itemY = -70;
    itemX = Math.random() * (gameBox.clientWidth - 60);
    item.src = fotoGato;
  }

  function mostrarPopup(titulo, mensagem, imagem, acaoBotao) {
  const pop = document.getElementById("popup");
  const img = document.getElementById("popup-img");
  const title = document.getElementById("popup-title");
  const msg = document.getElementById("popup-msg");
  const btn = document.getElementById("popup-btn");

  img.src = imagem;
  title.textContent = titulo;
  msg.textContent = mensagem;

  pop.classList.add("show"); 

  btn.onclick = () => {
    pop.classList.remove("show");
    if (acaoBotao) acaoBotao();
  };
}


  function reiniciarJogo() {
    score = 0;
    lives = 3;
    scoreDisplay.textContent = "Pontos: 0";
    livesDisplay.innerHTML = "❤️❤️❤️";
    playerX = gameBox.clientWidth / 2 - 60;
    itemY = -70;
    itemX = Math.random() * (gameBox.clientWidth - 60);
    gameStarted = true;
  }

  async function adicionarPontos(qtd) {
    if (!currentUser) return;

    const ref = doc(db, "usuarios", currentUser.uid);
    const dados = await getDoc(ref);
    let pontos = 0;
    if (dados.exists() && typeof dados.data().pontos === "number") pontos = dados.data().pontos;

    let novoTotal = pontos + qtd;
    if (novoTotal < 0) novoTotal = 0;

    await updateDoc(ref, { pontos: novoTotal });
    console.log("Pontos adicionados:", qtd, "→ Total:", novoTotal);
  }

  function loop() {
    if (gameStarted) {
      updatePlayer();
      updateItem();
    }
    requestAnimationFrame(loop);
  }

  loop();
}


