export function criarFormulario(campos, valoresIniciais = {}) {
  const form = document.createElement('form');
  form.className = 'mx-auto form-container';
  form.style.maxWidth = '500px';

  campos.forEach(field => {
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';

    const label = document.createElement('label');
    label.htmlFor = field.id;
    label.innerText = field.label;

    let input;
    const value = valoresIniciais[field.id] || '';

    if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.id = field.id;
      input.rows = field.rows || 3;
      input.className = 'form-control';
      input.value = value;
    } else if (field.type === 'select') {
      input = document.createElement('select');
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
    } else {
      input = document.createElement('input');
      input.type = field.type;
      input.id = field.id;
      input.className = 'form-control';
      input.value = value;
    }

    formGroup.appendChild(label);
    formGroup.appendChild(input);
    form.appendChild(formGroup);
  });

  return form;
}
