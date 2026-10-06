export function createElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

export function createButton(text, className, ariaLabel) {
  const btn = createElement('button', className, text);
  if (ariaLabel) btn.setAttribute('aria-label', ariaLabel);
  return btn;
}