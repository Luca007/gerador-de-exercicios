// Importações do Firebase modular
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

// Configurações do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCUdvrzpJdfBVEUYITyhiVjmvzoZFoXh-U",
    authDomain: "gerador-de-treinos.firebaseapp.com",
    projectId: "gerador-de-treinos",
    storageBucket: "gerador-de-treinos.appspot.com",
    messagingSenderId: "899225591084",
    appId: "1:899225591084:web:73440347db17930a92a089"
};
  
// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Serviços
const db = getFirestore(app);
const auth = getAuth(app);

// Exportar db e auth
export { db, auth };