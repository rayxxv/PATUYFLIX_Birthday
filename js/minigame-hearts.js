/* ==========================================================================
   PATUYFLIX — Tangkap Hati Minigame (minigame-hearts.js)
   Target: Patuy 💕 (Minimum 300 Points to Unlock Galeri Foto)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeartsGame();
});

function initHeartsGame() {
    const canvas = document.getElementById('hearts-game-canvas');
    const startBtn = document.getElementById('start-hearts-btn');
    const scoreEl = document.getElementById('hearts-score');
    const timerEl = document.getElementById('hearts-timer');
    const statusMsgEl = document.getElementById('game-status-msg');
    const nextGameCard = document.getElementById('next-game-cta-card');
    const ctaHeadline = document.getElementById('cta-headline');

    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const TARGET_SCORE = 1000;
    let score = 0;
    let timeLeft = 30;
    let gameInterval = null;
    let timerInterval = null;
    let spawnCounter = 0;
    let isRunning = false;
    let flashRed = 0;

    // Smooth paddle
    const basket = {
        x: canvas.width / 2 - 30,
        y: canvas.height - 24,
        width: 60,
        height: 14
    };

    let hearts = [];
    let popups = []; // Floating text +15, -25 etc.

    // Controls (Mouse & Touch)
    function handlePointerMove(clientX) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        basket.x = (clientX - rect.left) * scaleX - basket.width / 2;
        basket.x = Math.max(0, Math.min(canvas.width - basket.width, basket.x));
    }

    canvas.addEventListener('mousemove', (e) => {
        handlePointerMove(e.clientX);
    });

    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            e.preventDefault();
            handlePointerMove(e.touches[0].clientX);
        }
    }, { passive: false });

    function spawnHeart() {
        const rand = Math.random();
        let item;

        if (rand < 0.18) {
            // 18% Chance for Bomb (Must Avoid)
            item = { emoji: '💣', val: -750, isBad: true, speed: 3.2, size: 26 };
        } else if (rand < 0.50) {
            // 32% Pink Heart (+15)
            item = { emoji: '💖', val: 15, isBad: false, speed: 2.8, size: 24 };
        } else if (rand < 0.76) {
            // 26% Double Heart (+25)
            item = { emoji: '💕', val: 25, isBad: false, speed: 3.2, size: 24 };
        } else if (rand < 0.90) {
            // 14% Gold Star (+40)
            item = { emoji: '⭐', val: 40, isBad: false, speed: 3.6, size: 24 };
        } else {
            // 10% Birthday Cake (+60)
            item = { emoji: '🎂', val: 60, isBad: false, speed: 3.4, size: 26 };
        }

        hearts.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: -15,
            size: item.size,
            speed: item.speed + Math.random() * 0.8,
            emoji: item.emoji,
            val: item.val,
            isBad: item.isBad
        });
    }

    function addPopup(text, x, y, isBad) {
        popups.push({
            text: text,
            x: x,
            y: y,
            color: isBad ? '#ef4444' : '#10b981',
            alpha: 1.0,
            life: 30
        });
    }

    function updateGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Flash red screen if bomb hit
        if (flashRed > 0) {
            ctx.fillStyle = `rgba(239, 68, 68, ${flashRed * 0.25})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            flashRed--;
        }

        // Spawn items every 20 frames (~3 items per sec)
        spawnCounter++;
        if (spawnCounter % 20 === 0) {
            spawnHeart();
        }

        // Draw Basket Paddle (Cute glowing pill)
        ctx.fillStyle = '#e50914';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff2a44';
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(basket.x, basket.y, basket.width, basket.height, 8);
        } else {
            ctx.rect(basket.x, basket.y, basket.width, basket.height);
        }
        ctx.fill();

        // Paddle inner highlight
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(basket.x + 4, basket.y + 2, basket.width - 8, 3, 2);
        } else {
            ctx.rect(basket.x + 4, basket.y + 2, basket.width - 8, 3);
        }
        ctx.fill();

        // Update & Draw Falling Items
        for (let i = hearts.length - 1; i >= 0; i--) {
            const h = hearts[i];
            h.y += h.speed;

            // Draw Emoji
            ctx.font = `${h.size}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(h.emoji, h.x, h.y);

            // Collision Detection with Paddle
            if (
                h.y >= basket.y - 12 &&
                h.y <= basket.y + basket.height + 6 &&
                h.x >= basket.x - 12 &&
                h.x <= basket.x + basket.width + 12
            ) {
                // Update Score
                score = Math.max(0, score + h.val);
                if (scoreEl) scoreEl.innerText = score;

                // Visual feedback
                if (h.isBad) {
                    flashRed = 6;
                    addPopup(`${h.val}`, h.x, basket.y - 10, true);
                } else {
                    addPopup(`+${h.val}`, h.x, basket.y - 10, false);
                }

                hearts.splice(i, 1);
                continue;
            }

            // Remove fallen
            if (h.y > canvas.height + 20) {
                hearts.splice(i, 1);
            }
        }

        // Draw floating text popups
        for (let p = popups.length - 1; p >= 0; p--) {
            const pop = popups[p];
            pop.y -= 1.2;
            pop.alpha -= 0.03;
            pop.life--;

            ctx.save();
            ctx.globalAlpha = Math.max(0, pop.alpha);
            ctx.font = 'bold 16px "Montserrat", sans-serif';
            ctx.fillStyle = pop.color;
            ctx.textAlign = 'center';
            ctx.fillText(pop.text, pop.x, pop.y);
            ctx.restore();

            if (pop.life <= 0 || pop.alpha <= 0) {
                popups.splice(p, 1);
            }
        }
    }

    function startGame() {
        if (isRunning) return;
        isRunning = true;
        score = 0;
        timeLeft = 30;
        spawnCounter = 0;
        hearts = [];
        popups = [];
        flashRed = 0;

        if (scoreEl) scoreEl.innerText = score;
        if (timerEl) timerEl.innerText = timeLeft;
        if (startBtn) startBtn.innerText = '🔄 RESTART 🎮';
        if (statusMsgEl) {
            statusMsgEl.innerHTML = '🎮 <span style="color:#ffd1dc;">Kumpulkan minimal 1000 poin! Tangkap hati & hindari bom!</span>';
        }
        if (nextGameCard) {
            nextGameCard.style.display = 'none';
        }

        gameInterval = setInterval(updateGame, 1000 / 60);

        timerInterval = setInterval(() => {
            timeLeft--;
            if (timerEl) timerEl.innerText = timeLeft;

            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        isRunning = false;
        clearInterval(gameInterval);
        clearInterval(timerInterval);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const isWin = score >= TARGET_SCORE;

        if (isWin) {
            // Success / Won
            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 18px "Montserrat", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('TARGET TERCAPAI! 🎉', canvas.width / 2, canvas.height / 2 - 20);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px "Montserrat", sans-serif';
            ctx.fillText(`SKOR AKHIR: ${score}`, canvas.width / 2, canvas.height / 2 + 15);

            ctx.fillStyle = '#ffd1dc';
            ctx.font = '13px "Montserrat", sans-serif';
            ctx.fillText('Galeri Foto siap dibuka!', canvas.width / 2, canvas.height / 2 + 45);

            if (statusMsgEl) {
                statusMsgEl.innerHTML = `🎉 <strong style="color: #10b981;">Hebat! Skor kamu ${score} poin.</strong> Target 1000 poin tercapai!`;
            }

            if (nextGameCard) {
                nextGameCard.style.display = 'block';
                nextGameCard.style.background = 'rgba(16, 185, 129, 0.15)';
                nextGameCard.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                if (ctaHeadline) {
                    ctaHeadline.innerHTML = `🎉 Selamat! Target 1000 Poin Berhasil Tercapai (Skor: ${score})! 👇`;
                }
                setTimeout(() => {
                    nextGameCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }

            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        } else {
            // Failed / Under Target
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 18px "Montserrat", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('WAKTU HABIS! ⏰', canvas.width / 2, canvas.height / 2 - 20);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px "Montserrat", sans-serif';
            ctx.fillText(`SKOR: ${score} / ${TARGET_SCORE}`, canvas.width / 2, canvas.height / 2 + 15);

            ctx.fillStyle = '#fbbf24';
            ctx.font = '12px "Montserrat", sans-serif';
            ctx.fillText('Kurang sedikit lagi! Coba sekali lagi ya!', canvas.width / 2, canvas.height / 2 + 42);

            if (statusMsgEl) {
                statusMsgEl.innerHTML = `⚠️ <span style="color: #fca5a5;">Skor kamu ${score} poin (Target minimal 1000 poin). Klik <strong>Coba Lagi</strong> untuk lanjut!</span>`;
            }

            if (startBtn) {
                startBtn.innerText = '🔄 COBA LAGI 🎮';
            }

            if (nextGameCard) {
                nextGameCard.style.display = 'none';
            }
        }
    }

    if (startBtn) {
        startBtn.onclick = startGame;
    }
}


