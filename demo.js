/**
 * Demonstration controls for the accordion component.
 * This file shows how another developer can use the public API
 * without modifying the accordion implementation.
 */
(function () {
  'use strict';

  const accordionRoot = document.querySelector('[data-accordion]');
  const status = document.querySelector('.demo-status');
  const modeButton = document.querySelector('[data-action="toggle-mode"]');

  if (!accordionRoot || !accordionRoot.accordion) {
    // Fail safely: the page remains readable even if initialization failed.
    if (status) status.textContent = 'Accordion controls are unavailable.';
    return;
  }

  const accordion = accordionRoot.accordion;

  function showMessage(text) {
    if (status) status.textContent = text;
  }

  document.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;

      try {
        if (action === 'open-all') {
          accordion.openAll();
          showMessage('All accordion panels are open.');
        }

        if (action === 'close-all') {
          accordion.closeAll();
          showMessage('All accordion panels are closed.');
        }

        if (action === 'toggle-mode') {
          const currentMode = accordionRoot.dataset.accordionMode;
          const nextMode = currentMode === 'single' ? 'multiple' : 'single';
          accordion.setMode(nextMode);

          modeButton.textContent =
            nextMode === 'single'
              ? 'Switch to multiple-open mode'
              : 'Switch to single-open mode';

          showMessage(`Accordion mode changed to ${nextMode}-open.`);
        }
      } catch (error) {
        // Error handling prevents an unexpected component issue from breaking
        // the rest of the page.
        console.error('Accordion demo action failed:', error);
        showMessage('Something went wrong. Please try again.');
      }
    });
  });
})();
