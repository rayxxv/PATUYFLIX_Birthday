/* ==========================================================================
   Birthday Gift Website - Core JavaScript (main.js)
   Target: Patuy 💕 (7 September 2026) - PATUYFLIX Theme
   ========================================================================== */

const CONFIG = {
    birthdayDate: '2026-09-07T00:00:00',
    name: 'Patuy',
};

document.addEventListener('DOMContentLoaded', () => {
    initStarryBackground();
    initCountdown();
    initNavigation();
    initNetflixHeaderScroll();
    initFullscreenToggle();
    initLightbox();
    if (typeof renderPolaroids === 'function') renderPolaroids();
});

/* 1. Canvas Starry Background Generator */
function initStarryBackground() {
    const canvas = document.getElementById('starry-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const stars = [];
    const numStars = Math.floor((width * height) / 3000);

    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            speed: Math.random() * 0.02 + 0.005
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        stars.forEach(star => {
            star.alpha += star.speed;
            if (star.alpha > 1 || star.alpha < 0) {
                star.speed = -star.speed;
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
            ctx.shadowBlur = star.radius * 2;
            ctx.shadowColor = '#E50914';
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    draw();
}

/* 2. Countdown / Elapsed Birthday Timer Logic */
function initCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const labelEl = document.getElementById('hud-countdown-label') || document.querySelector('.hud-label');
    const dotEl = document.querySelector('.hud-live-dot');

    // 7 September 2026 00:00:00 WIB (UTC+7)
    const targetDate = new Date('2026-09-07T00:00:00+07:00').getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const difference = now - targetDate;

        if (difference >= 0) {
            // Waktu setelah 7 September 2026 00:00 WIB (Elapsed / Waktu Berjalan Sejak Hari Ultah)
            if (labelEl) {
                labelEl.innerText = 'WAKTU BERJALAN SEJAK 7 SEPTEMBER';
            }
            if (dotEl) {
                dotEl.style.backgroundColor = '#10b981';
                dotEl.style.boxShadow = '0 0 10px #10b981';
            }

            const elapsed = difference;
            const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
            const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

            if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
        } else {
            // Sebelum 7 September 2026 00:00 WIB (Hitungan Mundur)
            if (labelEl) {
                labelEl.innerText = 'COUNTDOWN TO 7 SEPTEMBER 2026';
            }
            const remaining = Math.abs(difference);
            const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
        }
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

/* 3. Netflix Header, Fullscreen & Navigation Interactions */
function initFullscreenToggle() {
    const fullscreenBtns = document.querySelectorAll('.fullscreen-toggle-btn, #nav-fullscreen-btn');
    
    function updateIcons() {
        const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        fullscreenBtns.forEach(btn => {
            btn.innerHTML = isFull ? '🗗' : '⛶';
            btn.setAttribute('title', isFull ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (Cinema 4K)');
        });
    }

    fullscreenBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
                const docEl = document.documentElement;
                if (docEl.requestFullscreen) {
                    docEl.requestFullscreen().catch(err => console.warn('Fullscreen err:', err));
                } else if (docEl.webkitRequestFullscreen) {
                    docEl.webkitRequestFullscreen();
                } else if (docEl.mozRequestFullScreen) {
                    docEl.mozRequestFullScreen();
                } else if (docEl.msRequestFullscreen) {
                    docEl.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        };
    });

    document.addEventListener('fullscreenchange', updateIcons);
    document.addEventListener('webkitfullscreenchange', updateIcons);
    document.addEventListener('mozfullscreenchange', updateIcons);
    document.addEventListener('MSFullscreenChange', updateIcons);
    updateIcons();
}

function initNetflixHeaderScroll() {
    const header = document.getElementById('netflix-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(20, 20, 20, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.8)';
        } else {
            header.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0) 100%)';
            header.style.boxShadow = 'none';
        }
    });
}

function initNavigation() {
    const openGiftBtn = document.getElementById('open-gift-btn');
    const contentBody = document.getElementById('netflix-content-body');
    const giftSection = document.getElementById('gift-section');
    const heroLetterBtn = document.getElementById('hero-letter-btn');
    const letterModal = document.getElementById('letter-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const nextToMemories = document.getElementById('next-to-memories');

    // Helper to unlock content body
    function unlockContentBody() {
        if (contentBody && contentBody.classList.contains('hidden-section')) {
            contentBody.classList.remove('hidden-section');
        }
    }

    // Trigger AyuSharma Style Interactive Birthday Magic Sequence when Mulai is clicked
    if (openGiftBtn) {
        openGiftBtn.addEventListener('click', () => {
            triggerMagicBirthdaySequence();
        });
    }

    // Unlock content body if user clicks any navbar link
    const navUnlockLinks = document.querySelectorAll('.nav-unlock-link');
    navUnlockLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            unlockContentBody();
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Open Letter Modal from Hero
    if (heroLetterBtn && letterModal) {
        heroLetterBtn.addEventListener('click', () => {
            letterModal.classList.remove('hidden');
        });
    }

    // Close Modal Button
    if (closeModalBtn && letterModal) {
        closeModalBtn.addEventListener('click', () => {
            letterModal.classList.add('hidden');
        });
    }

    // Next to Memories from Modal
    if (nextToMemories && letterModal) {
        nextToMemories.addEventListener('click', () => {
            letterModal.classList.add('hidden');
            unlockContentBody();
            const memoriesSection = document.getElementById('memories-section');
            if (memoriesSection) {
                memoriesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Video & Playlist Buttons
    const nextToVideo = document.getElementById('next-to-video');
    const videoSection = document.getElementById('video-section');

    if (nextToVideo && videoSection) {
        nextToVideo.addEventListener('click', () => {
            videoSection.classList.remove('hidden-section');
            videoSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const nextToEnding = document.getElementById('next-to-ending');
    const endingSection = document.getElementById('ending-section');

    if (nextToEnding && endingSection) {
        nextToEnding.addEventListener('click', () => {
            endingSection.classList.remove('hidden-section');
            endingSection.scrollIntoView({ behavior: 'smooth' });
            startRotatingText();
        });
    }

    const replayBtn = document.getElementById('replay-btn');
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    renderPolaroids();
}

/* AyuSharma + Faahim Style Interactive Birthday Magic Sequence */
window.closeMagicOverlay = function() {
    const overlay = document.getElementById('magic-birthday-overlay');
    if (overlay) {
        overlay.classList.add('hidden-overlay');
        overlay.style.display = 'none';
    }
};

window.triggerMagicBirthdaySequence = function() {
    const overlay = document.getElementById('magic-birthday-overlay');
    const stepBtn = document.getElementById('magic-step-btn');
    const stepTitle = document.getElementById('magic-step-title');
    const stepSub = document.getElementById('magic-step-sub');
    const chatBox = document.getElementById('magic-chat-box');
    const banner = document.getElementById('magic-banner');
    const cakeWrapper = document.getElementById('magic-cake-wrapper');
    const candleFlame = document.getElementById('candle-flame');
    const balloonContainer = document.getElementById('magic-balloon-container');

    if (!overlay || !stepBtn) {
        window.location.href = 'galeri.html';
        return;
    }

    // Force visible
    overlay.classList.remove('hidden-overlay');
    overlay.style.display = 'flex';
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';
    
    // Reset state elements
    if (chatBox) chatBox.classList.add('hidden-element');
    if (banner) banner.classList.add('hidden-element');
    if (cakeWrapper) cakeWrapper.classList.add('hidden-element');
    if (candleFlame) candleFlame.classList.add('hidden-element');
    overlay.classList.remove('lights-on');

    // Step 1 initial text (Faahim intro)
    stepTitle.innerHTML = "Hey Patuy 💕";
    stepSub.innerText = "Aku suka banget sama namamu...";
    stepBtn.innerText = "Lanjut ➔";

    let currentStep = 1;

    stepBtn.onclick = () => {
        if (currentStep === 1) {
            // Faahim Step 2: Birthday Greeting
            stepTitle.innerHTML = "7 September 2026 🎉";
            stepSub.innerText = "Hari ini adalah hari ulang tahunmu yang ke-28!";
            stepBtn.innerText = "Lanjut ➔";
            currentStep = 2;
        } else if (currentStep === 2) {
            // Faahim Step 3: Simulated Chat Typing
            if (chatBox) chatBox.classList.remove('hidden-element');
            stepTitle.innerHTML = "Pesan Singkat...";
            stepSub.innerText = "Awalnya aku cuma mau ngirim chat biasa seperti ini...";
            stepBtn.innerText = "Lanjut ➔";
            currentStep = 3;
        } else if (currentStep === 3) {
            // Faahim Step 4: Realization
            stepTitle.innerHTML = "Tapi Terus Aku Berpikir... 🤔";
            stepSub.innerText = "Masa cuma kirim pesan biasa sih? Aku mau buat sesuatu yang jauh lebih spesial!";
            stepBtn.innerText = "Lanjut ➔";
            currentStep = 4;
        } else if (currentStep === 4) {
            // Faahim Step 5: Special Message & Transition to AyuSharma Party
            if (chatBox) chatBox.classList.add('hidden-element');
            stepTitle.innerHTML = "Karena Kamu SPESIAL Buat Aku ❤️";
            stepSub.innerText = "Jadi... Yuk kita mulai pesta keajaiban ulang tahunmu!";
            stepBtn.innerHTML = "▶ Mulai Kejutan Pesta! 🎈";
            currentStep = 5;
        } else if (currentStep === 5) {
            // AyuSharma Step 1: Turn On Lights
            overlay.classList.add('lights-on');
            stepTitle.innerHTML = "💡 LAMPU PESTA MENYALA!";
            stepSub.innerText = "Sekarang, mari putar musik favorit berdua...";
            stepBtn.innerHTML = "🎵 Putar Musik Ulang Tahun";
            currentStep = 6;
        } else if (currentStep === 6) {
            // AyuSharma Step 2: Play Music
            if (typeof playTrack === 'function') {
                playTrack(0);
            }
            stepTitle.innerHTML = "🎵 MUSIK MULAI BERPUTAR!";
            stepSub.innerText = "Suasana makin hangat. Yuk hias dengan balon & dekorasi!";
            stepBtn.innerHTML = "🎈 Pasang Dekorasi & Terbang Balon";
            currentStep = 7;
        } else if (currentStep === 7) {
            // AyuSharma Step 3: Decorate & Fly Balloons
            if (banner) banner.classList.remove('hidden-element');
            spawnFloatingBalloons(balloonContainer);
            stepTitle.innerHTML = "🎈 DEKORASI & BALON TERBANG!";
            stepSub.innerText = "Pesta ulang tahun tak lengkap tanpa kue...";
            stepBtn.innerHTML = "🎂 Munculkan Kue Ulang Tahun";
            currentStep = 8;
        } else if (currentStep === 8) {
            // AyuSharma Step 4: Show Birthday Cake
            if (cakeWrapper) cakeWrapper.classList.remove('hidden-element');
            stepTitle.innerHTML = "🎂 KUE ULANG TAHUN HADIR!";
            stepSub.innerText = "Mari nyalakan lilin kue untuk Patuy...";
            stepBtn.innerHTML = "🕯️ Nyalakan Lilin Kue";
            currentStep = 9;
        } else if (currentStep === 9) {
            // AyuSharma Step 5: Light Candle & Make a Wish (Faahim nerdy wish included)
            if (candleFlame) candleFlame.classList.remove('hidden-element');
            stepTitle.innerHTML = "🕯️ LILIN BERNYALA TERANG!";
            stepSub.innerHTML = "Make a wish... Semoga Patuy selalu bahagia, sehat, dan impian kita terwujud!<br><span style='color:#e50914;font-style:italic;'>May the js.prototypes & happiness always be with you! 😉</span>";
            stepBtn.innerHTML = "🎉 MASUK KE DUNIA PATUYFLIX (Galeri Kenangan ➔)";
            currentStep = 10;
        } else if (currentStep === 10) {
            // AyuSharma Step 6: Enter Gallery
            closeMagicOverlay();
            window.location.href = 'galeri.html';
        }
    };
};

function spawnFloatingBalloons(container) {
    if (!container) return;
    const balloons = ['🎈', '💖', '🎁', '⭐', '🌸', '🎉', '💕', '🎈'];
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const b = document.createElement('div');
            b.className = 'magic-floating-balloon';
            b.innerText = balloons[Math.floor(Math.random() * balloons.length)];
            b.style.left = `${Math.random() * 90}%`;
            b.style.animationDuration = `${4 + Math.random() * 4}s`;
            container.appendChild(b);
            setTimeout(() => b.remove(), 7000);
        }, i * 300);
    }
}

/* Lightbox Zoom Preview for Netflix Memory Episodes */
function initLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('close-lightbox-btn');
    if (!modal) return;

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Close on Esc key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
    });
}

function openLightbox(item) {
    const modal = document.getElementById('lightbox-modal');
    const imgWrapper = document.getElementById('lightbox-img-wrapper');
    const titleEl = document.getElementById('lightbox-title');
    const subEl = document.getElementById('lightbox-sub');
    const matchEl = document.getElementById('modal-match');
    const ageEl = document.getElementById('modal-age');
    const qualityEl = document.getElementById('modal-quality');
    const yearEl = document.getElementById('modal-year');
    const genreEl = document.getElementById('modal-genre');
    const noteEl = document.getElementById('modal-note');

    if (modal && titleEl && subEl) {
        if (imgWrapper) {
            imgWrapper.innerHTML = `
                <img src="${item.src}" alt="${item.caption}" class="modal-hero-img">
                <div class="modal-hero-overlay"></div>
                <div class="modal-hero-n-badge">
                    <span class="n-red">N</span>
                    <span>ORIGINAL</span>
                </div>
                <span class="modal-hero-ep">${item.episode || 'EPISODE'}</span>
            `;
        }
        titleEl.innerText = item.caption;
        subEl.innerText = item.sub;
        if (matchEl) matchEl.innerText = item.match || '99% Cocok';
        if (ageEl) ageEl.innerText = item.rating || '28+';
        if (qualityEl) qualityEl.innerText = item.quality || '4K Ultra HD';
        if (yearEl) yearEl.innerText = item.year || '2026';
        if (genreEl) genreEl.innerText = item.genre || 'Romance • Heartfelt Moment';
        if (noteEl) noteEl.innerText = `Tag: ${item.tag || 'Favorit Ojen 💕'}`;

        modal.classList.remove('hidden');
    }
}

function startRotatingText() {
    const rotatingText = document.getElementById('rotating-text');
    if (!rotatingText) return;

    const phrases = [
        'HAPPY BIRTHDAY',
        'HAPPY BIRTHDAY PATUY 💕',
        'WITH ALL MY LOVE',
        'ALWAYS & FOREVER'
    ];

    let index = 0;
    setInterval(() => {
        index = (index + 1) % phrases.length;
        rotatingText.innerText = phrases[index];
    }, 2500);
}

function renderPolaroids() {
    const grid = document.getElementById('polaroid-grid');
    if (!grid) return;

    const memories = [
        { 
            id: 1,
            category: 'manis',
            episode: 'EPISODE 1',
            src: 'assets/images/20241228_122939-1.jpg',
            caption: 'Senyum Tipis Manis 🌸', 
            match: '99% Cocok',
            year: '2024',
            quality: '4K Ultra HD',
            duration: '3m 24s',
            genre: 'Romance • Manis Banget',
            sub: 'Senyuman andalan patar kalo lagi difoto, manisnya kebangetan sampe gulapun insecure wkwk.',
            tag: 'Paling Manis ✨',
            rating: '28+'
        },
        { 
            id: 2,
            category: 'candid',
            episode: 'EPISODE 2',
            src: 'assets/images/SNOW_20240228_122514_201.jpg',
            caption: 'Mode Kalem & Anteng ☕', 
            match: '98% Cocok',
            year: '2025',
            quality: '4K Ultra HD',
            duration: '4m 12s',
            genre: 'Slice of Life • Mode Kalem',
            sub: 'Tumben-tumbenan mukanya kalem dan anteng begini, padahal aslinya suka random wkwkwk.',
            tag: 'Candid Estetik 📸',
            rating: '28+'
        },
        { 
            id: 3,
            category: 'candid',
            episode: 'EPISODE 3',
            src: 'assets/images/SNOW_20250316_190509_670.jpg',
            caption: 'Filter Gemas Maksimal 🎀', 
            match: '100% Cocok',
            year: '2025',
            quality: '4K Ultra HD',
            duration: '2m 45s',
            genre: 'Comedy • Super Gemoy',
            sub: 'Efek filter + muka gemoy patawu = combo maut yang bikin ojen auto senyum-senyum sendiri.',
            tag: 'Gemas 100% 🧸',
            rating: '28+'
        },
        { 
            id: 4,
            category: 'ultah',
            episode: 'EPISODE 4',
            src: 'assets/images/IMG-20241228-WA0007-1.jpg',
            caption: 'Menatap Masa Depan 🌊', 
            match: '99% Cocok',
            year: '2024',
            quality: '4K Ultra HD',
            duration: '5m 01s',
            genre: 'Adventure • Anak Pantai',
            sub: 'Lagi di pantai pura-pura candid padahal sadar kamera, tapi gapapa tetep juara cantiknya!',
            tag: 'Anak Pantai 🏖️',
            rating: '28+'
        },
        { 
            id: 5,
            category: 'candid',
            episode: 'EPISODE 5',
            src: 'assets/images/IMG-20250501-WA0010.jpg',
            caption: 'Patawu Mode Serius 🧐', 
            match: '97% Cocok',
            year: '2025',
            quality: '4K Ultra HD',
            duration: '3m 48s',
            genre: 'Drama • Mode Fokus',
            sub: 'Kalo lagi fokus mukanya suka judes dikit, padahal hatinya selembut gulali kapas.',
            tag: 'Serius Tapi Lucu 👀',
            rating: '28+'
        },
        { 
            id: 6,
            category: 'manis',
            episode: 'EPISODE 6',
            src: 'assets/images/IMG-20250403-WA0010.jpg',
            caption: 'Sinar Matahari Kalah Terang ☀️', 
            match: '98% Cocok',
            year: '2025',
            quality: '4K Ultra HD',
            duration: '4m 30s',
            genre: 'Feel Good • Anti Silau',
            sub: 'Silau dikit gapapa yang penting tetep kece badai. Mood booster ojen setiap saat.',
            tag: 'Cerah Ceria 🌟',
            rating: '28+'
        },
        { 
            id: 7,
            category: 'manis',
            episode: 'EPISODE 7',
            src: 'assets/images/IMG-20251028-WA0024.jpg',
            caption: 'Mata Bulat Menghipnotis 👀', 
            match: '99% Cocok',
            year: '2025',
            quality: '4K Ultra HD',
            duration: '3m 15s',
            genre: 'Mystery • Tatapan Maut',
            sub: 'Tatapannya kek lagi minta jajan seblak atau minta dipeluk online wkwk.',
            tag: 'Tatapan Andalan 💫',
            rating: '28+'
        },
        { 
            id: 8,
            category: 'ultah',
            episode: 'EPISODE 8',
            src: 'assets/images/IMG-20260705-WA0020.jpg',
            caption: 'Head (#Anjay) Lagi Gaya 👑', 
            match: '100% Cocok',
            year: '2026',
            quality: '4K Ultra HD',
            duration: '6m 00s',
            genre: 'Action • Ibu Bos #Anjay',
            sub: 'Gaya ibu bos baru yang sekarang udah jadi head di kantor, senggol dong boss patawu!',
            tag: 'The Boss Queen 👑',
            rating: '28+'
        },
        { 
            id: 9,
            category: 'ultah',
            episode: 'EPISODE 9',
            src: 'assets/images/IMG-20250809-WA0005.jpg',
            caption: 'Pose Andalan Patawu ✌️', 
            match: '99% Cocok',
            year: '2025',
            quality: '4K Ultra HD',
            duration: '3m 50s',
            genre: 'Slice of Life • Pusing Mikir Makan',
            sub: 'Kalo bingung mau gaya apa, pose senyum manis sambil mikirin mau makan apa nanti malem.',
            tag: 'Lapar Tapi Kece 🍕',
            rating: '28+'
        },
        { 
            id: 10,
            category: 'ultah',
            episode: 'EPISODE 10',
            src: 'assets/images/IMG-20260905-WA0010.jpg',
            caption: 'Edisi Spesial Ultah 28th 🎂', 
            match: '100% Cocok',
            year: '2026',
            quality: '4K Ultra HD',
            duration: '4m 15s',
            genre: 'Celebration • Makin Tua Makin Lucu',
            sub: 'Makin tambah umur makin cantik, semoga makin sabar ngadepin ojen yang kadang ngeselin yaa hehe.',
            tag: 'Spesial 28th 🎉',
            rating: '28+'
        },
        { 
            id: 11,
            category: 'manis',
            episode: 'EPISODE 11',
            src: 'assets/images/20250617_121636.jpg',
            caption: 'Candid Ketawa Lepas 🌸', 
            match: '98% Cocok',
            year: '2025',
            quality: '4K Ultra HD',
            duration: '3m 30s',
            genre: 'Comedy • Tawa Renyah',
            sub: 'Ketawanya renyah banget kek kerupuk kaleng, selalu bikin suasana jadi rame dan happy!',
            tag: 'Happy Virus 🌈',
            rating: '28+'
        },
        { 
            id: 12,
            category: 'candid',
            episode: 'EPISODE 12',
            src: 'assets/images/IMG-20251122-WA0021.jpg',
            caption: 'Anak Gunung / Anak Taman? 🧕', 
            match: '99% Cocok',
            year: '2025',
            quality: '4K Ultra HD',
            duration: '4m 05s',
            genre: 'Aesthetic • Hunting Jajan',
            sub: 'Outfit udah rapi pake sweater ijo, tinggal nunggu diajak jalan-jalan hunting kuliner.',
            tag: 'OOTD Kece 🌿',
            rating: '28+'
        },
        { 
            id: 13,
            category: 'candid',
            episode: 'EPISODE 13',
            src: 'assets/images/Screenshot_20250416-225508_TikTok.jpg',
            caption: 'Random Video Call Mood 🥳', 
            match: '97% Cocok',
            year: '2025',
            quality: '4K Ultra HD',
            duration: '2m 55s',
            genre: 'Sitcom • Sesi Gibah',
            sub: 'Tangkapan layar pas lagi seru gibah atau cerita ngalor-ngidul sampe lupa waktu.',
            tag: 'Bocil Random 📱',
            rating: '28+'
        },
        { 
            id: 14,
            category: 'manis',
            episode: 'EPISODE 14',
            src: 'assets/images/IMG-20250321-WA0006.jpg',
            caption: 'Golden Hour Ala Patar 🌅', 
            match: '99% Cocok',
            year: '2025',
            quality: '4K Ultra HD',
            duration: '4m 40s',
            genre: 'Romance • Estetik Banget',
            sub: 'Cahaya matahari sore emang estetik, tapi tetep cantikan yang ada di depan kamera.',
            tag: 'Golden Hour ✨',
            rating: '28+'
        },
        { 
            id: 15,
            category: 'candid',
            episode: 'EPISODE 15',
            src: 'assets/images/Screenshot_20260818_235553_TikTok.jpg',
            caption: 'Muka Mupeng / Gemes 🍬', 
            match: '100% Cocok',
            year: '2026',
            quality: '4K Ultra HD',
            duration: '3m 10s',
            genre: 'Kawaii • Muka Mupeng',
            sub: 'Ekspresi pas lagi pengen sesuatu tapi malu-malu ngomongnya, gemesin parah!',
            tag: 'Super Gemoy 🥰',
            rating: '28+'
        },
        { 
            id: 16,
            category: 'ultah',
            episode: 'EPISODE 16',
            src: 'assets/images/IMG-20260831-WA0022.jpg',
            caption: 'Kesayangan Ojen Selamanya 💖', 
            match: '100% Cocok',
            year: '2026',
            quality: '4K Ultra HD',
            duration: '5m 28s',
            genre: 'Romance • Paling Juara',
            sub: 'Selamat ulang tahun ke-28 yaa patawu tercinta! Tetap jadi patar yang baik, lucu, dan selalu bahagia!',
            tag: 'Love You Always 💕',
            rating: '28+'
        }
    ];

    function drawCards(filter = 'all') {
        grid.innerHTML = '';
        const filtered = filter === 'all' ? memories : memories.filter(m => m.category === filter);

        filtered.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'netflix-ep-card';
            card.setAttribute('data-category', item.category);
            card.innerHTML = `
                <div class="ep-thumb-container">
                    <img src="${item.src}" alt="${item.caption}" class="ep-thumb-img" loading="lazy">
                    <div class="ep-thumb-gradient"></div>
                    
                    <div class="ep-n-badge">
                        <span class="n-red-icon">N</span>
                        <span class="n-brand-text">ORIGINAL</span>
                    </div>

                    <span class="ep-badge-pill">${item.episode}</span>

                    <div class="ep-thumb-meta-bar">
                        <span class="ep-tag-chip">${item.tag}</span>
                        <span class="ep-duration-chip">${item.duration}</span>
                    </div>

                    <div class="ep-hover-play-btn" title="Lihat Episode">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="#000"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </div>

                <div class="ep-card-body">
                    <div class="ep-title-row">
                        <h3 class="ep-card-title">${item.caption}</h3>
                        <span class="ep-quick-zoom" title="Buka Detail Episode">🔍</span>
                    </div>

                    <div class="ep-meta-row">
                        <span class="ep-match-pct">${item.match}</span>
                        <span class="ep-age-badge">${item.rating}</span>
                        <span class="ep-quality-badge">${item.quality}</span>
                        <span class="ep-year-badge">${item.year}</span>
                    </div>

                    <div class="ep-genre-line">${item.genre}</div>

                    <p class="ep-synopsis-text">${item.sub}</p>
                </div>
            `;
            card.addEventListener('click', () => openLightbox(item));
            grid.appendChild(card);
        });
    }

    drawCards('all');

    // Filter Tabs Handler
    const tabs = document.querySelectorAll('#gallery-filter-tabs .n-tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.getAttribute('data-filter') || 'all';
            drawCards(filter);
        });
    });
}
