/* ==========================================================================
   Fase 4 & Section 8: LDR Distance Map & Virgo Constellation Logic (map.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initLdrMap();
    initNavFase4();
});

function initLdrMap() {
    const distanceNumber = document.getElementById('distance-number');
    const targetDistance = 1400;

    let currentDistance = 0;
    const interval = setInterval(() => {
        currentDistance += 25;
        if (currentDistance >= targetDistance) {
            currentDistance = targetDistance;
            clearInterval(interval);
        }
        if (distanceNumber) {
            distanceNumber.innerText = currentDistance.toLocaleString('id-ID');
        }
    }, 30);
}

function initNavFase4() {
    const nextToLdr = document.getElementById('next-to-ldr');
    const ldrSection = document.getElementById('ldr-section');
    const nextToStars = document.getElementById('next-to-stars');
    const starsSection = document.getElementById('stars-section');
    const nextToEnvelope = document.getElementById('next-to-envelope');
    const envelopeSection = document.getElementById('envelope-section');
    const nextToGames = document.getElementById('next-to-games');
    const gamesSection = document.getElementById('game-hearts-section');

    if (nextToLdr && ldrSection) {
        nextToLdr.addEventListener('click', () => {
            ldrSection.classList.remove('hidden-section');
            ldrSection.scrollIntoView({ behavior: 'smooth' });
            initLdrMap();
        });
    }

    if (nextToStars && starsSection) {
        nextToStars.addEventListener('click', () => {
            starsSection.classList.remove('hidden-section');
            starsSection.scrollIntoView({ behavior: 'smooth' });
            drawVirgoConstellation();
        });
    }

    if (nextToEnvelope && envelopeSection) {
        nextToEnvelope.addEventListener('click', () => {
            envelopeSection.classList.remove('hidden-section');
            envelopeSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (nextToGames && gamesSection) {
        nextToGames.addEventListener('click', () => {
            gamesSection.classList.remove('hidden-section');
            gamesSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

/* Animated Virgo Constellation Renderer */
function drawVirgoConstellation() {
    const canvas = document.getElementById('virgo-constellation-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    // Virgo Constellation Star Nodes
    const starNodes = [
        { x: 50, y: 40 },   // Zavijava
        { x: 100, y: 70 },  // Zaniah
        { x: 160, y: 50 },  // Porrima
        { x: 220, y: 90 },  // Vindemiatrix
        { x: 265, y: 125 }  // Spica!
    ];

    const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4]
    ];

    let progress = 0;

    function renderFrame() {
        ctx.clearRect(0, 0, width, height);

        // Draw Animated Constellation Connecting Lines
        ctx.strokeStyle = 'rgba(232, 121, 249, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);

        connections.forEach(([p1, p2]) => {
            const node1 = starNodes[p1];
            const node2 = starNodes[p2];

            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node1.x + (node2.x - node1.x) * progress, node1.y + (node2.y - node1.y) * progress);
            ctx.stroke();
        });

        // Draw Twinkling Constellation Stars
        starNodes.forEach((node, i) => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, i === 4 ? 5 : 3, 0, Math.PI * 2);
            ctx.fillStyle = i === 4 ? '#fbbf24' : '#ffffff';
            ctx.shadowBlur = i === 4 ? 12 : 6;
            ctx.shadowColor = i === 4 ? '#fbbf24' : '#c084fc';
            ctx.fill();
        });

        if (progress < 1) {
            progress += 0.02;
            requestAnimationFrame(renderFrame);
        }
    }

    renderFrame();
}
