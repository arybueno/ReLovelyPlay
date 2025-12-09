function mostrarConfirmacao(msg) {
  const confirmacao = document.getElementById("confirmacao");
  confirmacao.textContent = msg;
  confirmacao.classList.add("show");

  setTimeout(() => {
    confirmacao.classList.remove("show");
  }, 3000); // 3 segundos
}

import { createUserWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { doc, setDoc }
  from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const auth = window.auth;
const db = window.db;

window.criarConta = async function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, senha);
    const user = cred.user;

    // salva nome, foto e pontos iniciais
    await setDoc(doc(db, "usuarios", user.uid), {
      nome: "",
      foto: "",
      pontos: 0
    });

    mostrarConfirmacao("Conta criada com sucesso!");
    setTimeout(() => {
      window.location.href = "/perfil";
    }, 1000);

  } catch (e) {
    mostrarConfirmacao(e.message);
  }
}
