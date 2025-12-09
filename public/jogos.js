const jogos = [
  {
    nome: "Kitties Wepper",
    capa: "/img/wepper.png",
    link: "/kittieswepper/select"
  },
  {
    nome: "It's Raining Kitties",
    capa: "/img/raining.png",
    link: "/raining/selectr"
  }
];

const lista = document.getElementById("listaJogos");

jogos.forEach(jogo => {
  const card = document.createElement("a");
  card.classList.add("card-jogo");
  card.href = jogo.link;

  card.innerHTML = `
    <img src="${jogo.capa}">
    <h3>${jogo.nome}</h3>
  `;

  lista.appendChild(card);
});
