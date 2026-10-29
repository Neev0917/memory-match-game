const emojis = ['🐶', '🐱', '🦊', '🐼', '🦁', '🐵', '🐰', '🐨'];
const grid = document.getElementById('game-grid');
const flipsEl = document.getElementById('flips');
const matchesEl = document.getElementById('matches');
const restartBtn = document.getElementById('restart-btn');
const winMessageEl = document.getElementById('win-message');

let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let flips = 0;
let matches = 0;

// Initialize and shuffle the game
function startGame() {
    grid.innerHTML = '';
    flips = 0;
    matches = 0;
    flipsEl.textContent = flips;
    matchesEl.textContent = matches;
    winMessageEl.textContent = '';
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;

    // Double the array to make pairs and shuffle them
    const gameCards = [...emojis, ...emojis]
        .sort(() => Math.random() - 0.5);

    // Create DOM elements for cards
    gameCards.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;

        card.innerHTML = `
            <div class="card-face card-front">?</div>
            <div class="card-face card-back">${emoji}</div>
        `;

        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

// Flip card logic
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        // First click
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Second click
    secondCard = this;
    flips++;
    flipsEl.textContent = flips;

    checkForMatch();
}

// Check if two cards match
function checkForMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

    isMatch ? disableCards() : unflipCards();
}

// If cards match, remove event listeners and keep them flipped
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matches++;
    matchesEl.textContent = matches;

    resetBoard();

    // Check for win condition
    if (matches === emojis.length) {
        winMessageEl.textContent = `🎉 You won in ${flips} flips!`;
    }
}

// If cards don't match, flip them back after a short delay
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');

        resetBoard();
    }, 1000); // 1 second delay so the user can memorize the card
}

// Reset board variables for the next turn
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

restartBtn.addEventListener('click', startGame);

// Run game on load
startGame();