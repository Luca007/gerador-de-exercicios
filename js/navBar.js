import { createAdminInterface, createLoginForm } from './admin.js';
import { criarGerenciamentoExercicios } from './exercicio.js';
import { removeExistingSections, loader } from './utils.js';
import { handleLogout } from './logout.js';

export function createNavBar() {
    // Verifica se a navbar já existe para não duplicar
    if (document.getElementById('admin-navbar')) return;
  
    // Cria um container para a navbar
    const navContainer = document.createElement('div');
    navContainer.id = 'admin-navbar';
    
    // Insere o HTML da barra de navegação
    navContainer.innerHTML = createNavBarHTML();
  
    document.body.appendChild(navContainer);
  
    setupNavBarEvents();
        // Selecionar o ícone "+" por padrão:
        const addIcon = document.querySelector('#nav-add .hint-dot');
        if (addIcon) {
            addIcon.classList.add('selected');
        }
  }

function createNavBarHTML() {
    return `
        <div class="navbar" id="admin-navbar-container">
            ${createNavItem('nav-home', 'fas fa-home', 'Página inicial do administrador, onde pode ser feito o login.', true)}
            ${createNavItem('nav-settings', 'fas fa-cog', 'Gerenciar exercícios existentes.')}
            ${createNavItem('nav-add', 'fas fa-plus', 'Adicionar novos exercícios.')}
            ${createNavItem('nav-logout', 'fas fa-sign-out-alt', 'Fazer logout da sua conta de administrador.')}
        </div>
    `;
}

function createNavItem(id, iconClass, description, active = false) {
    return `
        <div class="item-hints" id="${id}">
            <div class="hint" data-position="4">
                <span class="hint-radius"></span>
                <span class="hint-dot">
                    <svg class="hint-circle" width="60" height="60">
                        <circle cx="30" cy="30" r="28"></circle>
                        <path class="x-path-line1" d="M15 15 L45 45"></path>
                        <path class="x-path-line2" d="M45 15 L15 45"></path>
                    </svg>
                    <i class="${iconClass}"></i>
                </span>
                <div class="hint-content do--split-children${active ? ' active' : ''}">
                    <p>${description}</p>
                </div>
            </div>
        </div>
    `;
}
  
  function setupNavBarEvents() {
    const hintDots = document.querySelectorAll('.hint-dot');
  
    hintDots.forEach(dot => {
      dot.addEventListener('click', () => {
        // Remove a seleção de todos os outros ícones
        hintDots.forEach(d => d.classList.remove('selected'));
        
        // Animação de clique (pulso)
        dot.classList.add('clicked');
        setTimeout(() => {
          dot.classList.remove('clicked');
        }, 300);
        
        // Marca o ícone atual como selecionado
        dot.classList.add('selected');
      });
    })
  }
  
  // Função para vincular a navegação da barra aos eventos
  export function attachNavEvents({ createAdminInterface, criarGerenciamentoExercicios, handleLogout }) {
    // Página inicial (home)
    document.getElementById('nav-home').addEventListener('click', () => {
      // Limpa seções anteriores e cria interface de admin
      removeExistingSections();
      createLoginForm();
    });
  
    // Gerenciar exercícios (settings)
    document.getElementById('nav-settings').addEventListener('click', () => {
      removeExistingSections();
      criarGerenciamentoExercicios();
    });
  
    // Adicionar exercícios (add)
    document.getElementById('nav-add').addEventListener('click', () => {
      // A interface principal já é a de adicionar exercício
      // Caso queira criar uma função específica para mostrar o formulário de adicionar,
      // você pode chamá-la aqui. Caso contrário, `createAdminInterface()` já exibe o form.
      removeExistingSections();
      createAdminInterface();
    });
  
    // Logout
    document.getElementById('nav-logout').addEventListener('click', () => {
      handleLogout();
    });
  }
  