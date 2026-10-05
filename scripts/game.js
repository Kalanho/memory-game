
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
    cards: [],          
    firstCard: null,    
    secondCard: null,  
    lockBoard: false,   
    moves: 0,          
    pairs: 0,           
    totalPairs: 8,
    closeTimer: null,   
    isGameOver: false,
  };
  // game.js
import { createElement } from './utils.js';
import { CARD_IMAGES, shuffle } from './game.js';

export function createBoard() {
  const board = createElement('div', 'board');
  const deck = shuffle([...CARD_IMAGES, ...CARD_IMAGES]); // 16 карточек

  deck.forEach((img, index) => {
    const card = createElement('button', 'card');
    card.dataset.imageId = img.id;
    card.dataset.index = index;
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