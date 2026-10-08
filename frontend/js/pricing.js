/* ============================================
   PRICING PAGE — Logic + Animations
   ============================================ */

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

    tl.from('.pricing-hero .badge', { opacity: 0, y: 20, duration: 0.6 })
      .from('.pricing-hero__title', { opacity: 0, y: 40, duration: 0.8 }, '-=0.3')
      .from('.pricing-hero__subtitle', { opacity: 0, y: 30, duration: 0.7 }, '-=0.5')
      .from('.billing-toggle', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4');
});


// ===== SCROLL ANIMATIONS =====

// Pricing cards
gsap.from('.pricing-card', {
    opacity: 0,
    y: 60,
    duration: 0.8,
    stagger: 0.15,
    scrollTrigger: {
        trigger: '.pricing-grid',
        start: 'top 80%',
    },
});

// FAQ items
gsap.from('.faq-item', {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.1,
    scrollTrigger: {
        trigger: '.faq-list',
        start: 'top 80%',
    },
});

// CTA
gsap.from('.pricing-cta .cta-card', {
    opacity: 0,
    y: 60,
    duration: 0.8,
    scrollTrigger: {
        trigger: '.pricing-cta',
        start: 'top 80%',
    },
});


// ===== BILLING TOGGLE =====
const toggleBtns = document.querySelectorAll('.billing-toggle__btn');
const priceAmounts = document.querySelectorAll('.pricing-card__amount');

toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const period = btn.dataset.period;

        // Update active button
        toggleBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Update prices
        priceAmounts.forEach((amount) => {
            const newValue = period === 'yearly' ? amount.dataset.yearly : amount.dataset.monthly;

            // Animate number change
            gsap.to(amount, {
                duration: 0.4,
                ease: 'power2.out',
                onStart: () => {
                    amount.textContent = newValue;
                },
            });
        });
    });
});


// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach((item) => {
    const question = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all others
        faqItems.forEach((otherItem) => {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-item__answer').style.maxHeight = null;
        });

        // Toggle current
        if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

console.log('✅ Pricing page loaded');