import { auth } from './firebase.js';
import { createAdminInterface } from './admin.js';
import { removeExistingSections, loader } from './utils.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';

// Monitorar o estado de autenticação
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuário autenticado
    createAdminInterface();
  } else {
    // Usuário não autenticado
    // A interface de login será gerada ao clicar no botão
    removeExistingSections();
  }
  // Esconder o loader após resolver o estado de autenticação e carregar a interface
  loader.style.display = 'none';
});
