// formUtils.js

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
  
  // Função para extrair dados do formulário
  export function extractFormData() {
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
      tempo,
    };
  }
  