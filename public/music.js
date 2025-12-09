document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnSom");
  const img = document.getElementById("imgSom");
  const frame = document.getElementById("musicFrame");

  let musicaLigada = localStorage.getItem("musicaLigada") === "true";

  function atualizarBotao() {
    img.src = musicaLigada ? "/img/som_on.png" : "/img/som_off.png";
  }

  function getAudio() {
    if (!frame.contentWindow) return null;
    return frame.contentWindow.document.getElementById("bgmusic");
  }

  function aplicarEstado() {
    const audio = getAudio();
    if (!audio) return;

    if (musicaLigada) {
      audio.play().catch(()=>{}); // evita erro de autoplay
    } else {
      audio.pause();
    }
  }

  // Espera o iframe carregar
  frame.addEventListener("load", () => {
    aplicarEstado();
    atualizarBotao();
  });

  // Botão liga/desliga
  btn.addEventListener("click", () => {
    musicaLigada = !musicaLigada;
    localStorage.setItem("musicaLigada", musicaLigada);
    aplicarEstado();
    atualizarBotao();
  });


  setTimeout(() => {
    aplicarEstado();
    atualizarBotao();
  }, 200);
});
