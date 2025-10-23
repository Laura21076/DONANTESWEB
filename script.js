
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp,
  GeoPoint
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// ================== PWA Service Worker ==================

// Registrar el Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(registration => {
        console.log("Service Worker registrado con éxito:", registration.scope);
      })
      .catch(error => {
        console.error("Error al registrar el Service Worker:", error);
      });
  });
}



// ================== VALIDACIÓN DE FORMULARIOS ==================
(() => {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();

// ================== REGISTRO DE USUARIO ==================
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = `${document.getElementById("firstName").value.trim()} ${document.getElementById("lastName").value.trim()}`;
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const confirm = document.getElementById("confirmPassword").value.trim();

    if (password !== confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      // 1️⃣ Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Obtener ubicación geográfica (si el usuario lo permite)
      let location = null;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          location = new GeoPoint(pos.coords.latitude, pos.coords.longitude);

          // 3️⃣ Guardar en Firestore
          await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            fechaRegistro: serverTimestamp(),
            location: location,
            roleId: "/roles/donor"
          });

          alert("Cuenta creada con éxito 💜");
          window.location.href = "login.html";
        }, async (error) => {
          console.warn("Ubicación no concedida, guardando sin coordenadas.");
          await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            fechaRegistro: serverTimestamp(),
            location: null,
            roleId: "/roles/donor"
          });

          alert("Cuenta creada con éxito 💜");
          window.location.href = "login.html";
        });
      } else {
        // Si el navegador no soporta geolocalización
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: email,
          fechaRegistro: serverTimestamp(),
          location: null,
          roleId: "/roles/donor"
        });

        alert("Cuenta creada con éxito 💜");
        window.location.href = "login.html";
      }

    } catch (error) {
      console.error("Error de registro:", error.message);
      alert("Error al registrar: " + error.message);
    }
  });
}

// ================== INICIO DE SESIÓN ==================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert("Bienvenido a Donantes 💜");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      alert("Correo o contraseña incorrectos.");
    }
  });
}
