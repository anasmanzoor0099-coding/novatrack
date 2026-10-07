/* ============================================
   ABOUT PAGE — Animations
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

    tl.from('.about-hero .badge', { opacity: 0, y: 20, duration: 0.6 })
      .from('.about-hero__title', { opacity: 0, y: 40, duration: 0.8 }, '-=0.3')
      .from('.about-hero__subtitle', { opacity: 0, y: 30, duration: 0.7 }, '-=0.5');
});


// ===== SCROLL ANIMATIONS =====

// Story section
gsap.from('.about-story__content', {
    opacity: 0,
    x: -50,
    duration: 1,
    scrollTrigger: {
        trigger: '.about-story',
        start: 'top 80%',
    },
});

gsap.from('.about-story__card', {
    opacity: 0,
    x: 50,
    duration: 1,
    scrollTrigger: {
        trigger: '.about-story',
        start: 'top 80%',
    },
});

// MVV cards stagger
gsap.from('.mvv-card', {
    opacity: 0,
    y: 60,
    duration: 0.8,
    stagger: 0.15,
    scrollTrigger: {
        trigger: '.mvv__grid',
        start: 'top 80%',
    },
});

// Founder section
gsap.from('.about-founder__avatar', {
    opacity: 0,
    scale: 0.5,
    duration: 0.8,
    scrollTrigger: {
        trigger: '.about-founder',
        start: 'top 80%',
    },
});

gsap.from('.about-founder__content', {
    opacity: 0,
    x: 50,
    duration: 0.8,
    scrollTrigger: {
        trigger: '.about-founder',
        start: 'top 80%',
    },
});

// Timeline items
gsap.utils.toArray('.timeline-vertical__item').forEach((item) => {
    gsap.from(item, {
        opacity: 0,
        x: -30,
        duration: 0.6,
        scrollTrigger: {
            trigger: item,
            start: 'top 85%',
        },
    });
});

// CTA card
gsap.from('.cta-card', {
    opacity: 0,
    y: 60,
    duration: 0.8,
    scrollTrigger: {
        trigger: '.about-cta',
        start: 'top 80%',
    },
});

console.log('✅ About page loaded');