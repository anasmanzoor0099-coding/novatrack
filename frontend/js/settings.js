/* ============================================
   SETTINGS PAGE — Full Logic
   ============================================ */

const API_URL = 'https://novatrack-api.vercel.app/api/auth';

// ===== AUTH CHECK =====
const session = JSON.parse(localStorage.getItem('nt_session') || 'null');

if (!session || !session.token) {
    window.location.href = 'login.html';
}

const token = session?.token;
const user = session?.user;

// ===== HELPER: Fetch with Auth =====
async function apiCall(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || 'Request failed');
    }

    return data;
}

// ===== INIT: Load User Data =====
document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('profileName');
    const emailInput = document.getElementById('profileEmail');
    const avatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');

    if (nameInput && user) nameInput.value = user.name || '';
    if (emailInput && user) emailInput.value = user.email || '';
    if (avatar && user) avatar.textContent = (user.name || 'U').charAt(0).toUpperCase();

    // Load preferences from localStorage
    loadPreferences();
});

// ===== LOGOUT =====
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('nt_session');
        window.location.href = 'login.html';
    });
}

// ===== TABS =====
const tabs = document.querySelectorAll('.settings-tab');
const panels = document.querySelectorAll('.settings-panel');

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        tabs.forEach((t) => t.classList.remove('active'));
        panels.forEach((p) => p.classList.remove('active'));

        tab.classList.add('active');
        document.querySelector(`[data-panel="${targetTab}"]`).classList.add('active');
    });
});

// ===== SHOW MESSAGE =====
function showMessage(elementId, text, type = 'error') {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = text;
    el.className = 'form__message form__message--' + type;
}

function clearMessage(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = '';
    el.className = 'form__message';
}

// ===== PASSWORD TOGGLE =====
document.querySelectorAll('.form__toggle-pw').forEach((btn) => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.toggle;
        const input = document.getElementById(targetId);
        if (!input) return;

        const isPw = input.type === 'password';
        input.type = isPw ? 'text' : 'password';
        btn.textContent = isPw ? '🙈' : '👁';
    });
});

// ===== PROFILE FORM =====
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessage('profileMessage');

        const name = document.getElementById('profileName').value.trim();
        const submitBtn = document.getElementById('profileSubmit');

        if (!name || name.length < 2) {
            return showMessage('profileMessage', 'Name must be at least 2 characters');
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            const data = await apiCall('/update-profile', {
                method: 'PUT',
                body: JSON.stringify({ name }),
            });

            // Update session
            session.user.name = data.user.name;
            localStorage.setItem('nt_session', JSON.stringify(session));

            // Update avatar
            const avatar = document.getElementById('userAvatar');
            if (avatar) avatar.textContent = data.user.name.charAt(0).toUpperCase();

            showMessage('profileMessage', '✅ Profile updated successfully!', 'success');
        } catch (err) {
            showMessage('profileMessage', err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Changes';
        }
    });
}

// ===== PASSWORD FORM =====
const passwordForm = document.getElementById('passwordForm');
if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessage('passwordMessage');

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        const submitBtn = document.getElementById('passwordSubmit');

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return showMessage('passwordMessage', 'Please fill in all fields');
        }

        if (newPassword.length < 6) {
            return showMessage('passwordMessage', 'New password must be at least 6 characters');
        }

        if (newPassword !== confirmNewPassword) {
            return showMessage('passwordMessage', 'New passwords do not match');
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Updating...';

        try {
            await apiCall('/change-password', {
                method: 'PUT',
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            showMessage('passwordMessage', '✅ Password changed successfully!', 'success');
            passwordForm.reset();
        } catch (err) {
            showMessage('passwordMessage', err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Update Password';
        }
    });
}

// ===== PREFERENCES =====
function loadPreferences() {
    const prefs = JSON.parse(localStorage.getItem('nt_preferences') || '{}');

    const emailNotif = document.getElementById('emailNotif');
    const orderNotif = document.getElementById('orderNotif');
    const marketingNotif = document.getElementById('marketingNotif');

    if (emailNotif) emailNotif.checked = prefs.emailNotif !== false;
    if (orderNotif) orderNotif.checked = prefs.orderNotif !== false;
    if (marketingNotif) marketingNotif.checked = prefs.marketingNotif === true;
}

function savePreferences() {
    const prefs = {
        emailNotif: document.getElementById('emailNotif')?.checked ?? true,
        orderNotif: document.getElementById('orderNotif')?.checked ?? true,
        marketingNotif: document.getElementById('marketingNotif')?.checked ?? false,
    };

    localStorage.setItem('nt_preferences', JSON.stringify(prefs));
}

document.querySelectorAll('.switch input').forEach((input) => {
    input.addEventListener('change', savePreferences);
});

// ===== DELETE ACCOUNT MODAL =====
const deleteModal = document.getElementById('deleteModal');
const deleteBtn = document.getElementById('deleteAccountBtn');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');
const deleteConfirmInput = document.getElementById('deleteConfirmInput');

if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
        deleteModal.classList.add('active');
        deleteConfirmInput.value = '';
        confirmDelete.disabled = true;
    });
}

if (cancelDelete) {
    cancelDelete.addEventListener('click', () => {
        deleteModal.classList.remove('active');
    });
}

if (deleteConfirmInput) {
    deleteConfirmInput.addEventListener('input', () => {
        confirmDelete.disabled = deleteConfirmInput.value !== 'DELETE';
    });
}

if (confirmDelete) {
    confirmDelete.addEventListener('click', async () => {
        confirmDelete.disabled = true;
        confirmDelete.textContent = 'Deleting...';

        try {
            await apiCall('/delete-account', { method: 'DELETE' });

            // Clear session
            localStorage.removeItem('nt_session');
            localStorage.removeItem('nt_preferences');

            alert('Account deleted successfully. Redirecting...');
            window.location.href = 'index.html';
        } catch (err) {
            alert('Error: ' + err.message);
            confirmDelete.disabled = false;
            confirmDelete.textContent = 'Delete Permanently';
        }
    });
}

// Close modal on overlay click
document.querySelector('.modal__overlay')?.addEventListener('click', () => {
    deleteModal.classList.remove('active');
});

console.log('✅ Settings page loaded');