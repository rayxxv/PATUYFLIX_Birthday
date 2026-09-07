/* ==========================================================================
   Fase 5: Photo Puzzle Minigame Logic (minigame-puzzle.js)
   Sliding 3x3 Puzzle Game
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPuzzleGame();
});

function initPuzzleGame() {
    const board = document.getElementById('puzzle-board');
    const resetBtn = document.getElementById('reset-puzzle-btn');
    const nextToWishes = document.getElementById('next-to-wishes');
    const wishesSection = document.getElementById('wishes-section');

    if (!board) return;

    // 3x3 Grid State (numbers 1-8 and empty tile 0)
    let tiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function renderBoard() {
        board.innerHTML = '';
        tiles.forEach((val, idx) => {
            const tile = document.createElement('div');
            tile.className = 'puzzle-tile' + (val === 0 ? ' empty' : '');
            if (val !== 0) {
                tile.innerText = val;
            }
            tile.addEventListener('click', () => moveTile(idx));
            board.appendChild(tile);
        });
    }

    function moveTile(idx) {
        const emptyIdx = tiles.indexOf(0);
        const validMoves = [idx - 1, idx + 1, idx - 3, idx + 3];

        if (validMoves.includes(emptyIdx)) {
            // Swap
            [tiles[idx], tiles[emptyIdx]] = [tiles[emptyIdx], tiles[idx]];
            renderBoard();
            checkWin();
        }
    }

    function checkWin() {
        const winState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        const isWin = tiles.every((val, index) => val === winState[index]);

        if (isWin) {
            setTimeout(() => {
                alert('🧩 HOREEE! Puzzle Berhasil Disusun! 🎉\nKamu pinter banget sayang! 💕');
            }, 300);
        }
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            tiles = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 0]);
            renderBoard();
        });
    }

    if (nextToWishes && wishesSection) {
        nextToWishes.addEventListener('click', () => {
            wishesSection.classList.remove('hidden-section');
            wishesSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Initial shuffle & render
    tiles = shuffle(tiles);
    renderBoard();
}
