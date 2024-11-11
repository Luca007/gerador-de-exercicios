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
  firebase.initializeApp(firebaseConfig);
  
  // Inicializar Serviços
  const db = firebase.firestore();
  const auth = firebase.auth();