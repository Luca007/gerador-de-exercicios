import { exibirAlerta, removeExistingSections, applyInputMasks, loader } from './utils.js';
import { adicionarExercicio } from './firestore.js';
import { criarFormulario } from './formGenerator.js';
import { validateFormData } from './formUtils.js';
import { handleLogout } from './logout.js';
import { adicionarBotaoGerenciarExercicios } from './exercicio.js';
import { setupCheckboxGroupLogic, handleAllSelected, updateFieldRequirements, extractFormData } from './formUtils.js';


// Função para criar a interface de administração
export function createAdminInterface() {
  // Remover instâncias anteriores
  removeExistingSections();

  // Criar a interface de administração
  const adminSection = buildAdminSection();

  // Adicionar ao body
  document.body.appendChild(adminSection);

  // Aplicar máscaras aos campos após adicionar ao DOM
  applyInputMasks();

  // Configurar eventos
  setupEventListeners(adminSection);
}

// Função para criar a seção de administração
function buildAdminSection() {
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
      required: true,
    },
    {
      label: 'Categoria Etária:',
      id: 'etaria',
      type: 'checkboxGroup',
      options: ['todos', 'criança', 'adulto', 'idoso'],
      required: true,
    },
    {
      label: 'Categoria:',
      id: 'categoria',
      type: 'select',
      options: [
        'Todos',
        'Aquecimento',
        'Fortalecimento',
        'Alongamento',
        'Equipamento',
        'CoolDown',
      ],
      required: true,
    },
    {
      label: 'Nível:',
      id: 'nivel',
      type: 'select',
      options: ['todos', 'iniciante', 'intermediario', 'avancado'],
      required: true,
    },
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
  logoutButton.type = 'button'; // Evita submissão do formulário
  logoutButton.id = 'logout-button';
  logoutButton.innerText = 'Sair';
  logoutButton.className = 'btn btn-danger btn-block mt-3';

  // Montar a estrutura
  adminSection.appendChild(h2);
  adminSection.appendChild(form);
  form.appendChild(logoutButton);
  form.appendChild(adminMessage);

  return adminSection;
}

// Função para configurar os eventos
function setupEventListeners(adminSection) {
  const form = adminSection.querySelector('form');
  const logoutButton = adminSection.querySelector('#logout-button');

  // Adicionar eventos aos campos
  document.getElementById('tempo-admin').addEventListener('input', updateFieldRequirements);

  // Atualizar a obrigatoriedade inicial
  updateFieldRequirements();

  // Configurar a lógica dos grupos de checkboxes
  setupCheckboxGroupLogic('impulso');
  setupCheckboxGroupLogic('etaria');

  // Adicionar botão para gerenciar exercícios
  adicionarBotaoGerenciarExercicios();

  // Manipulador de submissão do formulário
  form.addEventListener('submit', handleFormSubmit);

  // Função de logout
  logoutButton.addEventListener('click', handleLogout);
}

// Função para manipular a submissão do formulário
async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = extractFormData();

  // Campos obrigatórios para a página de admin
  const camposObrigatoriosAdmin = [
    { campo: 'nome', nomeExibicao: 'Nome do Exercício' },
    { campo: 'explicacao', nomeExibicao: 'Explicação' },
    { campo: 'impulsoSelectedOptions', nomeExibicao: 'Equipamento' },
    { campo: 'categoriaEtariaSelectedOptions', nomeExibicao: 'Categoria Etária' },
    { campo: 'categoria', nomeExibicao: 'Categoria' },
    { campo: 'nivel', nomeExibicao: 'Nível' }
  ];

  if (!validateFormData(formData, camposObrigatoriosAdmin)) {
    return;
  }

  // Obter todas as opções disponíveis para impulso e categoria etária
  const impulsoOptions = [
    ...document.querySelectorAll(`input[name="impulso"]`),
  ].map((cb) => cb.value);
  const categoriaEtariaOptions = [
    ...document.querySelectorAll(`input[name="etaria"]`),
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
  document.body.classList.add('no-scroll');

  try {
    await adicionarExercicio({
      nome: formData.nome,
      etaria: categoriaEtaria,
      explicacao: formData.explicacao,
      impulso,
      repeticoes: formData.repeticoes ? parseInt(formData.repeticoes) : null,
      series: formData.series ? parseInt(formData.series) : null,
      duracao: formData.tempo,
      categoria: formData.categoria,
      nivel: formData.nivel,
    });
    exibirAlerta('sucesso', 'Exercício adicionado com sucesso!');
    form.reset();
    updateFieldRequirements(); // Atualizar obrigatoriedade após resetar o formulário

    // Resetar os checkboxes
    document
      .querySelectorAll('input[type="checkbox"]')
      .forEach((cb) => (cb.checked = false));

    loader.style.display = 'none';
    document.body.classList.remove('no-scroll');
  } catch (error) {
    exibirAlerta('erro', 'Erro ao adicionar exercício.');
    console.error('Erro ao adicionar exercício:', error);
    loader.style.display = 'none';
    document.body.classList.remove('no-scroll');
  }
}

