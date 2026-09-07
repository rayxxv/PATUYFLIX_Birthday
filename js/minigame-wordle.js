/* ==========================================================================
   PATUYFLIX — Wordle Minigame (minigame-wordle.js)
   Target Secret Word: "PNTAT" (5 letters)
   Rules:
   - 6 attempts
   - Green: Correct letter & correct position
   - Yellow: Letter exists in word but wrong position
   - Dark Gray: Letter not in word
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initWordleGame();
});

function initWordleGame() {
    const TARGET_WORD = 'PNTAT';
    const MAX_ATTEMPTS = 6;
    const WORD_LENGTH = 5;

    const board = document.getElementById('wordle-board');
    const keyboard = document.getElementById('wordle-keyboard');
    const messageEl = document.getElementById('wordle-message');
    const restartBtn = document.getElementById('wordle-restart-btn');
    const nextSuratBtn = document.getElementById('wordle-next-surat-btn');

    if (!board || !keyboard) return;

    let currentRow = 0;
    let currentCol = 0;
    let currentGuess = '';
    let isGameOver = false;
    let grid = Array(MAX_ATTEMPTS).fill(null).map(() => Array(WORD_LENGTH).fill(''));

    // Initialize/Reset Game
    function setupGame() {
        currentRow = 0;
        currentCol = 0;
        currentGuess = '';
        isGameOver = false;
        grid = Array(MAX_ATTEMPTS).fill(null).map(() => Array(WORD_LENGTH).fill(''));

        if (messageEl) {
            messageEl.textContent = 'Tebak 5 huruf kata rahasia! (6 kesempatan)';
            messageEl.className = 'wordle-message';
        }
        if (nextSuratBtn) {
            nextSuratBtn.style.display = 'none';
        }

        renderBoard();
        renderKeyboard();
    }

    // Render 6x5 Grid Board
    function renderBoard() {
        board.innerHTML = '';
        for (let r = 0; r < MAX_ATTEMPTS; r++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = `wordle-row row-${r}`;
            for (let c = 0; c < WORD_LENGTH; c++) {
                const tileDiv = document.createElement('div');
                tileDiv.className = 'wordle-tile';
                tileDiv.id = `tile-${r}-${c}`;
                tileDiv.textContent = grid[r][c] || '';
                rowDiv.appendChild(tileDiv);
            }
            board.appendChild(rowDiv);
        }
    }

    // Keyboard layout (QWERTY + ENTER + BACKSPACE)
    const KEY_ROWS = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
    ];

    function renderKeyboard() {
        keyboard.innerHTML = '';
        KEY_ROWS.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'wordle-key-row';
            row.forEach(key => {
                const btn = document.createElement('button');
                btn.className = 'wordle-key';
                btn.dataset.key = key;
                btn.textContent = key;
                if (key === 'ENTER' || key === '⌫') {
                    btn.classList.add('key-wide');
                }
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    handleInput(key === '⌫' ? 'BACKSPACE' : key);
                });
                rowDiv.appendChild(btn);
            });
            keyboard.appendChild(rowDiv);
        });
    }

    // Handle Letter / Input
    function handleInput(key) {
        if (isGameOver) return;

        if (key === 'BACKSPACE' || key === '⌫') {
            if (currentCol > 0) {
                currentCol--;
                currentGuess = currentGuess.slice(0, -1);
                grid[currentRow][currentCol] = '';
                const tile = document.getElementById(`tile-${currentRow}-${currentCol}`);
                if (tile) {
                    tile.textContent = '';
                    tile.classList.remove('tile-pop');
                }
            }
        } else if (key === 'ENTER') {
            if (currentGuess.length === WORD_LENGTH) {
                submitGuess();
            } else {
                showMessage('Kurang hurufnya! Harus 5 huruf yaa ✨', 'error');
                shakeRow(currentRow);
            }
        } else if (/^[A-Z]$/.test(key)) {
            if (currentCol < WORD_LENGTH) {
                grid[currentRow][currentCol] = key;
                currentGuess += key;
                const tile = document.getElementById(`tile-${currentRow}-${currentCol}`);
                if (tile) {
                    tile.textContent = key;
                    tile.classList.add('tile-pop');
                }
                currentCol++;
            }
        }
    }

    // Physical Keyboard Listener
    function handlePhysicalKey(e) {
        if (isGameOver) return;
        const key = e.key.toUpperCase();
        if (key === 'BACKSPACE') {
            handleInput('BACKSPACE');
        } else if (key === 'ENTER') {
            handleInput('ENTER');
        } else if (/^[A-Z]$/.test(key) && key.length === 1) {
            handleInput(key);
        }
    }

    // Remove existing listener if any to avoid duplication
    window.removeEventListener('keydown', handlePhysicalKey);
    window.addEventListener('keydown', handlePhysicalKey);

    // Shake animation when word is incomplete
    function shakeRow(rowIdx) {
        const rowEl = document.querySelector(`.row-${rowIdx}`);
        if (rowEl) {
            rowEl.classList.remove('row-shake');
            void rowEl.offsetWidth; // trigger reflow
            rowEl.classList.add('row-shake');
        }
    }

    // Show status message with styles
    function showMessage(text, type = 'info') {
        if (!messageEl) return;
        messageEl.textContent = text;
        messageEl.className = `wordle-message msg-${type}`;
    }

    // Submit and Evaluate Guess
    function submitGuess() {
        const guess = currentGuess.toUpperCase();
        const target = TARGET_WORD;
        const letterStatus = Array(WORD_LENGTH).fill('absent'); // 'correct' | 'present' | 'absent'

        const targetLetterCount = {};
        for (let char of target) {
            targetLetterCount[char] = (targetLetterCount[char] || 0) + 1;
        }

        // 1st Pass: Find exact matches (Green / Correct)
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (guess[i] === target[i]) {
                letterStatus[i] = 'correct';
                targetLetterCount[guess[i]]--;
            }
        }

        // 2nd Pass: Find present letters in wrong positions (Yellow / Present)
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (letterStatus[i] !== 'correct') {
                if (targetLetterCount[guess[i]] > 0) {
                    letterStatus[i] = 'present';
                    targetLetterCount[guess[i]]--;
                }
            }
        }

        // Animate tile flips row-by-row
        for (let i = 0; i < WORD_LENGTH; i++) {
            const tile = document.getElementById(`tile-${currentRow}-${i}`);
            const status = letterStatus[i];
            const char = guess[i];

            if (tile) {
                setTimeout(() => {
                    tile.classList.add('tile-flip', `tile-${status}`);
                    updateKeyboardKey(char, status);
                }, i * 200);
            }
        }

        // Check Win/Loss after animation finishes
        setTimeout(() => {
            if (guess === target) {
                isGameOver = true;
                showMessage('🎉 BENARRR! Katanya adalah "PNTAT" 🍑🤣 Horeee Patuy pintar bangett! 💕', 'win');
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 75,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
                if (nextSuratBtn) {
                    nextSuratBtn.style.display = 'inline-flex';
                }
            } else if (currentRow === MAX_ATTEMPTS - 1) {
                isGameOver = true;
                showMessage(`Awww kesempatan habis! Katanya adalah "${TARGET_WORD}" 🍑🤣 Coba lagi yaa!`, 'lose');
                if (nextSuratBtn) {
                    nextSuratBtn.style.display = 'inline-flex';
                }
            } else {
                currentRow++;
                currentCol = 0;
                currentGuess = '';
            }
        }, WORD_LENGTH * 200 + 100);
    }

    // Update Keyboard Key Color
    function updateKeyboardKey(letter, status) {
        const keyBtn = document.querySelector(`.wordle-key[data-key="${letter}"]`);
        if (!keyBtn) return;

        // Correct overrides present, present overrides absent
        if (keyBtn.classList.contains('key-correct')) return;
        if (keyBtn.classList.contains('key-present') && status === 'absent') return;

        keyBtn.classList.remove('key-present', 'key-absent');
        keyBtn.classList.add(`key-${status}`);
    }

    if (restartBtn) {
        restartBtn.onclick = () => {
            setupGame();
        };
    }

    setupGame();
}
