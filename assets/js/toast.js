/* ================================================
   TOAST.JS — Notificações toast
   ================================================ */

export function showToast(message, type) {
    const old = document.querySelector('.toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">&times;</button>`;

    Object.assign(toast.style, {
        position:      'fixed',
        top:           '80px',
        right:         '20px',
        padding:       '12px 20px',
        borderRadius: '12px',
        display:       'flex',
        alignItems:    'center',
        gap:           '10px',
        zIndex:        '9999',
        color:         '#fff',
        boxShadow:     '0 8px 32px rgba(0,0,0,.15)',
        background:    type === 'success' ? '#10B981' : '#EF4444',
        animation:     'toastIn .4s ease'
    });

    const closeBtn = toast.querySelector('button');
    closeBtn.style.cssText = 'background:none;border:none;color:#fff;font-size:1.3rem;cursor:pointer;';

    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4000);
}

export function initToastStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = '@keyframes toastIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
    document.head.appendChild(styleSheet);
}