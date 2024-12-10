// Exportar o loader
export const loader = document.getElementById('loader');

// Função para exibir alerta e fechar ao clicar
export function exibirAlerta(tipo, mensagem) {
  const tipos = {
    sucesso: {
      bgColor: 'bg-green-100 dark:bg-green-900',
      borderColor: 'border-green-500 dark:border-green-700',
      textColor: 'text-green-900 dark:text-green-100',
      hoverColor: 'hover:bg-green-200 dark:hover:bg-green-800',
      iconColor: 'text-green-600',
      progressBarColor: 'bg-green-500',
    },
    info: {
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      borderColor: 'border-blue-500 dark:border-blue-700',
      textColor: 'text-blue-900 dark:text-blue-100',
      hoverColor: 'hover:bg-blue-200 dark:hover:bg-blue-800',
      iconColor: 'text-blue-600',
      progressBarColor: 'bg-blue-500',
    },
    aviso: {
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      borderColor: 'border-yellow-500 dark:border-yellow-700',
      textColor: 'text-yellow-900 dark:text-yellow-100',
      hoverColor: 'hover:bg-yellow-200 dark:hover:bg-yellow-800',
      iconColor: 'text-yellow-600',
      progressBarColor: 'bg-yellow-500',
    },
    erro: {
      bgColor: 'bg-red-100 dark:bg-red-900',
      borderColor: 'border-red-500 dark:border-red-700',
      textColor: 'text-red-900 dark:text-red-100',
      hoverColor: 'hover:bg-red-200 dark:hover:bg-red-800',
      iconColor: 'text-red-600',
      progressBarColor: 'bg-red-500',
    },
  };

  const tipoAlert = tipos[tipo] || tipos.info;
  createAlert(tipoAlert, mensagem);
}

function createAlert(tipoAlert, mensagem) {
  const alertaDiv = document.createElement('div');
  alertaDiv.className = `space-y-2 p-4 ${tipoAlert.bgColor} ${tipoAlert.borderColor} ${tipoAlert.textColor} rounded-lg flex flex-col items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 ${tipoAlert.hoverColor} shadow-lg`;
  alertaDiv.role = 'alert';
  alertaDiv.style.position = 'fixed';
  alertaDiv.style.top = '2vh';
  alertaDiv.style.left = '1vw';
  alertaDiv.style.zIndex = '1000';
  alertaDiv.style.maxWidth = '90%';
  alertaDiv.style.width = 'auto';

  const svgIcon = `
    <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" class="h-5 w-5 flex-shrink-0 mr-2 ${tipoAlert.iconColor}" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
    </svg>
  `;

  alertaDiv.innerHTML = `
    <div class="flex items-center">
      ${svgIcon}
      <p class="text-sm font-semibold">${mensagem}</p>
    </div>
    <div class="w-full h-1 bg-gray-300 mt-2 rounded-full overflow-hidden">
      <div class="h-full progress-bar ${tipoAlert.progressBarColor}"></div>
    </div>
  `;

  alertaDiv.onclick = function () {
    alertaDiv.style.display = 'none';
  };

  document.body.appendChild(alertaDiv);

  const progressBar = alertaDiv.querySelector('.progress-bar');
  progressBar.style.width = '0%';
  progressBar.style.transition = 'width 5s linear';

  // Começa a barra de progresso
  setTimeout(() => {
    progressBar.style.width = '100%';
  }, 10);

  // Esconde o alerta após 5 segundos
  setTimeout(() => {
    alertaDiv.style.display = 'none';
  }, 5000);
}

// Função para embaralhar arrays
export function embaralharArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Função para remover seções existentes
export function removeExistingSections() {
  const sections = ['login-section', 'admin-section', 'manage-section', 'edit-section'];
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) section.remove();
  });
}

// Função para aplicar máscaras de entrada usando Inputmask e jQuery
export function applyInputMasks() {
  // Aplica a máscara para multiplos campos mudando a quantidade de dígitos de cada um de forma otimizada
  const inputSettings = {
      'tempo-disponivel': 4,
      'tempo-admin': 4,
      'repeticoes': 3,
      'series': 3
  };
  
  Object.entries(inputSettings).forEach(([id, maxLength]) => {
      const inputField = document.getElementById(id);
      
      if (inputField) {
          inputField.addEventListener('input', function () {
              let value = this.value.replace(/\D/g, ''); // Remove os caracteres não numéricos
          
              if (value.length > maxLength) {
                  value = value.slice(0, maxLength); // Limite para máximo de digitos
              }
          
              let num = parseInt(value, 10) || 0;
          
              const maxVal = Math.pow(10, maxLength) - 1;
              if (num > maxVal) {
                  value = `${maxVal}`; // Valor máximo baseado no número máximo de dígitos
              } else if (num < 0) {
                  value = '0'; // Valor mínimo
              }
          
              this.value = value;
          });
      }
  });
}