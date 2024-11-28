import { auth } from './firebase.js';
import { exibirAlerta, removeExistingSections, applyInputMasks, loader } from './utils.js';
import { adicionarExercicio } from './firestore.js';
import { criarFormulario } from './formGenerator.js';
import { signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import { adicionarBotaoGerenciarExercicios } from './exercicio.js';

// Elementos do DOM relacionados à administração
const adminButton = document.getElementById('admin-button'); // Botão de administrador

// Evento de clique no botão de administrador
adminButton.addEventListener('click', () => {
  createLoginForm();
});

// Função para criar o formulário de login
function createLoginForm() {
  // Remover instâncias anteriores
  removeExistingSections();

  // Criar a seção de login
  const loginSection = document.createElement('div');
  loginSection.id = 'login-section';
  loginSection.className = 'login-form-container';

  // Criar o formulário
  const form = document.createElement('form');
  form.className = 'form';
  form.id = 'login-form';

  // --- Grupo do Email ---
  const emailGroup = document.createElement('div');
  emailGroup.className = 'login-form-group';

  const emailLabel = document.createElement('label');
  emailLabel.setAttribute('for', 'email');
  emailLabel.innerText = 'Email';

  const emailInput = document.createElement('input');
  emailInput.name = 'email';
  emailInput.id = 'email';
  emailInput.type = 'text';
  emailInput.required = false;

  // Adicionar label e input ao grupo de email
  emailGroup.appendChild(emailLabel);
  emailGroup.appendChild(emailInput);

  // --- Grupo da Senha ---
  const passwordGroup = document.createElement('div');
  passwordGroup.className = 'login-form-group';

  const passwordLabel = document.createElement('label');
  passwordLabel.setAttribute('for', 'password');
  passwordLabel.innerText = 'Senha';

  const passwordWrapper = document.createElement('div');
  passwordWrapper.className = 'password-wrapper';

  const passwordInput = document.createElement('input');
  passwordInput.name = 'password';
  passwordInput.id = 'password';
  passwordInput.type = 'password';
  passwordInput.placeholder = 'Digite sua senha';
  passwordInput.required = false;

  const togglePasswordSpan = document.createElement('span');
  togglePasswordSpan.className = 'toggle-password';

  const toggleLabel = document.createElement('label');
  toggleLabel.className = 'password-container';

  const toggleCheckbox = document.createElement('input');
  toggleCheckbox.type = 'checkbox';
  toggleCheckbox.id = 'togglePassword';

  // Ícone de olho aberto
  const eyeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  eyeIcon.classList.add('eye');
  eyeIcon.setAttribute('height', '1em');
  eyeIcon.setAttribute('viewBox', '0 0 576 512');

  const eyePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  eyePath.setAttribute('d', 'M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8 -11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z');
  eyeIcon.appendChild(eyePath);

  // Ícone de olho fechado
  const eyeSlashIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  eyeSlashIcon.classList.add('eye-slash');
  eyeSlashIcon.setAttribute('height', '1em');
  eyeSlashIcon.setAttribute('viewBox', '0 0 640 512');

  const eyeSlashPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  eyeSlashPath.setAttribute('d', 'M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z');
  eyeSlashIcon.appendChild(eyeSlashPath);

  // Montar o label do toggle
  toggleLabel.appendChild(toggleCheckbox);
  toggleLabel.appendChild(eyeIcon);
  toggleLabel.appendChild(eyeSlashIcon);

  // Adicionar o label ao span
  togglePasswordSpan.appendChild(toggleLabel);

  // Montar o password wrapper
  passwordWrapper.appendChild(passwordInput);
  passwordWrapper.appendChild(togglePasswordSpan);

  // Adicionar label e wrapper ao grupo da senha
  passwordGroup.appendChild(passwordLabel);
  passwordGroup.appendChild(passwordWrapper);

  // --- Botão de Submissão ---
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'login-form-submit-btn';
  submitButton.innerText = 'Entrar';

  // Adicionar grupos ao formulário
  form.appendChild(emailGroup);
  form.appendChild(passwordGroup);
  form.appendChild(submitButton);

  // Adicionar o formulário à seção de login
  loginSection.appendChild(form);

  // Adicionar a seção de login ao body
  document.body.appendChild(loginSection);

  // --- Eventos ---

  // Evento de submissão do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.email.value;
    const password = form.password.value;

    // Mostrar o loader
    loader.style.display = 'block';

    if (!email) {
      loader.style.display = 'none';
      exibirAlerta('aviso', 'Por favor, preencha o campo Email.');
      return;
    }
    if (!password) {
      loader.style.display = 'none';
      exibirAlerta('aviso', 'Por favor, preencha o campo Senha.');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Ocultar o loader
        loader.style.display = 'none';
        // Limpar o formulário
        form.reset();
        // Mostrar a interface de administrador
        createAdminInterface();
        exibirAlerta('sucesso', 'Bem-vindo!');
      })
      .catch((error) => {
        // Ocultar o loader
        loader.style.display = 'none';
        if (error.code === 'auth/invalid-login-credentials' || error.code === 'auth/invalid-email') {
          exibirAlerta('erro', 'Email ou senha está incorreta.');
        } else {
          exibirAlerta('erro', 'Erro ao fazer login: ' + error.message);
        }
      });
  });

  // Evento para mostrar/ocultar a senha
  const togglePassword = document.getElementById('togglePassword');
  togglePassword.addEventListener('change', function () {
    passwordInput.type = this.checked ? 'text' : 'password';
  });
}

// Função para criar a interface de administração
export function createAdminInterface() {
  // Remover instâncias anteriores
  removeExistingSections();

  // Criar elementos
  const adminSection = document.createElement('div');
  adminSection.id = 'admin-section';
  adminSection.className = 'container mt-5';

  const h2 = document.createElement('h2');
  h2.innerText = 'Adicionar Novo Exercício';
  h2.className = 'text-center mb-4';

  // Campos do formulário
  const fields = [
    { label: 'Nome do Exercício:', id: 'nome', type: 'text', required: true },
    { label: 'Explicação:', id: 'explicacao', type: 'textarea', required: true },
    { label: 'Repetições:', id: 'repeticoes', type: 'text', required: false },
    { label: 'Séries:', id: 'series', type: 'text', required: false },
    { label: 'Tempo (segundos):', id: 'tempo-admin', type: 'text', required: false },
    {
      label: 'Equipamento:',
      id: 'impulso',
      type: 'checkboxGroup',
      options: ['todos', 'nenhum', 'Lira', 'Solo', 'Tecido', 'Trapézio'],
      required: true
    },
    {
      label: 'Categoria Etária:',
      id: 'etaria',
      type: 'checkboxGroup',
      options: ['todos', 'criança', 'adulto', 'idoso'],
      required: true
    },
    {
      label: 'Categoria:',
      id: 'categoria',
      type: 'select',
      options: ['Todos', 'Aquecimento', 'Fortalecimento', 'Alongamento', 'Equipamento', 'CoolDown'],
      required: true
    },
    {
      label: 'Nível:',
      id: 'nivel',
      type: 'select',
      options: ['todos', 'iniciante', 'intermediario', 'avancado'],
      required: true
    }
  ];

  const form = criarFormulario(fields);

  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.innerText = 'Adicionar Exercício';
  addButton.className = 'btn btn-success btn-block mt-4';
  form.appendChild(addButton);

  const adminMessage = document.createElement('div');
  adminMessage.id = 'admin-message';
  adminMessage.className = 'mt-3';

  // Criar o botão de logout
  const logoutButton = document.createElement('button');
  logoutButton.type = 'button'; // Adicionado para evitar submissão do formulário
  logoutButton.id = 'logout-button';
  logoutButton.innerText = 'Sair';
  logoutButton.className = 'btn btn-danger btn-block mt-3';

  adminSection.appendChild(h2);
  adminSection.appendChild(form);
  // Adicionar logoutButton ao formulário
  form.appendChild(logoutButton);
  form.appendChild(adminMessage);

  // Adicionar ao body
  document.body.appendChild(adminSection);

  // Aplicar máscaras aos campos após adicionar ao DOM
  applyInputMasks();

  // Função para atualizar a obrigatoriedade dos campos
  function updateFieldRequirements() {
    const tempoVal = $('#tempo-admin').val().trim();
    const repeticoesInput = $('#repeticoes');
    const seriesInput = $('#series');

    if (tempoVal === '') {
      // Tempo não preenchido, séries e repetições são obrigatórios
      repeticoesInput.data('required', true);
      seriesInput.data('required', true);
    } else {
      // Tempo preenchido, séries e repetições não são obrigatórios
      repeticoesInput.data('required', false);
      seriesInput.data('required', false);
    }
  }

  // Adicionar eventos aos campos
  $('#tempo-admin').on('input', updateFieldRequirements);

  // Atualizar a obrigatoriedade inicial
  updateFieldRequirements();

  // Adicionar botão para gerenciar exercícios
  adicionarBotaoGerenciarExercicios();

  // Função para configurar a lógica dos grupos de checkboxes
  function setupCheckboxGroupLogic(fieldId) {
    const checkboxes = document.querySelectorAll(`input[name="${fieldId}"]`);
    const todosCheckbox = document.querySelector(`input[name="${fieldId}"][value="todos"]`);
    const nenhumCheckbox = document.querySelector(`input[name="${fieldId}"][value="nenhum"]`);
    const otherCheckboxes = Array.from(checkboxes).filter(cb => cb !== todosCheckbox && cb !== nenhumCheckbox);
  
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox === todosCheckbox && todosCheckbox && todosCheckbox.checked) {
          // 'todos' foi marcado, marcar todas as outras opções, exceto 'nenhum'
          otherCheckboxes.forEach(cb => cb.checked = true);
          if (nenhumCheckbox) nenhumCheckbox.checked = false;
        } else if (checkbox === nenhumCheckbox && nenhumCheckbox && nenhumCheckbox.checked) {
          // 'nenhum' foi marcado, desmarcar todas as outras opções
          checkboxes.forEach(cb => {
            if (cb !== nenhumCheckbox) {
              cb.checked = false;
            }
          });
          if (todosCheckbox) todosCheckbox.checked = false;
        } else if (checkbox !== todosCheckbox && checkbox !== nenhumCheckbox) {
          // Outra opção foi marcada ou desmarcada
          if (otherCheckboxes.every(cb => cb.checked)) {
            // Todas as opções estão marcadas, marcar 'todos' e desmarcar 'nenhum'
            if (todosCheckbox) todosCheckbox.checked = true;
            if (nenhumCheckbox) nenhumCheckbox.checked = false;
          } else {
            // Nem todas as opções estão marcadas, desmarcar 'todos'
            if (todosCheckbox) todosCheckbox.checked = false;
          }
          // Se alguma opção está marcada, desmarcar 'nenhum'
          if (otherCheckboxes.some(cb => cb.checked)) {
            if (nenhumCheckbox) nenhumCheckbox.checked = false;
          }
        }
      });
    });
  }
  

  // Após o formulário ser adicionado ao DOM
  setupCheckboxGroupLogic('impulso');
  setupCheckboxGroupLogic('etaria');

  // Adicionar eventos
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validação personalizada
    const nome = $('#nome').val().trim();
    const explicacao = $('#explicacao').val().trim();

    const impulsoCheckboxes = document.querySelectorAll('input[name="impulso"]:checked');
    const impulsoSelectedOptions = Array.from(impulsoCheckboxes).map(cb => cb.value);

    const categoriaEtariaCheckboxes = document.querySelectorAll('input[name="etaria"]:checked');
    const categoriaEtariaSelectedOptions = Array.from(categoriaEtariaCheckboxes).map(cb => cb.value);

    const categoria = $('#categoria').val();
    const nivel = $('#nivel').val();
    const repeticoes = $('#repeticoes').val().replace(/\D/g, '') || null;
    const series = $('#series').val().replace(/\D/g, '') || null;
    const tempoVal = $('#tempo-admin').val().replace(/\D/g, '');
    const tempo = tempoVal ? parseInt(tempoVal) : null;

    if (!nome) {
      exibirAlerta('erro', 'Por favor, preencha o campo Nome do Exercício.');
      return;
    }
    if (!explicacao) {
      exibirAlerta('erro', 'Por favor, preencha o campo Explicação.');
      return;
    }
    if (!impulsoSelectedOptions || impulsoSelectedOptions.length === 0) {
      exibirAlerta('erro', 'Por favor, selecione pelo menos um Impulso.');
      return;
    }
    if (!categoriaEtariaSelectedOptions || categoriaEtariaSelectedOptions.length === 0) {
      exibirAlerta('erro', 'Por favor, selecione pelo menos uma Categoria Etária.');
      return;
    }
    if (!categoria) {
      exibirAlerta('erro', 'Por favor, selecione a Categoria.');
      return;
    }
    if (!nivel) {
      exibirAlerta('erro', 'Por favor, selecione o Nível.');
      return;
    }

    // Validação dos campos obrigatórios com base em Tempo/Repetições/Séries
    const repeticoesRequired = $('#repeticoes').data('required');
    const seriesRequired = $('#series').data('required');

    if (repeticoesRequired && !repeticoes) {
      exibirAlerta('erro', 'Por favor, preencha o campo Repetições.');
      return;
    }
    if (seriesRequired && !series) {
      exibirAlerta('erro', 'Por favor, preencha o campo Séries.');
      return;
    }
    if (!tempo && (!repeticoes || !series)) {
      exibirAlerta('erro', 'Preencha o Tempo ou as Séries e Repetições.');
      return;
    }

    // Função para tratar seleção de todas as opções
    function handleAllSelected(selectedOptions, allOptions, allOptionValue) {
      if (selectedOptions.includes(allOptionValue) || selectedOptions.length === allOptions.length) {
        // Todas as opções selecionadas ou 'todos' selecionado
        return [allOptionValue];
      } else {
        return selectedOptions.filter(value => value !== allOptionValue);
      }
    }

    // Obter todas as opções disponíveis para impulso e categoria etária
    const impulsoOptions = [...document.querySelectorAll(`input[name="impulso"]`)].map(cb => cb.value);
    const categoriaEtariaOptions = [...document.querySelectorAll(`input[name="etaria"]`)].map(cb => cb.value);

    // Tratar seleção de todas as opções
    const impulso = handleAllSelected(impulsoSelectedOptions, impulsoOptions, 'todos');
    const categoriaEtaria = handleAllSelected(categoriaEtariaSelectedOptions, categoriaEtariaOptions, 'todos');

    // Mostrar o loader
    loader.style.display = 'flex';

    try {
      await adicionarExercicio({
        nome,
        etaria: categoriaEtaria,
        explicacao,
        impulso,
        repeticoes: repeticoes ? parseInt(repeticoes) : null,
        series: series ? parseInt(series) : null,
        duracao: tempo,
        categoria,
        nivel
      });
      exibirAlerta('sucesso', 'Exercício adicionado com sucesso!');
      form.reset();
      updateFieldRequirements(); // Atualizar obrigatoriedade após resetar o formulário

      // Resetar os checkboxes
      document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

      loader.style.display = 'none';
    } catch (error) {
      exibirAlerta('erro', 'Erro ao adicionar exercício.');
      console.error('Erro ao adicionar exercício:', error);
      loader.style.display = 'none';
    }
  });

  // Função de logout
  logoutButton.addEventListener('click', () => {
    signOut(auth)
      .then(() => {
        // Logout bem-sucedido
        adminSection.remove(); // Remover a interface de administração
        exibirAlerta('sucesso', 'Logout realizado com sucesso.');
        console.log('Usuário desconectado');
      })
      .catch((error) => {
        exibirAlerta('erro', 'Erro ao desconectar.');
        console.error('Erro ao desconectar:', error);
      });
  });
}
