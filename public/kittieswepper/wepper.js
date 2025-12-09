import { doc, getDoc, updateDoc } 
  from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Espera o Firebase carregar
const wait = setInterval(() => {
  if (window.auth && window.db) {
    clearInterval(wait);
    iniciarJogo(); 
  }
}, 50);

const gatosJogo = {
  gato1: "blackiesat.png",
  gato2: "gingersat.png",
  gato3: "manchalamarromsat.png",
  gato4: "manchinhabegesat.png",
  gato5: "whiteysat.png"
};

const fotoGatoEscolhido = localStorage.getItem('gatinhoFoto');
let id = localStorage.getItem("gatinhoID") || "gato1";
let imagemGato = gatosJogo[id];

function iniciarJogo() {
  const db = window.db;
  const auth = window.auth;
  let user = null;

  onAuthStateChanged(auth, u => {
    user = u;
  });

  const tabuleiro = document.getElementById("tabuleiro");
  const tempoEl = document.getElementById("tempo");
  const btn = document.getElementById("recomecar");
  const select = document.getElementById("dificuldade");
  const btnMarcador = document.getElementById("btn-marcador");
  const gatosRestantesEl = document.getElementById("gatos-restantes");

  let linhas = 4;
  let colunas = 8;
  let totalGatos = 10;
  let grid = [];
  let tempo = 0;
  let timer = null;
  let iniciou = false;
  let faltam;
  let modoMarcador = false;
  let abrir;

  // Botão marcador
  btnMarcador.onclick = () => {
    modoMarcador = !modoMarcador; // alterna ativo/inativo
    btnMarcador.style.opacity = modoMarcador ? "0.6" : "1"; // visual
  };

  function mudarDificuldade() {
    const val = select.value;
    if (val === "facil") { 
      linhas = 4; colunas = 9; totalGatos = 9; 
      document.documentElement.style.setProperty('--tamanho-celula', '14vmin'); 
      document.documentElement.style.setProperty('--distancia-column', '60px'); 
    }
    else if (val === "medio") { 
      linhas = 6; colunas = 12; totalGatos = 15; 
      document.documentElement.style.setProperty('--tamanho-celula', '65px'); 
      document.documentElement.style.setProperty('--distancia-column', '35px');
    }
    else { 
      linhas = 8; colunas = 16; totalGatos = 35; 
      document.documentElement.style.setProperty('--tamanho-celula', '50px'); 
      document.documentElement.style.setProperty('--distancia-column', '15px');
    }
  }

  function iniciar() {
    mudarDificuldade();
    tabuleiro.style.gridTemplateColumns = `repeat(${colunas}, 40px)`;
    tabuleiro.innerHTML = "";

    grid = [];
    for (let i = 0; i < linhas; i++) {
      let row = [];
      for (let j = 0; j < colunas; j++) {
        row.push({ gato: false, v: 0, aberta: false, flag: false });
      }
      grid.push(row);
    }

    iniciou = false;
    clearInterval(timer);
    tempo = 0;
    tempoEl.textContent = "0s";

    faltam = linhas * colunas - totalGatos;
    abrir = totalGatos; 
    gatosRestantesEl.textContent = abrir;

    criarTela();
  }

  function criarTela() {
    for (let i = 0; i < linhas; i++) {
      for (let j = 0; j < colunas; j++) {

        const c = document.createElement("div");
        c.className = "celula fechada " + tipoGrama(i, j);
        c.dataset.l = i;
        c.dataset.c = j;

        // clique esquerdo
        c.onclick = (e) => {
          e.preventDefault();
          if (modoMarcador) {
            colocarMarcador(i, j);
            modoMarcador = false;
            btnMarcador.style.opacity = "1";
          } else {
            abrirCelula(i, j);
          }
        };

        // clique direito sempre coloca marcador
        c.oncontextmenu = (e) => {
          e.preventDefault();
          colocarMarcador(i, j);
        };

        tabuleiro.appendChild(c);
      }
    }
  }

  function tipoGrama(l, c) {
    if (l === 0 && c === 0) return "grass-tl";
    if (l === 0 && c === colunas - 1) return "grass-tr";
    if (l === linhas - 1 && c === 0) return "grass-bl";
    if (l === linhas - 1 && c === colunas - 1) return "grass-br";
    if (l === 0) return "grass-t";
    if (l === linhas - 1) return "grass-b";
    if (c === 0) return "grass-l";
    if (c === colunas - 1) return "grass-r";
    return "grass-center";
  }

  function colocarGatos(pl, pc) {
    let colocados = 0;
    while (colocados < totalGatos) {
      let l = Math.floor(Math.random() * linhas);
      let c = Math.floor(Math.random() * colunas);
      if (grid[l][c].gato) continue;
      if (l === pl && c === pc) continue;
      grid[l][c].gato = true;
      colocados++;
    }

    // conta vizinhos
    for (let l = 0; l < linhas; l++) {
      for (let c = 0; c < colunas; c++) {
        if (grid[l][c].gato) continue;
        let n = 0;
        for (let dl = -1; dl <= 1; dl++) {
          for (let dc = -1; dc <= 1; dc++) {
            let ll = l + dl, cc = c + dc;
            if (ll >= 0 && ll < linhas && cc >= 0 && cc < colunas) {
              if (grid[ll][cc].gato) n++;
            }
          }
        }
        grid[l][c].v = n;
      }
    }
  }

  function iniciarTempo() {
    iniciou = true;
    timer = setInterval(() => {
      tempo++;
      tempoEl.textContent = tempo + "s";
    }, 1000);
  }

  function abrirCelula(l, c) {
    const cel = grid[l][c];
    const el = tabuleiro.children[l * colunas + c];

    if (!iniciou) {
      colocarGatos(l, c);
      iniciarTempo();
    }

    if (cel.aberta || cel.flag) return;

    cel.aberta = true;
    el.classList.add("revelada");

    if (cel.gato) {
      el.textContent = "";
      perdeu();
      return;
    }

    faltam--;

    if (cel.v > 0) {
      el.textContent = cel.v;
    } else {
      for (let dl = -1; dl <= 1; dl++) {
        for (let dc = -1; dc <= 1; dc++) {
          let ll = l + dl, cc = c + dc;
          if (ll >= 0 && ll < linhas && cc >= 0 && cc < colunas)
            abrirCelula(ll, cc);
        }
      }
    }

    if (faltam === 0) ganhou();
  }

  function colocarMarcador(l, c) {
    const cel = grid[l][c];
    const el = tabuleiro.children[l * colunas + c];

    if (cel.aberta) return; // não marca células abertas

    cel.flag = !cel.flag;

    if (cel.flag) {
      el.innerHTML = `<img src="/img/fishwithdorde.png" class="flag-img">`;
      abrir--;
    } else {
      el.innerHTML = "";
      abrir++;
    }
    gatosRestantesEl.textContent = abrir;
  }

  function mostrarGatos() {
    for (let l = 0; l < linhas; l++) {
      for (let c = 0; c < colunas; c++) {
        if (grid[l][c].gato) {
          const el = tabuleiro.children[l * colunas + c];
          el.classList.add("revelada");
          el.innerHTML = `<img src="/img/${imagemGato}" class="gato-img">`;
        }
      }
    }
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

    pop.classList.remove("hidden");

    btn.onclick = () => {
      pop.classList.add("hidden");
      if (acaoBotao) acaoBotao();
    };
  }

  async function ganhou() {
    clearInterval(timer);
    mostrarGatos();

    mostrarPopup(
      "Parabens!! 🐾",
      "Os gatinhos ficaram seguros agora!",
      fotoGatoEscolhido
    );

    let pontos = 0;
    if (select.value === "facil") pontos = 5;
    else if (select.value === "medio") pontos = 10;
    else pontos = 20;

    await adicionarPontos(pontos);
  }

  async function perdeu() {
    clearInterval(timer);
    mostrarGatos();

    mostrarPopup(
      "Que pena 😿",
      "Os gatinhos fugiram! Tente novamente!",
      fotoGatoEscolhido
    );

    await adicionarPontos(-1);
  }

  btn.onclick = iniciar;
  select.onchange = iniciar;

  iniciar();

  async function adicionarPontos(qtd) {
    if (!user) return;

    const ref = doc(db, "usuarios", user.uid);
    const dados = await getDoc(ref);

    let pontos = 0;
    if (dados.exists() && typeof dados.data().pontos === "number") {
      pontos = dados.data().pontos;
    }

    let novoTotal = pontos + qtd;
    if (novoTotal < 0) novoTotal = 0;

    await updateDoc(ref, {
      pontos: novoTotal
    });

    console.log("Pontos adicionados:", qtd, "→ Total:", novoTotal);
  }
}
