// Configurações do Firebase (substitua pelos seus valores)
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

// Elementos existentes no HTML
const treinoForm = document.getElementById('treino-form');
const resultadoDiv = document.getElementById('resultado');
const adminButton = document.getElementById('admin-button'); // Botão de administrador

// Loader
const loader = document.getElementById('loader');

// Funções para gerar o treino
treinoForm.addEventListener('submit', gerarTreino);

function gerarTreino(e) {
  e.preventDefault();

  const tempoTotal = parseInt($('#tempo-disponivel').val().replace(/\D/g, ''));
  const nivel = $('#nivel').val();
  const categoriaEtaria = $('#categoria-etaria').val();

  // Chamar a função para montar o treino
  montarTreino(tempoTotal, nivel, categoriaEtaria);
}


async function montarTreino(tempoTotal, nivel, categoriaEtaria) {
  resultadoDiv.innerHTML = '';

  // Mostrar o loader
  loader.style.display = 'flex';

  // Definir as proporções de tempo para cada categoria
  const proporcaoAquecimento = 10 / 90;
  const proporcaoFortalecimento = 20 / 90;
  const proporcaoAlongamento = 20 / 90;
  const proporcaoEquipamento = 35 / 90;
  const proporcaoCooldown = 5 / 90;

  const tempoAquecimento = Math.floor(tempoTotal * proporcaoAquecimento);
  const tempoFortalecimento = Math.floor(tempoTotal * proporcaoFortalecimento);
  const tempoAlongamento = Math.floor(tempoTotal * proporcaoAlongamento);
  const tempoEquipamento = Math.floor(tempoTotal * proporcaoEquipamento);
  const tempoCooldown = tempoTotal - tempoAquecimento - tempoFortalecimento - tempoAlongamento - tempoEquipamento;

  // Converter tempos disponíveis para segundos
  const tempoAquecimentoSeg = tempoAquecimento * 60;
  const tempoFortalecimentoSeg = tempoFortalecimento * 60;
  const tempoAlongamentoSeg = tempoAlongamento * 60;
  const tempoEquipamentoSeg = tempoEquipamento * 60;
  const tempoCooldownSeg = tempoCooldown * 60;

  try {
    // Obter exercícios de cada categoria
    const aquecimentoExercicios = await obterExercicios('Aquecimento', nivel, categoriaEtaria);
    const fortalecimentoExercicios = await obterExercicios('Fortalecimento', nivel, categoriaEtaria);
    const alongamentoExercicios = await obterExercicios('Alongamento', nivel, categoriaEtaria);
    const equipamentoExercicios = await obterExercicios('Equipamento', nivel, categoriaEtaria);
    const cooldownExercicios = await obterExercicios('CoolDown', nivel, categoriaEtaria);

    // Selecionar exercícios que se encaixem no tempo disponível
    const treinoAquecimento = selecionarExercicios(aquecimentoExercicios, tempoAquecimentoSeg);
    const treinoFortalecimento = selecionarExercicios(fortalecimentoExercicios, tempoFortalecimentoSeg);
    const treinoAlongamento = selecionarExercicios(alongamentoExercicios, tempoAlongamentoSeg);
    const treinoEquipamento = selecionarExercicios(equipamentoExercicios, tempoEquipamentoSeg);
    const treinoCooldown = selecionarExercicios(cooldownExercicios, tempoCooldownSeg);

    // Exibir o treino
    exibirTreino('Aquecimento', treinoAquecimento, resultadoDiv);
    exibirTreino('Fortalecimento', treinoFortalecimento, resultadoDiv);
    exibirTreino('Alongamento', treinoAlongamento, resultadoDiv);
    exibirTreino('Equipamento', treinoEquipamento, resultadoDiv);
    exibirTreino('CoolDown', treinoCooldown, resultadoDiv);

    // Esconder o loader
    loader.style.display = 'none';

  } catch (error) {
    console.error('Erro ao montar o treino:', error);
    resultadoDiv.innerHTML = '<div class="alert alert-danger">Desculpe, ocorreu um erro ao gerar o treino.</div>';

    // Esconder o loader
    loader.style.display = 'none';
  }
}


async function obterExercicios(categoria, nivel, categoriaEtaria) {
  const exerciciosRef = db.collection('exercicios');
  let query = exerciciosRef;

  // Condição para Categoria
  query = query.where('categoria', 'in', [categoria, 'nenhum']);

  // Condição para Nível
  if (nivel !== 'todos') {
    query = query.where('nivel', '==', nivel);
  }

  // Condição para Categoria Etária
  if (categoriaEtaria !== 'todos') {
    query = query.where('etaria', '==', categoriaEtaria);
  }

  const querySnapshot = await query.get();
  return querySnapshot.docs.map(doc => doc.data());
}

function selecionarExercicios(exercicios, tempoDisponivel) {
  let tempoAcumulado = 0;
  const listaSelecionada = [];

  // Embaralhar exercícios para variedade
  exercicios = embaralharArray(exercicios);

  for (let exercicio of exercicios) {
    if (tempoAcumulado + exercicio.duracao <= tempoDisponivel) {
      listaSelecionada.push(exercicio);
      tempoAcumulado += exercicio.duracao;
    }
    if (tempoAcumulado >= tempoDisponivel) break;
  }
  return listaSelecionada;
}

function exibirTreino(titulo, exercicios, elemento) {
  if (exercicios.length > 0) {
    const tituloElem = document.createElement('h2');
    tituloElem.innerText = titulo;
    elemento.appendChild(tituloElem);

    const listGroup = document.createElement('div');
    listGroup.className = 'list-group mb-4';

    exercicios.forEach(exercicio => {
      const listItem = document.createElement('div');
      listItem.className = 'list-group-item';

      // Título do exercício e duração
      const titleDuration = document.createElement('h5');
      titleDuration.className = 'exercise-title';

      // Nome do exercício
      const exerciseName = document.createElement('span');
      exerciseName.className = 'exercise-name';
      exerciseName.innerText = exercicio.nome;

      // Separador
      const separator = document.createTextNode(' - ');

      // Adicionar nome ao título
      titleDuration.appendChild(exerciseName);
      titleDuration.appendChild(separator);

      // Duração ou Séries/Repetições
      if (exercicio.duracao) {
        const exerciseDuration = document.createElement('span');
        exerciseDuration.className = 'exercise-duration';

        // Converter duração de segundos para minutos ou manter em segundos
        let durationText;
        if (exercicio.duracao <= 59) {
          durationText = `${exercicio.duracao} seg`;
        } else {
          const minutes = Math.floor(exercicio.duracao / 60);
          const seconds = exercicio.duracao % 60;
          if (seconds === 0) {
            durationText = `${minutes} min`;
          } else {
            durationText = `${minutes} min ${seconds} seg`;
          }
        }
        exerciseDuration.innerText = durationText;

        // Adicionar ao título
        titleDuration.appendChild(exerciseDuration);
      } else if (exercicio.series && exercicio.repeticoes) {
        const seriesReps = document.createElement('span');
        seriesReps.className = 'exercise-series-reps';
        seriesReps.innerText = `${exercicio.series} séries de ${exercicio.repeticoes} repetições`;
        titleDuration.appendChild(seriesReps);
      }

      // Adicionar título ao item da lista
      listItem.appendChild(titleDuration);

      // Explicação
      if (exercicio.explicacao && exercicio.explicacao.trim() !== '') {
        const explicacaoPara = document.createElement('p');
        explicacaoPara.className = 'exercise-explicacao';
        explicacaoPara.innerHTML = `<strong>Explicação:</strong> ${exercicio.explicacao}`;
        listItem.appendChild(explicacaoPara);
      }

      // Impulso
      if (exercicio.impulso && exercicio.impulso.trim() !== '' && exercicio.impulso !== 'nenhum') {
        const impulsoPara = document.createElement('p');
        impulsoPara.className = 'exercise-impulso';
        impulsoPara.innerHTML = `<strong>Impulso:</strong> ${exercicio.impulso}`;
        listItem.appendChild(impulsoPara);
      }

      // Repetições
      if (exercicio.repeticoes) {
        const repeticoesPara = document.createElement('p');
        repeticoesPara.className = 'exercise-repeticoes';
        repeticoesPara.innerHTML = `<strong>Repetições:</strong> ${exercicio.repeticoes}`;
        listItem.appendChild(repeticoesPara);
      }

      // Séries
      if (exercicio.series) {
        const seriesPara = document.createElement('p');
        seriesPara.className = 'exercise-series';
        seriesPara.innerHTML = `<strong>Séries:</strong> ${exercicio.series}`;
        listItem.appendChild(seriesPara);
      }

      listGroup.appendChild(listItem);
    });
    elemento.appendChild(listGroup);
  } else {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-warning';
    alertDiv.innerText = `Não há exercícios disponíveis para a categoria ${titulo}.`;
    elemento.appendChild(alertDiv);
  }
}

function embaralharArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Função para remover seções existentes
function removeExistingSections() {
  const existingLogin = document.getElementById('login-section');
  if (existingLogin) existingLogin.remove();

  const existingAdmin = document.getElementById('admin-section');
  if (existingAdmin) existingAdmin.remove();

  const existingManage = document.getElementById('manage-section');
  if (existingManage) existingManage.remove();

  const existingEdit = document.getElementById('edit-section');
  if (existingEdit) existingEdit.remove();
}



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
  emailInput.required = true;
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
  passwordInput.required = true;
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

  // Adicionar evento de submissão
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    // Mostrar o loader
    loader.style.display = 'flex';

    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Login bem-sucedido
      form.reset();
      loginError.innerText = '';

      // Esconder o loader
      loader.style.display = 'none';
    })
    .catch((error) => {
      // Erro no login
      loginError.innerText = 'Email ou senha incorretos.';
      console.error('Erro no login:', error);

      // Esconder o loader
      loader.style.display = 'none';
      });
  });
}

// Função para criar a interface de administração
function createAdminInterface() {
  // Remover instâncias anteriores
  removeExistingSections();

  // Criar elementos
  const adminSection = document.createElement('div');
  adminSection.id = 'admin-section';
  adminSection.className = 'container mt-5';

  const h2 = document.createElement('h2');
  h2.innerText = 'Adicionar Novo Exercício';
  h2.className = 'text-center mb-4';

  const form = document.createElement('form');
  form.id = 'add-exercise-form';
  form.className = 'mx-auto';
  form.style.maxWidth = '500px';

  // Campos do formulário
  const fields = [
    { label: 'Nome do Exercício:', id: 'nome', type: 'text', required: true },
    { label: 'Explicação:', id: 'explicacao', type: 'textarea', required: true },
    { label: 'Repetições:', id: 'repeticoes', type: 'text', required: false },
    { label: 'Séries:', id: 'series', type: 'text', required: false },
    { label: 'Tempo (segundos):', id: 'tempo-admin', type: 'text', required: false },
    { label: 'Impulso (Equipamento):', id: 'impulso', type: 'select', options: ['nenhum', 'Lira', 'Solo', 'Tecido', 'Trapézio'], required: true },
    { label: 'Categoria Etária:', id: 'categoria-etaria', type: 'select', options: ['todos', 'criança', 'adulto', 'idoso'], required: true },
    { label: 'Categoria:', id: 'categoria', type: 'select', options: ['Todos', 'Aquecimento', 'Fortalecimento', 'Alongamento', 'Equipamento', 'CoolDown'], required: true },
    { label: 'Nível:', id: 'nivel', type: 'select', options: ['todos', 'iniciante', 'intermediario', 'avancado'], required: true },
  ];
    
  fields.forEach(field => {
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';

    const label = document.createElement('label');
    label.htmlFor = field.id;
    label.innerText = field.label;

    let input;
    if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.id = field.id;
      input.required = field.required;
      input.rows = 3;
      input.className = 'form-control';
    } else if (field.type === 'select') {
      input = document.createElement('select');
      input.id = field.id;
      input.required = field.required;
      input.className = 'form-control';
      field.options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.innerText = optionValue.charAt(0).toUpperCase() + optionValue.slice(1);
        input.appendChild(option);
      });
    } else {
      input = document.createElement('input');
      input.type = field.type;
      input.id = field.id;
      input.required = field.required;
      input.className = 'form-control';
    }

    formGroup.appendChild(label);
    formGroup.appendChild(input);
    form.appendChild(formGroup);
  });

  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.innerText = 'Adicionar Exercício';
  addButton.className = 'btn btn-success btn-block mt-4';
  form.appendChild(addButton);

  const adminMessage = document.createElement('div');
  adminMessage.id = 'admin-message';
  adminMessage.className = 'mt-3';

  const logoutButton = document.createElement('button');
  logoutButton.id = 'logout-button';
  logoutButton.innerText = 'Sair';
  logoutButton.className = 'btn btn-danger btn-block mt-3';
  
  adminSection.appendChild(h2);
  adminSection.appendChild(form);
  form.appendChild(logoutButton);
  form.appendChild(adminMessage);

  // Adicionar ao body
  document.body.appendChild(adminSection);

  // Aplicar máscaras aos campos após adicionar ao DOM
  applyInputMasks();

  // Função para atualizar a obrigatoriedade dos campos
  function updateFieldRequirements() {
    const tempoVal = $('#tempo-admin').val().trim();
    const repeticoesInput = document.getElementById('repeticoes');
    const seriesInput = document.getElementById('series');

    if (tempoVal === '') {
      // Tempo não preenchido, séries e repetições são obrigatórios
      repeticoesInput.required = true;
      seriesInput.required = true;
      $('#repeticoes').closest('.form-group').find('label').html('Repetições: *');
      $('#series').closest('.form-group').find('label').html('Séries: *');
    } else {
      // Tempo preenchido, séries e repetições não são obrigatórios
      repeticoesInput.required = false;
      seriesInput.required = false;
      $('#repeticoes').closest('.form-group').find('label').html('Repetições:');
      $('#series').closest('.form-group').find('label').html('Séries:');
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

    // Mostrar o loader
    loader.style.display = 'flex';
  
    const nome = $('#nome').val();
    const etaria = $('#categoria-etaria').val();
    const explicacao = $('#explicacao').val();
    const impulso = $('#impulso').val();
    const repeticoes = $('#repeticoes').val();
    const series = $('#series').val();
    const tempoVal = $('#tempo-admin').val().replace(/\D/g, '');
    const tempo = tempoVal ? parseInt(tempoVal) : null;
    const categoria = $('#categoria').val();
    const nivel = $('#nivel').val();
  
    // Validação dos campos obrigatórios
    if (!tempo && (!repeticoes || !series)) {
      adminMessage.innerHTML = '<div class="alert alert-danger">Por favor, preencha o campo de tempo ou os campos de séries e repetições.</div>';
      return;
    }
  
    try {
      await db.collection('exercicios').add({
        nome,
        etaria,
        explicacao,
        impulso,
        repeticoes,
        series,
        duracao: tempo,
        categoria,
        nivel
      });
      adminMessage.innerHTML = '<div class="alert alert-success">Exercício adicionado com sucesso!</div>';
      form.reset();
      updateFieldRequirements(); // Atualizar obrigatoriedade após resetar o formulário
    // Esconder o loader
    loader.style.display = 'none';
    } 
      catch (error) {
      adminMessage.innerHTML = '<div class="alert alert-danger">Erro ao adicionar exercício.</div>';
      console.error('Erro ao adicionar exercício:', error);

      // Esconder o loader
      loader.style.display = 'none';
      }
  
    // Limpar a mensagem após alguns segundos
    setTimeout(() => {
      adminMessage.innerHTML = '';
    }, 3000);
  });
  
  logoutButton.addEventListener('click', () => {
    auth.signOut().then(() => {
      // Logout bem-sucedido
      adminSection.remove(); // Remover a interface de administração
      console.log('Usuário desconectado');
    }).catch((error) => {
      console.error('Erro ao desconectar:', error);
    });
  });
}

// Função para aplicar máscaras de entrada
function applyInputMasks() {
  // Máscara para o campo 'Tempo (segundos)' no formulário de administração
  $('#tempo-admin').inputmask('integer', {
    rightAlign: false,
    placeholder: '',
    allowMinus: false,
    allowPlus: false,
    min: 0,
    max: 9999
  });

  // Máscara para o campo 'Tempo disponível' do formulário principal
  $('#tempo-disponivel').inputmask('integer', {
    rightAlign: false,
    placeholder: '',
    allowMinus: false,
    allowPlus: false,
    min: 1,
    max: 9999
  });

  // Máscara para o campo 'Repetições' no formulário de administração
  $('#repeticoes').inputmask('integer', {
    rightAlign: false,
    placeholder: '',
    allowMinus: false,
    allowPlus: false,
    min: 1,
    max: 9999
  });

  // Máscara para o campo 'Séries' no formulário de administração
  $('#series').inputmask('integer', {
    rightAlign: false,
    placeholder: '',
    allowMinus: false,
    allowPlus: false,
    min: 1,
    max: 9999
  });
}

// Quando o documento estiver pronto
$(document).ready(function() {
  applyInputMasks();
});

// Evento de clique no botão de administrador
adminButton.addEventListener('click', () => {
  createLoginForm();
});

// Monitorar o estado de autenticação
auth.onAuthStateChanged((user) => {
  if (user) {
    // Usuário autenticado
    createAdminInterface();
  } else {
    // Usuário não autenticado
    // A interface de login será gerada ao clicar no botão
  }
});


// Function to create the exercise management interface
function criarGerenciamentoExercicios() {
  // Remover seções existentes
  removeExistingSections();

  // Criar contêiner
  const manageSection = document.createElement('div');
  manageSection.id = 'manage-section';
  manageSection.className = 'container mt-5';

  const h2 = document.createElement('h2');
  h2.innerText = 'Gerenciar Exercícios';
  h2.className = 'text-center mb-4';

  manageSection.appendChild(h2);

  // Criar um indicador de carregamento
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading-exercises';
  loadingDiv.className = 'text-center';
  loadingDiv.innerText = 'Carregando exercícios...';
  manageSection.appendChild(loadingDiv);

  // Contêiner para exercícios
  const exercisesContainer = document.createElement('div');
  exercisesContainer.id = 'exercises-container';
  manageSection.appendChild(exercisesContainer);

  // Adicionar ao body
  document.body.appendChild(manageSection);

  // Buscar e exibir exercícios
  buscarEExibirExercicios();
}

function buscarEExibirExercicios() {
  const manageSection = document.getElementById('manage-section');
  
  // Limpar conteúdo anterior
  manageSection.innerHTML = '';

  // Criar um indicador de carregamento
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading-exercises';
  loadingDiv.className = 'text-center';
  loadingDiv.innerText = 'Carregando exercícios...';
  manageSection.appendChild(loadingDiv);

  // Buscar exercícios do Firestore
  db.collection('exercicios').get()
    .then((querySnapshot) => {
      const exercisesByCategory = {};

      querySnapshot.forEach((doc) => {
        const exercise = doc.data();
        exercise.id = doc.id; // Armazenar o ID do documento
        const category = exercise.categoria || 'Sem Categoria';

        if (!exercisesByCategory[category]) {
          exercisesByCategory[category] = [];
        }
        exercisesByCategory[category].push(exercise);
      });

      // Remover indicador de carregamento
      loadingDiv.style.display = 'none';

      // Exibir exercícios agrupados por categoria
      for (const category in exercisesByCategory) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';
        sectionDiv.id = category.toLowerCase();

        // Cabeçalho da seção
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';

        // Ícone da seção (utilizando Font Awesome)
        const iconElement = document.createElement('i');

        // Definir a classe do ícone com base na categoria
        switch (category.toLowerCase()) {
          case 'aquecimento':
            iconElement.className = 'section-icon fas fa-fire'; // Ícone de fogo para Aquecimento
            break;
          case 'fortalecimento':
            iconElement.className = 'section-icon fas fa-dumbbell'; // Ícone de haltere para Fortalecimento
            break;
          case 'alongamento':
            iconElement.className = 'section-icon fas fa-spa'; // Ícone de spa para Alongamento
            break;
          case 'equipamento':
            iconElement.className = 'section-icon fas fa-tools'; // Ícone de ferramentas para Equipamento
            break;
          case 'cooldown':
            iconElement.className = 'section-icon fas fa-snowflake'; // Ícone de floco de neve para CoolDown
            break;
          default:
            iconElement.className = 'section-icon fas fa-question'; // Ícone de interrogação como padrão
        }

        // Adicionar o ícone ao cabeçalho da seção
        sectionHeader.appendChild(iconElement);

        // Título da seção
        const sectionTitle = document.createElement('h2');
        sectionTitle.className = 'section-title';
        sectionTitle.innerText = category;

        sectionHeader.appendChild(iconElement);
        sectionHeader.appendChild(sectionTitle);
        sectionDiv.appendChild(sectionHeader);

        // Criar a tabela
        const table = document.createElement('table');
        table.className = 'exercise-table';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const headers = ['Nome', 'Explicação', 'Repetições', 'Séries', 'Tempo', 'Impulso (Equipamento)', 'Categoria Etária', 'Nível', 'Ações'];
        headers.forEach((headerText) => {
          const th = document.createElement('th');
          th.innerText = headerText;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        exercisesByCategory[category].forEach((exercise) => {
          const row = document.createElement('tr');

          // Nome
          const nameCell = document.createElement('td');
          nameCell.innerText = exercise.nome || '';
          row.appendChild(nameCell);

          // Explicação
          const explanationCell = document.createElement('td');
          explanationCell.className = 'explanation-cell';
          explanationCell.innerText = exercise.explicacao || '';
          row.appendChild(explanationCell);

          // Repetições
          const repeticoesCell = document.createElement('td');
          repeticoesCell.innerText = exercise.repeticoes || '';
          row.appendChild(repeticoesCell);

          // Séries
          const seriesCell = document.createElement('td');
          seriesCell.innerText = exercise.series || '';
          row.appendChild(seriesCell);

          // Tempo
          const tempoCell = document.createElement('td');
          tempoCell.innerText = exercise.duracao ? `${exercise.duracao} seg` : '';
          row.appendChild(tempoCell);

          // Impulso
          const impulsoCell = document.createElement('td');
          impulsoCell.innerText = exercise.impulso || '';
          row.appendChild(impulsoCell);

          // Categoria Etária
          const etariaCell = document.createElement('td');
          etariaCell.innerText = exercise.etaria || '';
          row.appendChild(etariaCell);

          // Nível
          const nivelCell = document.createElement('td');
          nivelCell.innerText = exercise.nivel || '';
          row.appendChild(nivelCell);

          // Ações
          const actionsCell = document.createElement('td');
          actionsCell.className = 'actions-cell';

          // Botão Editar
          const editButton = document.createElement('button');
          editButton.className = 'btn btn-primary btn-sm mr-2';
          editButton.innerText = 'Editar';
          editButton.addEventListener('click', () => editarExercicio(exercise));
          actionsCell.appendChild(editButton);

          // Botão Deletar
          const deleteButton = document.createElement('button');
          deleteButton.className = 'btn btn-danger btn-sm';
          deleteButton.innerText = 'Deletar';
          deleteButton.addEventListener('click', () => deletarExercicio(exercise.id));
          actionsCell.appendChild(deleteButton);

          row.appendChild(actionsCell);

          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        sectionDiv.appendChild(table);
        manageSection.appendChild(sectionDiv);
      }
    })
    .catch((error) => {
      console.error('Erro ao obter exercícios:', error);
      loadingDiv.innerText = 'Erro ao carregar exercícios.';
    });
}

function deletarExercicio(exerciseId) {
  if (confirm('Tem certeza que deseja deletar este exercício?')) {
    // Mostrar o loader
    loader.style.display = 'flex';

    db.collection('exercicios').doc(exerciseId).delete()
      .then(() => {
        alert('Exercício deletado com sucesso.');
        // Esconder o loader
        loader.style.display = 'none';
        // Atualizar a lista de exercícios
        buscarEExibirExercicios();
      })
      .catch((error) => {
        console.error('Erro ao deletar exercício:', error);
        alert('Erro ao deletar exercício.');

        // Esconder o loader
        loader.style.display = 'none';
      });
  }
}

function editarExercicio(exercise) {
  // Remover seções existentes
  removeExistingSections();

  // Criar formulário semelhante ao de adicionar exercício, pré-preenchido com os dados do exercício
  const editSection = document.createElement('div');
  editSection.id = 'edit-section';
  editSection.className = 'container mt-5';

  const h2 = document.createElement('h2');
  h2.innerText = 'Editar Exercício';
  h2.className = 'text-center mb-4';

  const form = document.createElement('form');
  form.id = 'edit-exercise-form';
  form.className = 'mx-auto';
  form.style.maxWidth = '500px';

  // Campos para editar exercício
  const fields = [
    { label: 'Nome do Exercício:', id: 'nome', type: 'text', required: true, value: exercise.nome },
    { label: 'Explicação:', id: 'explicacao', type: 'textarea', required: true, value: exercise.explicacao },
    { label: 'Repetições:', id: 'repeticoes', type: 'text', required: false, value: exercise.repeticoes },
    { label: 'Séries:', id: 'series', type: 'text', required: false, value: exercise.series },
    { label: 'Tempo (segundos):', id: 'tempo-admin', type: 'text', required: false, value: exercise.duracao },
    { label: 'Impulso (Equipamento):', id: 'impulso', type: 'select', options: ['nenhum', 'Lira', 'Solo', 'Tecido', 'Trapézio'], required: true, value: exercise.impulso },
    { label: 'Categoria Etária:', id: 'categoria-etaria', type: 'select', options: ['todos', 'criança', 'adulto', 'idoso'], required: true, value: exercise.etaria },
    { label: 'Categoria:', id: 'categoria', type: 'select', options: ['Todos', 'Aquecimento', 'Fortalecimento', 'Alongamento', 'Equipamento', 'CoolDown'], required: true, value: exercise.categoria },
    { label: 'Nível:', id: 'nivel', type: 'select', options: ['todos', 'iniciante', 'intermediario', 'avancado'], required: true, value: exercise.nivel },
  ];

  fields.forEach(field => {
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';

    const label = document.createElement('label');
    label.htmlFor = field.id;
    label.innerText = field.label;

    let input;
    if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.id = field.id;
      input.required = field.required;
      input.rows = 3;
      input.className = 'form-control';
      input.value = field.value || '';
    } else if (field.type === 'select') {
      input = document.createElement('select');
      input.id = field.id;
      input.required = field.required;
      input.className = 'form-control';
      field.options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.innerText = optionValue.charAt(0).toUpperCase() + optionValue.slice(1);
        if (optionValue === field.value) {
          option.selected = true;
        }
        input.appendChild(option);
      });
    } else {
      input = document.createElement('input');
      input.type = field.type;
      input.id = field.id;
      input.required = field.required;
      input.className = 'form-control';
      input.value = field.value || '';
    }

    formGroup.appendChild(label);
    formGroup.appendChild(input);
    form.appendChild(formGroup);
  });

  const saveButton = document.createElement('button');
  saveButton.type = 'submit';
  saveButton.innerText = 'Salvar Alterações';
  saveButton.className = 'btn btn-success btn-block mt-4';
  form.appendChild(saveButton);

  const adminMessage = document.createElement('div');
  adminMessage.id = 'admin-message';
  adminMessage.className = 'mt-3';

  const backButton = document.createElement('button');
  backButton.type = 'button'; // Evita comportamento de submissão
  backButton.innerText = 'Voltar';
  backButton.className = 'btn btn-secondary btn-block mt-3';
  backButton.addEventListener('click', () => {
    criarGerenciamentoExercicios();
  });  

  // Montar a estrutura
  editSection.appendChild(h2);
  editSection.appendChild(form);
  editSection.appendChild(backButton);
  editSection.appendChild(adminMessage);

  // **Adicionar ao body antes de configurar eventos**
  document.body.appendChild(editSection);

  // Aplicar máscaras de entrada
  applyInputMasks();

  // Função para atualizar a obrigatoriedade dos campos
  function updateFieldRequirements() {
    const tempoVal = $('#tempo-admin').val().trim();
    const repeticoesInput = document.getElementById('repeticoes');
    const seriesInput = document.getElementById('series');

    if (tempoVal === '') {
      // Tempo não preenchido, séries e repetições são obrigatórios
      repeticoesInput.required = true;
      seriesInput.required = true;
      $('#repeticoes').closest('.form-group').find('label').html('Repetições: *');
      $('#series').closest('.form-group').find('label').html('Séries: *');
    } else {
      // Tempo preenchido, séries e repetições não são obrigatórios
      repeticoesInput.required = false;
      seriesInput.required = false;
      $('#repeticoes').closest('.form-group').find('label').html('Repetições:');
      $('#series').closest('.form-group').find('label').html('Séries:');
    }
  }

  // **Adicionar eventos após elementos existirem no DOM**
  $('#tempo-admin').on('input', updateFieldRequirements);

  // Atualizar a obrigatoriedade inicial
  updateFieldRequirements();

  // Manipulador de submissão do formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Mostrar o loader
    loader.style.display = 'flex';

    const nome = document.getElementById('nome').value;
    const etaria = document.getElementById('categoria-etaria').value;
    const explicacao = document.getElementById('explicacao').value;
    const impulso = document.getElementById('impulso').value;
    const repeticoesVal = document.getElementById('repeticoes').value.replace(/\D/g, '');
    const seriesVal = document.getElementById('series').value.replace(/\D/g, '');
    const repeticoes = repeticoesVal ? parseInt(repeticoesVal) : null;
    const series = seriesVal ? parseInt(seriesVal) : null;
    const tempoVal = document.getElementById('tempo-admin').value.replace(/\D/g, '');
    const tempo = tempoVal ? parseInt(tempoVal) : null;
    const categoria = document.getElementById('categoria').value;
    const nivel = document.getElementById('nivel').value;

    if (!tempo && (!repeticoes || !series)) {
      adminMessage.innerHTML = '<div class="alert alert-danger">Por favor, preencha o campo de tempo ou os campos de séries e repetições.</div>';
      return;
    }

    try {
      await db.collection('exercicios').doc(exercise.id).update({
        nome,
        etaria,
        explicacao,
        impulso,
        repeticoes,
        series,
        duracao: tempo,
        categoria,
        nivel
      });
      adminMessage.innerHTML = '<div class="alert alert-success">Exercício atualizado com sucesso!</div>'

      // Retornar à lista de exercícios após atualização
      setTimeout(() => {
        criarGerenciamentoExercicios();
        // Esconder o loader após os 2000 ms
        loader.style.display = 'none';
      }, 2000);

    } catch (error) {
      adminMessage.innerHTML = '<div class="alert alert-danger">Erro ao atualizar exercício.</div>';
      console.error('Erro ao atualizar exercício:', error);
  
      // Esconder o loader
      loader.style.display = 'none';
    }

    // Limpar a mensagem após algum tempo
    setTimeout(() => {
      adminMessage.innerHTML = '';
    }, 3000);
  });
}

function adicionarBotaoGerenciarExercicios() {
  const manageButton = document.createElement('button');
  manageButton.id = 'manage-exercises-button';
  manageButton.innerText = 'Gerenciar Exercícios';
  manageButton.className = 'btn btn-info btn-block mt-3';

  manageButton.addEventListener('click', () => {
    criarGerenciamentoExercicios();
  });

  const adminSection = document.getElementById('admin-section');
  if (adminSection) {
    adminSection.appendChild(manageButton);
  }
}

