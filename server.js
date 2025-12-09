import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};


const appFirebase = initializeApp(firebaseConfig);
export const db = getFirestore(appFirebase);
export const auth = getAuth(appFirebase);


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

