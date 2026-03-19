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

    // 0.7 CORREÇÃO 9 — Fade nas imagens das subpáginas de exames
    function initExameImgs() {
        document.querySelectorAll('.exame-sub__image-slot img').forEach(img => {
            if (img.complete && img.naturalWidth > 0) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load',  () => img.classList.add('loaded'));
                img.addEventListener('error', () => img.classList.add('loaded'));
            }
        });
    }

    // 0.8 CORREÇÃO 9 — Fade nas imagens da equipe médica
    function initTeamImgs() {
        document.querySelectorAll('.team-img').forEach(img => {
            if (img.complete && img.naturalWidth > 0) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load',  () => img.classList.add('loaded'));
                img.addEventListener('error', () => img.classList.add('loaded'));
            }
        });
    }

    initExameImgs();
    initTeamImgs();

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

                    if (pageId === 'inicio') {
                        countersAnimated = false;
                        setTimeout(animateCounters, 300);
                    }

                    if (pageId === 'convenios') initConvenioLogos();

                    // CORREÇÃO 9 — reinicia fade ao navegar para páginas de exame ou equipe
                    if (pageId.startsWith('exames/')) initExameImgs();
                    if (pageId === 'equipe') initTeamImgs();
                });
            }
            if (window.location.hash.replace('#', '') !== pageId) {
                history.pushState(null, '', `#${pageId}`);
            }
        }, delay);
        document.dispatchEvent(new CustomEvent('spaNavigate', { detail: { pageId } }));
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
                if (hash.startsWith('exames/')) initExameImgs();
                if (hash === 'equipe') initTeamImgs();
                document.dispatchEvent(new CustomEvent('spaNavigate', { detail: { pageId: hash } }));
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
       ================================================ */
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

    window.addEventListener('popstate', () => {
        closeMobileMenu();
    });

    /* ================================================
       6. SCROLL — CORREÇÃO 6: header hide on scroll
       ================================================ */
    let lastScrollY = 0;

    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                const isScrolled = currentScrollY > 10;

                // box-shadow ao rolar
                if (header.classList.contains('header--scrolled') !== isScrolled) {
                    header.classList.toggle('header--scrolled', isScrolled);
                }

                // esconde ao rolar para baixo, mostra ao rolar para cima
                if (currentScrollY > lastScrollY && currentScrollY > 80) {
                    header.classList.add('header--hidden');
                } else {
                    header.classList.remove('header--hidden');
                }

                lastScrollY = currentScrollY;

                if (backToTop) backToTop.classList.toggle('visible', currentScrollY > 400);
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
            const target   = parseInt(counter.dataset.count);
            const duration = 2000;
            const start    = performance.now();
            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased    = 1 - Math.pow(1 - progress, 3);
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
            const btn      = this.querySelector('button[type="submit"]');
            const original = btn.innerHTML;
            btn.innerHTML  = '✓ Enviado!';
            btn.style.background = 'var(--success)';
            btn.disabled   = true;
            showToast('Mensagem enviada com sucesso!', 'success');
            setTimeout(() => {
                btn.innerHTML        = original;
                btn.style.background = '';
                btn.disabled         = false;
                this.reset();
            }, 3000);
        });
    }

    const tel = document.getElementById('telefone');
    if (tel) {
        tel.addEventListener('input', function () {
            let v = this.value.replace(/\D/g, '').slice(0, 11);
            if (v.length > 6)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
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
            position:     'fixed',
            top:          '80px',
            right:        '20px',
            padding:      '12px 20px',
            borderRadius: '12px',
            display:      'flex',
            alignItems:   'center',
            gap:          '10px',
            zIndex:       '9999',
            color:        '#fff',
            boxShadow:    '0 8px 32px rgba(0,0,0,.15)',
            background:   type === 'success' ? '#10B981' : '#EF4444',
            animation:    'toastIn .4s ease'
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
       10. HERO BACKGROUND CAROUSEL
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

        // CORREÇÃO LAZY LOAD: carrega background apenas quando slide vai aparecer
        function loadSlide(slide) {
            if (!slide || slide.dataset.bgLoaded) return;
            const bg = slide.dataset.bg;
            if (bg) {
                slide.style.backgroundImage = `url('${bg}')`;
                slide.dataset.bgLoaded = '1';
            }
        }

        // Precarrega o próximo slide antes de exibir
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
            if (slides[0]) {
                loadSlide(slides[0]);
                slides[0].classList.add('active');
            }
            // Precarrega o segundo slide imediatamente
            if (slides[1]) loadSlide(slides[1]);
            updateDotVisibility();
            const dots = getActiveDots();
            if (dots[0]) {
                dots[0].classList.add('active');
                dots[0].setAttribute('aria-current', 'true');
            }
        }

        initCarousel();

        window.addEventListener('resize', () => {
            clearTimeout(carouselResizeTimer);
            carouselResizeTimer = setTimeout(() => {
                clearInterval(timer);
                // Zera current antes de reiniciar para evitar
                // dessincronismo entre dots e slides ao girar o celular
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
                if (isOnInicio() && !isPerfLow) startTimer();
            }
        });

        document.addEventListener('spaNavigate', (e) => {
            if (e.detail.pageId === 'inicio') {
                if (!document.hidden && !isPerfLow) {
                    clearInterval(timer);
                    startTimer();
                }
            } else {
                clearInterval(timer);
            }
        });

        const isPerfLow = document.documentElement.classList.contains('perf-low');
        if (!isPerfLow) startTimer();
    })();
    


});