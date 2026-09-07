/* ==========================================================================
   PATUYFLIX — Faahim x Ayush Sharma Birthday Animation Engine (surprise.js)
   1. Intro Music & Watermark
   2. "Hey Patuy 💕" -> "Hari ini hari ulang tahunmu yang ke-28!"
   3. WhatsApp Mockup typing & sent bubble pop
   4. Thought ideas 1-5 ("Kamu Sangat Spesial Buat Aku :)")
   5. Ayush Sharma Interactive Stages (Lights -> Banner -> Balloons -> Cake -> Candle -> Story)
   6. Grand Celebration (Patuy Photo + Party Hat + Elastic HBD + Confetti + Outro)
   (Refined with brisk, snappy transitions for seamless pacing)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Ensure background music is paused while on the intro card until user clicks start
    if (window.GlobalMusic && window.GlobalMusic.audio && !window.GlobalMusic.audio.paused) {
        window.GlobalMusic.pause();
    }

    const startBtn = document.getElementById('start-surprise-btn');
    const musicStage = document.getElementById('play-music-stage');
    const passcodeStage = document.getElementById('passcode-stage');

    if (startBtn && musicStage) {
        startBtn.addEventListener('click', () => {
            // 1. Start audio playback immediately with Track 0: "Partner (パートナー)" by Yuka (有華)
            if (window.GlobalMusic) {
                window.GlobalMusic.loadTrack(0, true);
            }

            // 2. Animate out the play music intro card
            musicStage.classList.add('stage-hidden');
            setTimeout(() => {
                musicStage.style.display = 'none';
                
                // 3. Show the secret 4-digit passcode lock stage
                if (passcodeStage) {
                    passcodeStage.style.display = 'flex';
                    initPasscodeStage();
                } else {
                    initFaahimAnimation();
                }
            }, 400);
        });
    } else {
        initFaahimAnimation();
    }
});

function initFaahimAnimation() {
    const container = document.querySelector('.faahim-stage-container');
    if (!container) return;

    // Split chatbox and HBD text into spans for character-by-character animation
    const textBoxChars = document.querySelector('.hbd-chatbox');
    const hbd = document.querySelector('.wish-hbd');

    if (textBoxChars && !textBoxChars.dataset.split) {
        const rawChat = (textBoxChars.dataset.rawText || textBoxChars.textContent).trim();
        textBoxChars.dataset.rawText = rawChat;
        textBoxChars.innerHTML = `<span>${rawChat.split('').join('</span><span>')}</span>`;
        textBoxChars.dataset.split = 'true';
    }

    if (hbd && !hbd.dataset.split) {
        const rawHbd = (hbd.dataset.rawText || hbd.textContent).trim();
        hbd.dataset.rawText = rawHbd;
        hbd.innerHTML = `<span>${rawHbd.split('').join('</span><span>')}</span>`;
        hbd.dataset.split = 'true';
    }

    // Kill any active tweens on stage elements
    TweenMax.killAll(false, true, true);

    // Reset Body Theme classes
    document.body.classList.remove('ayush-dark-mode', 'ayush-room-lit');

    // Clean up floating balloons from previous run
    const balloonStage = document.getElementById('ewishwell-balloon-stage');
    if (balloonStage) balloonStage.innerHTML = '';

    // Reset Ayush stage DOM classes
    const bulbGlass = document.querySelector('.ayush-bulb-glass');
    if (bulbGlass) bulbGlass.classList.remove('bulb-lit');
    const banner = document.querySelector('.ayush-banner-container');
    if (banner) banner.classList.remove('banner-visible');
    const balloons = document.querySelectorAll('.ayush-balloon');
    balloons.forEach(b => b.classList.remove('balloon-floated'));
    const cake = document.querySelector('.ayush-cake-container');
    if (cake) cake.classList.remove('cake-visible');
    const flame = document.querySelector('.candle-flame');
    if (flame) flame.classList.remove('flame-lit');
    const cardDeck = document.getElementById('ayush-story-card-deck');
    if (cardDeck) cardDeck.classList.remove('card-deck-visible');

    // Reset all scene containers inline styles (y, x, scale, rotation, opacity, zIndex)
    const allScenes = document.querySelectorAll('.one, .three, .four, .scene-04, .scene-05, .scene-06, .scene-07, .scene-08, .six, .seven, .eight, .nine, .lydia-dp, .hat, .cinema-kicker, .one-title, .two, .three-title, .pc-chat-app-mockup, .scene-title, .cinema-subtitle, .wish-hbd span, .wish h5, .nine p, #replay, .outro-actions, #ayush-story-card-deck, #story-flip-card, .netflix-outro-card, .netflix-play-next-hero-btn');
    TweenMax.set(allScenes, {
        clearProps: 'transform,opacity,visibility,scale,rotation,x,y,zIndex'
    });

    // Reset backdrop photo to initial
    changePlayerBackdrop('assets/images/hero-banner.jpg');
    updatePlayerHudProgress('20%', '01:28');

    // Instantiate GSAP Timeline
    const tl = new TimelineMax();

    tl
        // 0. Initial Clean State: Hide all future steps explicitly so nothing flashes
        .set('.one, .three, .four, .scene-04, .scene-05, .scene-06, .scene-07, .scene-08, .six, .seven, .eight, .nine', {
            autoAlpha: 0,
            y: 0,
            x: 0,
            scale: 1,
            rotation: 0
        })
        .set('#ayush-stage', {
            autoAlpha: 0,
            pointerEvents: 'none'
        })
        .set('.cinema-kicker, .one-title, .two, .three-title, .pc-chat-app-mockup, .scene-title, .cinema-subtitle, .netflix-outro-card', {
            autoAlpha: 0,
            y: 0,
            x: 0,
            scale: 1,
            rotation: 0
        })
        .set('.idea-5 .smiley, .last-smile', {
            rotation: 0,
            x: 0,
            y: 0
        })
        .set('#replay, .outro-actions', {
            pointerEvents: 'none'
        })
        .call(() => {
            showPlayerHud(true);
        })
        .to('.container', 0.1, {
            autoAlpha: 1
        })

        // 1. Step One (Netflix Scene 01: "Hey Patuy 💕")
        .call(() => {
            updatePlayerHudProgress('20%', '01:28');
        })
        .set('.one', {
            autoAlpha: 1
        })
        .fromTo('.one .cinema-kicker', 0.6, {
            autoAlpha: 0,
            y: 15
        }, {
            autoAlpha: 1,
            y: 0,
            ease: Power2.easeOut
        })
        .fromTo('.one .one-title', 0.75, {
            autoAlpha: 0,
            y: 25,
            scale: 0.92
        }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: Back.easeOut.config(1.2)
        }, '-=0.3')
        .fromTo('.one .two', 0.55, {
            autoAlpha: 0,
            scale: 0.9
        }, {
            autoAlpha: 1,
            scale: 1,
            ease: Back.easeOut.config(1.4)
        }, '-=0.15')
        .to('.one', 0.6, {
            autoAlpha: 0,
            y: -25,
            scale: 0.95,
            ease: Power2.easeIn
        }, '+=3.6')

        // 2. Step Two (Netflix Scene 02: "Hari ini hari ulang tahunmu yang ke-28! 🎉✨")
        .call(() => {
            changePlayerBackdrop('assets/images/20250329_174913.jpg');
            updatePlayerHudProgress('45%', '02:45');
        })
        .set('.three', {
            autoAlpha: 1
        })
        .fromTo('.three .cinema-kicker', 0.6, {
            autoAlpha: 0,
            y: 15
        }, {
            autoAlpha: 1,
            y: 0,
            ease: Power2.easeOut
        })
        .fromTo('.three .three-title', 0.75, {
            autoAlpha: 0,
            y: 25,
            scale: 0.92
        }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: Back.easeOut.config(1.2)
        }, '-=0.3')
        .to('.three', 0.6, {
            autoAlpha: 0,
            y: -25,
            scale: 0.95,
            ease: Power2.easeIn
        }, '+=4.0')

        // 3. Step Three (WhatsApp Desktop / PC Chat App Mockup)
        .call(() => {
            changePlayerBackdrop('assets/images/20241228_122939-1.jpg');
            updatePlayerHudProgress('65%', '03:55');
        })
        .set('.four', {
            autoAlpha: 1
        })
        .set('.hbd-chatbox', {
            opacity: 1,
            display: 'inline'
        })
        .set('.hbd-chatbox span', {
            autoAlpha: 0
        })
        .set('.wa-cursor', {
            display: 'inline'
        })
        .set('.wa-chat-bubble', {
            autoAlpha: 0,
            scale: 0.2
        })
        .fromTo('.four .pc-chat-app-mockup', 0.7, {
            scale: 0.85,
            autoAlpha: 0,
            y: 30
        }, {
            scale: 1,
            autoAlpha: 1,
            y: 0,
            ease: Back.easeOut.config(1.15)
        })
        .fromTo('.four .cinema-kicker', 0.5, {
            autoAlpha: 0,
            y: 10
        }, {
            autoAlpha: 1,
            y: 0,
            ease: Power2.easeOut
        }, '-=0.45')
        // Typing characters into input dock (smooth typewriter pace)
        .staggerTo('.hbd-chatbox span', 0.03, {
            autoAlpha: 1
        }, 0.025, '+=0.4')
        // Short pause after finish typing before clicking send
        .to('.fake-btn', 0.16, {
            scale: 0.82,
            backgroundColor: '#008f6f'
        }, '+=0.6')
        .to('.fake-btn', 0.16, {
            scale: 1,
            backgroundColor: '#00a884'
        })
        // Clear input dock & pop sent chat bubble into chat wallpaper
        .set('.hbd-chatbox, .wa-cursor', {
            display: 'none'
        })
        .fromTo('.wa-chat-bubble', 0.5, {
            scale: 0.2,
            autoAlpha: 0,
            y: 15,
            transformOrigin: 'bottom right'
        }, {
            scale: 1,
            autoAlpha: 1,
            y: 0,
            ease: Back.easeOut.config(1.35)
        }, '-=0.05')
        // Ample hold for reading the sent WhatsApp message comfortably
        .to('.four', 0.6, {
            scale: 0.85,
            autoAlpha: 0,
            y: -40,
            ease: Back.easeIn.config(1.1)
        }, '+=4.5')

        // 4. Step Four: Scene 04 ("Itu yang tadinya mau aku kirim...")
        .call(() => {
            changePlayerBackdrop('assets/images/IMG-20250403-WA0010.jpg');
            updatePlayerHudProgress('72%', '04:30');
        })
        .set('.scene-04', {
            autoAlpha: 1
        })
        .fromTo('.scene-04 .cinema-kicker', 0.6, {
            autoAlpha: 0,
            y: 15
        }, {
            autoAlpha: 1,
            y: 0,
            ease: Power2.easeOut
        })
        .fromTo('.scene-04 .scene-title', 0.7, {
            autoAlpha: 0,
            y: 25,
            scale: 0.92
        }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: Back.easeOut.config(1.2)
        }, '-=0.2')
        .fromTo('.scene-04 .cinema-subtitle', 0.55, {
            autoAlpha: 0,
            scale: 0.88
        }, {
            autoAlpha: 1,
            scale: 1,
            ease: Back.easeOut.config(1.4)
        }, '-=0.2')
        .to('.scene-04', 0.55, {
            autoAlpha: 0,
            y: -25,
            scale: 0.95,
            ease: Power2.easeIn
        }, '+=3.8')

        // 5. Step Five: Scene 05 ("Tapi terus aku berhenti berpikir.")
        .call(() => {
            changePlayerBackdrop('assets/images/IMG-20250501-WA0010.jpg');
            updatePlayerHudProgress('79%', '05:10');
        })
        .set('.scene-05', {
            autoAlpha: 1
        })
        .fromTo('.scene-05 .cinema-kicker', 0.6, {
            autoAlpha: 0,
            y: 15
        }, {
            autoAlpha: 1,
            y: 0,
            ease: Power2.easeOut
        })
        .fromTo('.scene-05 .scene-title', 0.7, {
            autoAlpha: 0,
            y: 25,
            scale: 0.92
        }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: Back.easeOut.config(1.2)
        }, '-=0.2')
        .fromTo('.scene-05 .cinema-subtitle', 0.55, {
            autoAlpha: 0,
            scale: 0.88
        }, {
            autoAlpha: 1,
            scale: 1,
            ease: Back.easeOut.config(1.4)
        }, '-=0.2')
        .to('.scene-05', 0.55, {
            autoAlpha: 0,
            y: -25,
            scale: 0.95,
            ease: Power2.easeIn
        }, '+=4.0')

        // 6. Step Six: Scene 06 ("Aku ingin membuat sesuatu yang SPESIAL!")
        .call(() => {
            changePlayerBackdrop('assets/images/IMG-20250809-WA0005.jpg');
            updatePlayerHudProgress('86%', '05:45');
        })
        .set('.scene-06', {
            autoAlpha: 1
        })
        .fromTo('.scene-06 .cinema-kicker', 0.6, {
            autoAlpha: 0,
            y: 15
        }, {
            autoAlpha: 1,
            y: 0,
            ease: Power2.easeOut
        })
        .fromTo('.scene-06 .scene-title', 0.7, {
            autoAlpha: 0,
            y: 25,
            scale: 0.92
        }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: Back.easeOut.config(1.2)
        }, '-=0.2')
        .fromTo('.scene-06 .cinema-subtitle', 0.55, {
            autoAlpha: 0,
            scale: 0.88
        }, {
            autoAlpha: 1,
            scale: 1,
            ease: Back.easeOut.config(1.4)
        }, '-=0.15')
        .to('.scene-06', 0.55, {
            autoAlpha: 0,
            y: -25,
            scale: 0.95,
            ease: Power2.easeIn
        }, '+=4.0')

        // 7. Step Seven: Scene 07 ("Kamu Sangat Spesial Buat Aku :)")
        .call(() => {
            changePlayerBackdrop('assets/images/IMG-20251122-WA0021.jpg');
            updatePlayerHudProgress('92%', '06:20');
        })
        .set('.scene-07', {
            autoAlpha: 1
        })
        .fromTo('.scene-07 .cinema-kicker', 0.6, {
            autoAlpha: 0,
            y: 15
        }, {
            autoAlpha: 1,
            y: 0,
            ease: Power2.easeOut
        })
        .fromTo('.scene-07 .scene-title', 0.7, {
            autoAlpha: 0,
            y: 25,
            scale: 0.92
        }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: Back.easeOut.config(1.2)
        }, '-=0.2')
        .fromTo('.scene-07 .cinema-subtitle', 0.55, {
            autoAlpha: 0,
            scale: 0.88
        }, {
            autoAlpha: 1,
            scale: 1,
            ease: Back.easeOut.config(1.4)
        }, '-=0.15')
        .to('.scene-07', 0.6, {
            scale: 0.9,
            autoAlpha: 0,
            y: -25,
            ease: Power2.easeIn
        }, '+=4.2')

        // 8. Step Eight: Scene 08 (Giant "SO" Typography)
        .call(() => {
            changePlayerBackdrop('assets/images/hero-banner.jpg');
            updatePlayerHudProgress('96%', '06:50');
        })
        .set('.scene-08', {
            autoAlpha: 1
        })
        .fromTo('.scene-08 .cinema-kicker', 0.6, {
            autoAlpha: 0,
            y: 15
        }, {
            autoAlpha: 1,
            y: 0,
            ease: Power2.easeOut
        })
        .fromTo('.scene-08 .scene-title', 0.75, {
            scale: 0.2,
            autoAlpha: 0,
            rotation: -10
        }, {
            scale: 1,
            autoAlpha: 1,
            rotation: 0,
            ease: Back.easeOut.config(1.4)
        }, '-=0.2')
        .fromTo('.scene-08 .cinema-subtitle', 0.6, {
            autoAlpha: 0,
            scale: 0.88,
            y: 15
        }, {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            ease: Back.easeOut.config(1.4)
        }, '-=0.15')
        .to('.scene-08', 0.6, {
            scale: 1.15,
            autoAlpha: 0,
            ease: Expo.easeIn
        }, '+=3.5')

        // Scene 09: Massive Festive Balloon Cluster Release
        .call(() => {
            updatePlayerHudProgress('98%', '07:00');
            // 1. Release massive cluster of extra large balloons FIRST (48 balloons)
            launchEwishwellBalloons({ count: 48, isTransition: true });
        })
        // 2. Wait 2.2s while the massive balloon wave rises and completely covers the screen
        .to({}, 2.2, {})

        // 3. WHILE THE SCREEN IS FULLY COVERED: Seamlessly switch to dark room & interactive bulb
        .call(() => {
            showPlayerHud(false);
            document.body.classList.add('ayush-dark-mode');
            initAyushInteractiveStages(tl);
        });
}

/* ==========================================================================
   Ayush Sharma Interactive Multi-Stage Controller (Brisk Pacing)
   ========================================================================== */
function initAyushInteractiveStages(mainTl) {
    const ayushStage = document.getElementById('ayush-stage');
    const stepBtn = document.getElementById('ayush-step-btn');
    if (!ayushStage || !stepBtn) return;

    // Reset and smooth fade-in for Ayush Stage in pure black dark room
    ayushStage.style.visibility = 'visible';
    ayushStage.style.opacity = '1';
    ayushStage.style.pointerEvents = 'auto';
    stepBtn.style.display = 'inline-flex';
    stepBtn.style.visibility = 'visible';
    stepBtn.style.opacity = '1';
    stepBtn.style.pointerEvents = 'auto';
    if (typeof TweenMax !== 'undefined') {
        TweenMax.fromTo(ayushStage, 0.6, { opacity: 0 }, { opacity: 1, ease: Power2.easeOut });
        TweenMax.fromTo(stepBtn, 0.6, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, ease: Back.easeOut.config(1.5) });
    }

    const bulbGlass = document.querySelector('.ayush-bulb-glass');
    const banner = document.querySelector('.ayush-banner-container');
    const balloons = document.querySelectorAll('.ayush-balloon, .natural-balloon');
    const cake = document.querySelector('.ayush-cake-container');
    const flame = document.querySelector('.candle-flame');
    const btnIcon = stepBtn.querySelector('.ayush-btn-icon');
    const btnText = stepBtn.querySelector('.ayush-btn-text');

    let currentStep = 1;

    function updateButton(icon, text) {
        if (btnIcon) btnIcon.textContent = icon;
        if (btnText) btnText.textContent = text;
        TweenMax.fromTo(stepBtn, 0.3, { scale: 0.88 }, { scale: 1, ease: Back.easeOut.config(1.6) });
    }

    // Set initial button to '💡 Nyalakan Lampu'
    updateButton('💡', 'Nyalakan Lampu');

    function advanceAyushStep() {
        switch (currentStep) {
            case 1:
                // Step 1: Turn on Lights -> Smooth radiant bloom to pure clean WHITE!
                if (bulbGlass) bulbGlass.classList.add('bulb-lit');
                document.body.classList.remove('ayush-dark-mode');
                document.body.classList.add('ayush-room-lit');
                const bulbContainer = document.querySelector('.ayush-bulb-container');
                if (bulbContainer && typeof TweenMax !== 'undefined') {
                    TweenMax.fromTo(bulbContainer, 0.9, { opacity: 0, y: -40 }, { opacity: 1, y: 0, ease: Back.easeOut.config(1.2) });
                }
                updateButton('🎀', 'Pasang Dekorasi Pesta');
                currentStep++;
                break;

            case 2:
                // Step 2: Let's Decorate (Grand festive party decor suite)
                if (banner) banner.classList.add('banner-visible');

                // Pop dual celebratory party confetti
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 50,
                        spread: 60,
                        origin: { x: 0.15, y: 0.65 },
                        colors: ['#f43f5e', '#facc15', '#38bdf8', '#a855f7', '#4ade80']
                    });
                    confetti({
                        particleCount: 50,
                        spread: 60,
                        origin: { x: 0.85, y: 0.65 },
                        colors: ['#f43f5e', '#facc15', '#38bdf8', '#a855f7', '#4ade80']
                    });
                }

                updateButton('🎈', 'Terbangkan Balon');
                currentStep++;
                break;

            case 3:
                // Step 3: Fly with Balloons
                balloons.forEach((b, idx) => {
                    setTimeout(() => {
                        b.classList.add('balloon-floated');
                    }, idx * 120);
                });
                launchEwishwellBalloons({ count: 24 });
                updateButton('🎂', 'Bawa Kue Ulang Tahun');
                currentStep++;
                break;

            case 4:
                // Step 4: Birthday Cake
                if (cake) cake.classList.add('cake-visible');
                updateButton('🕯️', 'Nyalakan Lilin Ulang Tahun');
                currentStep++;
                break;

            case 5:
                // Step 5: Light Candle
                if (flame) flame.classList.add('flame-lit');
                updateButton('🎂', 'Tiup Lilin');
                currentStep++;
                break;

            case 6:
                // Step 6: Tiup Lilin (Blow Candle) & Open Interactive Story Card Deck
                if (flame) {
                    flame.classList.remove('flame-lit');
                }
                // Celebratory puff of confetti on blowing candle
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 45,
                        spread: 60,
                        origin: { x: 0.5, y: 0.5 },
                        colors: ['#ffffff', '#facc15', '#f43f5e', '#a855f7', '#38bdf8']
                    });
                }
                if (cake) {
                    TweenMax.to(cake, 0.45, {
                        opacity: 0,
                        scale: 0.7,
                        delay: 0.15,
                        ease: Power2.easeIn,
                        onComplete: () => {
                            cake.classList.remove('cake-visible');
                            cake.style.display = 'none';
                        }
                    });
                }
                
                // Hide the bottom dock button so user interacts directly with the Card Deck
                if (stepBtn) {
                    TweenMax.to(stepBtn, 0.35, {
                        opacity: 0,
                        scale: 0.8,
                        ease: Power2.easeIn,
                        onComplete: () => {
                            stepBtn.style.display = 'none';
                        }
                    });
                }

                setTimeout(() => {
                    initStoryCardDeck();
                }, 200);
                currentStep++;
                break;

            case 7:
                // Step 7: Transition directly into Grand Celebration Stage
                triggerGrandCelebrationStage();
                break;
        }
    }

    // Interactive Story Card Deck Logic
    // Interactive Story Card Deck Logic (Ultra-Smooth GSAP Transition)
    function initStoryCardDeck() {
        const cardDeck = document.getElementById('ayush-story-card-deck');
        const flipCard = document.getElementById('story-flip-card');
        const prevBtn = document.getElementById('story-prev-btn');
        const nextBtn = document.getElementById('story-next-btn');
        const nextText = document.getElementById('story-next-text');
        const nextArrow = document.getElementById('story-next-arrow');
        const curPage = document.getElementById('story-cur-page');
        const slides = document.querySelectorAll('.story-card-slide');
        const dots = document.querySelectorAll('.story-dot');

        if (!cardDeck || !flipCard) return;

        let activeSlide = 1;
        let isAnimating = false;
        const totalSlides = slides.length || 7;

        // Reveal Card Deck with smooth, jitter-free pop-in
        cardDeck.style.display = 'block';
        cardDeck.classList.add('card-deck-visible');
        if (typeof TweenMax !== 'undefined') {
            TweenMax.fromTo(cardDeck, 0.65, {
                opacity: 0,
                scale: 0.88,
                y: 20
            }, {
                opacity: 1,
                scale: 1,
                y: 0,
                ease: Back.easeOut.config(1.2)
            });
        }

        // Set initial slide state
        slides.forEach((slide, idx) => {
            if (idx === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        if (typeof TweenMax !== 'undefined') {
            TweenMax.set(flipCard, { rotationY: 0, transformPerspective: 1600 });
        }

        function updateDeckUI(direction = 'next') {
            const targetSlideEl = document.querySelector(`.story-card-slide[data-slide="${activeSlide}"]`);

            if (typeof TweenMax !== 'undefined') {
                const flipOutAngle = direction === 'next' ? -90 : 90;
                const flipInAngle = direction === 'next' ? 90 : -90;

                // Phase 1: Flip front to edge-on (0 -> ±90deg)
                TweenMax.to(flipCard, 0.24, {
                    rotationY: flipOutAngle,
                    scale: 0.93,
                    ease: Power2.easeIn,
                    onComplete: () => {
                        // At 90 deg (edge-on), switch slide & counter seamlessly
                        slides.forEach(s => s.classList.remove('active'));
                        if (targetSlideEl) {
                            targetSlideEl.classList.add('active');
                        }

                        // Update counter with bouncy pop
                        if (curPage) {
                            curPage.textContent = activeSlide;
                        }

                        // Update dots
                        dots.forEach((dot, idx) => {
                            if (idx + 1 === activeSlide) {
                                dot.classList.add('active');
                            } else {
                                dot.classList.remove('active');
                            }
                        });

                        // Update buttons
                        if (prevBtn) {
                            prevBtn.disabled = (activeSlide === 1);
                        }

                        if (nextBtn && nextText && nextArrow) {
                            if (activeSlide === totalSlides) {
                                nextText.textContent = '🎉 Buka Kejutan Puncak!';
                                nextArrow.textContent = '➔';
                                nextBtn.classList.add('finale-btn');
                            } else {
                                nextText.textContent = 'Selanjutnya';
                                nextArrow.textContent = '▶';
                                nextBtn.classList.remove('finale-btn');
                            }
                        }

                        // Position card on incoming edge-on side (±90deg)
                        TweenMax.set(flipCard, { rotationY: flipInAngle });

                        // Phase 2: Complete the flip (±90deg -> 0deg front)
                        TweenMax.to(flipCard, 0.32, {
                            rotationY: 0,
                            scale: 1,
                            ease: Back.easeOut.config(1.2),
                            onComplete: () => {
                                isAnimating = false;
                            }
                        });
                    }
                });
            } else {
                slides.forEach(s => s.classList.remove('active'));
                if (targetSlideEl) targetSlideEl.classList.add('active');
                if (curPage) curPage.textContent = activeSlide;
                isAnimating = false;
            }
        }

        // Prev Click
        if (prevBtn) {
            prevBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (activeSlide > 1 && !isAnimating) {
                    isAnimating = true;
                    activeSlide--;
                    updateDeckUI('prev');
                }
            };
        }

        // Next Click
        if (nextBtn) {
            nextBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (activeSlide < totalSlides && !isAnimating) {
                    isAnimating = true;
                    activeSlide++;
                    updateDeckUI('next');
                } else if (activeSlide === totalSlides && !isAnimating) {
                    // Reached finale on last card -> Transition to Grand Celebration
                    isAnimating = true;
                    TweenMax.to(cardDeck, 0.45, {
                        opacity: 0,
                        scale: 0.85,
                        y: -20,
                        ease: Power2.easeIn,
                        onComplete: () => {
                            cardDeck.classList.remove('card-deck-visible');
                            triggerGrandCelebrationStage();
                        }
                    });
                }
            };
        }

        // Dot Direct Click Navigation
        dots.forEach((dot, idx) => {
            dot.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const targetSlide = idx + 1;
                if (targetSlide !== activeSlide && !isAnimating) {
                    isAnimating = true;
                    const dir = targetSlide > activeSlide ? 'next' : 'prev';
                    activeSlide = targetSlide;
                    updateDeckUI(dir);
                }
            };
        });

        // Initialize state
        updateDeckUI('next');
    }

    // Step button strictly advances ONLY on user click (Manual)
    stepBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        advanceAyushStep();
    };
}

/* ==========================================================================
   Grand Celebration Stage Controller (Matches user's requested reveal page)
   ========================================================================== */
function triggerGrandCelebrationStage() {
    const ayushStage = document.getElementById('ayush-stage');
    if (ayushStage) {
        TweenMax.to(ayushStage, 0.6, {
            opacity: 0,
            ease: Power2.easeInOut,
            onComplete: () => {
                ayushStage.style.visibility = 'hidden';
                ayushStage.style.pointerEvents = 'none';
            }
        });
    }

    document.body.classList.remove('ayush-dark-mode', 'ayush-room-lit');

    const finalTl = new TimelineMax();

    finalTl
        // 1. Step Five (Launch eWishWell Floating Flying Balloon Cascade in Celebration)
        .call(() => {
            changePlayerBackdrop('assets/images/hero-banner.jpg');
            updatePlayerHudProgress('100%', '07:09');
            showPlayerHud(false);
            launchEwishwellBalloons({ count: 28, durationMin: 4.6, durationMax: 6.0 });
        })

        // 2. Step Six (Patuy Photo + Birthday Hat drop on upper-right head + Elastic Happy Birthday)
        .set('.six', {
            autoAlpha: 1,
            visibility: 'visible',
            zIndex: 25
        })
        .fromTo('.lydia-dp', 0.7, {
            scale: 2.5,
            autoAlpha: 0,
            y: 30
        }, {
            scale: 1,
            autoAlpha: 1,
            y: 0,
            ease: Back.easeOut.config(1.2)
        }, '+=0.2')
        .fromTo('.hat', 0.65, {
            y: -120,
            rotation: 5,
            autoAlpha: 0
        }, {
            y: 0,
            rotation: 20,
            autoAlpha: 1,
            ease: Bounce.easeOut
        })
        .staggerFromTo('.wish-hbd span', 0.6, {
            autoAlpha: 0,
            y: -35,
            rotation: 120,
            skewX: '20deg'
        }, {
            autoAlpha: 1,
            y: 0,
            rotation: 0,
            skewX: '0deg',
            ease: Elastic.easeOut.config(1, 0.5)
        }, 0.06)
        .fromTo('.wish h5', 0.5, {
            autoAlpha: 0,
            y: 15
        }, {
            autoAlpha: 1,
            y: 0,
            ease: Power2.easeOut
        }, 'party')

        // 3. Step Seven (9 Expanding Concentric Colored SVGs - Soft background burst strictly behind photo)
        .set('.eight', {
            autoAlpha: 1,
            visibility: 'visible',
            zIndex: 2
        })
        .staggerTo('.eight svg', 1.0, {
            visibility: 'visible',
            opacity: 0,
            scale: 85,
            repeat: 0
        }, 0.15, '+=0.8')

        // Hold photo and celebration for 3 seconds so user can enjoy it
        .to('.six', 0.55, {
            autoAlpha: 0,
            y: 25,
            zIndex: -1,
            ease: Power2.easeIn
        }, '+=3.0')

        // 4. Step Eight (Compact Aesthetic Netflix Next Episode Card Outro)
        .call(() => {
            showPlayerHud(false);
        })
        .set('.nine', {
            autoAlpha: 1,
            visibility: 'visible',
            display: 'flex',
            zIndex: 60,
            pointerEvents: 'auto'
        })
        .fromTo('.netflix-outro-card', 0.75, {
            autoAlpha: 0,
            y: 30,
            scale: 0.92
        }, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: Back.easeOut.config(1.2)
        })
        .fromTo('.netflix-play-next-hero-btn', 0.6, {
            scale: 0.88,
            autoAlpha: 0
        }, {
            scale: 1,
            autoAlpha: 1,
            ease: Back.easeOut.config(1.5)
        }, '-=0.2')
        .set('.netflix-play-next-hero-btn', {
            pointerEvents: 'auto'
        });
}

/* ==========================================================================
   Netflix Secret Passcode Stage Controller
   ========================================================================== */
function initPasscodeStage() {
    const passcodeStage = document.getElementById('passcode-stage');
    const pinInputs = [
        document.getElementById('pin-1'),
        document.getElementById('pin-2'),
        document.getElementById('pin-3'),
        document.getElementById('pin-4')
    ];
    const submitBtn = document.getElementById('submit-passcode-btn');
    const feedback = document.getElementById('passcode-feedback');
    const hintBtn = document.getElementById('passcode-hint-btn');
    const hintText = document.getElementById('passcode-hint-text');
    const lockIcon = document.getElementById('passcode-lock-icon');

    if (!pinInputs[0]) return;

    // Reset inputs
    pinInputs.forEach(input => {
        if (input) {
            input.value = '';
            input.classList.remove('pin-error', 'pin-success', 'filled');
        }
    });
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'passcode-feedback';
    }
    if (lockIcon) lockIcon.textContent = '🔒';

    // Auto-focus first input box
    setTimeout(() => {
        pinInputs[0].focus();
    }, 200);

    // Setup auto-advance and navigation for PIN boxes
    pinInputs.forEach((input, index) => {
        if (!input) return;

        input.oninput = (e) => {
            const val = e.target.value.replace(/\D/g, '');
            e.target.value = val ? val.slice(-1) : '';

            if (e.target.value) {
                e.target.classList.add('filled');
                if (index < pinInputs.length - 1) {
                    pinInputs[index + 1].focus();
                } else {
                    // All 4 boxes filled, verify code automatically
                    verifyPasscode();
                }
            } else {
                e.target.classList.remove('filled');
            }
        };

        input.onkeydown = (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                pinInputs[index - 1].focus();
            } else if (e.key === 'Enter') {
                verifyPasscode();
            }
        };

        // Support pasting full 4-digit code
        input.onpaste = (e) => {
            e.preventDefault();
            const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim().replace(/\D/g, '');
            if (pasteData.length >= 4) {
                pinInputs.forEach((box, i) => {
                    box.value = pasteData[i] || '';
                    box.classList.add('filled');
                });
                verifyPasscode();
            }
        };
    });

    // Toggle hint
    if (hintBtn && hintText) {
        hintBtn.onclick = () => {
            hintText.style.display = (hintText.style.display === 'none') ? 'block' : 'none';
        };
    }

    // Submit button
    if (submitBtn) {
        submitBtn.onclick = (e) => {
            e.preventDefault();
            verifyPasscode();
        };
    }

    function verifyPasscode() {
        const enteredPin = pinInputs.map(box => box.value).join('');

        if (enteredPin.length < 4) {
            if (feedback) {
                feedback.textContent = '⚠️ Masukkan 4 digit PIN lengkap terlebih dahulu!';
                feedback.className = 'passcode-feedback text-error';
            }
            return;
        }

        // Valid PINs: 0709 (07 September - Tanggal Lahir Patuy), 2807 (28th Birthday on 7th), 0728
        const validPins = ['0709', '2807', '0728'];

        if (validPins.includes(enteredPin)) {
            // Success Unlock
            if (feedback) {
                feedback.textContent = '✅ PIN BENAR! MEMBUKA PREMIERE SPESIAL PATUY...';
                feedback.className = 'passcode-feedback text-success';
            }
            if (lockIcon) {
                lockIcon.textContent = '🔓';
                TweenMax.fromTo(lockIcon, 0.4, { scale: 0.8 }, { scale: 1.25, ease: Back.easeOut.config(1.8) });
            }

            pinInputs.forEach(box => {
                box.classList.remove('pin-error');
                box.classList.add('pin-success');
            });

            setTimeout(() => {
                passcodeStage.classList.add('stage-hidden');
                setTimeout(() => {
                    passcodeStage.style.display = 'none';
                    initFaahimAnimation();
                }, 500);
            }, 700);
        } else {
            // Strictly Reject Incorrect PIN
            if (feedback) {
                feedback.textContent = '❌ PIN salah! Coba cek petunjuk di bawah ya...';
                feedback.className = 'passcode-feedback text-error';
            }
            const pinRow = document.getElementById('passcode-pin-row');
            if (pinRow && typeof TweenMax !== 'undefined') {
                TweenMax.fromTo(pinRow, 0.4, { x: -14 }, { x: 0, ease: RoughEase.ease ? RoughEase.ease.config({ strength: 2, points: 10, randomize: false }) : Elastic.easeOut.config(1.2, 0.3) });
            }

            pinInputs.forEach(box => {
                box.classList.add('pin-error');
            });

            setTimeout(() => {
                pinInputs.forEach(box => {
                    box.value = '';
                    box.classList.remove('pin-error', 'filled');
                });
                pinInputs[0].focus();
            }, 600);
        }
    }
}

/* ==========================================================================
   Netflix Player HUD & Dynamic Background Crossfader
   ========================================================================== */
let currentBgSlot = 1;

// Preload all backdrop images to eliminate any decoding / network blank flicker
const playerBackdropImages = [
    'assets/images/hero-banner.jpg',
    'assets/images/20250329_174913.jpg',
    'assets/images/20241228_122939-1.jpg',
    'assets/images/IMG-20250403-WA0010.jpg',
    'assets/images/IMG-20250501-WA0010.jpg',
    'assets/images/IMG-20250809-WA0005.jpg',
    'assets/images/IMG-20251122-WA0021.jpg',
    'assets/images/20251130_222509.jpg'
];
playerBackdropImages.forEach(src => {
    const img = new Image();
    img.src = src;
});

function showPlayerHud(show) {
    const backdrop = document.getElementById('netflix-player-backdrop');
    const topHud = document.getElementById('netflix-player-top-hud');
    const bottomHud = document.getElementById('netflix-player-bottom-hud');

    if (show) {
        if (backdrop) backdrop.classList.add('player-hud-visible');
        if (topHud) topHud.classList.add('player-hud-visible');
        if (bottomHud) bottomHud.classList.add('player-hud-visible');
    } else {
        if (backdrop) backdrop.classList.remove('player-hud-visible');
        if (topHud) topHud.classList.remove('player-hud-visible');
        if (bottomHud) bottomHud.classList.remove('player-hud-visible');
    }
}

function changePlayerBackdrop(photoUrl) {
    const bg1 = document.getElementById('player-bg-1');
    const bg2 = document.getElementById('player-bg-2');
    if (!bg1 || !bg2) return;

    const activeBg = currentBgSlot === 1 ? bg1 : bg2;
    const incomingBg = currentBgSlot === 1 ? bg2 : bg1;

    // Check if the incoming background already has this photo url to avoid redundant crossfades
    const activeUrl = activeBg.style.backgroundImage || '';
    if (activeUrl.includes(photoUrl) && parseFloat(window.getComputedStyle(activeBg).opacity) > 0.8) {
        return;
    }

    incomingBg.style.backgroundImage = `url('${photoUrl}')`;
    if (typeof TweenMax !== 'undefined') {
        TweenMax.to(incomingBg, 0.7, { opacity: 1, ease: Power1.easeInOut });
        TweenMax.to(activeBg, 0.7, { opacity: 0, ease: Power1.easeInOut });
    } else {
        incomingBg.style.opacity = '1';
        activeBg.style.opacity = '0';
    }

    currentBgSlot = currentBgSlot === 1 ? 2 : 1;
}

function updatePlayerHudProgress(percentage, currentTime) {
    const progressBar = document.getElementById('netflix-hud-progress');
    const timeDisplay = document.getElementById('hud-current-time');

    if (progressBar) {
        progressBar.style.width = percentage;
    }
    if (timeDisplay && currentTime) {
        timeDisplay.textContent = currentTime;
    }
}

function setThoughtsKickerText(text) {
    const kickerText = document.getElementById('thoughts-kicker-text');
    if (kickerText) {
        kickerText.textContent = text;
    }
}

function updateThoughtsKicker(newText) {
    const kickerText = document.getElementById('thoughts-kicker-text');
    if (!kickerText) return;

    if (typeof TweenMax !== 'undefined') {
        TweenMax.to(kickerText, 0.2, {
            autoAlpha: 0,
            ease: Power1.easeIn,
            onComplete: () => {
                kickerText.textContent = newText;
                TweenMax.to(kickerText, 0.25, { autoAlpha: 1, ease: Power1.easeOut });
            }
        });
    } else {
        kickerText.textContent = newText;
    }
}

/* ==========================================================================
   eWishWell High-Performance Dynamic Balloon Engine
   Directly matching eWishWell React Framer Motion Balloon Effect
   ========================================================================== */
const EWISHWELL_BALLOON_PALETTES = [
    { main: '#ff4d6d', light: '#ff8fa3', dark: '#c9184a' }, // Ruby Pink
    { main: '#ffb703', light: '#ffe169', dark: '#fb8500' }, // Gold Sun
    { main: '#4cc9f0', light: '#90e0ef', dark: '#0077b6' }, // Sky Cyan
    { main: '#a78bfa', light: '#c4b5fd', dark: '#7c3aed' }, // Lavender Violet
    { main: '#06d6a0', light: '#70e000', dark: '#008000' }, // Mint Emerald
    { main: '#f72585', light: '#ff70a6', dark: '#b5179e' }, // Vivid Magenta
    { main: '#fb5607', light: '#ff9e00', dark: '#d00000' }, // Sunset Orange
    { main: '#38bdf8', light: '#7dd3fc', dark: '#0284c7' }, // Ice Blue
    { main: '#f43f5e', light: '#fda4af', dark: '#be123c' }, // Rose Pink
    { main: '#8b5cf6', light: '#ddd6fe', dark: '#6d28d9' }  // Royal Purple
];

function launchEwishwellBalloons(options = {}) {
    const stage = document.getElementById('ewishwell-balloon-stage');
    if (!stage) return;

    stage.innerHTML = '';
    stage.style.display = 'block';
    stage.style.opacity = '1';
    stage.style.visibility = 'visible';

    const isMobile = window.innerWidth <= 768;
    const count = options.count || (isMobile ? 38 : 48);
    // Enlarged extra-large sizes (+10 more balloons) for lush, full screen coverage
    const minSize = isMobile ? 165 : 240;
    const maxSize = isMobile ? 225 : 320;

    const screenH = window.innerHeight || document.documentElement.clientHeight || 800;
    const numSectors = isMobile ? 6 : 10;
    const sectorWidthVw = 100 / numSectors;

    for (let i = 0; i < count; i++) {
        const id = 'b_' + i + '_' + Math.floor(Math.random() * 10000);
        const palette = EWISHWELL_BALLOON_PALETTES[i % EWISHWELL_BALLOON_PALETTES.length];
        const size = Math.floor(Math.random() * (maxSize - minSize) + minSize);
        
        // Distribute across 10 overlapping horizontal sectors with organic jitter (0% to 100% width covered)
        const sector = i % numSectors;
        const xPos = (sector * sectorWidthVw) + (Math.random() * sectorWidthVw * 0.7 - sectorWidthVw * 0.35);
        const swayAmp = (Math.random() * 12 - 6).toFixed(1);
        const floatDuration = (Math.random() * 0.8 + 4.2).toFixed(2); // Cohesive 4.2s to 5.0s flight
        const delay = (i * 0.038) + (Math.random() * 0.12); // Dense cluster launch
        const swayDuration = (Math.random() * 1.2 + 2.2).toFixed(2);
        const swayKeyframe = (i % 2 === 0) ? 'ewBalloonSwayLeft' : 'ewBalloonSwayRight';

        const balloonDiv = document.createElement('div');
        balloonDiv.className = 'ew-balloon';
        balloonDiv.style.left = `${xPos}vw`;
        balloonDiv.style.top = '0px';
        balloonDiv.style.width = `${size}px`;
        balloonDiv.style.height = `${size * 1.5}px`;

        balloonDiv.innerHTML = `
            <div class="ew-balloon-inner" style="animation: ${swayKeyframe} ${swayDuration}s ease-in-out infinite alternate;">
                <svg viewBox="0 0 100 150" width="100%" height="100%" style="overflow: visible;">
                    <defs>
                        <radialGradient id="balloon-grad-${id}" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stop-color="${palette.light}" />
                            <stop offset="55%" stop-color="${palette.main}" />
                            <stop offset="100%" stop-color="${palette.dark}" />
                        </radialGradient>
                        <filter id="balloon-shadow-${id}" x="-30%" y="-30%" width="160%" height="160%">
                            <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="rgba(0,0,0,0.45)" />
                        </filter>
                    </defs>
                    <path d="M50 84 Q${50 + parseFloat(swayAmp)} 116 50 148" stroke="rgba(255,255,255,0.75)" stroke-width="1.6" fill="none" stroke-linecap="round" />
                    <polygon points="46,83 54,83 50,87" fill="${palette.dark}" />
                    <ellipse cx="50" cy="46" rx="36" ry="40" fill="url(#balloon-grad-${id})" filter="url(#balloon-shadow-${id})" />
                    <ellipse cx="38" cy="30" rx="9" ry="14" transform="rotate(-28 38 30)" fill="rgba(255,255,255,0.5)" />
                </svg>
            </div>
        `;

        stage.appendChild(balloonDiv);

        if (typeof TweenMax !== 'undefined') {
            TweenMax.fromTo(balloonDiv, floatDuration, {
                y: screenH + (size * 1.5) + 60,
                autoAlpha: 1,
                visibility: 'visible'
            }, {
                y: -(size * 2 + 150),
                autoAlpha: 1,
                delay: delay,
                ease: Power1.easeOut,
                onComplete: () => {
                    balloonDiv.remove();
                }
            });
        }
    }
}

// Hook up HUD play/pause and fullscreen buttons on load
document.addEventListener('DOMContentLoaded', () => {
    const playToggleBtn = document.getElementById('hud-play-toggle');
    const fullscreenBtn = document.getElementById('hud-fullscreen-btn');

    if (playToggleBtn) {
        playToggleBtn.addEventListener('click', () => {
            if (window.GlobalMusic && window.GlobalMusic.audio) {
                if (!window.GlobalMusic.audio.paused) {
                    window.GlobalMusic.pause();
                    playToggleBtn.innerHTML = '<span>▶</span>';
                } else {
                    window.GlobalMusic.play();
                    playToggleBtn.innerHTML = '<span>⏸</span>';
                }
            }
        });
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.log(err));
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });
    }
});
