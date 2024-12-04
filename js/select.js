export function inicializarSelecao({ containerId, selectionIndicatorId, hoverEffectTopId, hoverEffectBottomId }) {
  const container = document.getElementById(containerId);
  const options = container.querySelectorAll('.option');
  const selectionIndicator = document.getElementById(selectionIndicatorId);
  const hoverEffectTop = document.getElementById(hoverEffectTopId);
  const hoverEffectBottom = document.getElementById(hoverEffectBottomId);

  const gap = 0;

  function isColumnLayout() {
      return window.getComputedStyle(container).flexDirection === 'column';
  }

  function updateSelectionIndicator(element) {
    const rect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (isColumnLayout()) {
        // Layout em coluna (mobile)
        selectionIndicator.style.width = `${rect.width}px`;
        selectionIndicator.style.height = `${rect.height}px`;
        selectionIndicator.style.left = `${rect.left - containerRect.left}px`;
        selectionIndicator.style.top = `${rect.top - containerRect.top + 26}px`;
        selectionIndicator.style.transition = 'left 1s ease, top 1s ease, width 1s ease, height 1s ease';
    } else {
        // Layout em linha (desktop)
        selectionIndicator.style.width = `${rect.width}px`;
        selectionIndicator.style.height = `${rect.height}px`;
        selectionIndicator.style.left = `${rect.left - containerRect.left}px`;
        selectionIndicator.style.transition = 'left 1s ease, width 1s ease, height 1s ease';
    }
  }

  function updateHoverEffect(element, isHover = false) {
    const rect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (isColumnLayout()) {
      // Layout em coluna (mobile)
      const adjustedHeight = rect.height + gap;
      const adjustedTop = rect.top - containerRect.top - gap / 2;
      hoverEffectTop.style.height = `${adjustedHeight}px`;
      hoverEffectTop.style.top = `${adjustedTop}px`;
      hoverEffectTop.style.left = '0';
      hoverEffectTop.style.right = '';

      hoverEffectBottom.style.height = `${adjustedHeight}px`;
      hoverEffectBottom.style.top = `${adjustedTop}px`;
      hoverEffectBottom.style.right = '0';
      hoverEffectBottom.style.left = `calc(100% - ${hoverEffectBottom.offsetWidth}px)`;
    } else {
      // Layout em linha (desktop)
      const adjustedWidth = rect.width + gap;
      const adjustedLeft = rect.left - containerRect.left - gap / 2;
      hoverEffectTop.style.width = `${adjustedWidth}px`;
      hoverEffectTop.style.left = `${adjustedLeft}px`;
      hoverEffectTop.style.height = isHover ? `calc(50% - 25px)` : `calc(50% - 35px)`;

      hoverEffectBottom.style.width = `${adjustedWidth}px`;
      hoverEffectBottom.style.left = `${adjustedLeft}px`;
      hoverEffectBottom.style.height = isHover ? `calc(50% - 25px)` : `calc(50% - 35px)`;
    }
  }

  function updateHoverEffectToSelected() {
    const selected = container.querySelector('.option.selected');
    updateHoverEffect(selected);
  }

  const initialSelected = container.querySelector('.option.selected');
  updateSelectionIndicator(initialSelected);
  updateHoverEffectToSelected();

  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      updateSelectionIndicator(option);
    });

    option.addEventListener('mouseenter', () => {
      updateHoverEffect(option, true);
    });

    option.addEventListener('mouseleave', () => {
      updateHoverEffectToSelected();
    });
  });

  container.addEventListener('mouseleave', () => {
    updateHoverEffectToSelected();
  });

  // Atualiza o layout ao redimensionar a janela
  window.addEventListener('resize', () => {
      updateHoverEffectToSelected();
  });
}
