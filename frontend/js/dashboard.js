/* ============================================
   3D SCENE — Three.js Import
   ============================================ */
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
/* ============================================
   DASHBOARD LOGIC
   ============================================ */

// ===== AUTH CHECK =====
const session = JSON.parse(localStorage.getItem('nt_session') || 'null');

if (!session) {
    window.location.href = 'login.html';
} else {
    const userNameEl = document.getElementById('userName');
    const avatarEl = document.getElementById('userAvatar');

    // Naya structure: session.user.name
    const user = session.user || session;
    const fullName = user.name || 'User';

    if (userNameEl) {
        userNameEl.textContent = fullName.split(' ')[0];
    }

    if (avatarEl) {
        avatarEl.textContent = fullName.charAt(0).toUpperCase();
    }
}

// ===== LOGOUT =====
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('nt_session');
        window.location.href = 'login.html';
    });
}

// ===== TRACKING FORM =====
const trackForm = document.getElementById('trackForm');
const trackInput = document.getElementById('trackInput');
const trackIdDisplay = document.getElementById('trackIdDisplay');

if (trackForm) {
    trackForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = trackInput.value.trim() || 'NT-2024-XK9821';
        trackIdDisplay.textContent = id.toUpperCase();

        // Smooth scroll to tracker
        document.getElementById('tracker').scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    });
}

console.log('✅ NovaTrack Dashboard loaded for:', session?.name || 'Guest');
/* ============================================
   3D TRACKING SCENE
   ============================================ */

function init3DScene() {
    const container = document.getElementById('tracking-canvas');
    if (!container) return;

    // ===== 1. SETUP =====
    const scene = new THREE.Scene();
    
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ===== 2. LIGHTS =====
    // Ambient light (soft overall glow)
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // Purple point light (main glow from top-right)
    const purpleLight = new THREE.PointLight(0x8b5cf6, 100, 20);
    purpleLight.position.set(3, 3, 3);
    scene.add(purpleLight);

    // Cyan point light (accent from bottom-left)
    const cyanLight = new THREE.PointLight(0x22d3ee, 60, 20);
    cyanLight.position.set(-3, -2, 2);
    scene.add(cyanLight);

    // ===== 3. MAIN OBJECT — Rotating Package =====
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    
    const material = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        metalness: 0.3,
        roughness: 0.4,
        emissive: 0x4c1d95,
        emissiveIntensity: 0.3,
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // ===== 4. WIREFRAME OVERLAY =====
    const wireframeGeo = new THREE.EdgesGeometry(geometry);
    const wireframeMat = new THREE.LineBasicMaterial({ 
        color: 0xa78bfa,
        linewidth: 1,
    });
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
    cube.add(wireframe);

    // ===== 5. FLOATING PARTICLES (data points around cube) =====
    const particlesCount = 60;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
        const radius = 4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

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

    // ===== 6. MOUSE INTERACTION =====
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    // ===== 7. ANIMATION LOOP =====
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        // Auto rotation
        cube.rotation.x = elapsed * 0.3;
        cube.rotation.y = elapsed * 0.5;

        // Subtle floating motion
        cube.position.y = Math.sin(elapsed * 0.8) * 0.15;

        // Mouse-based tilt (subtle)
        cube.rotation.x += mouseY * 0.02;
        cube.rotation.y += mouseX * 0.02;

        // Particles slow rotation
        particles.rotation.y = elapsed * 0.05;
        particles.rotation.x = elapsed * 0.02;

        // Animate purple light
        purpleLight.position.x = Math.sin(elapsed * 0.5) * 3;
        purpleLight.position.z = Math.cos(elapsed * 0.5) * 3;

        renderer.render(scene, camera);
    }

    animate();

    // ===== 8. HANDLE RESIZE =====
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}

// ===== INIT =====
// Wait for DOM to be ready, then init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DScene);
} else {
    init3DScene();
}