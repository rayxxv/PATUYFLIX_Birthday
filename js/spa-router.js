/* ==========================================================================
   PATUYFLIX — Seamless SPA Router with Netflix "Next Episode" Overlay Card (spa-router.js)
   ========================================================================== */

(function() {
    const PAGE_MAP = {
        'index.html': { ep: 'EPISODE 1', title: 'Beranda Utama', category: 'PREMIERE', icon: '🍿', img: 'assets/images/20250329_174913.jpg', sub: 'Panggung perayaan ulang tahun ke-28 Patuy...' },
        'surprise.html': { ep: 'EPISODE 1', title: 'Kejutan Spesial Ultah', category: 'SPECIAL', icon: '🎈', img: 'assets/images/20250329_174913.jpg', sub: 'Pesta kejutan & lilin ulang tahun ke-28...' },
        'musik.html': { ep: 'EPISODE 2', title: 'Playlist Musik Spesial', category: 'SOUNDTRACK', icon: '🎵', img: 'assets/images/20241228_122939-1.jpg', sub: 'Kumpulan lagu favorit & melodi terindah pengiring ultah Patuy...' },
        'game.html': { ep: 'EPISODE 3', title: 'Game Tangkap Hati', category: 'ARCADE ZONE', icon: '🎮', img: 'assets/images/SNOW_20240228_122514_201.jpg', sub: 'Tangkap hati sebanyak-banyaknya untuk buka galeri!' },
        'galeri.html': { ep: 'EPISODE 4', title: 'Galeri Episode Kenangan', category: '16 EPISODES', icon: '📸', img: 'assets/images/SNOW_20250316_190509_670.jpg', sub: '16 episode momen gemas, estetik & random Patawu...' },
        'wordle.html': { ep: 'EPISODE 5', title: 'Wordle Tebak Kata', category: 'MINIGAME', icon: '🔠', img: 'assets/images/IMG-20241228-WA0007-1.jpg', sub: 'Tebak 5 huruf kata rahasia spesial Patuy...' },
        'video.html': { ep: 'EPISODE 6', title: 'Pesan Video Sinematik', category: 'CINEMATIC 4K', icon: '🎬', img: 'assets/video/patar-yt-thumbnail.jpg', sub: 'Tayangan video ucapan sinematik spesial ultah...' },
        'surat.html': { ep: 'EPISODE 7', title: 'Surat Ucapan Ulang Tahun', category: 'FINALE EPISODE', icon: '✉️', img: 'assets/images/IMG-20250321-WA0003.jpg', sub: 'Surat ucapan tulus & doa terbaik dari Ojen...' }
    };

    function getPageName(url) {
        if (!url) return 'index.html';
        const clean = url.split('#')[0].split('?')[0];
        const filename = clean.substring(clean.lastIndexOf('/') + 1);
        return filename || 'index.html';
    }

    function createOverlayIfNeeded() {
        let overlay = document.getElementById('netflix-transition-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'netflix-transition-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(10, 10, 14, 0.92);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                z-index: 999999;
                display: flex; align-items: center; justify-content: center;
                opacity: 0; visibility: hidden;
                transition: opacity 0.25s ease, visibility 0.25s ease;
                padding: 20px;
                box-sizing: border-box;
            `;

            overlay.innerHTML = `
                <div id="netflix-next-card" style="
                    background: #141419;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 24px;
                    padding: 28px;
                    width: 100%;
                    max-width: 580px;
                    box-shadow: 0 25px 60px rgba(0,0,0,0.95), 0 0 40px rgba(229, 9, 20, 0.25);
                    display: flex; flex-direction: column; gap: 20px;
                    transform: scale(0.92);
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    position: relative;
                ">
                    <!-- Close X Button -->
                    <button id="trans-close-btn" title="Batal & Tutup" style="
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.15);
                        color: #ffffff;
                        width: 34px;
                        height: 34px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.2rem;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        z-index: 10;
                    ">&times;</button>

                    <!-- Card Top Header -->
                    <div style="display: flex; align-items: center; justify-content: space-between; padding-right: 40px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="background: #e50914; color: #fff; padding: 4px 8px; border-radius: 6px; font-weight: 900; font-size: 0.85rem;">P</span>
                            <span style="color: #fff; font-weight: 800; font-size: 0.9rem; letter-spacing: 1.5px; text-transform: uppercase;">
                                SELANJUTNYA • <span id="trans-ep-num" style="color: #ff8da1;">EPISODE 2</span>
                            </span>
                        </div>
                        <div style="border: 1px solid rgba(229, 9, 20, 0.6); background: rgba(229, 9, 20, 0.12); color: #ff2a44; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 6px;">
                            <span style="width: 6px; height: 6px; border-radius: 50%; background: #ff2a44; display: inline-block;"></span>
                            <span>SIAP DIPUTAR</span>
                        </div>
                    </div>

                    <!-- Card Body Media Preview -->
                    <div style="display: flex; gap: 18px; align-items: center;">
                        <div style="position: relative; width: 140px; height: 90px; border-radius: 12px; overflow: hidden; flex-shrink: 0; background: #000; box-shadow: 0 8px 20px rgba(0,0,0,0.6);">
                            <img id="trans-thumb" src="assets/images/hero-banner.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                            <span id="trans-ep-badge" style="position: absolute; top: 6px; right: 6px; background: rgba(0,0,0,0.75); color: #fff; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;">EP 2</span>
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 36px; height: 36px; background: #e50914; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 4px 12px rgba(229,9,20,0.6);" id="trans-icon">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="#ffffff" style="margin-left: 2px;"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
                            <div style="font-size: 0.72rem; color: #e50914; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
                                SEASON 28 • <span id="trans-category" style="color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); padding: 1px 6px; border-radius: 3px;">SOUNDTRACK</span>
                            </div>
                            <h3 id="trans-title" style="font-size: 1.25rem; font-weight: 900; color: #ffffff; margin: 0; font-family: 'Montserrat', sans-serif;">Playlist Musik Spesial</h3>
                            <p id="trans-sub" style="font-size: 0.82rem; color: rgba(255,255,255,0.7); margin: 0; line-height: 1.4;">Kumpulan lagu favorit dan melodi terindah pengiring perayaan ulang tahun Patuy...</p>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <button id="trans-play-btn" style="
                        width: 100%;
                        padding: 16px;
                        background: linear-gradient(135deg, #e50914, #ff416c);
                        color: #ffffff;
                        border: none;
                        border-radius: 35px;
                        font-weight: 900;
                        font-size: 1.05rem;
                        cursor: pointer;
                        display: flex; align-items: center; justify-content: center; gap: 10px;
                        box-shadow: 0 8px 25px rgba(229, 9, 20, 0.5);
                        letter-spacing: 0.5px;
                    ">
                        <span>▶</span>
                        <span id="trans-btn-label">MEMUAT HALAMAN...</span>
                        <span style="font-size: 1.2rem;">➔</span>
                    </button>

                    <!-- Footer Note -->
                    <div style="text-align: center; font-size: 0.8rem; color: rgba(255,255,255,0.45); font-weight: 600;">
                        Terima kasih sudah menonton • Hope you liked it! 💕 :)
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
        }
        return overlay;
    }

    function reinitPage(pageName) {
        window.scrollTo(0, 0);

        // Hide Netflix Video Player HUD and Backdrop if navigating away from surprise.html
        if (pageName !== 'surprise.html') {
            const backdrop = document.getElementById('netflix-player-backdrop');
            const topHud = document.getElementById('netflix-player-top-hud');
            const bottomHud = document.getElementById('netflix-player-bottom-hud');
            if (backdrop) backdrop.classList.remove('player-hud-visible');
            if (topHud) topHud.classList.remove('player-hud-visible');
            if (bottomHud) bottomHud.classList.remove('player-hud-visible');
            document.body.classList.remove('ayush-dark-mode', 'ayush-room-lit', 'faahim-body', 'faahim-white-theme');
        }

        document.querySelectorAll('.netflix-nav-links a').forEach(a => {
            const href = a.getAttribute('href');
            if (href === pageName || (pageName === 'index.html' && href === 'index.html') || (pageName === '' && href === 'index.html')) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
        });

        if (pageName === 'index.html' || pageName === '') {
            if (typeof initCountdown === 'function') initCountdown();
        } else if (pageName === 'surprise.html') {
            if (typeof initSurpriseSequence === 'function') initSurpriseSequence();
        } else if (pageName === 'galeri.html') {
            if (typeof renderPolaroids === 'function') renderPolaroids();
            if (typeof initLightbox === 'function') initLightbox();
        } else if (pageName === 'surat.html') {
            const fireConfetti = () => {
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 90,
                        spread: 75,
                        origin: { y: 0.6 },
                        colors: ['#e50914', '#ff416c', '#ffd700', '#ffffff', '#ff9a9e']
                    });
                }
            };

            const ensureConfettiAndFire = () => {
                if (typeof confetti === 'function') {
                    fireConfetti();
                } else {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
                    script.onload = () => fireConfetti();
                    document.body.appendChild(script);
                }
            };

            const btn = document.getElementById('confetti-btn');
            if (btn) {
                btn.onclick = (e) => {
                    e.preventDefault();
                    ensureConfettiAndFire();
                };
            }
            // Auto celebrate once when opening letter
            setTimeout(ensureConfettiAndFire, 500);
        } else if (pageName === 'musik.html') {
            if (typeof initPlaylistPlayer === 'function') initPlaylistPlayer();
        } else if (pageName === 'game.html') {
            if (typeof initHeartsGame === 'function') {
                initHeartsGame();
            } else {
                const script = document.createElement('script');
                script.src = 'js/minigame-hearts.js';
                script.onload = () => {
                    if (typeof initHeartsGame === 'function') initHeartsGame();
                };
                document.body.appendChild(script);
            }
        } else if (pageName === 'wordle.html') {
            if (typeof initWordleGame === 'function') {
                initWordleGame();
            } else {
                // Dynamically load minigame-wordle.js if not yet in DOM
                const script = document.createElement('script');
                script.src = 'js/minigame-wordle.js';
                script.onload = () => {
                    if (typeof initWordleGame === 'function') initWordleGame();
                };
                document.body.appendChild(script);
            }
        } else if (pageName === 'video.html') {
            const video = document.getElementById('birthday-video');
            if (video) {
                video.onplay = () => {
                    if (window.GlobalMusic && window.GlobalMusic.isPlaying) window.GlobalMusic.pause();
                };
            }
        }
    }

    async function navigateTo(url, push = true) {
        try {
            const pageName = getPageName(url);

            // If current page is surprise.html, navigate directly so we completely reset all animation/theme states
            if (window.location.pathname.includes('surprise.html') || document.body.classList.contains('faahim-body') || document.body.classList.contains('ayush-room-lit')) {
                window.location.href = url;
                return;
            }

            // For returning to Home / Beranda or Profile, use clean browser navigation
            if (pageName === 'index.html' || pageName === '' || pageName === 'profile.html') {
                window.location.href = url;
                return;
            }

            const targetData = PAGE_MAP[pageName] || { ep: 'PATUYFLIX', title: 'Memuat Halaman...', category: 'SPECIAL', icon: '🍿', img: 'assets/images/hero-banner.jpg', sub: 'Sedang menyiapkan pengalaman sinematik...' };

            const overlay = createOverlayIfNeeded();
            const card = document.getElementById('netflix-next-card');

            // Populate card info
            document.getElementById('trans-ep-num').innerText = targetData.ep;
            document.getElementById('trans-ep-badge').innerText = targetData.ep.replace('EPISODE ', 'EP ');
            document.getElementById('trans-thumb').src = targetData.img;
            document.getElementById('trans-category').innerText = targetData.category;
            document.getElementById('trans-title').innerText = targetData.title;
            document.getElementById('trans-sub').innerText = targetData.sub;
            
            const transPlayBtn = document.getElementById('trans-play-btn');
            const transCloseBtn = document.getElementById('trans-close-btn');
            document.getElementById('trans-btn-label').innerText = `PUTAR ${targetData.title.toUpperCase()} SEKARANG`;

            // Show Overlay & Card
            overlay.style.visibility = 'visible';
            overlay.style.opacity = '1';
            if (card) card.style.transform = 'scale(1)';

            // Fetch target HTML content in background while waiting for action
            const fetchPromise = fetch(url).then(res => res.text());

            // Wait for user to explicitly click the red button OR cancel via X button
            const userAction = await new Promise((resolve) => {
                const handlePlay = () => {
                    cleanup();
                    document.getElementById('trans-btn-label').innerText = `MEMUAT...`;
                    resolve('play');
                };
                const handleClose = () => {
                    cleanup();
                    resolve('cancel');
                };
                function cleanup() {
                    transPlayBtn.removeEventListener('click', handlePlay);
                    if (transCloseBtn) transCloseBtn.removeEventListener('click', handleClose);
                }
                transPlayBtn.addEventListener('click', handlePlay);
                if (transCloseBtn) transCloseBtn.addEventListener('click', handleClose);
            });

            if (userAction === 'cancel') {
                overlay.style.opacity = '0';
                if (card) card.style.transform = 'scale(0.92)';
                setTimeout(() => {
                    overlay.style.visibility = 'hidden';
                }, 250);
                return;
            }

            const htmlText = await fetchPromise;
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            const currentMain = document.querySelector('main');
            const newMain = doc.querySelector('main');

            if (currentMain && newMain) {
                currentMain.innerHTML = newMain.innerHTML;
                currentMain.className = newMain.className;
                document.title = doc.title;

                // Sync body className from fetched page (e.g. netflix-theme)
                if (doc.body && doc.body.className) {
                    document.body.className = doc.body.className;
                } else {
                    document.body.className = 'netflix-theme';
                }

                reinitPage(pageName);

                if (push) {
                    history.pushState({ url }, doc.title, url);
                }
            } else {
                window.location.href = url;
            }

            // Hide Overlay
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            if (card) card.style.transform = 'scale(0.92)';
            setTimeout(() => {
                overlay.style.visibility = 'hidden';
            }, 250);

        } catch (e) {
            console.warn('SPA Navigation fallback:', e);
            window.location.href = url;
        }
    }

    // Intercept clicks on page links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }

        if (href.endsWith('.html') || href.includes('.html')) {
            e.preventDefault();
            navigateTo(href);
        }
    });

    // Handle back / forward
    window.addEventListener('popstate', () => {
        const pageName = getPageName(window.location.pathname);
        navigateTo(pageName, false);
    });

    // Run on initial load
    document.addEventListener('DOMContentLoaded', () => {
        const pageName = getPageName(window.location.pathname);
        reinitPage(pageName);
    });
})();
