/**
 * Accessible Accordion Component
 * --------------------------------
 * A reusable vanilla-JavaScript accordion with:
 * - Single-open or multiple-open behavior
 * - Smooth height animation
 * - Full keyboard navigation
 * - ARIA state management
 * - Progressive-enhancement fallback
 *
 * Usage:
 *   <div data-accordion data-accordion-mode="single" data-default-open="0">
 *     ...accordion items...
 *   </div>
 *
 * Public API (attached to each accordion root):
 *   accordion.open(index)
 *   accordion.close(index)
 *   accordion.toggle(index)
 *   accordion.openAll()
 *   accordion.closeAll()
 *   accordion.setMode("single" | "multiple")
 */
(function () {
  'use strict';

  // Remove the no-JS fallback class as soon as scripting is available.
  document.documentElement.classList.remove('no-js');

  /**
   * Create one accordion instance from a root element.
   * @param {HTMLElement} root - Element containing [data-accordion].
   * @returns {Object} Public methods for controlling this accordion.
   */
  function createAccordion(root) {
    const triggers = Array.from(root.querySelectorAll('.accordion-trigger'));
    const panels = triggers.map((trigger) => {
      const panelId = trigger.getAttribute('aria-controls');
      return document.getElementById(panelId);
    });

    // "single" allows one open panel; "multiple" allows any number.
    let mode = root.dataset.accordionMode === 'multiple' ? 'multiple' : 'single';

    // Validate that every trigger has a matching panel.
    const missingPanel = panels.some((panel) => !panel);
    if (missingPanel) {
      console.error('Accordion initialization failed: a trigger is missing its aria-controls panel.');
      return null;
    }

    /**
     * Set the visual height for animation.
     * @param {HTMLElement} panel
     * @param {string} state - "open" or "closed"
     */
    function setPanelHeight(panel, state) {
      if (state === 'open') {
        panel.style.height = `${panel.scrollHeight}px`;
      } else {
        panel.style.height = '0px';
      }
    }

    /**
     * Open a panel, closing others first when in single mode.
     * @param {number} index
     */
    function open(index) {
      const trigger = triggers[index];
      const panel = panels[index];
      if (!trigger || !panel || trigger.getAttribute('aria-expanded') === 'true') return;

      if (mode === 'single') {
        panels.forEach((otherPanel, otherIndex) => {
          if (otherIndex !== index) close(otherIndex);
        });
      }

      panel.hidden = false;
      panel.dataset.state = 'closed';
      setPanelHeight(panel, 'open');
      panel.classList.add('is-animating');

      // Clear the explicit height after the transition so the panel can
      // respond naturally if its content changes or the viewport resizes.
      panel.addEventListener(
        'transitionend',
        function handleTransitionEnd(event) {
          if (event.propertyName !== 'height') return;
          panel.style.height = 'auto';
          panel.classList.remove('is-animating');
          panel.removeEventListener('transitionend', handleTransitionEnd);
        }
      );

      trigger.setAttribute('aria-expanded', 'true');
      panel.dataset.state = 'open';
    }

    /**
     * Close a panel.
     * @param {number} index
     */
    function close(index) {
      const trigger = triggers[index];
      const panel = panels[index];
      if (!trigger || !panel || trigger.getAttribute('aria-expanded') === 'false') return;

      // Measure current height, lock it, then animate to zero.
      panel.style.height = `${panel.scrollHeight}px`;
      panel.classList.add('is-animating');

      // Force a style flush so the browser registers the starting height.
      void panel.offsetHeight;

      panel.style.height = '0px';
      trigger.setAttribute('aria-expanded', 'false');
      panel.dataset.state = 'closed';

      panel.addEventListener(
        'transitionend',
        function handleTransitionEnd(event) {
          if (event.propertyName !== 'height') return;
          panel.hidden = true;
          panel.classList.remove('is-animating');
          panel.style.height = '';
          panel.removeEventListener('transitionend', handleTransitionEnd);
        }
      );
    }

    /**
     * Toggle a panel by index.
     * @param {number} index
     */
    function toggle(index) {
      const trigger = triggers[index];
      if (!trigger) return;

      if (trigger.getAttribute('aria-expanded') === 'true') {
        close(index);
      } else {
        open(index);
      }
    }

    function openAll() {
      triggers.forEach((_, index) => open(index));
    }

    function closeAll() {
      triggers.forEach((_, index) => close(index));
    }

    /**
     * Change the accordion behavior at runtime.
     * @param {string} nextMode
     */
    function setMode(nextMode) {
      if (nextMode !== 'single' && nextMode !== 'multiple') {
        console.warn('Invalid accordion mode. Use "single" or "multiple".');
        return;
      }

      mode = nextMode;
      root.dataset.accordionMode = mode;

      // In single mode, retain only the first currently open panel.
      if (mode === 'single') {
        let firstOpenFound = false;
        triggers.forEach((trigger, index) => {
          const isOpen = trigger.getAttribute('aria-expanded') === 'true';
          if (isOpen && firstOpenFound) close(index);
          if (isOpen) firstOpenFound = true;
        });
      }
    }

    // Click handling: event delegation keeps listeners minimal.
    triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => toggle(index));

      // Keyboard support for arrow, Home, and End keys.
      trigger.addEventListener('keydown', (event) => {
        let targetIndex = null;

        if (event.key === 'ArrowDown') targetIndex = (index + 1) % triggers.length;
        if (event.key === 'ArrowUp') targetIndex = (index - 1 + triggers.length) % triggers.length;
        if (event.key === 'Home') targetIndex = 0;
        if (event.key === 'End') targetIndex = triggers.length - 1;

        if (targetIndex !== null) {
          event.preventDefault();
          triggers[targetIndex].focus();
        }
      });
    });

    // Open the configured default panel, if requested and valid.
    const defaultOpen = Number.parseInt(root.dataset.defaultOpen, 10);
    if (!Number.isNaN(defaultOpen) && triggers[defaultOpen]) {
      open(defaultOpen);
    }

    // Expose a small, testable public API.
    return { open, close, toggle, openAll, closeAll, setMode };
  }

  // Initialize every accordion on the page.
  document.querySelectorAll('[data-accordion]').forEach((root) => {
    const instance = createAccordion(root);
    if (instance) root.accordion = instance;
  });

  // Expose the factory for reuse in other pages or modules.
  window.createAccordion = createAccordion;
})();
