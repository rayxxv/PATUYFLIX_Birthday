/* ==========================================================================
   Music Playlist Player (playlist.js)
   Synchronizes with window.GlobalMusic for seamless playback across all pages
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPlaylistPlayer();
});

function initPlaylistPlayer() {
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const albumArt = document.getElementById('album-art');
    const trackTitle = document.getElementById('track-title');
    const trackArtist = document.getElementById('track-artist');
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('total-duration');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressBarBg = document.getElementById('progress-bar-bg');

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function syncUI() {
        if (!window.GlobalMusic) return;
        const track = window.GlobalMusic.playlist[window.GlobalMusic.currentTrackIndex];
        const isPlaying = window.GlobalMusic.isPlaying;
        const audio = window.GlobalMusic.audio;

        if (trackTitle && track) trackTitle.innerText = track.title;
        if (trackArtist && track) trackArtist.innerText = track.artist;
        if (albumArt && track) albumArt.innerText = track.icon;

        if (playBtn) playBtn.innerText = isPlaying ? '⏸' : '▶';
        if (albumArt) {
            if (isPlaying) {
                albumArt.classList.add('playing');
            } else {
                albumArt.classList.remove('playing');
            }
        }

        const duration = audio.duration || (track ? track.duration : 200);
        const cur = audio.currentTime || 0;

        if (currentTimeEl) currentTimeEl.innerText = formatTime(cur);
        if (totalDurationEl) totalDurationEl.innerText = formatTime(duration);

        if (progressBarFill && duration > 0) {
            const pct = (cur / duration) * 100;
            progressBarFill.style.width = `${pct}%`;
        }
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (window.GlobalMusic) {
                window.GlobalMusic.togglePlay();
                syncUI();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (window.GlobalMusic) {
                window.GlobalMusic.prevTrack();
                syncUI();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (window.GlobalMusic) {
                window.GlobalMusic.nextTrack();
                syncUI();
            }
        });
    }

    if (progressBarBg) {
        progressBarBg.addEventListener('click', (e) => {
            if (!window.GlobalMusic) return;
            const rect = progressBarBg.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const audio = window.GlobalMusic.audio;
            const track = window.GlobalMusic.playlist[window.GlobalMusic.currentTrackIndex];
            const duration = audio.duration || (track ? track.duration : 200);
            
            const targetTime = (clickX / width) * duration;
            audio.currentTime = targetTime;
            syncUI();
        });
    }

    // Sync on audio events
    if (window.GlobalMusic && window.GlobalMusic.audio) {
        window.GlobalMusic.audio.addEventListener('timeupdate', syncUI);
        window.GlobalMusic.audio.addEventListener('play', syncUI);
        window.GlobalMusic.audio.addEventListener('pause', syncUI);
        window.GlobalMusic.audio.addEventListener('loadedmetadata', syncUI);
    }

    // Initial sync
    syncUI();
    setInterval(syncUI, 500);
}
