# Accessible FAQ Accordion

An interactive, responsive, and accessible FAQ accordion built with semantic HTML5, modern CSS, and vanilla JavaScript.

## Component choice

An accordion was selected because it improves user experience when a page contains related but non-essential information. Users can scan question titles first and expand only the answers they need, reducing visual clutter without hiding important content permanently.

## Files

- `index.html` — semantic markup, ARIA attributes, and component examples.
- `styles.css` — component styling, animation, responsive layout, and fallback states.
- `accordion.js` — reusable accordion component and public JavaScript API.
- `demo.js` — demonstration controls that use the component API.

## Features

- Single-open or multiple-open modes
- Smooth height animation
- Keyboard navigation with `Tab`, `Enter`, `Space`, `Arrow Up`, `Arrow Down`, `Home`, and `End`
- ARIA attributes: `aria-expanded`, `aria-controls`, `role="region"`, and `aria-labelledby`
- Focus-visible styling
- Reduced-motion support
- No-JavaScript fallback that displays all answers
- Reusable public API: `open`, `close`, `toggle`, `openAll`, `closeAll`, and `setMode`

## How to use

1. Unzip the archive.
2. Open `index.html` in a modern browser.
3. Click an accordion header or use the keyboard to expand and collapse answers.
4. Use the demonstration buttons to open all panels, close all panels, or switch between single-open and multiple-open behavior.

## Reuse in another project

Add an accordion root with `data-accordion`:

```html
<div data-accordion data-accordion-mode="single" data-default-open="0">
  <!-- Add accordion items using the same trigger/panel structure -->
</div>
```

Each trigger must include:

```html
<button class="accordion-trigger" aria-expanded="false" aria-controls="panel-id">
  Question text
</button>
```

Each panel must have a matching ID:

```html
<div class="accordion-panel" id="panel-id" role="region" aria-labelledby="trigger-id" hidden>
  <div class="accordion-panel-inner">Answer content</div>
</div>
```

Then initialize it:

```js
const accordion = createAccordion(document.querySelector('[data-accordion]'));
accordion.toggle(0);
```

## Error handling and fallbacks

- The component validates that each trigger has a corresponding panel and logs a clear console error if one is missing.
- Invalid mode values are rejected with a console warning.
- Demo actions are wrapped in `try...catch` so an unexpected issue does not break the page.
- If JavaScript is unavailable, the `.no-js` CSS fallback reveals every panel and hides the toggle icons.
- If CSS transitions are unsupported, panels still open and close because the component updates `hidden`, ARIA state, and height directly.

## Testing checklist

- Test at 320px, 375px, 768px, and 1280px viewport widths.
- Confirm that only one panel opens in single mode.
- Switch to multiple-open mode and verify several panels can remain open.
- Navigate using only the keyboard.
- Test with a screen reader where available.
- Disable JavaScript and confirm that all answers remain visible.
- Enable “Reduce motion” in the operating system and confirm animation is minimized.
