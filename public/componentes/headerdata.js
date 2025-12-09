import { onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import { doc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const auth = window.auth;
const db = window.db;

function iniciarHeader() {
  const botao = document.getElementById("botaoPerfil");
  const nomeEl = document.getElementById("nomePerfil");
  const fotoEl = document.getElementById("fotoPerfil");
  const pontosEl = document.getElementById("pontosUsuario");

  if (!botao || !nomeEl || !fotoEl || !pontosEl) {
    console.error("Header não encontrado no DOM.");
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const docRef = doc(db, "usuarios", user.uid);
      const dados = await getDoc(docRef);

      let nome = "Perfil";
      let foto = "https://i.imgur.com/8QfH0kR.png";
      let pontos = 0;

      if (dados.exists()) {
        const d = dados.data();
        nome = d.nome ?? nome;
        foto = d.foto ?? foto;
        pontos = d.pontos ?? 0;
      }

      nomeEl.textContent = nome;
      fotoEl.src = foto;
      pontosEl.textContent = `Pontuação: ${pontos}`;

      botao.onclick = () => window.location.href = "/perfil";

    } else {
      nomeEl.textContent = "Entrar";
      fotoEl.src = "/img/gato.jpg";
      pontosEl.textContent = "Pontuação: 0";
      botao.onclick = () => window.location.href = "/login";
    }
  });
}

iniciarHeader();
