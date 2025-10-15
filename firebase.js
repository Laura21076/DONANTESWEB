// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBaBir5mquN-xK-6H-92Wcf_Mp6muY4cSQ",
    authDomain: "donantes-400ba.firebaseapp.com",
    projectId: "donantes-400ba",
    storageBucket: "donantes-400ba.firebasestorage.app",
    messagingSenderId: "202152301689",
    appId: "1:202152301689:web:5485bb0344ba6a821030a8",
    measurementId: "G-NR3LS2M6YV"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  export const auth = getAuth(app);
  export const db = getFirestore(app);