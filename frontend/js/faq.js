/* ============================================
   FAQ PAGE — Data + Logic
   ============================================ */

// ===== FAQ DATA =====
const faqData = [
    {
        category: 'general',
        question: 'What is NovaTrack?',
        answer: 'NovaTrack is a modern order tracking platform that lets you follow your packages in stunning 3D visualization. It works with businesses of all sizes.',
    },
    {
        category: 'general',
        question: 'How does the 3D tracking work?',
        answer: 'Our platform uses Three.js to render interactive 3D visualizations of your package journey — from warehouse to doorstep — in real-time.',
    },
    {
        category: 'general',
        question: 'Is NovaTrack free to use?',
        answer: 'Yes! Our Free plan is perfect for personal projects with up to 10 orders per month. Paid plans start at just $29/month for businesses.',
    },
    {
        category: 'account',
        question: 'How do I create an account?',
        answer: 'Click "Get Started" on any page, fill in your name, email, and password. You\'ll be tracking orders in less than 60 seconds.',
    },
    {
        category: 'account',
        question: 'Can I change my email address?',
        answer: 'Currently, email changes require contacting support. We\'re working on a self-service option for future releases.',
    },
    {
        category: 'account',
        question: 'How do I delete my account?',
        answer: 'Go to Settings → Danger Zone → Delete Account. Please note this action is permanent and cannot be undone.',
    },
    {
        category: 'tracking',
        question: 'How do I track an order?',
        answer: 'Once logged in, enter your tracking ID on the dashboard. You\'ll see a 3D visualization plus a detailed timeline of your package journey.',
    },
    {
        category: 'tracking',
        question: 'How often is tracking data updated?',
        answer: 'Tracking data updates in real-time. You\'ll receive live status changes as your package moves through the delivery network.',
    },
    {
        category: 'tracking',
        question: 'What if my tracking ID doesn\'t work?',
        answer: 'Double-check the ID and try again. If the issue persists, contact the business that shipped your order or reach out to our support team.',
    },
    {
        category: 'billing',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, and bank transfers. All payments are securely processed.',
    },
    {
        category: 'billing',
        question: 'Can I cancel anytime?',
        answer: 'Absolutely. No contracts, no commitments. You can cancel or change your plan anytime from your Settings page.',
    },
    {
        category: 'billing',
        question: 'Do you offer refunds?',
        answer: 'Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked.',
    },
];

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

    tl.from('.faq-hero .badge', { opacity: 0, y: 20, duration: 0.6 })
      .from('.faq-hero__title', { opacity: 0, y: 40, duration: 0.8 }, '-=0.3')
      .from('.faq-hero__subtitle', { opacity: 0, y: 30, duration: 0.7 }, '-=0.5')
      .from('.faq-category', {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.5,
      }, '-=0.4');
});

// ===== RENDER FAQ =====
const faqList = document.getElementById('faqList');

function renderFaq(category = 'all') {
    const filtered = category === 'all'
        ? faqData
        : faqData.filter((item) => item.category === category);

    faqList.innerHTML = filtered.map((item, idx) => `
        <div class="faq-item" data-category="${item.category}">
            <button class="faq-item__question">
                ${item.question}
                <span class="faq-item__icon">+</span>
            </button>
            <div class="faq-item__answer">
                <p>${item.answer}</p>
            </div>
        </div>
    `).join('');

    // Attach click handlers
    document.querySelectorAll('.faq-item').forEach((faqItem) => {
        const question = faqItem.querySelector('.faq-item__question');
        const answer = faqItem.querySelector('.faq-item__answer');

        question.addEventListener('click', () => {
            const isActive = faqItem.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach((other) => {
                other.classList.remove('active');
                other.querySelector('.faq-item__answer').style.maxHeight = null;
            });

            // Open current
            if (!isActive) {
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // GSAP animation
    gsap.from('.faq-item', {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out',
    });
}

// Initial render
renderFaq();

// ===== CATEGORY FILTER =====
document.querySelectorAll('.faq-category').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.faq-category').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        renderFaq(btn.dataset.cat);
    });
});

// ===== CTA ANIMATION =====
gsap.from('.faq-cta .cta-card', {
    opacity: 0,
    y: 60,
    duration: 0.8,
    scrollTrigger: {
        trigger: '.faq-cta',
        start: 'top 80%',
    },
});

console.log('✅ FAQ page loaded');