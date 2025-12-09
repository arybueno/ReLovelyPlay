
fetch("/componentes/header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("header-placeholder").innerHTML = html;

    import("/componentes/headerData.js");
  });
