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
    const cooldownExercicios = await obterExercicios('Cool Down', nivel, categoriaEtaria);

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
    exibirTreino('Cooldown', treinoCooldown, resultadoDiv);

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

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Login bem-sucedido
        form.reset();
        loginError.innerText = '';
      })
      .catch((error) => {
        // Erro no login
        loginError.innerText = 'Email ou senha incorretos.';
        console.error('Erro no login:', error);
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
    { label: 'Categoria:', id: 'categoria', type: 'select', options: ['nenhum', 'Alongamento', 'Aquecimento', 'Cool Down', 'Fortalecimento', 'Mobilidade'], required: true },
    { label: 'Nível:', id: 'nivel', type: 'select', options: ['todos', 'iniciante', 'intermediario', 'avancado'], required: true },
  ];
  
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
  adminSection.appendChild(logoutButton);
  adminSection.appendChild(adminMessage);

  // Adicionar ao body
  document.body.appendChild(adminSection);

  // Aplicar máscaras aos campos após adicionar ao DOM
  applyInputMasks();

  // Adicionar eventos
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
  
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
    } catch (error) {
      adminMessage.innerHTML = '<div class="alert alert-danger">Erro ao adicionar exercício.</div>';
      console.error('Erro ao adicionar exercício:', error);
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
