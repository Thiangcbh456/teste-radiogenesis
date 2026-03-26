/* ================================================
   HEADER-SCROLL.JS — Scroll behavior + back-to-top
   ================================================ */

export function initHeaderScroll() {
    const header    = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    let lastScrollY = 0;
    let ticking     = false;

    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                const isScrolled     = currentScrollY > 10;

                if (header.classList.contains('header--scrolled') !== isScrolled) {
                    header.classList.toggle('header--scrolled', isScrolled);
                }

                if (currentScrollY > lastScrollY && currentScrollY > 80) {
                    header.classList.add('header--hidden');
                } else {
                    header.classList.remove('header--hidden');
                }

                lastScrollY = currentScrollY;

                if (backToTop) backToTop.classList.toggle('visible', currentScrollY > 400);

                const socialFloat = document.querySelector('.social-float');
                if (socialFloat) socialFloat.classList.toggle('visible', currentScrollY > 50);

                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
}