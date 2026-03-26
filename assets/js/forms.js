/* ================================================
   FORMS.JS — Formulários e máscaras
   ================================================ */

// Correção: Removido o "08-" do nome do arquivo
import { showToast } from './toast.js';

export function initForms() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome  = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const msg   = document.getElementById('mensagem').value.trim();

            if (!nome || !email || !msg) return showToast('Preencha todos os campos.', 'error');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast('E-mail inválido.', 'error');

            const btn      = this.querySelector('button[type="submit"]');
            const original = btn.innerHTML;
            btn.innerHTML   = '✓ Enviado!';
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
        tel.addEventListener('input', function() {
            let v = this.value.replace(/\D/g, '').slice(0, 11);
            if (v.length > 6)      v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
            else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
            else if (v.length > 0) v = `(${v}`;
            this.value = v;
        });
    }
}