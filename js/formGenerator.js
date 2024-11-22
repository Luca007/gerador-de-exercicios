export function criarFormulario(campos, valoresIniciais = {}) {
  const form = document.createElement('form');
  form.className = 'mx-auto form-container';
  form.style.maxWidth = '500px';

  campos.forEach(field => {
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';

    if (field.type !== 'checkboxGroup') {
      const label = document.createElement('label');
      label.htmlFor = field.id;
      label.innerText = field.label;
      formGroup.appendChild(label);
    } else {
      const label = document.createElement('label');
      label.innerText = field.label;
      formGroup.appendChild(label);
    }

    const value = valoresIniciais[field.id] || '';

    if (field.type === 'textarea') {
      const input = document.createElement('textarea');
      input.id = field.id;
      input.rows = field.rows || 3;
      input.className = 'form-control';
      input.value = value;
      formGroup.appendChild(input);
    } else if (field.type === 'select') {
      const input = document.createElement('select');
      input.id = field.id;
      input.className = 'form-control';
      if (field.multiple) {
        input.multiple = true;
      }
      field.options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.innerText = optionValue.charAt(0).toUpperCase() + optionValue.slice(1);
        if (field.multiple && Array.isArray(value) && value.includes(optionValue)) {
          option.selected = true;
        } else if (optionValue === value) {
          option.selected = true;
        }
        input.appendChild(option);
      });
      formGroup.appendChild(input);
    } else if (field.type === 'checkboxGroup') {
      // Criação dos checkboxes personalizados
      const checkboxContainer = document.createElement('div');
      checkboxContainer.className = 'checkbox';
      const options = field.options;
      const valueArray = Array.isArray(value) ? value : [value];
      const isTodosSelected = valueArray.includes('todos');
      const isNenhumSelected = valueArray.includes('nenhum');
    
      options.forEach((optionValue, index) => {
        const checkboxId = `${field.id}_checkbox${index}`;
        const input = document.createElement('input');
        input.id = checkboxId;
        input.className = 'checkbox__input';
        input.type = 'checkbox';
        input.name = field.id; // mesmo nome para todos os checkboxes do grupo
        input.value = optionValue;
    
        if (isTodosSelected && optionValue !== 'nenhum') {
          // Se 'todos' está selecionado, marcar todas as opções, exceto 'nenhum'
          input.checked = true;
        } else if (isNenhumSelected && optionValue === 'nenhum') {
          // Se 'nenhum' está selecionado, marcar apenas 'nenhum'
          input.checked = true;
        } else if (valueArray.includes(optionValue)) {
          // Marcar as opções que estão no valor
          input.checked = true;
        }
    
        const label = document.createElement('label');
        label.htmlFor = checkboxId;
        label.className = 'checkbox__label';
    
        const span = document.createElement('span');
        span.className = 'checkbox__custom';
        label.appendChild(span);
        label.appendChild(document.createTextNode(optionValue.charAt(0).toUpperCase() + optionValue.slice(1)));
    
        checkboxContainer.appendChild(input);
        checkboxContainer.appendChild(label);
      });
      formGroup.appendChild(checkboxContainer);
    } else {
      const input = document.createElement('input');
      input.type = field.type;
      input.id = field.id;
      input.className = 'form-control';
      input.value = value;
      formGroup.appendChild(input);
    }

    form.appendChild(formGroup);
  });

  return form;
}
