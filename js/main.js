// Importar os módulos necessários
import './firebase.js';
import './auth.js';
import './utils.js';
import './select.js';
import './admin.js';
import './exercicio.js';
import './treino.js';

import { applyInputMasks } from './utils.js';
import { inicializarSelecao } from './select.js';

// Aplicar máscaras de entrada e inicializar seleções ao carregar o documento
$(document).ready(function () {
  // Aplicar máscaras de entrada
  applyInputMasks();

  // Inicializar o primeiro seletor
  inicializarSelecao({
    containerId: 'optionsContainer1',
    selectionIndicatorId: 'selectionIndicator1',
    hoverEffectTopId: 'hoverEffectTop1',
    hoverEffectBottomId: 'hoverEffectBottom1',
  });

  // Inicializar o segundo seletor
  inicializarSelecao({
    containerId: 'optionsContainer2',
    selectionIndicatorId: 'selectionIndicator2',
    hoverEffectTopId: 'hoverEffectTop2',
    hoverEffectBottomId: 'hoverEffectBottom2',
  });
});

