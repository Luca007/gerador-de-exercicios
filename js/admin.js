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

  // Criar elementos
  const loginSection = document.createElement('div');
  loginSection.id = 'login-section';
  loginSection.className = 'container mt-5';

  const h2 = document.createElement('h2');
  h2.innerText = 'Admin Login';
  h2.className = 'text-center mb-4';

  const form = document.createElement('form');
  form.id = 'login-form';
  form.className = 'mx-auto';
  form.style.maxWidth = '400px';

  const emailGroup = document.createElement('div');
  emailGroup.className = 'form-group';

  const emailLabel = document.createElement('label');
  emailLabel.htmlFor = 'email';
  emailLabel.innerText = 'Email:';

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'email';
  emailInput.className = 'form-control';

  emailGroup.appendChild(emailLabel);
  emailGroup.appendChild(emailInput);

  const passwordGroup = document.createElement('div');
  passwordGroup.className = 'form-group';

  const passwordLabel = document.createElement('label');
  passwordLabel.htmlFor = 'password';
  passwordLabel.innerText = 'Senha:';

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'password';
  passwordInput.className = 'form-control';

  passwordGroup.appendChild(passwordLabel);
  passwordGroup.appendChild(passwordInput);

  const loginButton = document.createElement('button');
  loginButton.type = 'submit';
  loginButton.innerText = 'Entrar';
  loginButton.className = 'btn btn-primary btn-block mt-4';

  const loginError = document.createElement('div');
  loginError.id = 'login-error';
  loginError.className = 'text-danger mt-2';

  // Montar estrutura
  form.appendChild(emailGroup);
  form.appendChild(passwordGroup);
  form.appendChild(loginButton);
  form.appendChild(loginError);

  loginSection.appendChild(h2);
  loginSection.appendChild(form);

  // Adicionar ao body
  document.body.appendChild(loginSection);

  // Evento de submissão do formulário de login
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email) {
      exibirAlerta('erro', 'Por favor, preencha o campo Email.');
      return;
    }
    if (!password) {
      exibirAlerta('erro', 'Por favor, preencha o campo Senha.');
      return;
    }

    // Mostrar o loader
    loader.style.display = 'flex';

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login bem-sucedido
        form.reset();
        loginError.innerText = '';

        // Esconder o loader
        loader.style.display = 'none';
      })
      .catch((error) => {
        // Erro no login
        exibirAlerta('erro', 'Email ou senha incorretos.');
        console.error('Erro no login:', error);

        // Esconder o loader
        loader.style.display = 'none';
      });
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
      label: 'Impulso (Equipamento):',
      id: 'impulso',
      type: 'select',
      options: ['todos', 'nenhum', 'Lira', 'Solo', 'Tecido', 'Trapézio'],
      required: true,
      multiple: true
    },
    {
      label: 'Categoria Etária:',
      id: 'etaria',
      type: 'select',
      options: ['todos', 'criança', 'adulto', 'idoso'],
      required: true,
      multiple: true
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

  // Adicionar eventos
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validação personalizada
    const nome = $('#nome').val().trim();
    const explicacao = $('#explicacao').val().trim();
    const impulsoSelectedOptions = $('#impulso').val() || [];
    const categoriaEtariaSelectedOptions = $('#etaria').val() || [];
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
    const impulsoOptions = $('#impulso option').map(function () { return $(this).val(); }).get();
    const categoriaEtariaOptions = $('#etaria option').map(function () { return $(this).val(); }).get();

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
