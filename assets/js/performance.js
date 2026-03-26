/* ================================================
   PERFORMANCE.JS — Detecção de performance
   ================================================ */

export function detectPerformance() {
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
}

export function getPerfDelay() {
    const root = document.documentElement;
    return root.classList.contains('perf-low')  ? 250
         : root.classList.contains('perf-mid')  ? 280
         : 150;
}

export function isPerfLow() {
    return document.documentElement.classList.contains('perf-low');
}