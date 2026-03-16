/* ================================================
   RADIOGÊNESIS — SPA ENGINE v4.0 (Full Optimized)
   Responsivo + Touch-friendly + Performance
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ================================================
       0. DETECÇÃO DE PERFORMANCE DO DISPOSITIVO
       ================================================ */
    (function detectPerformance() {
        const root = document.documentElement;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            root.classList.add('perf-low');
            return;
        }
        const cores    = navigator.hardwareConcurrency || 4;
        const memory   = navigator.deviceMemory;
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
            let score = 0;
            if (cores <= 4) score += 2;
            else if (cores <= 6) score += 1;
            if (memory !== undefined) {
                if (memory <= 2) score += 2;
                else if (memory <= 4) score += 1;
            }
            if (score >= 2) root.classList.add('perf-low');
            else if (score === 1) root.classList.add('perf-mid');
            else root.classList.add('perf-high');
        } else {
            if (cores <= 2) root.classList.add('perf-mid');
            else root.classList.add('perf-high');
        }
    })();

    const perfDelay = document.documentElement.classList.contains('perf-low')  ? 250
                    : document.documentElement.classList.contains('perf-mid')   ? 280
                    : 150;

    // 0.5 Carregamento suave das imagens das unidades
    document.querySelectorAll('.unit-img').forEach(img => {
        if (img.complete && img.naturalWidth > 0) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
            img.addEventListener('error', () => img.classList.add('loaded'));
        }
    });

    // 0.6 Carregamento suave das logos de convênios
    function initConvenioLogos() {
        document.querySelectorAll('.convenio-img').forEach(img => {
            if (img.complete && img.naturalWidth > 0) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load',  () => img.classList.add('loaded'));
                img.addEventListener('error', () => img.classList.add('loaded'));
            }
        });
    }
    initConvenioLogos();

    // 1. Seleção de Elementos Globais
    const header     = document.getElementById('header');
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const backToTop  = document.getElementById('backToTop');
    const allPages   = document.querySelectorAll('.page');
    const overlay    = document.getElementById('mobileOverlay');

    let ticking = false;

    /* ================================================
       1. SPA ROUTER
       ================================================ */
    function navigateTo(pageId) {
        if (!pageId) return;
        const currentPage = document.querySelector('.page.active');
        if (currentPage && currentPage.dataset.page === pageId) return;
        if (currentPage) currentPage.classList.remove('visible');
        const delay = currentPage ? perfDelay : 0;
        setTimeout(() => {
            allPages.forEach(p => {
                p.classList.remove('active', 'visible');
                p.style.display = 'none';
            });
            const targetPage = document.querySelector(`.page[data-page="${pageId}"]`);
            if (targetPage) {
                targetPage.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'instant' });
                requestAnimationFrame(() => {
                    targetPage.classList.add('active');
                    targetPage.classList.add('visible');
                    updatePageTitle(pageId);
                    const navId = pageId.startsWith('exames/') ? 'exames' : pageId;
                    updateActiveNav(navId);

                    /* FIX BUG 4 — resetar flag antes de animar,
                       senão contadores não rodam ao voltar para Início */
                    if (pageId === 'inicio') {
                        countersAnimated = false;
                        setTimeout(animateCounters, 300);
                    }

                    if (pageId === 'convenios') initConvenioLogos();
                });
            }
            if (window.location.hash.replace('#', '') !== pageId) {
                history.pushState(null, '', `#${pageId}`);
            }
        }, delay);
        closeMobileMenu();
    }

    /* ================================================
       2. AUXILIARES
       ================================================ */
    function updateActiveNav(pageId) {
        document.querySelectorAll('.nav__link, .mobile-menu__link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
        });
    }

    function updatePageTitle(pageId) {
        const titles = {
            'inicio': 'Radiogênesis | Diagnóstico por Imagem',
            'exames': 'Exames | Radiogênesis',
            'sobre': 'Sobre Nós | Radiogênesis',
            'equipe': 'Equipe Médica | Radiogênesis',
            'unidades': 'Unidades | Radiogênesis',
            'convenios': 'Convênios | Radiogênesis',
            'contato': 'Contato | Radiogênesis',
            'ouvidoria': 'Ouvidoria | Radiogênesis',
            'trabalhe-conosco': 'Trabalhe Conosco | Radiogênesis',
            'laudo': 'Laudo Online | Radiogênesis',
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

    /* ================================================
       3. HASH ROUTING
       ================================================ */
    function handleHash() {
        const hash = window.location.hash.replace('#', '') || 'inicio';
        const targetPage = document.querySelector(`.page[data-page="${hash}"]`);
        if (targetPage) {
            allPages.forEach(p => {
                p.style.display = 'none';
                p.classList.remove('active', 'visible');
            });
            targetPage.style.display = 'block';
            setTimeout(() => {
                targetPage.classList.add('active');
                targetPage.classList.add('visible');
                updatePageTitle(hash);
                const navPage = hash.startsWith('exames/') ? 'exames' : hash;
                updateActiveNav(navPage);
                if (hash === 'inicio') { countersAnimated = false; animateCounters(); }
                if (hash === 'convenios') initConvenioLogos();
            }, 10);
        } else {
            window.location.hash = '#inicio';
        }
    }

    window.addEventListener('hashchange', handleHash);
    handleHash();
    window.addEventListener('load', () => {
        if (!document.querySelector('.page.active')) handleHash();
    });

    /* ================================================
       4. DELEGAÇÃO DE EVENTOS (Cliques SPA)
       — Unificado: trata .spa-link e .spa-exame num só listener
       ================================================ */
    document.addEventListener('click', (e) => {
        const spaLink  = e.target.closest('.spa-link');
        const exameLink = e.target.closest('.spa-exame');
        const backBtn  = e.target.closest('[data-back]');

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
            navigateTo(backBtn.dataset.back);
        }
    });


    /* ================================================
       5. MENU MOBILE
       ================================================ */

    const menuResizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.style.top = entry.contentRect.height + 'px';
            }
        }
    });

    function openMobileMenu() {
        const headerH = header ? header.getBoundingClientRect().height : 0;
        mobileMenu.style.top = headerH + 'px';
        mobileMenu.style.height = '';

        mobileMenu.classList.add('open');
        overlay.classList.add('active');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';

        const app = document.getElementById('app');
        const topBar = document.querySelector('.top-bar');
        if (app) app.style.setProperty('pointer-events', 'none', 'important');
        if (topBar) topBar.style.setProperty('pointer-events', 'none', 'important');
        const vw = document.querySelector('[vw]');
        if (vw) vw.style.setProperty('left', '-200px', 'important');

        if (header) menuResizeObserver.observe(header);
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        overlay.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';

        const app = document.getElementById('app');
        const topBar = document.querySelector('.top-bar');
        if (app) app.style.removeProperty('pointer-events');
        if (topBar) topBar.style.removeProperty('pointer-events');
        const vw = document.querySelector('[vw]');
        if (vw) vw.style.setProperty('left', '20px', 'important');

        if (header) menuResizeObserver.unobserve(header);
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
        });
    }

    if (overlay) overlay.addEventListener('click', closeMobileMenu);

    const mobileMenuClose = document.getElementById('mobileMenuClose');
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) closeMobileMenu();
        }, 150);
    });

    // Safety reset — fecha o menu se o usuário navegar pelo histórico
    window.addEventListener('popstate', () => {
        closeMobileMenu();
    });


    /* ================================================
       6. SCROLL
       ================================================ */
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const isScrolled = window.scrollY > 10;
                if (header.classList.contains('header--scrolled') !== isScrolled) {
                    header.classList.toggle('header--scrolled', isScrolled);
                }
                if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
                ticking = false;
            });
            ticking = true;
        }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }


    /* ================================================
       7. CONTADORES
       ================================================ */
    let countersAnimated = false;
    function animateCounters() {
        if (countersAnimated) return;
        const counterElements = document.querySelectorAll('.stat-item__number[data-count]');
        if (counterElements.length === 0) return;
        countersAnimated = true;
        counterElements.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const start = performance.now();
            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(tick);
                else counter.textContent = target;
            }
            requestAnimationFrame(tick);
        });
    }


    /* ================================================
       8. FORMULÁRIOS E MÁSCARAS
       ================================================ */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const nome  = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const msg   = document.getElementById('mensagem').value.trim();
            if (!nome || !email || !msg) return showToast('Preencha todos os campos.', 'error');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast('E-mail inválido.', 'error');
            const btn = this.querySelector('button[type="submit"]');
            const original = btn.innerHTML;
            btn.innerHTML = '✓ Enviado!';
            btn.style.background = 'var(--success)';
            btn.disabled = true;
            showToast('Mensagem enviada com sucesso!', 'success');
            setTimeout(() => {
                btn.innerHTML = original;
                btn.style.background = '';
                btn.disabled = false;
                this.reset();
            }, 3000);
        });
    }

    const laudoForm = document.getElementById('laudoForm');
    if (laudoForm) {
        laudoForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const p = document.getElementById('laudoProtocolo').value.trim();
            const s = document.getElementById('laudoSenha').value.trim();
            if (!p || !s) return showToast('Preencha protocolo e senha.', 'error');
            showToast('Redirecionando para o sistema de laudos...', 'success');
        });
    }

    const tel = document.getElementById('telefone');
    if (tel) {
        tel.addEventListener('input', function () {
            let v = this.value.replace(/\D/g, '').slice(0, 11);
            if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
            else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
            else if (v.length > 0) v = `(${v}`;
            this.value = v;
        });
    }


    /* ================================================
       9. TOAST
       ================================================ */
    function showToast(message, type) {
        const old = document.querySelector('.toast');
        if (old) old.remove();
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">&times;</button>`;
        Object.assign(toast.style, {
            position: 'fixed', top: '80px', right: '20px',
            padding: '12px 20px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', gap: '10px',
            zIndex: '9999', color: '#fff',
            boxShadow: '0 8px 32px rgba(0,0,0,.15)',
            background: type === 'success' ? '#10B981' : '#EF4444',
            animation: 'toastIn .4s ease'
        });
        const closeBtn = toast.querySelector('button');
        closeBtn.style.cssText = 'background:none;border:none;color:#fff;font-size:1.3rem;cursor:pointer;';
        document.body.appendChild(toast);
        setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4000);
    }

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `@keyframes toastIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
    document.head.appendChild(styleSheet);

    /* ================================================
       HERO BACKGROUND CAROUSEL
       ================================================ */
    (function initHeroCarousel() {
        const isMobile = () => window.innerWidth <= 768;

        function getActiveSlides() {
            if (isMobile()) {
                return document.querySelectorAll('.hero__bg-carousel--mobile .hero__bg-slide');
            }
            return document.querySelectorAll('.hero__bg-carousel--desktop .hero__bg-slide');
        }

        const allDots = document.querySelectorAll('.hero__carousel-dot');
        const label   = document.getElementById('heroSlideLabel');
        let current = 0;
        let timer;
        let carouselResizeTimer; // FIX: variável local, não polui window

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

        function goTo(index) {
            const slides = getActiveSlides();
            const dots   = getActiveDots();
            slides[current].classList.remove('active');
            if (dots[current]) {
                dots[current].classList.remove('active');
                dots[current].removeAttribute('aria-current');
            }
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            if (dots[current]) {
                dots[current].classList.add('active');
                dots[current].setAttribute('aria-current', 'true');
            }
            if (label) label.textContent = slides[current].dataset.label || '';
        }

        function initCarousel() {
            const slides = getActiveSlides();
            document.querySelectorAll('.hero__bg-slide').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.hero__carousel-dot').forEach(d => {
                d.classList.remove('active');
                d.removeAttribute('aria-current');
            });
            current = 0;
            if (slides[0]) slides[0].classList.add('active');
            updateDotVisibility();
            const dots = getActiveDots();
            if (dots[0]) {
                dots[0].classList.add('active');
                dots[0].setAttribute('aria-current', 'true');
            }
        }

        initCarousel();

        window.addEventListener('resize', () => {
            clearTimeout(carouselResizeTimer); // FIX: usa variável local
            carouselResizeTimer = setTimeout(() => {
                clearInterval(timer);
                initCarousel();
                startTimer();
            }, 200);
        });

        function next() { goTo(current + 1); }
        function startTimer() { timer = setInterval(next, 5000); }
        function resetTimer() { clearInterval(timer); startTimer(); }

        allDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const idx    = parseInt(dot.dataset.index);
                const slides = getActiveSlides();
                if (idx < slides.length) { goTo(idx); resetTimer(); }
            });
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) clearInterval(timer);
            else startTimer();
        });

        const isPerfLow = document.documentElement.classList.contains('perf-low');
        if (!isPerfLow) startTimer();
    })();


    /* ================================================
       VLIBRAS
       ================================================ */
    (function watchVLibras() {

        var STORAGE_KEY = 'rg-vlibras-pos';
        var dragging    = false;
        var dragMoved   = false;
        var startX, startY, startLeft, startTop;

        function getSavedPos() {
            try {
                var p = JSON.parse(localStorage.getItem(STORAGE_KEY));
                if (p && typeof p.left === 'number' && typeof p.top === 'number') return p;
            } catch(e) {}
            return null;
        }

        function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

        function setPos(vw, left, top) {
            var W = window.innerWidth;
            var H = window.innerHeight;
            var w = vw.offsetWidth  || 80;
            var h = vw.offsetHeight || 80;
            left = clamp(left, 0, W - w);
            top  = clamp(top,  0, H - h);
            vw.style.setProperty('position',  'fixed',     'important');
            vw.style.setProperty('z-index',   '299',       'important');
            vw.style.setProperty('left',      left + 'px', 'important');
            vw.style.setProperty('top',       top  + 'px', 'important');
            vw.style.setProperty('right',     'auto',      'important');
            vw.style.setProperty('bottom',    'auto',      'important');
            vw.style.setProperty('transform', 'none',      'important');
            vw.style.setProperty('cursor',    'grab',      'important');
            var btn = vw.querySelector('[vw-access-button]');
            if (btn) {
                btn.style.setProperty('right',     'auto', 'important');
                btn.style.setProperty('left',      '0',    'important');
                btn.style.setProperty('bottom',    '0',    'important');
                btn.style.setProperty('top',       'auto', 'important');
                btn.style.setProperty('transform', 'none', 'important');
            }
            return { left: left, top: top };
        }

        function applyPosition(vw) {
            var menu = document.getElementById('mobileMenu');
            if (menu && menu.classList.contains('open')) return;
            var saved = getSavedPos();
            var left, top;
            if (saved) { left = saved.left; top = saved.top; }
            else { left = 20; top = window.innerHeight - (vw.offsetHeight || 80) - 20; }
            setPos(vw, left, top);
        }

        function isVLibrasControl(target) {
            var wrapper = target.closest('[vw-plugin-wrapper]');
            if (!wrapper) return false;
            return !!(target.closest('button, a, [role="button"]'));
        }

        function onMouseDown(e) {
            if (e.button !== 0) return;
            var vw = document.querySelector('[vw]');
            if (!vw || !vw.contains(e.target)) return;
            if (isVLibrasControl(e.target)) return;
            dragging  = true; dragMoved = false;
            startX = e.clientX; startY = e.clientY;
            startLeft = parseInt(vw.style.left) || 20;
            startTop  = parseInt(vw.style.top)  || (window.innerHeight - 80);
            vw.style.setProperty('cursor', 'grabbing', 'important');
        }

        function onMouseMove(e) {
            if (!dragging) return;
            var vw = document.querySelector('[vw]');
            if (!vw) return;
            var dx = e.clientX - startX; var dy = e.clientY - startY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved = true;
            setPos(vw, startLeft + dx, startTop + dy);
        }

        function onMouseUp() {
            if (!dragging) return;
            dragging = false;
            var vw = document.querySelector('[vw]');
            if (!vw) return;
            vw.style.setProperty('cursor', 'grab', 'important');
            if (dragMoved) {
                var left = parseInt(vw.style.left) || 20;
                var top  = parseInt(vw.style.top)  || 20;
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ left: left, top: top })); } catch(e) {}
            }
        }

        function onTouchStart(e) {
            var vw = document.querySelector('[vw]');
            if (!vw || !vw.contains(e.target)) return;
            if (isVLibrasControl(e.target)) return;
            var t = e.touches[0];
            dragging = true; dragMoved = false;
            startX = t.clientX; startY = t.clientY;
            startLeft = parseInt(vw.style.left) || 20;
            startTop  = parseInt(vw.style.top)  || (window.innerHeight - 80);
        }

        function onTouchMove(e) {
            if (!dragging) return;
            var vw = document.querySelector('[vw]');
            if (!vw) return;
            var t = e.touches[0];
            var dx = t.clientX - startX; var dy = t.clientY - startY;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) { dragMoved = true; e.preventDefault(); }
            setPos(vw, startLeft + dx, startTop + dy);
        }

        function onTouchEnd() {
            if (!dragging) return;
            dragging = false;
            var vw = document.querySelector('[vw]');
            if (!vw) return;
            if (dragMoved) {
                var left = parseInt(vw.style.left) || 20;
                var top  = parseInt(vw.style.top)  || 20;
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ left: left, top: top })); } catch(e) {}
            }
        }

        window.addEventListener('resize', function() {
            var vw = document.querySelector('[vw]');
            if (!vw) return;
            var left = parseInt(vw.style.left) || 20;
            var top  = parseInt(vw.style.top)  || 20;
            var pos  = setPos(vw, left, top);
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pos)); } catch(e) {}
        });

        function initDrag(vw) { applyPosition(vw); }

        document.addEventListener('mousedown',  onMouseDown);
        document.addEventListener('mousemove',  onMouseMove);
        document.addEventListener('mouseup',    onMouseUp);
        document.addEventListener('touchstart', onTouchStart, { passive: true });
        document.addEventListener('touchmove',  onTouchMove,  { passive: false });
        document.addEventListener('touchend',   onTouchEnd);

        var observer = new MutationObserver(function(mutations) {
            for (var i = 0; i < mutations.length; i++) {
                if (mutations[i].type === 'childList') {
                    var vw = document.querySelector('[vw]');
                    if (vw && !vw.dataset.dragInit) { vw.dataset.dragInit = '1'; initDrag(vw); }
                    break;
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: false });

        window.addEventListener('load', function() {
            var vw = document.querySelector('[vw]');
            if (vw && !vw.dataset.dragInit) { vw.dataset.dragInit = '1'; initDrag(vw); }
        });

    })();

});