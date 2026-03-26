/* ================================================
   COUNTERS.JS — Contadores animados
   ================================================ */

let countersAnimated = false;

export function resetCounters() {
    countersAnimated = false;
}

export function animateCounters() {
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