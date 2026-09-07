/* ==========================================================================
   PATUYFLIX — Flappy Patuy Minigame (minigame-flappy.js)
   Theme: Flappy Bird Birthday Edition for Patuy 💕
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initFlappyGame();
});

function initFlappyGame() {
    const canvas = document.getElementById('flappy-game-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const scoreEl = document.getElementById('flappy-score');
    const bestEl = document.getElementById('flappy-best');
    const targetEl = document.getElementById('flappy-target');
    const statusMsgEl = document.getElementById('flappy-status-msg');
    const startBtn = document.getElementById('start-flappy-btn');
    const nextGameCard = document.getElementById('flappy-next-cta-card');
    const ctaHeadline = document.getElementById('flappy-cta-headline');

    const TARGET_PASS = 5; // Target melewati 5 rintangan pilar untuk menang
    let bestScore = parseInt(localStorage.getItem('patuyflix_flappy_best') || '0', 10);
    if (bestEl) bestEl.innerText = bestScore;
    if (targetEl) targetEl.innerText = TARGET_PASS;

    // Game Physics & State
    let bird = {
        x: 65,
        y: 180,
        radius: 16,
        velocity: 0,
        gravity: 0.28,
        jump: -5.8,
        rotation: 0
    };

    let pipes = [];
    let particles = [];
    let score = 0;
    let frames = 0;
    let isRunning = false;
    let isGameOver = false;
    let gameLoopId = null;

    // Sound effect synthesis with Web Audio API
    function playAudioTone(type) {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const actx = new AudioCtx();
            const osc = actx.createOscillator();
            const gain = actx.createGain();
            osc.connect(gain);
            gain.connect(actx.destination);

            if (type === 'jump') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(420, actx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(780, actx.currentTime + 0.12);
                gain.gain.setValueAtTime(0.25, actx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, actx.currentTime + 0.12);
                osc.start();
                osc.stop(actx.currentTime + 0.12);
            } else if (type === 'score') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, actx.currentTime); // C5
                osc.frequency.setValueAtTime(659.25, actx.currentTime + 0.08); // E5
                osc.frequency.setValueAtTime(783.99, actx.currentTime + 0.16); // G5
                gain.gain.setValueAtTime(0.2, actx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, actx.currentTime + 0.25);
                osc.start();
                osc.stop(actx.currentTime + 0.25);
            } else if (type === 'hit') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, actx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(60, actx.currentTime + 0.25);
                gain.gain.setValueAtTime(0.3, actx.currentTime);
                gain.gain.linearRampToValueAtTime(0.01, actx.currentTime + 0.25);
                osc.start();
                osc.stop(actx.currentTime + 0.25);
            }
        } catch (e) {
            // Audio policy fallback
        }
    }

    function resetGame() {
        bird.y = 180;
        bird.velocity = 0;
        bird.rotation = 0;
        pipes = [];
        particles = [];
        score = 0;
        frames = 0;
        isGameOver = false;

        if (scoreEl) scoreEl.innerText = '0';
        if (statusMsgEl) {
            statusMsgEl.innerHTML = '🕊️ <span style=color:#ffd1dc;>Ketuk layar / tekan spasi untuk mengepakkan sayap!</span>';
        }
        if (nextGameCard) {
            nextGameCard.style.display = 'none';
        }
    }

    function flap() {
        if (!isRunning) {
            startGame();
            return;
        }
        if (isGameOver) {
            resetGame();
            startGame();
            return;
        }

        bird.velocity = bird.jump;
        playAudioTone('jump');

        // Spawn heart spark particles on flap
        for (let i = 0; i < 4; i++) {
            particles.push({
                x: bird.x - 10,
                y: bird.y + (Math.random() * 10 - 5),
                vx: -Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
                size: Math.random() * 10 + 8,
                alpha: 1,
                emoji: ['✨', '💖', '⭐'][Math.floor(Math.random() * 3)]
            });
        }
    }

    // Input Listeners: Canvas Click, Touch, Keyboard
    function handleFlapInput(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        flap();
    }

    canvas.removeEventListener('pointerdown', handleFlapInput);
    canvas.addEventListener('pointerdown', handleFlapInput, { passive: false });

    // Keyboard Spacebar / Up Arrow Listener
    function handleKeyDown(e) {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            flap();
        }
    }
    window.removeEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleKeyDown);

    if (startBtn) {
        startBtn.onclick = (e) => {
            e.preventDefault();
            if (isGameOver || !isRunning) {
                resetGame();
                startGame();
            } else {
                flap();
            }
        };
    }

    function createPipe() {
        const gap = 120; // Celah lorong antar pilar
        const minHeight = 45;
        const maxHeight = canvas.height - gap - minHeight;
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        const bottomY = topHeight + gap;

        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: bottomY,
            width: 48,
            passed: false
        });
    }

    function update() {
        frames++;

        // Bird Physics
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        // Bird Rotation based on velocity
        bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 5, (bird.velocity * 4) * Math.PI / 180));

        // Floor / Ceiling Collision
        if (bird.y + bird.radius >= canvas.height - 15) {
            bird.y = canvas.height - 15 - bird.radius;
            triggerGameOver();
            return;
        }
        if (bird.y - bird.radius <= 0) {
            bird.y = bird.radius;
            bird.velocity = 0;
        }

        // Spawn Pipes every 100 frames (~1.6s)
        if (frames % 100 === 0) {
            createPipe();
        }

        // Move & Check Pipes
        for (let i = pipes.length - 1; i >= 0; i--) {
            const p = pipes[i];
            p.x -= 2.2;

            // Check Score Passing
            if (!p.passed && p.x + p.width < bird.x - bird.radius) {
                p.passed = true;
                score++;
                if (scoreEl) scoreEl.innerText = score;
                playAudioTone('score');

                if (score > bestScore) {
                    bestScore = score;
                    localStorage.setItem('patuyflix_flappy_best', bestScore);
                    if (bestEl) bestEl.innerText = bestScore;
                }

                // Check Win Condition Target
                if (score >= TARGET_PASS && nextGameCard && nextGameCard.style.display !== 'block') {
                    showVictoryCard();
                }
            }

            // Pipe Collision Detection (AABB vs Circle)
            const birdLeft = bird.x - bird.radius + 3;
            const birdRight = bird.x + bird.radius - 3;
            const birdTop = bird.y - bird.radius + 3;
            const birdBottom = bird.y + bird.radius - 3;

            // Top Pipe Check
            if (birdRight > p.x && birdLeft < p.x + p.width && birdTop < p.top) {
                triggerGameOver();
                return;
            }

            // Bottom Pipe Check
            if (birdRight > p.x && birdLeft < p.x + p.width && birdBottom > p.bottom) {
                triggerGameOver();
                return;
            }

            // Remove off-screen pipes
            if (p.x + p.width < -10) {
                pipes.splice(i, 1);
            }
        }

        // Update Particles
        for (let j = particles.length - 1; j >= 0; j--) {
            const part = particles[j];
            part.x += part.vx;
            part.y += part.vy;
            part.alpha -= 0.035;
            if (part.alpha <= 0) {
                particles.splice(j, 1);
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Cinematic Background Gradient (Night Sky Netflix Theme)
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGrad.addColorStop(0, '#100c1e');
        bgGrad.addColorStop(0.6, '#1e1430');
        bgGrad.addColorStop(1, '#0b0b12');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Background City Skyline Silhouette
        ctx.fillStyle = 'rgba(255, 42, 68, 0.08)';
        ctx.fillRect(20, canvas.height - 90, 45, 90);
        ctx.fillRect(75, canvas.height - 120, 55, 120);
        ctx.fillRect(140, canvas.height - 75, 40, 75);
        ctx.fillRect(190, canvas.height - 110, 60, 110);
        ctx.fillRect(260, canvas.height - 85, 50, 85);

        // 2. Draw Pipes (Netflix Red / Neon Glowing Pillars)
        pipes.forEach(p => {
            // Top Pipe
            const topGrad = ctx.createLinearGradient(p.x, 0, p.x + p.width, 0);
            topGrad.addColorStop(0, '#e50914');
            topGrad.addColorStop(0.5, '#ff416c');
            topGrad.addColorStop(1, '#b20710');

            ctx.fillStyle = topGrad;
            ctx.shadowBlur = 12;
            ctx.shadowColor = 'rgba(229, 9, 20, 0.5)';

            // Top Pipe Body
            ctx.fillRect(p.x, 0, p.width, p.top);
            // Top Pipe Cap
            ctx.fillStyle = '#ff5b79';
            ctx.fillRect(p.x - 3, p.top - 15, p.width + 6, 15);

            // Bottom Pipe Body
            ctx.fillStyle = topGrad;
            ctx.fillRect(p.x, p.bottom, p.width, canvas.height - p.bottom);
            // Bottom Pipe Cap
            ctx.fillStyle = '#ff5b79';
            ctx.fillRect(p.x - 3, p.bottom, p.width + 6, 15);

            ctx.shadowBlur = 0;
        });

        // 3. Draw Floor
        ctx.fillStyle = '#141419';
        ctx.fillRect(0, canvas.height - 15, canvas.width, 15);
        ctx.fillStyle = '#e50914';
        ctx.fillRect(0, canvas.height - 15, canvas.width, 2);

        // 4. Draw Particles (Sparks & Hearts)
        particles.forEach(part => {
            ctx.save();
            ctx.globalAlpha = Math.max(0, part.alpha);
            ctx.font = part.size + 'px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(part.emoji, part.x, part.y);
            ctx.restore();
        });

        // 5. Draw Bird (Patuy Cute Flying Character with Crown/Heart)
        ctx.save();
        ctx.translate(bird.x, bird.y);
        ctx.rotate(bird.rotation);

        // Bird Body (Glowing Pink/Red Orb)
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#ff2a44';
        const birdGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, bird.radius);
        birdGrad.addColorStop(0, '#ffffff');
        birdGrad.addColorStop(0.4, '#ff4b72');
        birdGrad.addColorStop(1, '#e50914');
        ctx.fillStyle = birdGrad;
        ctx.beginPath();
        ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Cute Face & Heart Badge
        ctx.font = '16px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👸', 0, -1);

        // Mini Angel Wing / Glow
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.ellipse(-10, Math.sin(frames * 0.3) * 4, 6, 4, -0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // 6. Overlay Screen for Game Over or Ready
        if (!isRunning && !isGameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px "Righteous", "Montserrat", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('FLAPPY PATUY 🕊️', canvas.width / 2, canvas.height / 2 - 25);

            ctx.fillStyle = '#ff7b90';
            ctx.font = '13px "Montserrat", sans-serif';
            ctx.fillText('Ketuk / Tekan Spasi untuk Mulai', canvas.width / 2, canvas.height / 2 + 10);

            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 12px "Montserrat", sans-serif';
            ctx.fillText('Target: Lewati ' + TARGET_PASS + ' Pilar Rintangan!', canvas.width / 2, canvas.height / 2 + 35);
        }
    }

    function gameLoop() {
        if (isRunning) {
            update();
            draw();
            gameLoopId = requestAnimationFrame(gameLoop);
        }
    }

    function startGame() {
        if (isRunning) return;
        isRunning = true;
        isGameOver = false;
        if (startBtn) startBtn.innerText = '🕊️ TERBANG (FLAP) ✨';
        gameLoop();
    }

    function triggerGameOver() {
        isRunning = false;
        isGameOver = true;
        if (gameLoopId) cancelAnimationFrame(gameLoopId);
        playAudioTone('hit');

        // Draw Game Over Screen
        draw();
        ctx.fillStyle = 'rgba(20, 10, 15, 0.78)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 22px "Righteous", "Montserrat", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('NABRAK! 💥', canvas.width / 2, canvas.height / 2 - 25);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px "Montserrat", sans-serif';
        ctx.fillText('Skor Kamu: ' + score, canvas.width / 2, canvas.height / 2 + 10);

        ctx.fillStyle = '#fbbf24';
        ctx.font = '12px "Montserrat", sans-serif';
        ctx.fillText('Rekor Terbaik: ' + bestScore + ' Pilar', canvas.width / 2, canvas.height / 2 + 35);

        if (startBtn) startBtn.innerText = '🔄 COBA LAGI 🕊️';

        if (statusMsgEl) {
            if (score >= TARGET_PASS) {
                statusMsgEl.innerHTML = '🎉 <strong style="color:#10b981;">Luar biasa! Kamu berhasil melewati ' + score + ' rintangan!</strong>';
            } else {
                statusMsgEl.innerHTML = '⚠️ <span style="color:#fca5a5;">Skor kamu ' + score + ' (Target: ' + TARGET_PASS + ' pilar). Ayo coba lagi!</span>';
            }
        }
    }

    function showVictoryCard() {
        if (nextGameCard) {
            nextGameCard.style.display = 'block';
            nextGameCard.style.background = 'rgba(16, 185, 129, 0.15)';
            nextGameCard.style.borderColor = 'rgba(16, 185, 129, 0.5)';
            if (ctaHeadline) {
                ctaHeadline.innerHTML = '🎉 Hebat! Target ' + TARGET_PASS + ' Pilar Berhasil Dilewati (Skor: ' + score + ')! 👇';
            }
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 75,
                    spread: 65,
                    origin: { y: 0.6 }
                });
            }
        }
    }

    // Initial first draw
    resetGame();
    draw();
}
