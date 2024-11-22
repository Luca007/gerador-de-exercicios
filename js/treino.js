import { obterExercicios } from './firestore.js';
import { embaralharArray, exibirAlerta, loader } from './utils.js';

// Elementos do DOM relacionados ao treino
const treinoForm = document.getElementById('treino-form');
const resultadoDiv = document.getElementById('resultado');

// Evento de submissão do formulário de treino
treinoForm.addEventListener('submit', gerarTreino);

function gerarTreino(e) {
  e.preventDefault();

  const tempoTotalInput = document.getElementById('tempo-disponivel');
  const tempoTotalVal = tempoTotalInput.value.replace(/\D/g, '');
  const tempoTotal = parseInt(tempoTotalVal);

  if (!tempoTotalVal || isNaN(tempoTotal)) {
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
  const proporcoes = {
    Aquecimento: 10 / 90,
    Fortalecimento: 20 / 90,
    Alongamento: 20 / 90,
    Equipamento: 35 / 90,
    CoolDown: 5 / 90
  };

  const temposCategoria = {};
  let tempoTotalCalculado = 0;

  // Calcular o tempo para cada categoria
  for (const categoria in proporcoes) {
    const tempoCategoria = Math.floor(tempoTotal * proporcoes[categoria]);
    temposCategoria[categoria] = tempoCategoria;
    tempoTotalCalculado += tempoCategoria;
  }

  // Ajustar o tempo do CoolDown para compensar possíveis arredondamentos
  temposCategoria['CoolDown'] += tempoTotal - tempoTotalCalculado;

  // Converter tempos disponíveis para segundos
  const temposEmSegundos = {};
  for (const categoria in temposCategoria) {
    temposEmSegundos[categoria] = temposCategoria[categoria] * 60;
  }

  try {
    // Obter exercícios de cada categoria
    const categorias = ['Aquecimento', 'Fortalecimento', 'Alongamento', 'Equipamento', 'CoolDown'];
    const treinos = {};

    for (const categoria of categorias) {
      let exercicios = await obterExercicios({
        categoria: categoria
      });

      // Filtrar exercícios no lado do cliente
      exercicios = exercicios.filter(exercicio => {
        const nivelMatch = (nivel === 'todos' || exercicio.nivel === 'todos' || exercicio.nivel === nivel);
        const etariaMatch = (categoriaEtaria === 'todos' || exercicio.etaria.includes('todos') || exercicio.etaria.includes(categoriaEtaria));
        return nivelMatch && etariaMatch;
      });

      // Selecionar exercícios que se encaixem no tempo disponível
      treinos[categoria] = selecionarExercicios(exercicios, temposEmSegundos[categoria]);
    }
    
    // Exibir o treino
    for (const categoria of categorias) {
      exibirTreino(categoria, treinos[categoria], resultadoDiv);
    }

    // Esconder o loader
    loader.style.display = 'none';

  } catch (error) {
    console.error('Erro ao montar o treino:', error);
    resultadoDiv.innerHTML = '<div class="alert alert-danger">Desculpe, ocorreu um erro ao gerar o treino.</div>';

    // Esconder o loader
    loader.style.display = 'none';
  }
}

function selecionarExercicios(exercicios, tempoDisponivel) {
  let tempoAcumulado = 0;
  const listaSelecionada = [];

  // Embaralhar exercícios para variedade
  exercicios = embaralharArray(exercicios);

  for (let exercicio of exercicios) {
    const duracaoExercicio = exercicio.duracao || 0;
    if (tempoAcumulado + duracaoExercicio <= tempoDisponivel) {
      listaSelecionada.push(exercicio);
      tempoAcumulado += duracaoExercicio;
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

      // Adicionar nome ao título
      titleDuration.appendChild(exerciseName);

      // Duração ou Séries/Repetições
      if (exercicio.duracao) {
        const separator = document.createTextNode(' - ');
        titleDuration.appendChild(separator);

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
        const separator = document.createTextNode(' - ');
        titleDuration.appendChild(separator);

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
      if (exercicio.impulso && exercicio.impulso.length > 0 && !exercicio.impulso.includes('nenhum')) {
        const impulsoPara = document.createElement('p');
        impulsoPara.className = 'exercise-impulso';
        impulsoPara.innerHTML = `<strong>Impulso:</strong> ${exercicio.impulso.join(', ')}`;
        listItem.appendChild(impulsoPara);
      }

      // Repetições
      if (exercicio.repeticoes && !exercicio.duracao) {
        const repeticoesPara = document.createElement('p');
        repeticoesPara.className = 'exercise-repeticoes';
        repeticoesPara.innerHTML = `<strong>Repetições:</strong> ${exercicio.repeticoes}`;
        listItem.appendChild(repeticoesPara);
      }

      // Séries
      if (exercicio.series && !exercicio.duracao) {
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
