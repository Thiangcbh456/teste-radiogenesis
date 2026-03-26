/* ================================================
   RADIOGÊNESIS — main.js (Entry Point)
   ES Modules — ordem de inicialização
   ================================================ */

// Correção: Adicionado o prefixo "./" em todos os imports
import { detectPerformance }   from './performance.js';
import { initUnitImgs, initConvenioLogos, initExameImgs, initTeamImgs } from './image-helpers.js';
import { initMobileMenu }     from './mobile-menu.js';
import { initSpaRouter }      from './spa-router.js';
import { initHeaderScroll }   from './header-scroll.js';
import { initToastStyles }    from './toast.js';
import { initForms }          from './forms.js';
import { initHeroCarousel }   from './hero-carousel.js';
import { initVideoPlayer }    from './video-player.js';
import { initSobreSlider }    from './sobre-slider.js';

document.addEventListener('DOMContentLoaded', () => {

    /* 0. Performance */
    detectPerformance();

    /* 0.5 Imagens iniciais */
    initUnitImgs();
    initConvenioLogos();
    initExameImgs();
    initTeamImgs();

    /* 1. Menu mobile */
    initMobileMenu();

    /* 2. SPA Router (hash + cliques) */
    initSpaRouter();

    /* 3. Header scroll */
    initHeaderScroll();

    /* 4. Toast + Forms */
    initToastStyles();
    initForms();

    /* 5. Hero carousel */
    initHeroCarousel();

    /* 6. Player de vídeo */
    initVideoPlayer();

    /* 7. Slider sobre */
    initSobreSlider();

    /* Anti-FOUC (Flash of Unstyled Content) */
    document.body.classList.add('rg-ready');
});