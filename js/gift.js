/* ==========================================================================
   Fase 2: Gift Box Animation & Letter Modal Logic (gift.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const giftBox = document.getElementById('gift-box');
    const letterModal = document.getElementById('letter-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const nextToMemories = document.getElementById('next-to-memories');

    if (giftBox) {
        giftBox.addEventListener('click', () => {
            // Trigger 3D gift lid animation
            const boxElement = giftBox.querySelector('.gift-box');
            if (boxElement) {
                boxElement.classList.add('opened');
            }

            // Launch confetti explosion
            createConfettiExplosion();

            // Show Letter Modal after animation delay
            setTimeout(() => {
                if (letterModal) {
                    letterModal.classList.remove('hidden');
                }
            }, 700);
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (letterModal) letterModal.classList.add('hidden');
        });
    }

    if (nextToMemories) {
        nextToMemories.addEventListener('click', () => {
            if (letterModal) letterModal.classList.add('hidden');
            const memoriesSection = document.getElementById('memories-section');
            if (memoriesSection) {
                memoriesSection.classList.remove('hidden-section');
                memoriesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

/* Confetti Burst Generator */
function createConfettiExplosion() {
    const colors = ['#c084fc', '#e879f9', '#fbbf24', '#f59e0b', '#ffffff'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = `${Math.random() * 20 + 30}vh`;
        confetti.style.width = `${Math.random() * 8 + 6}px`;
        confetti.style.height = `${Math.random() * 12 + 6}px`;
        confetti.style.animationDuration = `${Math.random() * 2 + 1.5}s`;

        document.body.appendChild(confetti);

        // Cleanup
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}
