// Função para exibir alerta e fechar ao clicar
function exibirAlerta(tipo, mensagem) {
    const tipos = {
      sucesso: {
        bgColor: 'bg-green-100 dark:bg-green-900',
        borderColor: 'border-green-500 dark:border-green-700',
        textColor: 'text-green-900 dark:text-green-100',
        hoverColor: 'hover:bg-green-200 dark:hover:bg-green-800',
        iconColor: 'text-green-600',
      },
      info: {
        bgColor: 'bg-blue-100 dark:bg-blue-900',
        borderColor: 'border-blue-500 dark:border-blue-700',
        textColor: 'text-blue-900 dark:text-blue-100',
        hoverColor: 'hover:bg-blue-200 dark:hover:bg-blue-800',
        iconColor: 'text-blue-600',
      },
      aviso: {
        bgColor: 'bg-yellow-100 dark:bg-yellow-900',
        borderColor: 'border-yellow-500 dark:border-yellow-700',
        textColor: 'text-yellow-900 dark:text-yellow-100',
        hoverColor: 'hover:bg-yellow-200 dark:hover:bg-yellow-800',
        iconColor: 'text-yellow-600',
      },
      erro: {
        bgColor: 'bg-red-100 dark:bg-red-900',
        borderColor: 'border-red-500 dark:border-red-700',
        textColor: 'text-red-900 dark:text-red-100',
        hoverColor: 'hover:bg-red-200 dark:hover:bg-red-800',
        iconColor: 'text-red-600',
      },
    };
  
    const tipoAlert = tipos[tipo] || tipos.info;
  
    const alertaDiv = document.createElement('div');
    alertaDiv.className = `space-y-2 p-4 ${tipoAlert.bgColor} ${tipoAlert.borderColor} ${tipoAlert.textColor} rounded-lg flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 ${tipoAlert.hoverColor} shadow-lg`;
    alertaDiv.role = 'alert';
    alertaDiv.style.position = 'fixed';
    alertaDiv.style.top = '2dvh';
    alertaDiv.style.left = '1dvw';
    alertaDiv.style.zIndex = '1000';
    alertaDiv.style.maxWidth = '90%';
    alertaDiv.style.width = 'auto';
  
    const svgIcon = `
      <svg stroke="currentColor" viewBox="0 0 24 24" fill="none" class="h-5 w-5 flex-shrink-0 mr-2 ${tipoAlert.iconColor}" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path>
      </svg>
    `;
  
    alertaDiv.innerHTML = `
      ${svgIcon}
      <p class="text-sm font-semibold">${mensagem}</p>
    `;
  
    alertaDiv.onclick = function () {
      alertaDiv.style.display = 'none';
    };
  
    document.body.appendChild(alertaDiv);
  
    setTimeout(() => {
      alertaDiv.style.display = 'none';
    }, 5000);
}


// Função para embaralhar arrays
function embaralharArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  
  // Função para remover seções existentes
  function removeExistingSections() {
    const existingLogin = document.getElementById('login-section');
    if (existingLogin) existingLogin.remove();
  
    const existingAdmin = document.getElementById('admin-section');
    if (existingAdmin) existingAdmin.remove();
  
    const existingManage = document.getElementById('manage-section');
    if (existingManage) existingManage.remove();
  
    const existingEdit = document.getElementById('edit-section');
    if (existingEdit) existingEdit.remove();
}

// Função para aplicar máscaras de entrada
function applyInputMasks() {
    // Máscara para o campo 'Tempo (segundos)' no formulário de administração
    $('#tempo-admin').inputmask('integer', {
      rightAlign: false,
      placeholder: '',
      allowMinus: false,
      allowPlus: false,
      min: 0,
      max: 9999
    });
  
    // Máscara para o campo 'Tempo disponível' do formulário principal
    $('#tempo-disponivel').inputmask('integer', {
      rightAlign: false,
      placeholder: '',
      allowMinus: false,
      allowPlus: false,
      min: 1,
      max: 9999
    });
  
    // Máscara para o campo 'Repetições' no formulário de administração
    $('#repeticoes').inputmask('integer', {
      rightAlign: false,
      placeholder: '',
      allowMinus: false,
      allowPlus: false,
      min: 1,
      max: 9999
    });
  
    // Máscara para o campo 'Séries' no formulário de administração
    $('#series').inputmask('integer', {
      rightAlign: false,
      placeholder: '',
      allowMinus: false,
      allowPlus: false,
      min: 1,
      max: 9999
    });
}


// Quando o documento estiver pronto
$(document).ready(function() {
    applyInputMasks();
});