export function inicializarSelecao({ containerId, selectionIndicatorId, hoverEffectTopId, hoverEffectBottomId }) {
    const container = document.getElementById(containerId);
    const options = container.querySelectorAll('.option');
    const selectionIndicator = document.getElementById(selectionIndicatorId);
    const hoverEffectTop = document.getElementById(hoverEffectTopId);
    const hoverEffectBottom = document.getElementById(hoverEffectBottomId);
  
    const gap = 0;
  
    function updateSelectionIndicator(element) {
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      selectionIndicator.style.width = `${rect.width}px`;
      selectionIndicator.style.height = `${rect.height}px`;
      selectionIndicator.style.left = `${rect.left - containerRect.left}px`;
      selectionIndicator.style.transition = 'left 1s ease, width 1s ease, height 1s ease';
    }
  
    function updateHoverEffectToSelected() {
      const selected = container.querySelector('.option.selected');
      const rect = selected.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const adjustedWidth = rect.width + gap;
      const adjustedLeft = rect.left - containerRect.left - (gap / 2);
      hoverEffectTop.style.width = `${adjustedWidth}px`;
      hoverEffectTop.style.left = `${adjustedLeft}px`;
      hoverEffectTop.style.height = `calc(50% - 30px)`;
      hoverEffectBottom.style.width = `${adjustedWidth}px`;
      hoverEffectBottom.style.left = `${adjustedLeft}px`;
      hoverEffectBottom.style.height = `calc(50% - 30px)`;
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
        const rect = option.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const adjustedWidth = rect.width + gap;
        const adjustedLeft = rect.left - containerRect.left - (gap / 2);
        hoverEffectTop.style.width = `${adjustedWidth}px`;
        hoverEffectTop.style.left = `${adjustedLeft}px`;
        hoverEffectBottom.style.width = `${adjustedWidth}px`;
        hoverEffectBottom.style.left = `${adjustedLeft}px`;
        hoverEffectTop.style.height = `calc(50% - 20px)`;
        hoverEffectBottom.style.height = `calc(50% - 20px)`;
      });
  
      option.addEventListener('mouseleave', () => {
        updateHoverEffectToSelected();
      });
    });
  
    container.addEventListener('mouseleave', () => {
      updateHoverEffectToSelected();
    });
}
  