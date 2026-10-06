import { createElement, createButton } from './utils.js';
import { createBoard, onCardClick, state, resetState } from './game.js';
import { openModal, closeModal } from './modal.js';
import { saveResult, getResults, formatDate } from './storage.js';

const app = createElement('div', 'app');
document.body.append(app);

let movesEl = null;
let pairsEl = null;
let themeToggle = null;


function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'
    );
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('memory-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('memory-theme', next);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('memory-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function updateUI() {
  if (movesEl) movesEl.textContent = String(state.moves);
  if (pairsEl) pairsEl.textContent = `${state.pairs} / ${state.totalPairs}`;
}

function createHeader(onNewGame, onShowLeaders) {
  const header = createElement('header', 'header');
  const title = createElement('h1', 'header__title', 'Memory Game');

  const actions = createElement('div', 'header__actions');

  themeToggle = createButton('🌙', 'btn btn--theme', 'Переключить тему');

  const newGameBtn = createButton('Новая игра', 'btn btn--new', 'Начать новую игру');
  newGameBtn.addEventListener('click', onNewGame);

  const leadersBtn = createButton('Таблица лидеров', 'btn btn--leaders', 'Открыть таблицу лидеров');
  leadersBtn.addEventListener('click', onShowLeaders);

  actions.append(themeToggle, newGameBtn, leadersBtn);
  header.append(title, actions);
  return header;
}


function createStats() {
  const stats = createElement('div', 'stats');

  const movesBox = createElement('div', 'stats__box');
  const movesValue = createElement('span', 'stats__value', '0');
  const movesLabel = createElement('span', 'stats__label', 'Ходы');
  movesBox.append(movesValue, movesLabel);

  const pairsBox = createElement('div', 'stats__box');
  const pairsValue = createElement('span', 'stats__value', '0 / 8');
  const pairsLabel = createElement('span', 'stats__label', 'Пары');
  pairsBox.append(pairsValue, pairsLabel);

  stats.append(movesBox, pairsBox);

  movesEl = movesValue;
  pairsEl = pairsValue;

  return stats;
}

function bindBoardEvents(board) {
  board.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    onCardClick(card, updateUI, showWinModal);
  });
}


function showWinModal(moves) {
  saveResult(moves);
  openModal({
    title: 'Победа!',
    content: `Вы нашли все пары за ${moves} ходов.`,
    actions: [
      {
        text: 'Новая игра',
        className: 'btn btn--primary',
        onClick: () => {
          closeModal();
          startNewGame();
        },
      },
      { text: 'Закрыть', className: 'btn', onClick: closeModal },
    ],
  });
}

function showLeadersModal() {
  const results = getResults();
  let content;

  if (results.length === 0) {
    content = 'Пока нет результатов';
  } else {
    const table = createElement('table', 'leaders');
    const thead = createElement('thead');
    const headRow = createElement('tr');
    ['Место', 'Ходы', 'Дата'].forEach((t) => {
      headRow.append(createElement('th', null, t));
    });
    thead.append(headRow);

    const tbody = createElement('tbody');
    results.forEach((r, i) => {
      const row = createElement('tr');
      row.append(
        createElement('td', null, String(i + 1)),
        createElement('td', null, String(r.moves)),
        createElement('td', null, formatDate(r.date))
      );
      tbody.append(row);
    });

    table.append(thead, tbody);
    content = table;
  }

  openModal({
    title: 'Таблица лидеров',
    content,
    actions: [{ text: 'Закрыть', className: 'btn', onClick: closeModal }],
  });
}


function startNewGame() {
  resetState();
  closeModal();

  const oldBoard = document.querySelector('.board');
  const newBoard = createBoard();

  if (oldBoard) {
    oldBoard.replaceWith(newBoard);
  } else {
    app.append(newBoard);
  }

  bindBoardEvents(newBoard);
  updateUI();
}


function init() {
  const header = createHeader(startNewGame, showLeadersModal);
  const stats = createStats();
  app.append(header, stats);

  const board = createBoard();
  app.append(board);
  bindBoardEvents(board);

  initTheme();
  updateUI();
}

init();