import { auth } from './firebase.js';
import { createAdminInterface } from './admin.js';
import { handleLogout } from './logout.js';
import { removeExistingSections, loader } from './utils.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { criarGerenciamentoExercicios } from './exercicio.js';
import { createNavBar, attachNavEvents } from './navBar.js';

// Monitorar o estado de autenticação
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuário autenticado
    createAdminInterface();
    // Adicione estas linhas:
    createNavBar();
    attachNavEvents({
      createAdminInterface,
      criarGerenciamentoExercicios,
      handleLogout
    });
  } else {
    // Usuário não autenticado
    removeExistingSections();
  }
  // Esconder o loader após resolver o estado de autenticação e carregar a interface
  loader.style.display = 'none';
  document.body.classList.remove('no-scroll');
});
