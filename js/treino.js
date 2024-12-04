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
    exibirAlerta('aviso', 'Por favor, preencha o campo Tempo disponível.');
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
  mostrarLoader();

  // Definir as proporções de tempo para cada categoria
  const proporcoes = {
    Aquecimento: 10 / 90,
    Fortalecimento: 20 / 90,
    Alongamento: 20 / 90,
    Equipamento: 35 / 90,
    CoolDown: 5 / 90
  };

  const temposCategoria = calcularTemposCategoria(tempoTotal, proporcoes);
  const temposEmSegundos = converterTemposParaSegundos(temposCategoria);

  try {
    const treinos = await obterTreinos(temposEmSegundos, nivel, categoriaEtaria);
    exibirTreinos(treinos);
    esconderLoader();
  } catch (error) {
    exibirErro();
    esconderLoader();
  }
}

// Mostrar o loader
function mostrarLoader() {
  loader.style.display = 'flex';
}

// Esconder o loader
function esconderLoader() {
  loader.style.display = 'none';
}

// Calcular o tempo para cada categoria
function calcularTemposCategoria(tempoTotal, proporcoes) {
  const temposCategoria = {};
  let tempoTotalCalculado = 0;

  for (const categoria in proporcoes) {
    const tempoCategoria = Math.floor(tempoTotal * proporcoes[categoria]);
    temposCategoria[categoria] = tempoCategoria;
    tempoTotalCalculado += tempoCategoria;
  }

  // Ajustar o tempo do CoolDown para compensar possíveis arredondamentos
  temposCategoria['CoolDown'] += tempoTotal - tempoTotalCalculado;
  return temposCategoria;
}

// Converter tempos disponíveis para segundos
function converterTemposParaSegundos(temposCategoria) {
  const temposEmSegundos = {};
  for (const categoria in temposCategoria) {
    temposEmSegundos[categoria] = temposCategoria[categoria] * 60;
  }
  return temposEmSegundos;
}

// Obter exercícios de cada categoria
async function obterTreinos(temposEmSegundos, nivel, categoriaEtaria) {
  const categorias = ['Aquecimento', 'Fortalecimento', 'Alongamento', 'Equipamento', 'CoolDown'];
  const treinos = {};

  // Selecionar exercícios que se encaixem no tempo disponível
  for (const categoria of categorias) {
    let exercicios = await obterExercicios({ categoria: categoria });
    exercicios = filtrarExercicios(exercicios, nivel, categoriaEtaria);
    treinos[categoria] = selecionarExercicios(exercicios, temposEmSegundos[categoria]);
  }
  return treinos;
}

// Filtrar exercícios no lado do cliente
function filtrarExercicios(exercicios, nivel, categoriaEtaria) {
  return exercicios.filter(exercicio => {
    const nivelMatch = (nivel === 'todos' || exercicio.nivel === 'todos' || exercicio.nivel === nivel);
    const etariaMatch = (categoriaEtaria === 'todos' || exercicio.etaria.includes('todos') || exercicio.etaria.includes(categoriaEtaria));
    return nivelMatch && etariaMatch;
  });
}

// Exibir o treino
function exibirTreinos(treinos) {
  const categorias = ['Aquecimento', 'Fortalecimento', 'Alongamento', 'Equipamento', 'CoolDown'];
  for (const categoria of categorias) {
    exibirTreino(categoria, treinos[categoria], resultadoDiv);
  }
}

function exibirErro() {
  resultadoDiv.innerHTML = '<div class="alert alert-danger">Desculpe, ocorreu um erro ao gerar o treino.</div>';
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

      createTitleDuration(titleDuration, exercicio);

      // Adicionar título ao item da lista
      listItem.appendChild(titleDuration);

      // Explicação
      if (exercicio.explicacao && exercicio.explicacao.trim() !== '') {
        const explicacaoPara = document.createElement('p');
        explicacaoPara.className = 'exercise-explicacao';
        explicacaoPara.innerHTML = `<strong>Explicação:</strong> ${exercicio.explicacao}`;
        listItem.appendChild(explicacaoPara);
      }

      createExerciseDetails(listItem, exercicio);

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

function createExerciseDetails(listItem, exercicio) {
  // Impulso
  if (deveExibirImpulso(exercicio)) {
    const impulsoPara = document.createElement('p');
    impulsoPara.className = 'exercise-impulso';
    impulsoPara.innerHTML = `<strong>Impulso:</strong> ${exercicio.impulso.join(', ')}`;
    listItem.appendChild(impulsoPara);
  }

  // Função para verificar se deve exibir o impulso
  function deveExibirImpulso(exercicio) {
    return exercicio.impulso &&
       exercicio.impulso.length > 0 &&
       !exercicio.impulso.includes('nenhum');
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
}

function createTitleDuration(titleDuration, exercicio) {
  // Duração ou Séries/Repetições
  if (exercicio.duracao) {
    adicionarDuracaoAoTitulo(titleDuration, exercicio.duracao);
  } else if (exercicio.series && exercicio.repeticoes) {
    adicionarSeriesRepeticoesAoTitulo(titleDuration, exercicio.series, exercicio.repeticoes);
  }
}

function adicionarDuracaoAoTitulo(titleDuration, duracao) {
  // Adicionar separador
  const separator = document.createTextNode(' - ');
  titleDuration.appendChild(separator);

  // Criar elemento de duração
  const exerciseDuration = document.createElement('span');
  exerciseDuration.className = 'exercise-duration';

  // Obter texto de duração formatado
  const durationText = formatarDuracao(duracao);
  exerciseDuration.innerText = durationText;

  // Adicionar ao título
  titleDuration.appendChild(exerciseDuration);
}

// Formatar duração em texto
function formatarDuracao(duracao) {
  if (duracao <= 59) {
    return `${duracao} seg`;
  } else {
    const minutes = Math.floor(duracao / 60);
    const seconds = duracao % 60;
    if (seconds === 0) {
      return `${minutes} min`;
    } else {
      return `${minutes} min ${seconds} seg`;
    }
  }
}

function adicionarSeriesRepeticoesAoTitulo(titleDuration, series, repeticoes) {
  // Adicionar separador
  const separator = document.createTextNode(' - ');
  titleDuration.appendChild(separator);

  // Criar elemento de séries e repetições
  const seriesReps = document.createElement('span');
  seriesReps.className = 'exercise-series-reps';
  seriesReps.innerText = `${series} séries de ${repeticoes} repetições`;

  // Adicionar ao título
  titleDuration.appendChild(seriesReps);
}
