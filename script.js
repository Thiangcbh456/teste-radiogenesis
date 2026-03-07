/* ================================================
   RADIOGÊNESIS — SPA ENGINE v4.0 (Full Optimized)
   Responsivo + Touch-friendly + Performance
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Seleção de Elementos Globais
    const header     = document.getElementById('header');
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const backToTop  = document.getElementById('backToTop');
    const allPages   = document.querySelectorAll('.page');

    // ✅ FIX: Usa o overlay já existente no HTML pelo ID
    // (não cria um segundo overlay dinamicamente)
    const overlay = document.getElementById('mobileOverlay');

    let ticking = false; // Controle de performance do scroll

    /* ================================================
       1. SPA ROUTER (Navegação Principal)
       ================================================ */
    function navigateTo(pageId) {
        if (!pageId) return;

        const currentPage = document.querySelector('.page.active');

        // Se já estiver na página atual, ignora o clique
        if (currentPage && currentPage.dataset.page === pageId) return;

        // Inicia o Fade Out da página atual
        if (currentPage) {
            currentPage.classList.remove('visible');
        }

        // Delay para o Fade Out terminar (300ms)
        const delay = currentPage ? 300 : 0;

        setTimeout(() => {
            // Esconde todas as páginas e remove classes
            allPages.forEach(p => {
                p.classList.remove('active', 'visible');
                p.style.display = 'none';
            });

            const targetPage = document.querySelector(`.page[data-page="${pageId}"]`);

            if (targetPage) {
                targetPage.style.display = 'block';

                // Volta para o topo instantaneamente
                window.scrollTo({ top: 0, behavior: 'instant' });

                // Técnica de RequestAnimationFrame Duplo (60 FPS)
                requestAnimationFrame(() => {
                    targetPage.classList.add('active');

                    requestAnimationFrame(() => {
                        targetPage.classList.add('visible');

                        updatePageTitle(pageId);
                        updateActiveNav(pageId);

                        // Dispara contadores se for a Home
                        if (pageId === 'inicio') {
                            setTimeout(animateCounters, 400);
                        }
                    });
                });
            }

            // Atualiza o histórico do navegador (Hash)
            if (window.location.hash.replace('#', '') !== pageId) {
                history.pushState(null, '', `#${pageId}`);
            }
        }, delay);

        closeMobileMenu();
    }

    /* ================================================
       2. AUXILIARES: Títulos e Links Ativos
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
            'laudo': 'Laudo Online | Radiogênesis'
        };
        document.title = titles[pageId] || titles['inicio'];
    }

    /* ================================================
       3. HASH ROUTING (SOLUÇÃO DEFINITIVA)
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
                updateActiveNav(hash);

                if (hash === 'inicio') {
                    countersAnimated = false;
                    animateCounters();
                }
            }, 20);
        } else {
            window.location.hash = '#inicio';
        }
    }

    // Ouvinte para quando o usuário clica em "Voltar" no navegador
    window.addEventListener('hashchange', handleHash);

    /* ================================================
       INICIALIZAÇÃO DE SEGURANÇA
       ================================================ */
    handleHash();

    window.addEventListener('load', () => {
        if (!document.querySelector('.page.active')) {
            handleHash();
        }
    });

    /* ================================================
       4. DELEGAÇÃO DE EVENTOS (Cliques SPA)
       ================================================ */
    document.addEventListener('click', (e) => {
        const spaLink = e.target.closest('.spa-link');
        if (!spaLink) return;
        e.preventDefault();
        const pageId = spaLink.dataset.page;
        if (pageId) navigateTo(pageId);
    });


    /* ================================================
       5. MENU MOBILE (Hambúrguer)
       ================================================ */
    function openMobileMenu() {
        mobileMenu.classList.add('open');
        overlay.classList.add('active');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        overlay.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeMobileMenu);
    }

    // Botão X dentro do menu lateral
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    // Fecha menu se a tela for redimensionada para desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) closeMobileMenu();
        }, 150);
    });


    /* ================================================
       6. EFEITOS DE SCROLL (Sticky Header & Top Button)
       ================================================ */
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const isScrolled = window.scrollY > 10;
                if (header.classList.contains('header--scrolled') !== isScrolled) {
                    header.classList.toggle('header--scrolled', isScrolled);
                }
                if (backToTop) {
                    backToTop.classList.toggle('visible', window.scrollY > 400);
                }
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
       7. CONTADORES (Animação Numérica)
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
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const msg = document.getElementById('mensagem').value.trim();

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
       9. SISTEMA DE TOAST (Notificações)
       ================================================ */
    function showToast(message, type) {
        const old = document.querySelector('.toast');
        if (old) old.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">&times;</button>`;

        Object.assign(toast.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: '9999',
            color: '#fff',
            boxShadow: '0 8px 32px rgba(0,0,0,.15)',
            background: type === 'success' ? '#10B981' : '#EF4444',
            animation: 'toastIn .4s ease'
        });

        const closeBtn = toast.querySelector('button');
        closeBtn.style.cssText = 'background:none;border:none;color:#fff;font-size:1.3rem;cursor:pointer;';

        document.body.appendChild(toast);
        setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4000);
    }

    // Animações CSS para o Toast
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes toastIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    `;
    document.head.appendChild(styleSheet);

    // Inicialização final
    handleHash();
});