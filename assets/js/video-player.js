/* ================================================
   VIDEO-PLAYER.JS — Player de vídeo customizado
   ================================================ */

export function initVideoPlayer() {
    const player = document.getElementById('rgPlayer');
    if (!player) return;

    const video     = player.querySelector('.rg-player__video');
    const bigPlay   = player.querySelector('.rg-player__big-play');
    const playBtn   = player.querySelector('.rg-player__play');
    const muteBtn   = player.querySelector('.rg-player__mute');
    const fullBtn   = player.querySelector('.rg-player__fullscreen');
    const progress  = player.querySelector('.rg-player__progress');
    const fill      = player.querySelector('.rg-player__progress-fill');
    const timeCur   = player.querySelector('.rg-player__time--current');
    const timeTotal = player.querySelector('.rg-player__time--total');

    function fmt(s) {
        const m   = Math.floor(s / 60);
        const sec = Math.floor(s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    }

    function togglePlay() {
        video.paused ? video.play() : video.pause();
    }

    video.addEventListener('play', () => {
        player.classList.add('playing');
        player.classList.remove('paused');
        playBtn.querySelector('.icon-play').style.display  = 'none';
        playBtn.querySelector('.icon-pause').style.display = 'block';
    });

    video.addEventListener('pause', () => {
        player.classList.remove('playing');
        player.classList.add('paused');
        playBtn.querySelector('.icon-play').style.display  = 'block';
        playBtn.querySelector('.icon-pause').style.display = 'none';
    });

    video.addEventListener('loadedmetadata', () => {
        timeTotal.textContent = fmt(video.duration);
    });

    video.addEventListener('timeupdate', () => {
        if (!video.duration) return;
        const pct = (video.currentTime / video.duration) * 100;
        fill.style.width     = pct + '%';
        timeCur.textContent  = fmt(video.currentTime);
    });

    video.addEventListener('ended', () => {
        player.classList.remove('playing');
        player.classList.add('paused');
        playBtn.querySelector('.icon-play').style.display  = 'block';
        playBtn.querySelector('.icon-pause').style.display = 'none';
        fill.style.width    = '0%';
        timeCur.textContent = '0:00';
    });

    bigPlay.addEventListener('click', togglePlay);
    playBtn.addEventListener('click', togglePlay);
    player.addEventListener('click', (e) => {
        if (e.target === video) togglePlay();
    });

    muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        muteBtn.querySelector('.icon-sound').style.display = video.muted ? 'none'  : 'block';
        muteBtn.querySelector('.icon-muted').style.display = video.muted ? 'block' : 'none';
    });

    progress.addEventListener('click', (e) => {
        const rect = progress.getBoundingClientRect();
        const pct  = (e.clientX - rect.left) / rect.width;
        video.currentTime = pct * video.duration;
    });

    fullBtn.addEventListener('click', () => {
        if (document.fullscreenElement) document.exitFullscreen();
        else player.requestFullscreen();
    });
}