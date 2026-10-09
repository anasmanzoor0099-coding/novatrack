/* ============================================
   CONTACT PAGE — Animations + Form
   ============================================ */

// ===== API CONFIG =====
const API_URL = 'https://novatrack-api.vercel.app/api/contact';

// ===== LENIS SMOOTH SCROLL =====
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

gsap.registerPlugin(ScrollTrigger);


// ===== HERO ANIMATIONS =====
window.addEventListener('load', () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.contact-hero .badge', { opacity: 0, y: 20, duration: 0.6 })
      .from('.contact-hero__title', { opacity: 0, y: 40, duration: 0.8 }, '-=0.3')
      .from('.contact-hero__subtitle', { opacity: 0, y: 30, duration: 0.7 }, '-=0.5');
});


// ===== SCROLL ANIMATIONS =====

// Info cards
gsap.from('.contact-info__card', {
    opacity: 0,
    x: -30,
    duration: 0.6,
    stagger: 0.1,
    scrollTrigger: {
        trigger: '.contact-info__cards',
        start: 'top 80%',
    },
});

// Contact form
gsap.from('.contact-form-wrapper', {
    opacity: 0,
    x: 50,
    duration: 0.8,
    scrollTrigger: {
        trigger: '.contact-grid',
        start: 'top 80%',
    },
});

// CTA
gsap.from('.cta-card', {
    opacity: 0,
    y: 60,
    duration: 0.8,
    scrollTrigger: {
        trigger: '.contact-cta',
        start: 'top 80%',
    },
});


// ===== FORM SUBMISSION =====
const contactForm = document.getElementById('contactForm');

function showMessage(text, type = 'error') {
    const el = document.getElementById('contactFormMessage');
    if (!el) return;
    el.textContent = text;
    el.className = 'form__message form__message--' + type;
}

function clearMessage() {
    const el = document.getElementById('contactFormMessage');
    if (!el) return;
    el.textContent = '';
    el.className = 'form__message';
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessage();

        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        const submitBtn = document.getElementById('contactSubmit');

        // Validation
        if (!name || !email || !subject || !message) {
            return showMessage('Please fill in all fields.');
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return showMessage('Please enter a valid email address.');
        }

        if (message.length < 10) {
            return showMessage('Message must be at least 10 characters.');
        }

        // Submit
        setButtonLoading(submitBtn, 'Sending...');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to send message');
            }

            showMessage('✅ Message sent! We\'ll get back to you within 24 hours.', 'success');
            contactForm.reset();
        } catch (err) {
            console.error('Contact form error:', err);
            showMessage(err.message || 'Something went wrong. Please try again.');
        } finally {
            unsetButtonLoading(submitBtn);
        }
    });
}

console.log('✅ Contact page loaded');