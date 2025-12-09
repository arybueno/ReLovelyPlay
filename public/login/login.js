function mostrarConfirmacao(msg) {
  const confirmacao = document.getElementById("confirmacao");
  confirmacao.textContent = msg;
  confirmacao.classList.add("show");

  setTimeout(() => {
    confirmacao.classList.remove("show");
  }, 3000); 
}

import { signInWithEmailAndPassword }
  from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

window.login = function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  signInWithEmailAndPassword(window.auth, email, senha)
    .then(() => {
      mostrarConfirmacao("Logado com sucesso!");
      setTimeout(() => {
        window.location.href = "/perfil";
      }, 1000);
    })
    .catch(e => mostrarConfirmacao(e.message));
}
