import './firebase.js';
import './utils.js';
import './auth.js';
import './select.js';
import './admin.js';
import './showPassword.js';
import './exercicio.js';
import './treino.js';

// Aplicar máscaras de entrada ao carregar a página
import { applyInputMasks } from './utils.js';
import { inicializarSelecao } from './select.js';

$(document).ready(function() {
  applyInputMasks();

  // Inicializar o primeiro seletor
  inicializarSelecao({
    containerId: 'optionsContainer1',
    selectionIndicatorId: 'selectionIndicator1',
    hoverEffectTopId: 'hoverEffectTop1',
    hoverEffectBottomId: 'hoverEffectBottom1'
  });

  // Inicializar o segundo seletor
  inicializarSelecao({
    containerId: 'optionsContainer2',
    selectionIndicatorId: 'selectionIndicator2',
    hoverEffectTopId: 'hoverEffectTop2',
    hoverEffectBottomId: 'hoverEffectBottom2'
  });
});

window.addEventListener('load', function() {
  // Esconde o loader após o carregamento da página
  document.getElementById('loader').style.display = 'none';
});
