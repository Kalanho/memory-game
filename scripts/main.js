import { createElement, createButton } from './utils.js';
import { createBoard, onCardClick, state, resetState } from './game.js';
import { openModal, closeModal } from './modal.js';
import { saveResult, getResults, formatDate } from './storage.js';

const app = createElement('div', 'app');
document.body.append(app);

let movesEl = null;
let pairsEl = null;

function updateUI() {
  if (movesEl) movesEl.textContent = `Ходы: ${state.moves}`;
  if (pairsEl) pairsEl.textContent = `Пары: ${state.pairs} / ${state.totalPairs}`;
}

function createHeader(onNewGame, onShowLeaders) {
  const header = createElement('header', 'header');
  const title = createElement('h1', 'header__title', 'Memory Game');

  const newGameBtn = createButton('Новая игра', 'btn btn--new', 'Начать новую игру');
  newGameBtn.addEventListener('click', onNewGame);

  const leadersBtn = createButton('Таблица лидеров', 'btn btn--leaders', 'Открыть таблицу лидеров');
  leadersBtn.addEventListener('click', onShowLeaders);

  header.append(title, newGameBtn, leadersBtn);
  return header;
}

function createStats() {
  const stats = createElement('div', 'stats');
  movesEl = createElement('p', 'stats__moves', 'Ходы: 0');
  pairsEl = createElement('p', 'stats__pairs', 'Пары: 0 / 8');
  stats.append(movesEl, pairsEl);
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
    updateUI();
  }
  
  init();  