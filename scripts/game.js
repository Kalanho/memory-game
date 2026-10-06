import { createElement } from './utils.js';

export const CARD_IMAGES = [
  { id: 'apple', emoji: '🍎' },
  { id: 'banana', emoji: '🍌' },
  { id: 'cherry', emoji: '🍒' },
  { id: 'grape', emoji: '🍇' },
  { id: 'lemon', emoji: '🍋' },
  { id: 'melon', emoji: '🍉' },
  { id: 'peach', emoji: '🍑' },
  { id: 'pear', emoji: '🍐' },
];

export const state = {
  firstCard: null,
  secondCard: null,
  lockBoard: false,
  moves: 0,
  pairs: 0,
  totalPairs: CARD_IMAGES.length,
  closeTimer: null,
  isGameOver: false,
};

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createBoard() {
  const board = createElement('div', 'board');
  const deck = shuffle([...CARD_IMAGES, ...CARD_IMAGES]);

  deck.forEach((img) => {
    const card = createElement('button', 'card');
    card.type = 'button';
    card.dataset.imageId = img.id;
    card.setAttribute('aria-label', 'Закрытая карточка');

    const inner = createElement('div', 'card__inner');
    const front = createElement('div', 'card__front', img.emoji);
    const back = createElement('div', 'card__back', '?');

    inner.append(front, back);
    card.append(inner);
    board.append(card);
  });

  return board;
}

export function onCardClick(card, updateUI, onWin) {
  if (state.lockBoard) return;
  if (state.isGameOver) return;
  if (card.classList.contains('card--flipped')) return;
  if (card.classList.contains('card--matched')) return;

  card.classList.add('card--flipped');

  if (!state.firstCard) {
    state.firstCard = card;
    return;
  }

  state.secondCard = card;
  state.moves++;
  updateUI();

  if (state.firstCard.dataset.imageId === card.dataset.imageId) {
    state.firstCard.classList.add('card--matched');
    card.classList.add('card--matched');
    state.pairs++;
    state.firstCard = null;
    state.secondCard = null;
    updateUI();

    if (state.pairs === state.totalPairs) {
      state.isGameOver = true;
      onWin(state.moves);
    }
  } else {
    state.lockBoard = true;
    state.closeTimer = setTimeout(() => {
      if (state.firstCard) state.firstCard.classList.remove('card--flipped');
      if (state.secondCard) state.secondCard.classList.remove('card--flipped');
      state.firstCard = null;
      state.secondCard = null;
      state.lockBoard = false;
      state.closeTimer = null;
    }, 1000);
  }
}

export function resetState() {
  if (state.closeTimer) {
    clearTimeout(state.closeTimer);
    state.closeTimer = null;
  }
  state.firstCard = null;
  state.secondCard = null;
  state.lockBoard = false;
  state.moves = 0;
  state.pairs = 0;
  state.isGameOver = false;
}