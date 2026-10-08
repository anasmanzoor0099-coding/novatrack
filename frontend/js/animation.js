/* ============================================
   NOVATRACK — Premium Animations
   GSAP + Lenis + ScrollTrigger
   ============================================ */

// ===== 1. LENIS SMOOTH SCROLL =====
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


// ===== 2. GSAP REGISTER PLUGINS =====
gsap.registerPlugin(ScrollTrigger);


// ===== 3. HERO ANIMATIONS =====
window.addEventListener('load', () => {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Hero badge
    heroTl.from('.badge', {
        opacity: 0,
        y: 20,
        duration: 0.6,
    });

    // Hero title (line by line)
    heroTl.from('.hero__title', {
        opacity: 0,
        y: 40,
        duration: 0.8,
    }, '-=0.3');

    // Hero subtitle
    heroTl.from('.hero__subtitle', {
        opacity: 0,
        y: 30,
        duration: 0.7,
    }, '-=0.5');

    // Hero CTA buttons
    heroTl.from('.hero__cta .btn', {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.6,
    }, '-=0.4');

    // Hero stats
    heroTl.from('.hero__stats .stat', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
    }, '-=0.3');

    // Hero visual (3D canvas box)
    heroTl.from('.hero__visual', {
        opacity: 0,
        scale: 0.9,
        duration: 1,
    }, '-=1');
});


// ===== 4. ANIMATED COUNTERS =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat__number');

    counters.forEach((counter) => {
        const text = counter.textContent;
        const hasK = text.includes('K');
        const hasPercent = text.includes('%');
        const hasM = text.includes('M');

        // Extract number from text
        let target = parseFloat(text.replace(/[^\d.]/g, ''));

        const obj = { value: 0 };

        gsap.to(obj, {
            value: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                let displayValue = Math.floor(obj.value);
                let suffix = '';

                if (hasM) suffix = 'M+';
                else if (hasK) suffix = 'K+';
                else if (hasPercent) {
                    displayValue = obj.value.toFixed(1);
                    suffix = '%';
                }

                counter.textContent = displayValue + suffix;
            },
            scrollTrigger: {
                trigger: counter,
                start: 'top 85%',
                once: true,
            },
        });
    });
}

animateCounters();


// ===== 5. SCROLL-TRIGGERED ANIMATIONS =====

// Section headers
gsap.utils.toArray('.section-header').forEach((header) => {
    gsap.from(header, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            once: true,
        },
    });
});

// Feature cards (staggered)
gsap.from('.feature-card', {
    opacity: 0,
    y: 60,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.features__grid',
        start: 'top 80%',
        once: true,
    },
});

// Tracking form
gsap.from('.tracking__form', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.tracking__form',
        start: 'top 85%',
        once: true,
    },
});


// ===== 6. BUTTON HOVER EFFECTS =====
document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out',
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
        });
    });
});


// ===== 7. FEATURE CARD HOVER =====
document.querySelectorAll('.feature-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -10,
            duration: 0.4,
            ease: 'power2.out',
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
        });
    });
});


// ===== 8. 3D HERO CUBE =====
// Wait for hero canvas to be ready
setTimeout(() => {
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas && typeof THREE !== 'undefined') {
        initHero3D(heroCanvas);
    }
}, 100);

function initHero3D(container) {
    // Scene setup
    const scene = new THREE.Scene();

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const purpleLight = new THREE.PointLight(0x8b5cf6, 80, 20);
    purpleLight.position.set(3, 3, 3);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x22d3ee, 60, 20);
    cyanLight.position.set(-3, -2, 2);
    scene.add(cyanLight);

    // Main cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({
        color: 0x6d28d9,
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0x4c1d95,
        emissiveIntensity: 0.4,
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Wireframe overlay
    const wireframeGeo = new THREE.EdgesGeometry(geometry);
    const wireframeMat = new THREE.LineBasicMaterial({
        color: 0xa78bfa,
        linewidth: 1,
    });
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
    cube.add(wireframe);

    // Particles
    const particlesCount = 60;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
        const radius = 4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
        color: 0x22d3ee,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
    });

    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth - 0.5;
        mouseY = e.clientY / window.innerHeight - 0.5;
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        cube.rotation.x = elapsed * 0.3;
        cube.rotation.y = elapsed * 0.5;
        cube.position.y = Math.sin(elapsed * 0.8) * 0.15;

        cube.rotation.x += mouseY * 0.02;
        cube.rotation.y += mouseX * 0.02;

        particles.rotation.y = elapsed * 0.05;
        particles.rotation.x = elapsed * 0.02;

        purpleLight.position.x = Math.sin(elapsed * 0.5) * 3;
        purpleLight.position.z = Math.cos(elapsed * 0.5) * 3;

        renderer.render(scene, camera);
    }

    animate();

    // Resize
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}

console.log('✅ NovaTrack animations loaded');
// ===== HAMBURGER MENU =====
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header__inner');
    const nav = document.querySelector('.nav');
    
    if (!header || !nav) return;
    
    // Create hamburger if it doesn't exist
    let hamburger = document.querySelector('.hamburger');
    
    if (!hamburger) {
        hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.setAttribute('aria-label', 'Toggle menu');
        hamburger.innerHTML = '<span></span><span></span><span></span>';
        
        // Insert before header__actions
        const actions = header.querySelector('.header__actions');
        if (actions) {
            header.insertBefore(hamburger, actions);
        } else {
            header.appendChild(hamburger);
        }
    }
    
    // Toggle menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Close menu on link click (mobile)
    nav.querySelectorAll('.nav__link').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });
});