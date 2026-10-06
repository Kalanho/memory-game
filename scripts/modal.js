import { createElement, createButton } from './utils.js';

let activeModal = null;

export function openModal({ title, content, actions = [] }) {
  if (activeModal) closeModal();

  const overlay = createElement('div', 'modal-overlay');
  const modal = createElement('div', 'modal');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  const titleEl = createElement('h2', 'modal__title', title);
  const body = createElement('div', 'modal__body');

  if (typeof content === 'string') {
    body.textContent = content;
  } else if (content) {
    body.append(content);
  }

  const footer = createElement('div', 'modal__footer');
  actions.forEach(({ text, className, onClick, ariaLabel }) => {
    const btn = createButton(text, className, ariaLabel);
    btn.addEventListener('click', onClick);
    footer.append(btn);
  });

  modal.append(titleEl, body, footer);
  overlay.append(modal);
  document.body.append(overlay);
  document.body.classList.add('no-scroll');

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  const onKey = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', onKey);

  activeModal = { overlay, onKey };
}

export function closeModal() {
  if (!activeModal) return;
  const { overlay, onKey } = activeModal;
  document.removeEventListener('keydown', onKey);
  if (overlay && overlay.parentNode) overlay.remove();
  document.body.classList.remove('no-scroll');
  activeModal = null;
}