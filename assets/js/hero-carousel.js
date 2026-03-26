/* ================================================
   HERO-CAROUSEL.JS — Carrossel de fundo do hero
   ================================================ */

// Correção: Removido o "01-" do nome do arquivo
import { isPerfLow } from './performance.js';

export function initHeroCarousel() {
    const isMobile = () => window.innerWidth <= 768;

    function getActiveSlides() {
        return isMobile()
            ? document.querySelectorAll('.hero__bg-carousel--mobile .hero__bg-slide')
            : document.querySelectorAll('.hero__bg-carousel--desktop .hero__bg-slide');
    }

    const allDots = document.querySelectorAll('.hero__carousel-dot');
    const label   = document.getElementById('heroSlideLabel');
    let current = 0;
    let timer;
    let carouselResizeTimer;

    function getActiveDots() {
        const slides = getActiveSlides();
        return Array.from(allDots).slice(0, slides.length);
    }

    function updateDotVisibility() {
        const slides = getActiveSlides();
        allDots.forEach((dot, i) => {
            dot.style.display = i < slides.length ? '' : 'none';
        });
    }

    function loadSlide(slide) {
        if (!slide || slide.dataset.bgLoaded) return;
        const bg = slide.dataset.bg;
        if (bg) {
            slide.style.backgroundImage = `url('${bg}')`;
            slide.dataset.bgLoaded = '1';
        }
    }

    function preloadNext(index, slides) {
        const nextIdx = (index + 1) % slides.length;
        loadSlide(slides[nextIdx]);
    }

    function goTo(index) {
        const slides = getActiveSlides();
        if (!slides.length) return;
        const dots = getActiveDots();

        slides[current].classList.remove('active');
        if (dots[current]) {
            dots[current].classList.remove('active');
            dots[current].removeAttribute('aria-current');
        }

        current = (index + slides.length) % slides.length;
        loadSlide(slides[current]);
        slides[current].classList.add('active');

        if (dots[current]) {
            dots[current].classList.add('active');
            dots[current].setAttribute('aria-current', 'true');
        }

        if (label) label.textContent = slides[current].dataset.label || '';
        preloadNext(current, slides);
    }

    function initCarousel() {
        const slides = getActiveSlides();
        document.querySelectorAll('.hero__bg-slide').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.hero__carousel-dot').forEach(d => {
            d.classList.remove('active');
            d.removeAttribute('aria-current');
        });
        current = 0;
        if (slides[0]) { loadSlide(slides[0]); slides[0].classList.add('active'); }
        if (slides[1]) loadSlide(slides[1]);
        updateDotVisibility();
        const dots = getActiveDots();
        if (dots[0]) { dots[0].classList.add('active'); dots[0].setAttribute('aria-current', 'true'); }
    }

    initCarousel();

    window.addEventListener('resize', () => {
        clearTimeout(carouselResizeTimer);
        carouselResizeTimer = setTimeout(() => {
            clearInterval(timer);
            current = 0;
            initCarousel();
            if (isOnInicio()) startTimer();
        }, 200);
    });

    function next()       { goTo(current + 1); }
    function startTimer() { timer = setInterval(next, 5000); }
    function resetTimer() { clearInterval(timer); if (isOnInicio()) startTimer(); }

    function isOnInicio() {
        const active = document.querySelector('.page.active');
        return active && active.dataset.page === 'inicio';
    }

    allDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx    = parseInt(dot.dataset.index);
            const slides = getActiveSlides();
            if (idx < slides.length) { goTo(idx); resetTimer(); }
        });
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(timer);
        } else {
            if (isOnInicio() && !isPerfLow()) startTimer();
        }
    });

    document.addEventListener('spaNavigate', (e) => {
        if (e.detail.pageId === 'inicio') {
            if (!document.hidden && !isPerfLow()) {
                clearInterval(timer);
                startTimer();
            }
        } else {
            clearInterval(timer);
        }
    });

    if (!isPerfLow()) startTimer();
}