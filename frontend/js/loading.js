/* ============================================
   LOADING STATES — Global
   ============================================ */

// ===== PAGE LOADER (Auto-hide on load) =====
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 400);
        }, 300);
    }
});

// ===== BUTTON LOADING HELPER =====
window.setButtonLoading = function(button, loadingText = null) {
    if (!button) return;
    
    if (!button.dataset.originalText) {
        button.dataset.originalText = button.innerHTML;
    }
    
    if (loadingText) {
        button.innerHTML = `<span class="spinner spinner--sm"></span> ${loadingText}`;
    } else {
        button.innerHTML = `<span class="spinner spinner--sm"></span>`;
    }
    
    button.classList.add('is-loading');
    button.disabled = true;
};

window.unsetButtonLoading = function(button) {
    if (!button) return;
    
    button.innerHTML = button.dataset.originalText || button.innerHTML;
    button.classList.remove('is-loading');
    button.disabled = false;
};

console.log('✅ Loading states loaded');