const images = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝'];
const cards = [...images, ...images];

let flippedCards = [];
let matchedCards = 0;
let moves = 0;
let timer = null;
let timeLeft = 0;
let selectedTime = 2;
let gameActive = false;

const gameBoard = document.getElementById('game-board');
const movesCount = document.getElementById('moves-count');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restart');
const startGameButton = document.getElementById('start-game');
const setTimerButton = document.getElementById('set-timer');
const timerModal = document.getElementById('timer-modal');
const closeTimerModalButton = document.getElementById('close-timer-modal');
const timeOptions = document.querySelectorAll('.time-option');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const resultMessage = document.getElementById('result-message');

setTimerButton.addEventListener('click', () => timerModal.classList.remove('hidden'));
closeTimerModalButton.addEventListener('click', () => timerModal.classList.add('hidden'));

timeOptions.forEach(option => {
  option.addEventListener('click', e => {
    selectedTime = parseInt(e.target.dataset.time);
    timerDisplay.textContent = ${String(selectedTime).padStart(2, '0')}:00;
    startGameButton.disabled = false;
    timerModal.classList.add('hidden');
  });
});

startGameButton.addEventListener('click', initializeGame);
restartButton.addEventListener('click', initializeGame);

document.getElementById('play-again').addEventListener('click', () => {
  modal.classList.add('hidden');
  initializeGame();
});

function initializeGame() {
  clearInterval(timer);
  timer = null;

  flippedCards = [];
  matchedCards = 0;
  moves = 0;
  gameActive = true;

  timeLeft = selectedTime * 60;
  movesCount.textContent = '0';
  timerDisplay.textContent = ${String(selectedTime).padStart(2, '0')}:00;

  gameBoard.innerHTML = '';
  startGameButton.disabled = true;

  shuffle([...cards]).forEach(img => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${img}</div>
      </div>`;
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function flipCard() {
  if (!gameActive) return;

  const inner = this.querySelector('.card-inner');
  if (inner.classList.contains('flipped') || flippedCards.length === 2) return;

  if (!timer) startTimer();

  inner.classList.add('flipped');
  flippedCards.push(this);

  if (flippedCards.length === 2) checkMatch();
}

function checkMatch() {
  moves++;
  movesCount.textContent = moves;

  const [c1, c2] = flippedCards;
  const img1 = c1.querySelector('.card-back').textContent;
  const img2 = c2.querySelector('.card-back').textContent;

  if (img1 === img2) {
    matchedCards += 2;
    flippedCards = [];
    if (matchedCards === cards.length) endGame(true);
  } else {
    setTimeout(() => {
      c1.querySelector('.card-inner').classList.remove('flipped');
      c2.querySelector('.card-inner').classList.remove('flipped');
      flippedCards = [];
    }, 800);
  }
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const s = String(timeLeft % 60).padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;

    if (timeLeft <= 0) endGame(false);
  }, 1000);
}

function endGame(win) {
  clearInterval(timer);
  gameActive = false;

  modalTitle.textContent = win ? '🎉 You Win!' : '⏰ Time’s Up!';
  resultMessage.textContent = win
    ? You matched all cards in ${moves} moves.
    : 'Try again!';

  modal.classList.remove('hidden');
}
