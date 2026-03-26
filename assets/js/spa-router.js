/* ================================================
   SPA-ROUTER.JS — Navegação SPA + hash routing
   ================================================ */

// Correção: Caminhos atualizados para os novos nomes de arquivos e com ./
import { getPerfDelay } from './performance.js';
import {
    clearPageImages, restorePageImages,
    initConvenioLogos, initExameImgs, initTeamImgs
} from './image-helpers.js';
import { closeMobileMenu } from './mobile-menu.js';
import { animateCounters, resetCounters } from './counters.js';
import { initSobreSlider } from './sobre-slider.js';

let navigationTimer = null;

/* ---- Helpers ---- */
function updateActiveNav(pageId) {
    document.querySelectorAll('.nav__link, .mobile-menu__link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
    });
}

function updatePageTitle(pageId) {
    const titles = {
        'inicio':             'Radiogênesis | Diagnóstico por Imagem',
        'exames':             'Exames | Radiogênesis',
        'sobre':              'Sobre Nós | Radiogênesis',
        'equipe':             'Equipe Médica | Radiogênesis',
        'unidades':           'Unidades | Radiogênesis',
        'convenios':          'Convênios | Radiogênesis',
        'contato':            'Contato | Radiogênesis',
        'ouvidoria':          'Ouvidoria | Radiogênesis',
        'trabalhe-conosco':   'Trabalhe Conosco | Radiogênesis',
        'politica-de-privacidade': 'Política de Privacidade | Radiogênesis',
        'exames/ressonancia-magnetica':      'Ressonância Magnética | Radiogênesis',
        'exames/tomografia-computadorizada': 'Tomografia Computadorizada | Radiogênesis',
        'exames/biopsia-puncao-marcacao':    'Biópsia, Punção e Marcação | Radiogênesis',
        'exames/ultrassonografia-geral':     'Ultrassonografia Geral | Radiogênesis',
        'exames/raio-x-digital':             'Raio-X Digital | Radiogênesis',
        'exames/mamografia-digital':         'Mamografia Digital | Radiogênesis',
        'exames/ultrassonografia-doppler':   'Ultrassonografia com Doppler | Radiogênesis',
        'exames/densitometria-ossea':        'Densitometria Óssea | Radiogênesis',
        'exames/mamotomia':                  'Mamotomia | Radiogênesis'
    };
    document.title = titles[pageId] || titles['inicio'];
}

function runPageHooks(pageId) {
    if (pageId === 'inicio') {
        resetCounters();
        setTimeout(animateCounters, 300);
    }
    if (pageId === 'convenios')         initConvenioLogos();
    if (pageId.startsWith('exames/'))  initExameImgs();
    if (pageId === 'equipe')           initTeamImgs();
    if (pageId === 'sobre')            initSobreSlider();
}

/* ---- navigateTo ---- */
export function navigateTo(pageId) {
    if (!pageId) return;

    const allPages    = document.querySelectorAll('.page');
    const currentPage = document.querySelector('.page.active');

    if (currentPage && currentPage.dataset.page === pageId) return;
    if (currentPage) currentPage.classList.remove('visible');

    if (navigationTimer) { clearTimeout(navigationTimer); navigationTimer = null; }

    const delay = currentPage ? getPerfDelay() : 0;

    navigationTimer = setTimeout(() => {
        navigationTimer = null;

        allPages.forEach(p => {
            p.classList.remove('active', 'visible');
            p.style.display = 'none';
            if (p.dataset.page !== pageId) clearPageImages(p);
        });

        const targetPage = document.querySelector(`.page[data-page="${pageId}"]`);
        if (targetPage) {
            targetPage.style.display = 'block';
            restorePageImages(targetPage);
            window.scrollTo({ top: 0, behavior: 'instant' });

            requestAnimationFrame(() => {
                targetPage.classList.add('active', 'visible');
                updatePageTitle(pageId);
                const navId = pageId.startsWith('exames/') ? 'exames' : pageId;
                updateActiveNav(navId);
                runPageHooks(pageId);
            });
        }

        if (window.location.hash.replace('#', '') !== pageId) {
            history.pushState(null, '', `#${pageId}`);
        }
    }, delay);

    document.dispatchEvent(new CustomEvent('spaNavigate', { detail: { pageId } }));
    closeMobileMenu();
}

/* ---- Hash routing ---- */
function handleHash() {
    const hash       = window.location.hash.replace('#', '') || 'inicio';
    const allPages   = document.querySelectorAll('.page');
    const targetPage = document.querySelector(`.page[data-page="${hash}"]`);

    if (targetPage) {
        if (navigationTimer) { clearTimeout(navigationTimer); navigationTimer = null; }

        allPages.forEach(p => {
            p.style.display = 'none';
            p.classList.remove('active', 'visible');
            if (p.dataset.page !== hash) clearPageImages(p);
        });

        targetPage.style.display = 'block';
        restorePageImages(targetPage);

        setTimeout(() => {
            targetPage.classList.add('active', 'visible');
            updatePageTitle(hash);
            const navPage = hash.startsWith('exames/') ? 'exames' : hash;
            updateActiveNav(navPage);
            runPageHooks(hash);
            document.dispatchEvent(new CustomEvent('spaNavigate', { detail: { pageId: hash } }));
        }, 10);
    } else {
        window.location.hash = '#inicio';
    }
}

/* ---- Init ---- */
export function initSpaRouter() {
    window.addEventListener('hashchange', handleHash);
    handleHash();
    window.addEventListener('load', () => {
        if (!document.querySelector('.page.active')) handleHash();
    });

    /* Delegação de cliques */
    document.addEventListener('click', (e) => {
        const spaLink   = e.target.closest('.spa-link');
        const exameLink = e.target.closest('.spa-exame');
        const backBtn   = e.target.closest('[data-back]');

        if (spaLink) {
            e.preventDefault();
            const pageId = spaLink.dataset.page;
            if (pageId) navigateTo(pageId);
        } else if (exameLink) {
            e.preventDefault();
            const hash = exameLink.getAttribute('href').replace('#', '');
            navigateTo(hash);
        } else if (backBtn) {
            e.preventDefault();
            const pageIdBack = backBtn.dataset.back;
            if (pageIdBack) navigateTo(pageIdBack);
        }
    });
}