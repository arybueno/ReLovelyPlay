import express from "express";
import path from "path";
import { fileURLToPath } from "url";


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

function render(pagina) {
  return path.join(__dirname, "views", pagina);
}

// ---------------- ROTAS ------------------ //

app.get("/", (req, res) => {
  res.sendFile(render("index.html"));
});

app.get("/player", (req, res) => {
  res.sendFile(render("player.html"));
});

// Cadastro
app.get("/cadastro", (req, res) => {
  res.sendFile(render("cadastro.html"));
});

// Login
app.get("/login", (req, res) => {
  res.sendFile(render("login.html"));
});

// Perfil
app.get("/perfil", (req, res) => {
  res.sendFile(render("perfil.html"));
});

// Tela de seleção do Kitties Wepper
app.get("/kittieswepper/select", (req, res) => {
  res.sendFile(render("select.html"));
});

// Jogo Kitties Wepper
app.get("/kittieswepper", (req, res) => {
  res.sendFile(render("wepper.html"));
});

//raining
app.get("/raining/selectr", (req, res) => {
  res.sendFile(render("selectr.html"));
});

app.get("/raining", (req, res) => {
  res.sendFile(render("raining.html"));
});

// Ranking
app.get("/ranking", (req, res) => {
  res.sendFile(render("ranking.html"));
});

// ----------------------------------------- //

// Iniciar servidor
app.listen(3000, () => console.log("Rodando em http://localhost:3000"));


