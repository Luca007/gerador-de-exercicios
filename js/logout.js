import { signOut } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { auth } from './firebase.js';
import { exibirAlerta, removeExistingSections, loader } from './utils.js';

// Função para manipular o logout
export function handleLogout() {
    // Mostrar o loader
    loader.style.display = 'flex';
    document.body.classList.add('no-scroll');

    signOut(auth)
      .then(() => {
        // Logout bem-sucedido
        removeExistingSections();
        exibirAlerta('sucesso', 'Logout realizado com sucesso.');
        // Aqui removemos a barra de navegação
        const navbar = document.getElementById('admin-navbar');
        if (navbar) {
          navbar.remove();
        }
        // Ocultar o loader
        loader.style.display = 'none';
        document.body.classList.remove('no-scroll');
      })
      .catch((error) => {
        // Ocultar o loader
        loader.style.display = 'none';
        document.body.classList.remove('no-scroll');
        exibirAlerta('erro', 'Erro ao desconectar.');
        console.error('Erro ao desconectar:', error);
      });
}
  