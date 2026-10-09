/* ============================================
   AUTH LOGIC — Real Backend Connection
   NovaTrack Full-Stack
   ============================================ */

// ===== API CONFIGURATION =====
const API_URL = 'https://novatrack-api.vercel.app/api/auth';

// ===== UTILITIES =====

/**
 * Shows a message below the form.
 */
function showMessage(text, type = 'error') {
    const el = document.getElementById('formMessage');
    if (!el) return;
    el.textContent = text;
    el.className = 'form__message form__message--' + type;
}

/**
 * Clears the form message.
 */
function clearMessage() {
    const el = document.getElementById('formMessage');
    if (!el) return;
    el.textContent = '';
    el.className = 'form__message';
}

// ===== PASSWORD TOGGLE =====

const togglePw = document.getElementById('togglePw');
const passwordInput = document.getElementById('password');

if (togglePw && passwordInput) {
    togglePw.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        togglePw.textContent = isPassword ? '🙈' : '👁';
    });
}

// ===== LOGIN FORM =====

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessage();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const submitBtn = document.getElementById('submitBtn');

        // --- Validation ---
        if (!email || !password) {
            return showMessage('Please fill in all fields.');
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return showMessage('Please enter a valid email address.');
        }

        // --- Loading state ---
       setButtonLoading(submitBtn, 'Signing in...');

        try {
            // --- REAL BACKEND CALL ---
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Login failed');
            }

            // --- Save session in localStorage (for frontend only) ---
            localStorage.setItem(
                'nt_session',
                JSON.stringify({
                    token: data.token,
                    user: data.user,
                    loggedInAt: Date.now(),
                })
            );

            showMessage('Welcome back! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 700);
        } catch (err) {
            console.error('Login error:', err);
            showMessage(err.message || 'Cannot connect to server. Is it running?');
        } finally {
            unsetButtonLoading(submitBtn);
        }
    });
}

// ============================================
// SIGNUP LOGIC
// ============================================

const signupForm = document.getElementById('signupForm');

if (signupForm) {
    // --- Password strength meter ---
    const pwInput = document.getElementById('password');
    const pwBar = document.getElementById('pwBar');
    const pwHint = document.getElementById('pwHint');
    const confirmInput = document.getElementById('confirm');
    const toggleConfirm = document.getElementById('toggleConfirm');

    if (toggleConfirm && confirmInput) {
        toggleConfirm.addEventListener('click', () => {
            const isPw = confirmInput.type === 'password';
            confirmInput.type = isPw ? 'text' : 'password';
            toggleConfirm.textContent = isPw ? '🙈' : '👁';
        });
    }

    if (pwInput && pwBar) {
        pwInput.addEventListener('input', () => {
            const val = pwInput.value;
            let strength = 0;

            if (val.length >= 6) strength++;
            if (/[A-Z]/.test(val)) strength++;
            if (/[0-9]/.test(val)) strength++;
            if (/[^A-Za-z0-9]/.test(val)) strength++;

            pwBar.className = 'pw-strength__bar';

            if (val.length === 0) {
                pwHint.textContent = 'Minimum 6 characters';
            } else if (strength <= 1) {
                pwBar.classList.add('pw-strength__bar--weak');
                pwHint.textContent = 'Weak password';
            } else if (strength === 2) {
                pwBar.classList.add('pw-strength__bar--medium');
                pwHint.textContent = 'Medium — add numbers & symbols';
            } else {
                pwBar.classList.add('pw-strength__bar--strong');
                pwHint.textContent = 'Strong password 💪';
            }
        });
    }

    // --- Signup form submit ---
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessage();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm').value;
        const terms = document.getElementById('terms').checked;
        const submitBtn = document.getElementById('submitBtn');

        // --- Validation ---
        if (!name || !email || !password || !confirm) {
            return showMessage('Please fill in all fields.');
        }

        if (name.length < 2) {
            return showMessage('Please enter a valid name.');
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return showMessage('Please enter a valid email address.');
        }

        if (password.length < 6) {
            return showMessage('Password must be at least 6 characters.');
        }

        if (password !== confirm) {
            return showMessage('Passwords do not match.');
        }

        if (!terms) {
            return showMessage('Please accept the Terms & Privacy Policy.');
        }

        // --- Loading ---
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';

        try {
            // --- REAL BACKEND CALL ---
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Signup failed');
            }

            // --- Save session ---
            localStorage.setItem(
                'nt_session',
                JSON.stringify({
                    token: data.token,
                    user: data.user,
                    loggedInAt: Date.now(),
                })
            );

            showMessage('Account created! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 800);
        } catch (err) {
            console.error('Signup error:', err);
            showMessage(err.message || 'Cannot connect to server. Is it running?');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    });
}