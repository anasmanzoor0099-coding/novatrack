/* ============================================
   404 PAGE — Animations + 3D Scene
   ============================================ */

// ===== GSAP SETUP =====
window.addEventListener('load', () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.error-content .badge', { opacity: 0, y: 20, duration: 0.5 })
      .from('.error-number__digit', {
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 0.7,
      }, '-=0.2')
      .from('.error-title', { opacity: 0, y: 30, duration: 0.6 }, '-=0.4')
      .from('.error-subtitle', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
      .from('.error-actions .btn', {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.5,
      }, '-=0.3')
      .from('.error-links', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3');

    // 3D scene
    const container = document.getElementById('error-3d');
    if (container && typeof window.THREE !== 'undefined') {
        initError3D(container);
    }
});


// ===== 3D SCENE =====
function initError3D(container) {
    const THREE = window.THREE;

    // Scene setup
    const scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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

    // Broken/Wireframe cube
    const geometry = new THREE.IcosahedronGeometry(1.8, 1);

    const material = new THREE.MeshStandardMaterial({
        color: 0x6d28d9,
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0x4c1d95,
        emissiveIntensity: 0.4,
        wireframe: false,
    });

    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    // Wireframe overlay
    const wireframeGeo = new THREE.EdgesGeometry(geometry);
    const wireframeMat = new THREE.LineBasicMaterial({ color: 0xa78bfa });
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
    shape.add(wireframe);

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

    // Animate
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        // Floating + rotating
        shape.rotation.x = elapsed * 0.4;
        shape.rotation.y = elapsed * 0.6;
        shape.position.y = Math.sin(elapsed * 1.2) * 0.2;

        // Mouse tilt
        shape.rotation.x += mouseY * 0.02;
        shape.rotation.y += mouseX * 0.02;

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

console.log('✅ 404 page loaded');