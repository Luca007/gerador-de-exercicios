import { exibirAlerta, removeExistingSections, applyInputMasks, loader } from './utils.js';
import {
  atualizarExercicio,
  deletarExercicio as deletarExercicioFirestore,
  obterExercicios
} from './firestore.js';
import { criarFormulario } from './formGenerator.js';
import { createAdminInterface } from './admin.js';

// Função para criar o gerenciamento de exercícios
export function criarGerenciamentoExercicios() {
  // Remover seções existentes
  removeExistingSections();

  // Criar contêiner
  const manageSection = document.createElement('div');
  manageSection.id = 'manage-section';
  manageSection.className = 'container mt-5';

  const h2 = document.createElement('h2');
  h2.innerText = 'Gerenciar Exercícios';
  h2.className = 'text-center mb-4';

  // Adicionar o botão de voltar com o ícone de casinha
  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'btn btn-secondary mb-3 voltar';
  backButton.innerHTML = '<i class="fas fa-home mr-2"></i> Voltar';
  backButton.addEventListener('click', () => {
    createAdminInterface();
  });

  manageSection.appendChild(h2);
  manageSection.appendChild(backButton);

  // Contêiner para exercícios
  const exercisesContainer = document.createElement('div');
  exercisesContainer.id = 'exercises-container';
  manageSection.appendChild(exercisesContainer);

  // Adicionar ao body
  document.body.appendChild(manageSection);

  // Buscar e exibir exercícios
  buscarEExibirExercicios();
}

function criarBotaoDeletar(exerciseId) {
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button noselect';
  deleteButton.addEventListener('click', () => excluirExercicio(exerciseId));

  // Criar os elementos internos
  const deleteTextSpan = document.createElement('span');
  deleteTextSpan.className = 'text';
  deleteTextSpan.innerText = 'Excluir';

  const deleteIconSpan = document.createElement('span');
  deleteIconSpan.className = 'icon';

  // Usar o ícone de lixeira do Font Awesome
  const deleteIcon = document.createElement('i');
  deleteIcon.className = 'fas fa-trash';

  deleteIconSpan.appendChild(deleteIcon);

  // Montar o botão
  deleteButton.appendChild(deleteTextSpan);
  deleteButton.appendChild(deleteIconSpan);

  return deleteButton;
}

function criarBotaoEditar(exercise) {
  const editButton = document.createElement('button');
  editButton.className = 'edit-button noselect';
  editButton.addEventListener('click', () => editarExercicio(exercise));

  // Criar os elementos internos
  const editTextSpan = document.createElement('span');
  editTextSpan.className = 'text';
  editTextSpan.innerText = 'Editar';

  const editIconSpan = document.createElement('span');
  editIconSpan.className = 'icon';

  // Usar o ícone de lápis do Font Awesome
  const editIcon = document.createElement('i');
  editIcon.className = 'fas fa-pencil-alt';

  editIconSpan.appendChild(editIcon);

  // Montar o botão
  editButton.appendChild(editTextSpan);
  editButton.appendChild(editIconSpan);

  return editButton;
}

async function buscarEExibirExercicios() {
  const exercisesContainer = document.getElementById('exercises-container');

  // Limpar conteúdo anterior
  exercisesContainer.innerHTML = '';

  // Mostrar o loader padrão
  loader.style.display = 'flex';

  try {
    const exercises = await obterExercicios();
    const exercisesByCategory = categorizeExercises(exercises);

    // Esconder o loader padrão
    loader.style.display = 'none';

    // Exibir exercícios agrupados por categoria
    for (const category in exercisesByCategory) {
      const sectionDiv = exibirExerciciosPorCategoria(
        category,
        exercisesByCategory[category]
      );
      exercisesContainer.appendChild(sectionDiv);
    }
  } catch (error) {
    console.error('Erro ao obter exercícios:', error);
    exibirAlerta('erro', 'Erro ao obter exercícios.');
    // Esconder o loader padrão
    loader.style.display = 'none';
  }
}

// Função para exibir exercícios por categoria
function exibirExerciciosPorCategoria(category, exercises) {
  const sectionDiv = document.createElement('div');
  sectionDiv.className = 'section';
  sectionDiv.id = category.toLowerCase();

  // Cabeçalho da seção
  const sectionHeader = criarCabecalhoSecao(category);
  sectionDiv.appendChild(sectionHeader);

  // Criar a tabela de exercícios
  const table = criarTabelaExercicios(exercises);
  sectionDiv.appendChild(table);

  return sectionDiv;
}

// Função para criar o cabeçalho da seção
function criarCabecalhoSecao(category) {
  const sectionHeader = document.createElement('div');
  sectionHeader.className = 'section-header';

  // Ícone da seção (utilizando Font Awesome)
  const iconElement = document.createElement('i');
  setIconClass(iconElement, category);

  // Adicionar o ícone ao cabeçalho da seção
  sectionHeader.appendChild(iconElement);

  // Título da seção
  const sectionTitle = document.createElement('h2');
  sectionTitle.className = 'section-title';
  sectionTitle.innerText = category;

  sectionHeader.appendChild(sectionTitle);

  return sectionHeader;
}

// Função para criar a tabela de exercícios
function criarTabelaExercicios(exercises) {
  const table = document.createElement('table');
  table.className = 'exercise-table';

  const thead = criarCabecalhoTabela();
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  exercises.forEach((exercise) => {
    const row = criarLinhaExercicio(exercise);
    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  return table;
}

// Função para criar o cabeçalho da tabela
function criarCabecalhoTabela() {
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  const headers = [
    'Nome',
    'Explicação',
    'Repetições',
    'Séries',
    'Tempo',
    'Equipamento',
    'Categoria Etária',
    'Nível',
    'Ações'
  ];
  headers.forEach((headerText) => {
    const th = document.createElement('th');
    th.innerText = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  return thead;
}

// Função para criar uma linha da tabela
function criarLinhaExercicio(exercise) {
  const row = document.createElement('tr');

  createNameCell(row, exercise);
  createExplanationCell(row, exercise);
  createRepeticoesCell(row, exercise);
  createSeriesCell(row, exercise);
  createTempoCell(row, exercise);
  createEquipamentoCell(row, exercise);
  createEtariaCell(row, exercise);
  createNivelCell(row, exercise);
  createActionsCell(row, exercise);

  return row;
}

function createNameCell(row, exercise) {
  const nameCell = document.createElement('td');
  nameCell.innerText = exercise.nome || '';
  row.appendChild(nameCell);
}

function createExplanationCell(row, exercise) {
  const explanationCell = document.createElement('td');
  explanationCell.className = 'explanation-cell';
  explanationCell.innerText = exercise.explicacao || '';
  row.appendChild(explanationCell);
}

function createRepeticoesCell(row, exercise) {
  const repeticoesCell = document.createElement('td');
  repeticoesCell.innerText = exercise.repeticoes || '';
  row.appendChild(repeticoesCell);
}

function createSeriesCell(row, exercise) {
  const seriesCell = document.createElement('td');
  seriesCell.innerText = exercise.series || '';
  row.appendChild(seriesCell);
}

function createTempoCell(row, exercise) {
  const tempoCell = document.createElement('td');
  tempoCell.innerText = exercise.duracao ? `${exercise.duracao} seg` : '';
  row.appendChild(tempoCell);
}

function createEquipamentoCell(row, exercise) {
  const impulsoCell = document.createElement('td');
  impulsoCell.innerText = Array.isArray(exercise.impulso)
    ? exercise.impulso.join(', ')
    : exercise.impulso || '';
  row.appendChild(impulsoCell);
}

function createEtariaCell(row, exercise) {
  const etariaCell = document.createElement('td');
  etariaCell.innerText = Array.isArray(exercise.etaria)
    ? exercise.etaria.join(', ')
    : exercise.etaria || '';
  row.appendChild(etariaCell);
}

function createNivelCell(row, exercise) {
  const nivelCell = document.createElement('td');
  nivelCell.innerText = exercise.nivel || '';
  row.appendChild(nivelCell);
}

function createActionsCell(row, exercise) {
  const actionsCell = document.createElement('td');
  const actionsContainer = criarActionsContainer(exercise);
  actionsCell.appendChild(actionsContainer);
  row.appendChild(actionsCell);
}

// Função para criar o contêiner de ações (editar e deletar)
function criarActionsContainer(exercise) {
  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'actions-container';

  // Botão Editar
  const editButton = criarBotaoEditar(exercise);
  actionsContainer.appendChild(editButton);

  // Botão Deletar
  const deleteButton = criarBotaoDeletar(exercise.id);
  actionsContainer.appendChild(deleteButton);

  return actionsContainer;
}

function categorizeExercises(exercises) {
  const exercisesByCategory = {};
  exercises.forEach((exercise) => {
    const category = exercise.categoria || 'Sem Categoria';
    if (!exercisesByCategory[category]) {
      exercisesByCategory[category] = [];
    }
    exercisesByCategory[category].push(exercise);
  });
  return exercisesByCategory;
}

function setIconClass(iconElement, category) {
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
}

async function excluirExercicio(exerciseId) {
  if (confirm('Tem certeza que deseja deletar este exercício?')) {
    // Mostrar o loader
    loader.style.display = 'flex';

    try {
      // Chama a função importada para deletar do Firestore
      await deletarExercicioFirestore(exerciseId);
      exibirAlerta('sucesso', 'Exercício deletado com sucesso.');
      // Esconder o loader
      loader.style.display = 'none';
      // Atualizar a lista de exercícios
      buscarEExibirExercicios();
    } catch (error) {
      console.error('Erro ao deletar exercício:', error);
      exibirAlerta('erro', 'Erro ao deletar exercício.');
      // Esconder o loader
      loader.style.display = 'none';
    }
  }
}

// Função para editar exercício
function editarExercicio(exercise) {
  // Remover seções existentes
  removeExistingSections();

  // Criar formulário para editar exercício
  const editSection = document.createElement('div');
  editSection.id = 'edit-section';
  editSection.className = 'container mt-5';

  const h2 = document.createElement('h2');
  h2.innerText = 'Editar Exercício';
  h2.className = 'text-center mb-4';

  // Campos para editar exercício
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

  const valoresIniciais = {
    nome: exercise.nome,
    explicacao: exercise.explicacao,
    repeticoes: exercise.repeticoes,
    series: exercise.series,
    'tempo-admin': exercise.duracao,
    impulso: exercise.impulso,
    etaria: exercise.etaria,
    categoria: exercise.categoria,
    nivel: exercise.nivel
  };

  const form = criarFormulario(fields, valoresIniciais);

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

  // Adicionar ao body
  document.body.appendChild(editSection);

  // Aplicar máscaras de entrada
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

  // Adicionar eventos após elementos existirem no DOM
  $('#tempo-admin').on('input', updateFieldRequirements);

  // Atualizar a obrigatoriedade inicial
  updateFieldRequirements();

  // Função para configurar a lógica dos grupos de checkboxes
  function setupCheckboxGroupLogic(fieldId) {
    const checkboxes = document.querySelectorAll(`input[name="${fieldId}"]`);
    const todosCheckbox = document.querySelector(
      `input[name="${fieldId}"][value="todos"]`
    );
    const nenhumCheckbox = document.querySelector(
      `input[name="${fieldId}"][value="nenhum"]`
    );
    const otherCheckboxes = Array.from(checkboxes).filter(
      (cb) => cb !== todosCheckbox && cb !== nenhumCheckbox
    );

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        handleCheckboxChange(checkbox, {
          checkboxes,
          todosCheckbox,
          nenhumCheckbox,
          otherCheckboxes
        });
      });
    });
  }

  function handleCheckboxChange(
    checkbox,
    { checkboxes, todosCheckbox, nenhumCheckbox, otherCheckboxes }
  ) {
    if (checkbox === todosCheckbox && todosCheckbox.checked) {
      marcarTodos(todosCheckbox, nenhumCheckbox, otherCheckboxes);
    } else if (checkbox === nenhumCheckbox && nenhumCheckbox.checked) {
      marcarNenhum(nenhumCheckbox, checkboxes, todosCheckbox);
    } else {
      atualizarOutrasOpcoes(todosCheckbox, nenhumCheckbox, otherCheckboxes);
    }
  }
  
  function marcarTodos(todosCheckbox, nenhumCheckbox, otherCheckboxes) {
    // 'todos' foi marcado, marcar todas as outras opções, exceto 'nenhum'
    otherCheckboxes.forEach((cb) => (cb.checked = true));
    if (nenhumCheckbox) nenhumCheckbox.checked = false;
  }
  
  function marcarNenhum(nenhumCheckbox, checkboxes, todosCheckbox) {
    // 'nenhum' foi marcado, desmarcar todas as outras opções
    checkboxes.forEach((cb) => {
      if (cb !== nenhumCheckbox) {
        cb.checked = false;
      }
    });
    if (todosCheckbox) todosCheckbox.checked = false;
  }
  
  function atualizarOutrasOpcoes(todosCheckbox, nenhumCheckbox, otherCheckboxes) {
    // Verificar se todas as outras opções estão marcadas
    const todasMarcadas = otherCheckboxes.every((cb) => cb.checked);
  
    // Atualizar o checkbox 'todos'
    if (todosCheckbox) {
      todosCheckbox.checked = todasMarcadas;
    }
  
    // Verificar se alguma opção está marcada
    const algumaMarcada = otherCheckboxes.some((cb) => cb.checked);
  
    // Desmarcar 'nenhum' se alguma opção estiver marcada
    if (nenhumCheckbox && algumaMarcada) {
      nenhumCheckbox.checked = false;
    }
  
    // Desmarcar 'todos' se nem todas as opções estão marcadas
    if (todosCheckbox && !todasMarcadas) {
      todosCheckbox.checked = false;
    }
  }
  
  // Após o formulário ser adicionado ao DOM
  setupCheckboxGroupLogic('impulso');
  setupCheckboxGroupLogic('etaria');

  // Função para validar os dados do formulário
  function validateFormData(formData) {
    // Lista de campos obrigatórios
    const camposObrigatorios = [
      { campo: 'nome', nomeExibicao: 'Nome do Exercício' },
      { campo: 'explicacao', nomeExibicao: 'Explicação' },
      { campo: 'impulsoSelectedOptions', nomeExibicao: 'Equipamento' },
      { campo: 'categoriaEtariaSelectedOptions', nomeExibicao: 'Categoria Etária' },
      { campo: 'categoria', nomeExibicao: 'Categoria' },
      { campo: 'nivel', nomeExibicao: 'Nível' }
    ];

    // Se 'tempo' não estiver preenchido, 'repeticoes' e 'series' são obrigatórios
    if (!formData.tempo) {
      camposObrigatorios.push(
        { campo: 'repeticoes', nomeExibicao: 'Repetições' },
        { campo: 'series', nomeExibicao: 'Séries' }
      );
    }

    // Verificar quais campos estão faltando
    const camposFaltantes = camposObrigatorios.filter(({ campo }) => {
      const valor = formData[campo];
      return (
        valor === undefined ||
        valor === null ||
        (typeof valor === 'string' && valor.trim() === '') ||
        (Array.isArray(valor) && valor.length === 0)
      );
    }).map(({ nomeExibicao }) => nomeExibicao);

    // Se houver campos faltantes, exibir alerta
    if (camposFaltantes.length > 0) {
      exibirAlerta('aviso', 'Por favor, preencha os seguintes campos: ' + camposFaltantes.join(', '));
      return false;
    }

    return true;
  }


  // Manipulador de submissão do formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = extractFormData();

    if (!validateFormData(formData)) {
      return;
    }

    // Função para tratar seleção de todas as opções
    function handleAllSelected(selectedOptions, allOptions, allOptionValue) {
      const optionsWithoutAll = allOptions.filter((option) => option !== allOptionValue);
    
      // Verificar se todas as opções, exceto 'todos', estão selecionadas
      const allOptionsSelected = optionsWithoutAll.every((option) =>
        selectedOptions.includes(option)
      );
    
      if (allOptionsSelected) {
        // Se todas as opções estiverem selecionadas, retornar ['todos']
        return [allOptionValue];
      } else {
        // Caso contrário, retornar as opções selecionadas sem 'todos'
        return selectedOptions.filter((value) => value !== allOptionValue);
      }
    }
    
    // Obter todas as opções disponíveis para impulso e categoria etária
    const impulsoOptions = [
      ...document.querySelectorAll(`input[name="impulso"]`)
    ].map((cb) => cb.value);
    const categoriaEtariaOptions = [
      ...document.querySelectorAll(`input[name="etaria"]`)
    ].map((cb) => cb.value);

    // Tratar seleção de todas as opções
    const impulso = handleAllSelected(
      formData.impulsoSelectedOptions,
      impulsoOptions,
      'todos'
    );
    const categoriaEtaria = handleAllSelected(
      formData.categoriaEtariaSelectedOptions,
      categoriaEtariaOptions,
      'todos'
    );

    // Mostrar o loader
    loader.style.display = 'flex';

    try {
      await atualizarExercicio(exercise.id, {
        nome: formData.nome,
        etaria: categoriaEtaria,
        explicacao: formData.explicacao,
        impulso,
        repeticoes: formData.repeticoes ? parseInt(formData.repeticoes) : null,
        series: formData.series ? parseInt(formData.series) : null,
        duracao: formData.tempo,
        categoria: formData.categoria,
        nivel: formData.nivel
      });
      exibirAlerta('sucesso', 'Exercício atualizado com sucesso!');

      // Retornar à lista de exercícios após atualização
      setTimeout(() => {
        criarGerenciamentoExercicios();
        // Esconder o loader após os 20 ms
        loader.style.display = 'none';
      }, 20);
    } catch (error) {
      console.error('Erro ao atualizar exercício:', error);
      exibirAlerta('erro', 'Erro ao atualizar exercício.');

      // Esconder o loader
      loader.style.display = 'none';
    }

    // Limpar a mensagem após algum tempo
    setTimeout(() => {
      adminMessage.innerHTML = '';
    }, 3000);
  });

  function extractFormData() {
    const nome = $('#nome').val().trim();
    const explicacao = $('#explicacao').val().trim();

    const impulsoCheckboxes = document.querySelectorAll(
      'input[name="impulso"]:checked'
    );
    const impulsoSelectedOptions = Array.from(impulsoCheckboxes).map(
      (cb) => cb.value
    );

    const categoriaEtariaCheckboxes = document.querySelectorAll(
      'input[name="etaria"]:checked'
    );
    const categoriaEtariaSelectedOptions = Array.from(
      categoriaEtariaCheckboxes
    ).map((cb) => cb.value);

    const categoria = $('#categoria').val();
    const nivel = $('#nivel').val();
    const repeticoes = $('#repeticoes').val().replace(/\D/g, '') || null;
    const series = $('#series').val().replace(/\D/g, '') || null;
    const tempoVal = $('#tempo-admin').val().replace(/\D/g, '');
    const tempo = tempoVal ? parseInt(tempoVal) : null;

    return {
      nome,
      explicacao,
      impulsoSelectedOptions,
      categoriaEtariaSelectedOptions,
      categoria,
      nivel,
      repeticoes,
      series,
      tempo
    };
  }
}

export function adicionarBotaoGerenciarExercicios() {
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
