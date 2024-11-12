import { db } from './firebase.js';
import { createAdminInterface } from './admin.js';
import { exibirAlerta, removeExistingSections, applyInputMasks, loader } from './utils.js';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';


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

async function buscarEExibirExercicios() {
    const exercisesContainer = document.getElementById('exercises-container');
    
    // Limpar conteúdo anterior
    exercisesContainer.innerHTML = '';

    // Mostrar o loader padrão
    loader.style.display = 'flex';

    try {
        // Referência à coleção 'exercicios'
        const exerciciosRef = collection(db, 'exercicios');

        // Obter os documentos da coleção
        const querySnapshot = await getDocs(exerciciosRef);

        const exercisesByCategory = {};

        querySnapshot.forEach((docSnapshot) => {
            const exercise = docSnapshot.data();
            exercise.id = docSnapshot.id; // Armazenar o ID do documento
            const category = exercise.categoria || 'Sem Categoria';

            if (!exercisesByCategory[category]) {
                exercisesByCategory[category] = [];
            }
            exercisesByCategory[category].push(exercise);
        });

        // Esconder o loader padrão
        loader.style.display = 'none';

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
  
          // Adicionar a seção ao exercisesContainer, não ao manageSection
          exercisesContainer.appendChild(sectionDiv);
        }
      }
      catch (error) {
        console.error('Erro ao obter exercícios:', error);
        // Esconder o loader padrão
        loader.style.display = 'none';
        exercisesContainer.innerHTML = '<div class="alert alert-danger">Erro ao carregar exercícios.</div>';
    }
}


async function deletarExercicio(exerciseId) {
    if (confirm('Tem certeza que deseja deletar este exercício?')) {
        // Mostrar o loader
        loader.style.display = 'flex';

        try {
            await deleteDoc(doc(db, 'exercicios', exerciseId));
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
        input.rows = 3;
        input.className = 'form-control';
        input.value = field.value || '';
      } else if (field.type === 'select') {
        input = document.createElement('select');
        input.id = field.id;
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
        repeticoesInput.required = false;
        seriesInput.required = false;
      } else {
        // Tempo preenchido, séries e repetições não são obrigatórios
        repeticoesInput.required = false;
        seriesInput.required = false;
      }
    }
  
    // **Adicionar eventos após elementos existirem no DOM**
    $('#tempo-admin').on('input', updateFieldRequirements);
  
    // Atualizar a obrigatoriedade inicial
    updateFieldRequirements();
  
    // Manipulador de submissão do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
  
      // Validação personalizada
      const nome = document.getElementById('nome').value.trim();
      const explicacao = document.getElementById('explicacao').value.trim();
      const impulso = document.getElementById('impulso').value;
      const categoriaEtaria = document.getElementById('categoria-etaria').value;
      const categoria = document.getElementById('categoria').value;
      const nivel = document.getElementById('nivel').value;
      const repeticoes = document.getElementById('repeticoes').value.trim();
      const series = document.getElementById('series').value.trim();
      const tempo = $('#tempo-admin').val().trim();
  
      if (!nome) {
        exibirAlerta('erro', 'Por favor, preencha o campo Nome do Exercício.');
        return;
      }
      if (!explicacao) {
        exibirAlerta('erro', 'Por favor, preencha o campo Explicação.');
        return;
      }
      if (!impulso) {
        exibirAlerta('erro', 'Por favor, selecione o Impulso.');
        return;
      }
      if (!categoriaEtaria) {
        exibirAlerta('erro', 'Por favor, selecione a Categoria Etária.');
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
  
    // Mostrar o loader
    loader.style.display = 'flex';

    try {
        const exercicioRef = doc(db, 'exercicios', exercise.id);

        await updateDoc(exercicioRef, {
            nome,
            etaria: categoriaEtaria,
            explicacao,
            impulso,
            repeticoes,
            series,
            duracao: tempo,
            categoria,
            nivel
        });
        exibirAlerta('sucesso', 'Exercício atualizado com sucesso!');

        // Retornar à lista de exercícios após atualização
        setTimeout(() => {
            criarGerenciamentoExercicios();
            // Esconder o loader após os 20 ms
            loader.style.display = 'none';
        }, 20);

    } catch (error) {
        exibirAlerta('erro', 'Erro ao atualizar exercício.');
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
