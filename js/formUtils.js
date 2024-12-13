import { exibirAlerta } from './utils.js';

// Função para construir a mensagem de alerta baseada nos campos faltantes
export function construirMensagem(camposFaltantes) {
    const essenciais = ['Repetições', 'Séries', 'Tempo'];
    const essenciaisFaltantes = camposFaltantes.filter(campo => essenciais.includes(campo));
    const outrosFaltantes = camposFaltantes.filter(campo => !essenciais.includes(campo));

    if (todosEssenciaisFaltando(essenciaisFaltantes)) {
        return gerarMensagem(['Repetições', 'Séries'], 'Tempo', outrosFaltantes);
    }

    if (faltamRepeticoesSeries(essenciaisFaltantes)) {
        return gerarMensagem(['Repetições', 'Séries'], 'Tempo', outrosFaltantes);
    }

    if (faltamTempo(essenciaisFaltantes)) {
        return gerarMensagem(['Tempo'], 'Repetições e Séries', outrosFaltantes);
    }

    if (camposFaltantes.length === 1) {
        return `Por favor, preencha o seguinte campo: ${camposFaltantes[0]}`;
    }

    return `Por favor, preencha os seguintes campos: ${camposFaltantes.join(', ')}`;
}

// Verifica se todos os essenciais estão faltando
function todosEssenciaisFaltando(essenciaisFaltantes) {
    return essenciaisFaltantes.length === 3;
}

// Verifica se faltam Repetições e Séries
function faltamRepeticoesSeries(essenciaisFaltantes) {
    return essenciaisFaltantes.includes('Repetições') && essenciaisFaltantes.includes('Séries');
}

// Verifica se falta Tempo
function faltamTempo(essenciaisFaltantes) {
    return essenciaisFaltantes.includes('Tempo');
}

// Gera a mensagem de alerta com base nos parâmetros fornecidos
function gerarMensagem(camposPrincipais, campoAlternativo, outrosFaltantes) {
    let mensagem = `Por favor, preencha ${camposPrincipais.join(' e ')} ou ${campoAlternativo}.`;
    if (outrosFaltantes.length > 0) {
        mensagem += ` Além de ${outrosFaltantes.join(', ')}.`;
    }
    return mensagem;
}

// Função para configurar a lógica dos grupos de checkboxes
export function setupCheckboxGroupLogic(fieldId) {
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
                otherCheckboxes,
            });
        });
    });
}

// Função para manipular as mudanças nos checkboxes
export function handleCheckboxChange(
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

// Função para marcar todas as opções
export function marcarTodos(todosCheckbox, nenhumCheckbox, otherCheckboxes) {
    otherCheckboxes.forEach((cb) => (cb.checked = true));
    if (nenhumCheckbox) nenhumCheckbox.checked = false;
}

// Função para marcar nenhum
export function marcarNenhum(nenhumCheckbox, checkboxes, todosCheckbox) {
    checkboxes.forEach((cb) => {
        if (cb !== nenhumCheckbox) {
            cb.checked = false;
        }
    });
    if (todosCheckbox) todosCheckbox.checked = false;
}

// Função para atualizar outras opções
export function atualizarOutrasOpcoes(
    todosCheckbox,
    nenhumCheckbox,
    otherCheckboxes
) {
    const todasMarcadas = otherCheckboxes.every((cb) => cb.checked);

    if (todosCheckbox) {
        todosCheckbox.checked = todasMarcadas;
    }

    const algumaMarcada = otherCheckboxes.some((cb) => cb.checked);

    if (nenhumCheckbox && algumaMarcada) {
        nenhumCheckbox.checked = false;
    }

    if (todosCheckbox && !todasMarcadas) {
        todosCheckbox.checked = false;
    }
}

// Função para tratar seleção de todas as opções
export function handleAllSelected(selectedOptions, allOptions, allOptionValue) {
    const optionsWithoutAll = allOptions.filter(
        (option) => option !== allOptionValue
    );

    const allOptionsSelected = optionsWithoutAll.every((option) =>
        selectedOptions.includes(option)
    );

    if (allOptionsSelected) {
        return [allOptionValue];
    } else {
        return selectedOptions.filter((value) => value !== allOptionValue);
    }
}

// Função para atualizar a obrigatoriedade dos campos
export function updateFieldRequirements() {
    const tempoVal = document.getElementById('tempo-admin').value.trim();
    const repeticoesInput = document.getElementById('repeticoes');
    const seriesInput = document.getElementById('series');

    if (tempoVal === '') {
        // Tempo não preenchido, séries e repetições são obrigatórios
        repeticoesInput.dataset.required = "true";
        seriesInput.dataset.required = "true";
    } else {
        // Tempo preenchido, séries e repetições não são obrigatórios
        repeticoesInput.dataset.required = "false";
        seriesInput.dataset.required = "false";
    }
}

// Função para extrair dados do formulário
export function extractFormData() {
    const nome = document.getElementById('nome').value.trim();
    const explicacao = document.getElementById('explicacao').value.trim();

    const impulsoCheckboxes = document.querySelectorAll('input[name="impulso"]:checked');
    const impulsoSelectedOptions = Array.from(impulsoCheckboxes).map(
        (cb) => cb.value
    );

    const categoriaEtariaCheckboxes = document.querySelectorAll('input[name="etaria"]:checked');
    const categoriaEtariaSelectedOptions = Array.from(
        categoriaEtariaCheckboxes
    ).map((cb) => cb.value);

    const categoria = document.getElementById('categoria').value;
    const nivel = document.getElementById('nivel').value;
    const repeticoes = document.getElementById('repeticoes').value.replace(/\D/g, '') || null;
    const series = document.getElementById('series').value.replace(/\D/g, '') || null;
    const tempo = document.getElementById('tempo-admin').value.replace(/\D/g, '');
    return {
        nome,
        explicacao,
        impulsoSelectedOptions,
        categoriaEtariaSelectedOptions,
        categoria,
        nivel,
        repeticoes,
        series,
        tempo,
    };
}

// Função genérica para verificar se um campo está faltando
export function isCampoFaltante(valor) {
    return (
      valor === undefined ||
      valor === null ||
      (typeof valor === 'string' && valor.trim() === '') ||
      (Array.isArray(valor) && valor.length === 0)
    );
}
  
// Função genérica para validar dados do formulário
// Recebe o formData e uma lista de campos obrigatórios.
// Também recebe a lógica de obrigatoriedade adicional se 'tempo' não estiver preenchido.
export function validateFormData(formData, camposObrigatoriosBase) {
    // Copiamos a lógica de verificar se tempo não existe e então adicionar repeticoes e series
    const camposObrigatorios = [...camposObrigatoriosBase];
  
    if (!formData.tempo) {
      camposObrigatorios.push(
        { campo: 'repeticoes', nomeExibicao: 'Repetições' },
        { campo: 'series', nomeExibicao: 'Séries' }
      );
    }
  
    const camposFaltantes = camposObrigatorios
      .filter(({ campo }) => isCampoFaltante(formData[campo]))
      .map(({ nomeExibicao }) => nomeExibicao);
  
    if (camposFaltantes.length > 0) {
      const mensagem = construirMensagem(camposFaltantes);
      exibirAlerta('aviso', mensagem);
      return false;
    }
    return true;
}
  