/* ==========================================================================
   PATUYFLIX — Global Persistent Background Music Engine (audio-player.js)
   Plays soundtrack continuously across all pages via localStorage state
   ========================================================================== */

const GLOBAL_PLAYLIST = [
    { 
        title: 'Teenage Blue (ティーンエイジブルー)', 
        artist: 'Eve (Ao no Hako / Blue Box ED)', 
        icon: '💙', 
        file: '/assets/audio/teenage-blue-eve.mp3',
        duration: 226 
    },
    { 
        title: 'Antanante. (あんたなんて。)', 
        artist: 'Eve / WurtS', 
        icon: '✨', 
        file: '/assets/audio/antanante.mp3',
        duration: 242 
    },
    { 
        title: 'Kamu', 
        artist: 'Napking', 
        icon: '💖', 
        file: '/assets/audio/napking-kamu.mp3',
        duration: 234 
    },
    { 
        title: 'Olivia Dean Medley (Cover)', 
        artist: 'Mild Nawin', 
        icon: '🎶', 
        file: '/assets/audio/olivia-dean-medley.mp3',
        duration: 348 
    },
    { 
        title: '∞ (Uma Musume Cinderella Gray ED Theme)', 
        artist: 'Piano Cover by Kyle Xian', 
        icon: '🎹', 
        file: '/assets/audio/uma-musume-piano.mp3',
        duration: 137 
    },
    { 
        title: 'Partner (パートナー)', 
        artist: 'Yuka (有華)', 
        icon: '💑', 
        file: '/assets/audio/partner-yuka.mp3',
        duration: 178 
    }
];

class GlobalMusicPlayer {
    constructor() {
        this.playlist = GLOBAL_PLAYLIST;
        this.audio = new Audio();
        this.audio.preload = 'auto';
        this.audio.volume = 0.65;
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.saveTimer = null;

        this.init();
    }

    init() {
        // Load saved state from localStorage
        const savedTrack = localStorage.getItem('patuy_music_track');
        const savedTime = localStorage.getItem('patuy_music_time');
        const savedState = localStorage.getItem('patuy_music_playing');
        const savedVol = localStorage.getItem('patuy_music_volume');

        if (savedTrack !== null) {
            this.currentTrackIndex = parseInt(savedTrack, 10) || 0;
            if (this.currentTrackIndex >= this.playlist.length) this.currentTrackIndex = 0;
        }

        if (savedVol !== null) {
            this.audio.volume = parseFloat(savedVol) || 0.65;
        }

        // Setup audio element source
        this.loadTrack(this.currentTrackIndex, false);

        if (savedTime !== null) {
            const time = parseFloat(savedTime) || 0;
            this.audio.currentTime = time;
        }

        // Setup audio event listeners
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('timeupdate', () => {
            // Save time periodically
            localStorage.setItem('patuy_music_time', this.audio.currentTime);
            this.updateFloatingUI();
        });

        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            localStorage.setItem('patuy_music_playing', 'true');
            this.updateFloatingUI();
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            localStorage.setItem('patuy_music_playing', 'false');
            this.updateFloatingUI();
        });

        // Save state before leaving page
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('patuy_music_time', this.audio.currentTime);
            localStorage.setItem('patuy_music_track', this.currentTrackIndex);
            if (this.isPlaying) {
                localStorage.setItem('patuy_music_playing', 'true');
            }
        });

        const checkIsSurprisePage = () => {
            return window.location.pathname.includes('surprise') || 
                   window.location.hash.includes('surprise') || 
                   (document.body && document.body.classList.contains('faahim-body'));
        };

        const isSurprisePage = checkIsSurprisePage();

        // Mount floating widget UI (disabled on surprise page for cinema immersion)
        if (!isSurprisePage) {
            this.renderFloatingWidget();
        }

        // Attempt resume if previously playing
        if (savedState === 'true' && !isSurprisePage) {
            this.tryResume();
        }

        // Global unlock on first user click anywhere to bypass browser autoplay restrictions
        const unlockAudio = () => {
            if (localStorage.getItem('patuy_music_playing') === 'true' && this.audio.paused) {
                this.play();
            }
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
        };
        document.addEventListener('click', unlockAudio, { once: true });
        document.addEventListener('keydown', unlockAudio, { once: true });
        document.addEventListener('touchstart', unlockAudio, { once: true });
    }

    loadTrack(index, autoPlay = true) {
        this.currentTrackIndex = index;
        const track = this.playlist[this.currentTrackIndex];
        if (track) {
            this.audio.src = track.file;
            localStorage.setItem('patuy_music_track', this.currentTrackIndex);

            if (autoPlay) {
                this.play();
            }
            this.updateFloatingUI();
        }
    }

    tryResume() {
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                localStorage.setItem('patuy_music_playing', 'true');
                this.updateFloatingUI();
            }).catch(() => {
                console.log('Autoplay waiting for user gesture to resume music.');
            });
        }
    }

    play() {
        localStorage.setItem('patuy_music_playing', 'true');
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            return playPromise.then(() => {
                this.isPlaying = true;
                this.updateFloatingUI();
            }).catch(err => {
                console.log('Audio playback waiting for user interaction:', err);
                this.isPlaying = false;
                this.updateFloatingUI();
            });
        }
        return Promise.resolve();
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        localStorage.setItem('patuy_music_playing', 'false');
        this.updateFloatingUI();
    }

    togglePlay() {
        if (this.audio.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    nextTrack() {
        let next = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(next, true);
    }

    prevTrack() {
        let prev = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(prev, true);
    }

    renderFloatingWidget() {
        // Create stylish floating music bar dock (skip on surprise page)
        const isSurprisePage = window.location.pathname.includes('surprise') || 
                               window.location.hash.includes('surprise') || 
                               (document.body && document.body.classList.contains('faahim-body'));
        if (isSurprisePage) return;
        if (document.getElementById('global-music-dock')) return;

        const mount = () => {
            if (!document.body || document.getElementById('global-music-dock')) return;
            const dock = document.createElement('div');
            dock.id = 'global-music-dock';
            dock.className = 'global-music-dock';
            dock.innerHTML = `
                <div class="music-dock-pill" id="music-dock-pill">
                    <div class="music-dock-icon">
                        <span class="music-note-symbol">🎵</span>
                        <div class="sound-bars" id="sound-bars">
                            <span class="bar"></span>
                            <span class="bar"></span>
                            <span class="bar"></span>
                        </div>
                    </div>
                    <div class="music-dock-info">
                        <span class="dock-title" id="dock-title">Teenage Blue</span>
                        <span class="dock-artist" id="dock-artist">Eve (Ao no Hako ED)</span>
                    </div>
                    <div class="music-dock-controls">
                        <button class="dock-btn" id="dock-play-btn" title="Play / Pause">
                            <span id="dock-play-icon">▶</span>
                        </button>
                        <button class="dock-btn" id="dock-next-btn" title="Lagu Selanjutnya">
                            ⏭
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(dock);

            const playBtn = document.getElementById('dock-play-btn');
            const nextBtn = document.getElementById('dock-next-btn');

            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.togglePlay();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.nextTrack();
                });
            }

            this.updateFloatingUI();
        };

        if (document.body) {
            mount();
        } else {
            document.addEventListener('DOMContentLoaded', mount);
        }
    }

    updateFloatingUI() {
        const track = this.playlist[this.currentTrackIndex];
        const dockTitle = document.getElementById('dock-title');
        const dockArtist = document.getElementById('dock-artist');
        const dockPlayIcon = document.getElementById('dock-play-icon');
        const soundBars = document.getElementById('sound-bars');
        const dockPill = document.getElementById('music-dock-pill');

        if (dockTitle && track) {
            dockTitle.innerText = track.title;
        }
        if (dockArtist && track) {
            dockArtist.innerText = track.artist;
        }
        if (dockPlayIcon) {
            dockPlayIcon.innerText = this.isPlaying ? '⏸' : '▶';
        }
        if (soundBars) {
            if (this.isPlaying) {
                soundBars.classList.add('animating');
            } else {
                soundBars.classList.remove('animating');
            }
        }
        if (dockPill) {
            if (this.isPlaying) {
                dockPill.classList.add('is-playing');
            } else {
                dockPill.classList.remove('is-playing');
            }
        }
    }
}

// Global Singleton Instance
window.GlobalMusic = new GlobalMusicPlayer();
