/* ================================================
   IMAGE-HELPERS.JS — Fade-in + lazy load helpers
   ================================================ */

export function bindImageFade(img) {
    if (img.dataset.listenersBound) return;
    img.dataset.listenersBound = '1';
    if (img.complete && img.naturalWidth > 0) {
        img.classList.add('loaded');
    } else {
        img.addEventListener('load',  () => img.classList.add('loaded'), { once: true });
        img.addEventListener('error', () => img.classList.add('loaded'), { once: true });
    }
}

export function initUnitImgs() {
    document.querySelectorAll('.unit-img').forEach(bindImageFade);
}

export function initConvenioLogos() {
    document.querySelectorAll('.convenio-img').forEach(bindImageFade);
}

export function initExameImgs() {
    document.querySelectorAll('.exame-sub__image-slot img').forEach(bindImageFade);
}

export function initTeamImgs() {
    document.querySelectorAll('.team-img').forEach(bindImageFade);
}

export function clearPageImages(page) {
    page.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (!img.dataset.src && img.getAttribute('src')) {
            img.dataset.src = img.getAttribute('src');
        }
        img.removeAttribute('src');
        img.classList.remove('loaded');
        delete img.dataset.listenersBound;
    });
}

export function restorePageImages(page) {
    page.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.remove('loaded');
        delete img.dataset.listenersBound;
        img.src = img.dataset.src;
        delete img.dataset.src;
        bindImageFade(img);
    });
}