/* ================================================
   RADIOGÊNESIS — SPA ENGINE v4.0
   Responsivo + Touch-friendly
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const header     = document.getElementById('header');
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const backToTop  = document.getElementById('backToTop');
    const allPages   = document.querySelectorAll('.page');

    const overlay = document.createElement('div');
    overlay.classList.add('mobile-overlay');
    document.body.appendChild(overlay);


    /* ================================================
       1. SPA ROUTER
       ================================================ */
    function navigateTo(pageId) {
        if (!pageId) return;

        const currentPage = document.querySelector('.page.active.visible');
        if (currentPage && currentPage.dataset.page === pageId) return;

        if (currentPage) currentPage.classList.remove('visible');

        const delay = currentPage ? 280 : 0;

        setTimeout(() => {
            allPages.forEach(p => p.classList.remove('active', 'visible'));

            const targetPage = document.querySelector(`.page[data-page="${pageId}"]`);
            if (targetPage) {
                targetPage.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'instant' });
                void targetPage.offsetHeight;
                requestAnimationFrame(() => targetPage.classList.add('visible'));
                updatePageTitle(pageId);
                if (pageId === 'inicio') setTimeout(animateCounters, 400);
            }

            updateActiveNav(pageId);
            history.pushState(null, '', `#${pageId}`);
        }, delay);

        closeMobileMenu();
    }

    function updateActiveNav(pageId) {
        document.querySelectorAll('.nav__link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
        });
    }

    function updatePageTitle(pageId) {
        const titles = {
            'inicio':'Radiogênesis | Diagnóstico por Imagem',
            'exames':'Exames | Radiogênesis',
            'sobre':'Sobre Nós | Radiogênesis',
            'equipe':'Equipe Médica | Radiogênesis',
            'unidades':'Unidades | Radiogênesis',
            'convenios':'Convênios | Radiogênesis',
            'contato':'Contato | Radiogênesis',
            'ouvidoria':'Ouvidoria | Radiogênesis',
            'trabalhe-conosco':'Trabalhe Conosco | Radiogênesis',
            'laudo':'Laudo Online | Radiogênesis'
        };
        document.title = titles[pageId] || titles['inicio'];
    }


    /* ================================================
       2. EVENT DELEGATION
       ================================================ */
    document.addEventListener('click', (e) => {
        const spaLink = e.target.closest('.spa-link');
        if (!spaLink) return;
        e.preventDefault();
        const pageId = spaLink.dataset.page;
        if (pageId) navigateTo(pageId);
    });


    /* ================================================
       3. HASH ROUTING
       ================================================ */
    function handleHash() {
        const hash = window.location.hash.replace('#', '') || 'inicio';
        navigateTo(hash);
    }
    window.addEventListener('hashchange', handleHash);
    handleHash();


    /* ================================================
       4. MOBILE MENU
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

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });

    overlay.addEventListener('click', closeMobileMenu);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });

    /* Fecha menu ao redimensionar para desktop           ◀ RESPONSIVE */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) closeMobileMenu();
        }, 150);
    });


    /* ================================================
       5. SCROLL EFFECTS
       ================================================ */
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('header--scrolled', window.scrollY > 10);
                backToTop.classList.toggle('visible', window.scrollY > 400);
                ticking = false;
            });
            ticking = true;
        }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


    /* ================================================
       6. COUNTER ANIMATION
       ================================================ */
    let countersAnimated = false;
    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        document.querySelectorAll('.stat-item__number[data-count]').forEach(counter => {
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
       7. FORMS
       ================================================ */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const msg  = document.getElementById('mensagem').value.trim();

            if (!nome || !email || !msg) return showToast('Preencha todos os campos.', 'error');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast('E-mail inválido.', 'error');

            const btn = this.querySelector('button[type="submit"]');
            const original = btn.innerHTML;
            btn.innerHTML = '✓ Enviado!';
            btn.style.background = 'var(--success)';
            btn.style.borderColor = 'var(--success)';
            btn.disabled = true;
            showToast('Mensagem enviada com sucesso!', 'success');

            setTimeout(() => {
                btn.innerHTML = original; btn.style.background = ''; btn.style.borderColor = '';
                btn.disabled = false; this.reset();
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
            showToast('Redirecionando para o sistema...', 'success');
        });
    }


    /* ================================================
       8. PHONE MASK
       ================================================ */
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
            position: 'fixed',
            top: 'clamp(70px, 12vw, 100px)',
            right: 'clamp(12px, 3vw, 24px)',
            left: window.innerWidth <= 480 ? 'clamp(12px, 3vw, 24px)' : 'auto',
            maxWidth: '420px',
            padding: '14px 18px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '.88rem',
            fontWeight: '500',
            zIndex: '9999',
            color: '#fff',
            boxShadow: '0 8px 32px rgba(0,0,0,.15)',
            background: type === 'success' ? '#10B981' : '#EF4444',
            animation: 'toastIn .4s ease'
        });

        toast.querySelector('button').style.cssText =
            'background:none;border:none;color:#fff;font-size:1.3rem;cursor:pointer;padding:0 0 0 8px;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;';

        document.body.appendChild(toast);
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'toastOut .3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }

    const css = document.createElement('style');
    css.textContent = `
        @keyframes toastIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes toastOut{from{transform:translateX(0);opacity:1}to{transform:translateX(120%);opacity:0}}
        @media(max-width:480px){
            @keyframes toastIn{from{transform:translateY(-30px);opacity:0}to{transform:translateY(0);opacity:1}}
            @keyframes toastOut{from{transform:translateY(0);opacity:0}to{transform:translateY(-30px);opacity:0}}
        }
    `;
    document.head.appendChild(css);


    handleScroll();
});