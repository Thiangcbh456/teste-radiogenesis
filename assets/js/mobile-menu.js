/* ================================================
   MOBILE-MENU.JS — Hamburger + overlay
   ================================================ */

let resizeObserver = null;

export function openMobileMenu() {
    const header     = document.getElementById('header');
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay    = document.getElementById('mobileOverlay');

    if (!mobileMenu) return;

    const headerH = header ? header.getBoundingClientRect().height : 0;
    mobileMenu.style.top    = headerH + 'px';
    mobileMenu.style.height = '';
    mobileMenu.classList.add('open');
    if (overlay)   overlay.classList.add('active');
    if (hamburger) {
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';

    const app    = document.getElementById('app');
    const topBar = document.querySelector('.top-bar');
    if (app)    app.style.setProperty('pointer-events', 'none', 'important');
    if (topBar) topBar.style.setProperty('pointer-events', 'none', 'important');
    if (header && resizeObserver) resizeObserver.observe(header);
}

export function closeMobileMenu() {
    const header     = document.getElementById('header');
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay    = document.getElementById('mobileOverlay');

    if (!mobileMenu || !mobileMenu.classList.contains('open')) return;

    mobileMenu.classList.remove('open');
    if (overlay)   overlay.classList.remove('active');
    if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';

    const app    = document.getElementById('app');
    const topBar = document.querySelector('.top-bar');
    if (app)    app.style.removeProperty('pointer-events');
    if (topBar) topBar.style.removeProperty('pointer-events');
    if (header && resizeObserver) resizeObserver.unobserve(header);
}

export function initMobileMenu() {
    const hamburger      = document.getElementById('hamburger');
    const mobileMenu     = document.getElementById('mobileMenu');
    const overlay        = document.getElementById('mobileOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');

    if (!hamburger || !mobileMenu) return;

    resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            if (mobileMenu.classList.contains('open')) {
                mobileMenu.style.top = entry.contentRect.height + 'px';
            }
        }
    });

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });

    if (overlay)        overlay.addEventListener('click', closeMobileMenu);
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

    window.addEventListener('popstate', closeMobileMenu);
}