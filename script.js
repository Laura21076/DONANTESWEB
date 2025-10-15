// Registro del Service Worker para la PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.js')
    .then(() => console.log("✅ Service Worker registrado correctamente."))
    .catch(err => console.error("❌ Error al registrar el Service Worker:", err));
}


import { auth, db } from "/firebase.js";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp,
  GeoPoint
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

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

// Registro de usuario con rol dinámico
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = `${document.getElementById("firstName").value.trim()} ${document.getElementById("lastName").value.trim()}`;
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const confirm = document.getElementById("confirmPassword").value.trim();
    const roleId = document.getElementById("roleSelect").value; // <-- nuevo

    if (password !== confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!roleId) {
      alert("Debes seleccionar un rol");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ubicación opcional
      let location = null;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          location = new GeoPoint(pos.coords.latitude, pos.coords.longitude);

          await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            fechaRegistro: serverTimestamp(),
            location: location,
            roleId: roleId
          });

          alert("Cuenta creada con éxito 💜");
          window.location.href = "login.html";
        }, async () => {
          await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            fechaRegistro: serverTimestamp(),
            location: null,
            roleId: roleId
          });

          alert("Cuenta creada con éxito 💜");
          window.location.href = "login.html";
        });
      } else {
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: email,
          fechaRegistro: serverTimestamp(),
          location: null,
          roleId: roleId
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
      window.location.href = "donationcenter.html";
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      alert("Correo o contraseña incorrectos.");
    }
  });
}
