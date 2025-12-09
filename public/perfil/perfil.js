import { onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { doc, setDoc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const auth = window.auth;
const db = window.db;

let user;

const nomeInput = document.getElementById("nome");
const fotoInput = document.getElementById("foto");
const fotoPreview = document.getElementById("fotoPreview");
const userEmailDisplay = document.getElementById("userEmail");

onAuthStateChanged(auth, async (u) => {
  if (!u) {
    window.location.href = "login.html";
    return;
  }

  user = u;
  userEmailDisplay.innerText = "Email: " + u.email;

  const docRef = doc(db, "usuarios", user.uid);
  const dados = await getDoc(docRef);

  if (dados.exists()) {
    nomeInput.value = dados.data().nome || "";
    if (dados.data().foto) {
      fotoPreview.src = dados.data().foto;
    }
  }
});

fotoInput.addEventListener("change", () => {
  const file = fotoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      fotoPreview.src = e.target.result; 
    };
    reader.readAsDataURL(file);
  }
});

window.salvarPerfil = async function () {
  const nome = nomeInput.value;
  const foto = fotoInput.files[0];

  let urlFoto = null;

  if (foto) {
    const cloudName = "dahpo4gdd";
    const uploadPreset = "perfil";

    const formData = new FormData();
    formData.append("file", foto);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    urlFoto = data.secure_url;
  }

  const dadosParaSalvar = { nome };
  if (urlFoto) dadosParaSalvar.foto = urlFoto;

  await setDoc(doc(db, "usuarios", user.uid), dadosParaSalvar, { merge: true });

  alert("Perfil salvo!");
}

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "/login/login.html";
  });
}
