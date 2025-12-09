document.addEventListener('DOMContentLoaded', () => {
  const opcoes = document.querySelectorAll('.opcao-gato');
  const btn = document.querySelector('.btn-img');
  let escolha = null;

  const prev = localStorage.getItem('gatinhoID');
  if (prev) {
    const elPrev = document.querySelector(`.opcao-gato[data-id="${prev}"]`);
    if (elPrev) {
      elPrev.classList.add('selecionado');
      escolha = prev;
    }
  }

  opcoes.forEach(el => {
    el.addEventListener('click', () => {

      escolha = el.dataset.id;

      localStorage.setItem('gatinhoFoto', el.src);

      opcoes.forEach(e => e.classList.remove('selecionado'));
      el.classList.add('selecionado');
    });
  });

  if (btn) {
    btn.addEventListener('click', () => {
      if (!escolha) {
        alert('Escolha um gatinho primeiro!');
        return;
      }

      localStorage.setItem('gatinhoID', escolha);

      window.location.href = '/kittieswepper';
    });
  } else {
    console.warn('Botão .btn-img não encontrado no DOM.');
  }
});
