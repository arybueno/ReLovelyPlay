const gb = document.getElementById("gameboyIntro");
const conteudo = document.getElementById("conteudoSite");

// Detecta se já entrou antes nesta sessão
const jaEntrou = sessionStorage.getItem("jaEntrou");

if (!jaEntrou) {
  // Primeira vez > mostra animação
  document.body.classList.add("gameboy-bg");

  gb.style.display = "block";
  conteudo.style.display = "none";

  gb.addEventListener("click", () => {
    gb.classList.add("sumir");

    gb.addEventListener("animationend", () => {
      gb.style.display = "none";
      conteudo.style.display = "block";

      document.body.classList.remove("gameboy-bg");

      sessionStorage.setItem("jaEntrou", "sim");
    }, { once: true });
  });

} else {
  // pula animação
  gb.style.display = "none";
  conteudo.style.display = "block";
  document.body.classList.remove("gameboy-bg");
}
