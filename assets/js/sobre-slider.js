/* ================================================
   SOBRE-SLIDER.JS — Slider de fotos (página Sobre)
   ================================================ */

export function initSobreSlider() {
    const slider = document.getElementById('sobreSlider');
    if (!slider) return;

    const slides = [
        { label: 'Unidade Medical',          src: 'img/sobre/medical2.jpg' },
        { label: 'Ressonância Magnética',    src: null },
        { label: 'Tomografia',               src: null },
        { label: 'Ultrassonografia',         src: null },
        { label: 'Unidade Hospital Gênesis', src: 'img/sobre/hospital.webp' },
        { label: 'Unidade BS Tower',         src: null },
    ];

    const mainEl   = document.getElementById('sobreSliderMain');
    const thumbsEl = document.getElementById('sobreSliderThumbs');
    const prevBtn  = document.getElementById('sliderPrev');
    const nextBtn  = document.getElementById('sliderNext');
    const curEl    = document.getElementById('sliderCurrent');
    const totalEl  = document.getElementById('sliderTotal');

    if (!mainEl || !thumbsEl) return;
    if (totalEl) totalEl.textContent = slides.length;

    /* Monta slides lado a lado */
    mainEl.innerHTML = '';
    mainEl.style.cssText = `
        display: flex;
        width: ${slides.length * 100}%;
        transition: transform 0.4s cubic-bezier(.4,0,.2,1);
    `;

    slides.forEach((slide) => {
        const item = document.createElement('div');
        item.style.cssText = `width:${100 / slides.length}%;flex-shrink:0;`;

        if (slide.src) {
            item.innerHTML = `<img src="${slide.src}" alt="${slide.label}" style="width:100%;height:100%;object-fit:cover;display:block;">`;
        } else {
            item.innerHTML = `
                <div class="sobre-placeholder sobre-placeholder--main">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span>${slide.label || 'Em breve'}</span>
                </div>`;
        }
        mainEl.appendChild(item);
    });

    /* Atualiza miniaturas com imagem real */
    const thumbBtns = thumbsEl.querySelectorAll('.sobre-slider__thumb');
    thumbBtns.forEach((btn, i) => {
        if (slides[i] && slides[i].src) {
            btn.innerHTML = `<img src="${slides[i].src}" alt="${slides[i].label}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:calc(var(--radius-md) - 2px);">`;
        }
    });

    let current   = 0;
    let autoTimer = null;

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        mainEl.style.transform = `translateX(-${current * (100 / slides.length)}%)`;
        if (curEl) curEl.textContent = current + 1;
        thumbsEl.querySelectorAll('.sobre-slider__thumb').forEach((btn, i) => {
            btn.classList.toggle('active', i === current);
        });
    }

    function startAuto() { stopAuto(); autoTimer = setInterval(() => goTo(current + 1), 3500); }
    function stopAuto()  { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
    function resetAuto() { stopAuto(); startAuto(); }

    /* Limpa listeners antigos clonando botões */
    const freshPrev = prevBtn ? prevBtn.cloneNode(true) : null;
    const freshNext = nextBtn ? nextBtn.cloneNode(true) : null;
    if (freshPrev && prevBtn && prevBtn.parentNode) prevBtn.parentNode.replaceChild(freshPrev, prevBtn);
    if (freshNext && nextBtn && nextBtn.parentNode) nextBtn.parentNode.replaceChild(freshNext, nextBtn);

    const activePrev = document.getElementById('sliderPrev');
    const activeNext = document.getElementById('sliderNext');
    if (activePrev) activePrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    if (activeNext) activeNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    /* Reatribui cliques nas miniaturas */
    thumbsEl.querySelectorAll('.sobre-slider__thumb').forEach((btn) => {
        const clone = btn.cloneNode(true);
        btn.parentNode.replaceChild(clone, btn);
    });
    thumbsEl.querySelectorAll('.sobre-slider__thumb').forEach((btn, i) => {
        btn.addEventListener('click', () => { goTo(i); resetAuto(); });
    });

    /* Pausa ao passar o mouse */
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    /* Swipe touch */
    let touchStartX = 0;
    const mainWrapper = slider.querySelector('.sobre-slider__main');
    if (mainWrapper) {
        mainWrapper.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            stopAuto();
        }, { passive: true });
        mainWrapper.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
            startAuto();
        }, { passive: true });
    }

    /* Para ao sair da página Sobre */
    document.addEventListener('spaNavigate', (e) => {
        if (e.detail.pageId !== 'sobre') stopAuto();
    });

    goTo(0);
    startAuto();
}