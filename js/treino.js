import { db } from './firebase.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';
import { embaralharArray, exibirAlerta, loader } from './utils.js';

// Elementos do DOM relacionados ao treino
const treinoForm = document.getElementById('treino-form');
const resultadoDiv = document.getElementById('resultado');

// Evento de submissão do formulário de treino
treinoForm.addEventListener('submit', gerarTreino);

function gerarTreino(e) {
    e.preventDefault();
  
    const tempoTotalInput = document.getElementById('tempo-disponivel');
    const tempoTotal = parseInt(tempoTotalInput.value.replace(/\D/g, ''));
  
    if (!tempoTotal || isNaN(tempoTotal)) {
      exibirAlerta('erro', 'Por favor, preencha o campo Tempo disponível.');
      return;
    }
  
    // Obter o nível selecionado
    const nivelElemento = document.querySelector('#optionsContainer1 .option.selected');
    const nivel = nivelElemento ? nivelElemento.getAttribute('data-value') : 'todos';
  
    // Obter a categoria etária selecionada
    const categoriaEtariaElemento = document.querySelector('#optionsContainer2 .option.selected');
    const categoriaEtaria = categoriaEtariaElemento ? categoriaEtariaElemento.getAttribute('data-value') : 'todos';
  
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
    let q = query(collection(db, 'exercicios'), where('categoria', 'in', [categoria, 'nenhum']));
  
    if (nivel !== 'todos') {
      q = query(q, where('nivel', '==', nivel));
    }
  
    if (categoriaEtaria !== 'todos') {
      q = query(q, where('etaria', '==', categoriaEtaria));
    }
  
    const querySnapshot = await getDocs(q);
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
