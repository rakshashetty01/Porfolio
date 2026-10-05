/**
 * Raksha Shetty — Scroll-Driven Editorial Portfolio Engine
 * Exact Dymas Alfin Sequence:
 * 1. Giant font animates in first
 * 2. Photo slides UP from bottom into full visibility
 * 3. Every section: Giant font reveals FIRST -> Photos/Cards slide UP visible
 * Powered by GSAP, ScrollTrigger, and Three.js
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Register GSAP plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ==========================================================================
     HARMONIC PENTATONIC AUDIO SYNTHESIZER
     ========================================================================== */
  let audioCtx = null;
  let soundEnabled = false;
  const notes = [311.13, 349.23, 392.00, 466.16, 523.25, 622.25, 698.46];

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
  }

  function playHarmonicTone(index = 0, duration = 0.12) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const freq = notes[index % notes.length];
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.02, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio permissions
    }
  }

  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.classList.toggle('active', soundEnabled);
      if (soundEnabled) {
        initAudio();
        playHarmonicTone(4, 0.2);
        showToast('🔊 Interactive Sound Effects Enabled');
      } else {
        showToast('🔇 Sound Muted');
      }
    });
  }

  /* ==========================================================================
     CUSTOM MAGNETIC CURSOR
     ========================================================================== */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouch) {
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  } else {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (cursorRing) cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    const interactiveElements = document.querySelectorAll(
      'a, button, .project-card, .service-card, .filter-btn, .quick-contact-pill, input, textarea, select'
    );
    interactiveElements.forEach((el, idx) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        playHarmonicTone(idx % notes.length, 0.06);
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  /* ==========================================================================
     MAGNETIC BUTTON PHYSICS ENGINE
     ========================================================================== */
  const magneticTargets = document.querySelectorAll('.magnetic-target');
  if (!isTouch) {
    magneticTargets.forEach((target) => {
      target.addEventListener('mousemove', (e) => {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.35;
        const deltaY = (e.clientY - centerY) * 0.35;
        target.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      });

      target.addEventListener('mouseleave', () => {
        target.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     THREE.JS 3D WEBGL INTERACTIVE CANVAS
     ========================================================================== */
  const webglContainer = document.getElementById('webgl-canvas-container');
  if (webglContainer && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    webglContainer.appendChild(renderer.domElement);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const particleCount = isTouch ? 400 : 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const maroonColor = new THREE.Color(0x800000);
    const pearlColor = new THREE.Color(0xf5dcdc);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      const r = 40 + (Math.random() - 0.5) * 14;

      positions[i * 3] = r * Math.cos(u) * Math.cos(v);
      positions[i * 3 + 1] = r * Math.sin(u) * 0.65;
      positions[i * 3 + 2] = r * Math.sin(v);

      const mixed = pearlColor.clone().lerp(maroonColor, Math.random() * 0.7);
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    particleSystem.position.y = -6;
    scene.add(particleSystem);

    const crystals = [];
    const crystalGeo = new THREE.IcosahedronGeometry(3.2, 0);
    const crystalMat = new THREE.MeshPhongMaterial({
      color: 0xf5dcdc,
      emissive: 0x800000,
      emissiveIntensity: 0.25,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });

    for (let i = 0; i < 4; i++) {
      const mesh = new THREE.Mesh(crystalGeo, crystalMat);
      mesh.position.set((Math.random() - 0.5) * 90, (Math.random() - 0.5) * 45, (Math.random() - 0.5) * 30);
      scene.add(mesh);
      crystals.push({ mesh, rx: (Math.random() - 0.5) * 0.015, ry: (Math.random() - 0.5) * 0.015 });
    }

    const pointLight = new THREE.PointLight(0xa81c2d, 2.5, 180);
    pointLight.position.set(0, 0, 50);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    let targetX = 0;
    let targetY = 0;
    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    let clock = new THREE.Clock();
    function animate3D() {
      requestAnimationFrame(animate3D);
      const elapsedTime = clock.getElapsedTime();

      particleSystem.rotation.y = elapsedTime * 0.04;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.03) * 0.15;

      camera.position.x += (targetX * 12 - camera.position.x) * 0.04;
      camera.position.y += (targetY * 8 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      pointLight.position.x = targetX * 60;
      pointLight.position.y = targetY * 40;

      crystals.forEach((c) => {
        c.mesh.rotation.x += c.rx;
        c.mesh.rotation.y += c.ry;
      });

      renderer.render(scene, camera);
    }
    animate3D();
  }

  /* ==========================================================================
     DYMAS ALFIN ANIMATION SEQUENCE (ENTRY & SCROLL CHOREOGRAPHY)
     Sequence:
     1. Giant Font ("RAKSHA SHETTY") animates in first!
     2. Then the Photo slides UP from bottom into full visibility!
     3. Then the Role text and buttons slide up into place!
     ========================================================================== */
  if (typeof gsap !== 'undefined') {
    // 1. Initial Hero Entrance Sequence
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Step 1: The giant font ("RAKSHA SHETTY") comes in FIRST
    // Animate inner text element so there is ZERO conflict with outer container scroll parallax
    heroTl.fromTo(
      '.giant-text-single-line',
      { y: 80, opacity: 0, scale: 0.94 },
      { y: 0, opacity: 1, scale: 1, duration: 1.25 }
    );

    // Step 2: Then the photo slides UP from bottom into visibility
    heroTl.fromTo(
      '#hero-portrait-photo',
      { y: 180, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 1.35 },
      '-=0.75' // Starts overlapping as font settles
    );

    // Step 2b: Radiance halo aura behind portrait expands
    heroTl.fromTo(
      '.portrait-glow-halo',
      { scale: 0.45, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out' },
      '-=1.2'
    );

    // Step 3: Floating editorial badges glide in
    heroTl.fromTo(
      ['#hero-badge-left', '#hero-badge-right'],
      { y: 35, opacity: 0, scale: 0.88 },
      { y: 0, opacity: 1, scale: 1, duration: 0.85, stagger: 0.15 },
      '-=0.7'
    );

    // Step 4: Status pill, role block, and socials reveal
    heroTl.fromTo(
      '#hero-status-pill',
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.7'
    );

    heroTl.fromTo(
      '#hero-role-block',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 },
      '-=0.6'
    );

    heroTl.fromTo(
      '#hero-meta-block',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 },
      '-=0.7'
    );

    // 2. Hero Scroll Parallax (Applied to outer containers, eliminating tween collision)
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.to('#hero-giant-text', {
        y: -90,
        opacity: 0.35,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });

      gsap.to('#hero-portrait-stage', {
        y: -50,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });

      // 3. EVERY SECTION SCROLL-DRIVEN SEQUENCE:
      // "the animation of the font should come then the photo should come up visible. Everything should work like that not like this."

      // For every section:
      const sections = ['#works', '#services', '#about', '#experience', '#contact'];

      sections.forEach((secId) => {
        const section = document.querySelector(secId);
        if (!section) return;

        const head = section.querySelector('.reveal-head');
        const cards = section.querySelectorAll('.reveal-card');

        const secTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none'
          },
          defaults: { ease: 'power3.out' }
        });

        // Step 1: Font/Headline animates in FIRST
        if (head) {
          secTl.fromTo(
            head,
            { y: 70, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9 }
          );
        }

        // Step 2: Photos / Cards slide UP into visibility!
        if (cards && cards.length > 0) {
          secTl.fromTo(
            cards,
            { y: 130, opacity: 0, scale: 0.92 },
            { y: 0, opacity: 1, scale: 1, duration: 1.1, stagger: 0.16 },
            '-=0.5' // Photo/cards rise up as font settles
          );
        }
      });
    }
  }

  /* ==========================================================================
     KINETIC TEXT SCRAMBLE / DECRYPT EFFECT
     ========================================================================== */
  const scrambleChars = '!<>-_\\/[]{}—=+*^?#________';
  function scrambleText(element) {
    const originalText = element.getAttribute('data-text') || element.textContent;
    let iteration = 0;
    let interval = null;

    clearInterval(interval);
    interval = setInterval(() => {
      element.textContent = originalText
        .split('')
        .map((letter, index) => {
          if (index < iteration) return originalText[index];
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join('');

      if (iteration >= originalText.length) clearInterval(interval);
      iteration += 1 / 2;
    }, 28);
  }

  document.querySelectorAll('.scramble-hover').forEach((el) => {
    el.addEventListener('mouseenter', () => scrambleText(el));
  });

  /* ==========================================================================
     DYMAS ALFIN MOUSE PARALLAX (Subtle dynamic sway)
     ========================================================================== */
  const heroSection = document.getElementById('hero');
  const portraitPhoto = document.getElementById('hero-portrait-photo');
  const giantTypography = document.getElementById('hero-giant-text');
  const badgeLeft = document.getElementById('hero-badge-left');
  const badgeRight = document.getElementById('hero-badge-right');

  if (heroSection && !isTouch) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
      const yPercent = (e.clientY - rect.top) / rect.height - 0.5;

      if (portraitPhoto) {
        const moveX = xPercent * 22;
        const moveY = yPercent * 16;
        portraitPhoto.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      }

      if (giantTypography) {
        const textMoveX = xPercent * -28;
        const textMoveY = yPercent * -16;
        giantTypography.style.transform = `translate(calc(-50% + ${textMoveX}px), calc(-50% + ${textMoveY}px))`;
      }

      if (badgeLeft) {
        badgeLeft.style.transform = `translate3d(${xPercent * 16}px, ${yPercent * 12}px, 0)`;
      }
      if (badgeRight) {
        badgeRight.style.transform = `translate3d(${xPercent * 22}px, ${yPercent * 18}px, 0)`;
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      if (portraitPhoto) portraitPhoto.style.transform = 'translate3d(0, 0, 0)';
      if (giantTypography) giantTypography.style.transform = 'translate(-50%, -50%)';
      if (badgeLeft) badgeLeft.style.transform = '';
      if (badgeRight) badgeRight.style.transform = '';
    });
  }

  /* ==========================================================================
     3D TILT PHYSICS FOR PROJECT CARDS
     ========================================================================== */
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    if (!isTouch) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    }
  });

  /* ==========================================================================
     PROJECT CATEGORY FILTER TABS
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      playHarmonicTone(2, 0.08);

      const filterVal = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     PROJECT DATA & DEEP DIVE MODAL
     ========================================================================== */
  const projectsData = {
    syncflow: {
      title: 'Syncflow AI Orchestrator',
      tagline: 'Enterprise Cloud Infrastructure Control Plane & Distributed Clusters',
      img: 'assets/proj_cloudflow.jpg',
      specs: [
        { label: 'Role', val: 'Principal Architect & Full-Stack Lead' },
        { label: 'Tech Stack', val: 'Next.js 15, Go, Kubernetes, Kafka, Tailwind' },
        { label: 'Throughput', val: '789.6 TB Processed / mo' },
        { label: 'Availability', val: '99.98% Monitored Uptime' }
      ],
      desc: 'Syncflow AI unifies complex hybrid-cloud architectures into an intuitive, zero-latency dashboard. By leveraging event-driven microservices written in Go and an asynchronous WebSocket stream, telemetry from over 340 active microservices is aggregated and analyzed in real-time. Automated cluster healing routines reduce manual engineering intervention by over 60%.',
      features: [
        'Automated real-time anomaly detection with statistical drift alerting.',
        'High-density time-series data visualization rendered on HTML5 Canvas at 60 FPS.',
        'Zero-downtime rolling canary deployments orchestrated directly from the web interface.',
        'Multi-tenant RBAC security model with end-to-end cryptographic audit logging.'
      ]
    },
    lumina: {
      title: 'Lumina AI 3D Studio',
      tagline: 'Procedural Generative 3D Mesh Synthesis & WebGL Workspace',
      img: 'assets/proj_neuroart.jpg',
      specs: [
        { label: 'Role', val: 'Frontend & WebGL Systems Engineer' },
        { label: 'Tech Stack', val: 'Three.js, GLSL, React 19, Python FastAPI, PyTorch' },
        { label: 'Render Latency', val: '< 16ms Interactive Frame Time' },
        { label: 'Polygons', val: 'Up to 250k dynamic polygons' }
      ],
      desc: 'Lumina AI connects text and image prompts directly to three-dimensional procedural geometry in real-time. Utilizing custom GLSL shaders and optimized WebGL draw-call batching, users can manipulate crystalline forms, lighting presets, and export clean production-ready OBJ/GLTF assets straight to their digital pipelines.',
      features: [
        'Hardware-accelerated PBR (Physically Based Rendering) viewport inside standard modern browsers.',
        'Dynamic parameter sliders (detail, complexity, roughness) updating GPU buffers synchronously.',
        'Client-side procedural geometry caching with IndexedDB integration.',
        'Multi-angle turntable exporter with photorealistic ambient occlusion passes.'
      ]
    },
    pulsepay: {
      title: 'PulsePay Core Engine',
      tagline: 'High-Velocity Multi-Currency Settlement & Ledger Architecture',
      img: 'assets/proj_pulsepay.jpg',
      specs: [
        { label: 'Role', val: 'Backend & Distributed Systems Architect' },
        { label: 'Tech Stack', val: 'TypeScript, Node.js, Redis, PostgreSQL, Docker' },
        { label: 'Volume', val: '$42.8M Daily Transaction Ledger' },
        { label: 'Latency', val: '1.2ms Internal Settlement Speed' }
      ],
      desc: 'PulsePay addresses the demanding throughput requirements of global cross-border payments. Engineered with idempotent API endpoints, distributed Redis mutexes, and write-ahead transaction ledgers, the platform ensures complete consistency even amidst network partitions.',
      features: [
        'Distributed lock manager preventing race conditions during simultaneous payment settlement.',
        'Real-time fraud telemetry calculating risk scores within 5ms of payload ingestion.',
        'Automated reconciliation engine validating bank clearing files across 14 currencies.',
        'Cryptographic webhooks with exponential backoff and replay attack protection.'
      ]
    },
    devorbit: {
      title: 'DevOrbit Collaborative IDE',
      tagline: 'Ephemeral In-Browser Development Environments with CRDTs',
      img: 'assets/proj_devorbit.jpg',
      specs: [
        { label: 'Role', val: 'Full-Stack & WebAssembly Engineer' },
        { label: 'Tech Stack', val: 'WebSockets, Yjs CRDTs, Rust, WebAssembly, React' },
        { label: 'Sync Delay', val: '< 25ms Peer-to-Peer Latency' },
        { label: 'Concurrency', val: '50+ Active Peers per Workspace' }
      ],
      desc: 'DevOrbit provides instant, zero-install developer sandboxes directly in Google Chrome and modern browsers. By embedding WebAssembly runtime modules and CRDT conflict-free replication trees, teams can co-code, run unit tests, and terminal sessions without stepping on each other’s keystrokes.',
      features: [
        'Conflict-free multi-cursor synchronization with visual presence badges.',
        'Sandboxed WebAssembly compiler executing TypeScript and Rust in-browser.',
        'Low-overhead WebRTC audio conferencing embedded alongside editor buffers.',
        'One-click GitHub branch checkout and container snapshot persistence.'
      ]
    },
    aurabiotrack: {
      title: 'Aura BioTrack Telemetry',
      tagline: 'High-Frequency Wearable Sensor Ingestion & Health Analytics',
      img: 'assets/proj_aurabiotrack.jpg',
      specs: [
        { label: 'Role', val: 'Lead Full-Stack Developer' },
        { label: 'Tech Stack', val: 'Next.js, TimescaleDB, Canvas API, GraphQL, Python' },
        { label: 'Data Points', val: '12M+ Sensor Records Ingested / day' },
        { label: 'Accuracy', val: '99.4% Physiological Trend Model' }
      ],
      desc: 'Aura BioTrack synchronizes biometric sensor feeds (heart rate variability, sleep stages, recovery metrics) into actionable personal wellness dashboards. Designed with TimescaleDB continuous aggregates to make querying months of continuous biometric time-series instant.',
      features: [
        'Interactive smooth bezier canvas graphs with scrubbable temporal crosshairs.',
        'Automated anomaly detection flagging sleep irregularities and recovery dips.',
        'Offline-first progressive web app (PWA) with background sync capabilities.',
        'HIPAA-compliant encrypted data storage with patient-controlled key sharing.'
      ]
    },
    hypersonic: {
      title: 'HyperSonic UI Framework',
      tagline: 'Ultra-Lightweight 60FPS Component System & Token Architecture',
      img: 'assets/proj_neuroart.jpg',
      specs: [
        { label: 'Role', val: 'UI/UX & Design Systems Creator' },
        { label: 'Tech Stack', val: 'Vanilla JS, CSS Houdini, Web Components, Rollup' },
        { label: 'Bundle Size', val: '< 9.2 KB Gzipped (Zero Dependencies)' },
        { label: 'A11y Score', val: '100% WCAG AAA Compliant' }
      ],
      desc: 'HyperSonic was developed to break free from heavy JavaScript component bloat. Built entirely upon native Web Components and modern CSS custom properties, it guarantees silky 60FPS fluid physics, keyboard accessibility, and effortless skinning.',
      features: [
        'Hardware-accelerated micro-animations utilizing CSS Houdini Paint API.',
        'Complete semantic accessibility with ARIA attributes baked in by default.',
        'Native light/dark/custom theme tokens switchable in a single CSS cascade.',
        'Zero framework lock-in: compatible with React, Vue, Svelte, or Vanilla HTML.'
      ]
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalTagline = document.getElementById('modal-tagline');
  const modalImg = document.getElementById('modal-img');
  const modalSpecs = document.getElementById('modal-specs');
  const modalDesc = document.getElementById('modal-desc');
  const modalFeatures = document.getElementById('modal-features');
  const modalDemoBtn = document.getElementById('modal-live-demo-btn');
  const modalCodeBtn = document.getElementById('modal-code-link-btn');

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalTagline.textContent = data.tagline;
    modalImg.src = data.img;
    modalDesc.textContent = data.desc;

    modalSpecs.innerHTML = data.specs
      .map(
        (s) => `
      <div class="modal-spec-item">
        <span class="modal-spec-label">${s.label}</span>
        <span class="modal-spec-val">${s.val}</span>
      </div>
    `
      )
      .join('');

    modalFeatures.innerHTML = data.features.map((f) => `<li>${f}</li>`).join('');

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playHarmonicTone(4, 0.1);
  }

  function closeProjectModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
    playHarmonicTone(1, 0.08);
  }

  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const pid = card.getAttribute('data-project-id');
      if (pid) openProjectModal(pid);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  if (modalDemoBtn) {
    modalDemoBtn.addEventListener('click', () => {
      playHarmonicTone(5, 0.15);
      showToast('🚀 Launching live interactive sandbox environment...');
      setTimeout(() => {
        showToast('✨ Live demo telemetry active & synchronized!');
      }, 1400);
    });
  }

  if (modalCodeBtn) {
    modalCodeBtn.addEventListener('click', () => {
      playHarmonicTone(3, 0.1);
      showToast('📖 Architecture diagram & documentation opened!');
    });
  }

  /* ==========================================================================
     RESUME MODAL HANDLERS
     ========================================================================== */
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const resumeCloseBtn = document.getElementById('resume-close-btn');
  const downloadPdfBtn = document.getElementById('download-resume-pdf-btn');

  if (openResumeBtn) {
    openResumeBtn.addEventListener('click', () => {
      resumeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      playHarmonicTone(4, 0.1);
    });
  }

  if (resumeCloseBtn) {
    resumeCloseBtn.addEventListener('click', () => {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
      playHarmonicTone(1, 0.08);
    });
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      playHarmonicTone(5, 0.12);
      showToast('📄 Preparing Raksha_Shetty_Resume.pdf download...');
      setTimeout(() => {
        showToast('✅ Download started successfully!');
      }, 1200);
    });
  }

  /* ==========================================================================
     COMMAND PALETTE HUD (⌘K)
     ========================================================================== */
  const cmdPalette = document.getElementById('cmd-palette');
  const openCmdBtn = document.getElementById('open-cmd-btn');
  const cmdSearchInput = document.getElementById('cmd-search-input');
  const cmdResults = document.getElementById('cmd-results');

  function openCommandPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.add('active');
    if (cmdSearchInput) {
      cmdSearchInput.value = '';
      cmdSearchInput.focus();
    }
    filterCommandItems('');
    playHarmonicTone(3, 0.1);
  }

  function closeCommandPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.remove('active');
  }

  if (openCmdBtn) openCmdBtn.addEventListener('click', openCommandPalette);

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPalette && cmdPalette.classList.contains('active')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    }
  });

  if (cmdPalette) {
    cmdPalette.addEventListener('click', (e) => {
      if (e.target === cmdPalette) closeCommandPalette();
    });
  }

  function filterCommandItems(query) {
    if (!cmdResults) return;
    const items = cmdResults.querySelectorAll('.cmd-item');
    const q = query.toLowerCase().trim();
    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (cmdSearchInput) {
    cmdSearchInput.addEventListener('input', (e) => {
      filterCommandItems(e.target.value);
    });
  }

  if (cmdResults) {
    cmdResults.querySelectorAll('.cmd-item').forEach((item) => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        const target = item.getAttribute('data-target');
        closeCommandPalette();

        if (action === 'goto' && target) {
          const sec = document.querySelector(target);
          if (sec) sec.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'resume') {
          if (resumeModal) {
            resumeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
          }
        } else if (action === 'theme') {
          cycleTheme();
        } else if (action === 'sound') {
          soundEnabled = !soundEnabled;
          if (soundBtn) soundBtn.classList.toggle('active', soundEnabled);
          showToast(soundEnabled ? '🔊 Sound Enabled' : '🔇 Sound Muted');
        }
      });
    });
  }

  /* ==========================================================================
     INTERACTIVE CLI TERMINAL SHELL
     ========================================================================== */
  const cliInput = document.getElementById('cli-input-field');
  const cliHistory = document.getElementById('cli-history-output');

  if (cliInput && cliHistory) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawCmd = cliInput.value.trim();
        if (!rawCmd) return;
        cliInput.value = '';

        const userLine = document.createElement('div');
        userLine.className = 'cli-line-output';
        userLine.innerHTML = `<span style="color:#C93434; font-weight:700;">rs:~$</span> ${escapeHTML(rawCmd)}`;
        cliHistory.appendChild(userLine);

        const responseLine = document.createElement('div');
        responseLine.className = 'cli-line-output';

        const cmd = rawCmd.toLowerCase();
        if (cmd === 'help') {
          responseLine.innerHTML = `
            Available Commands:<br>
            • <span style="color:#A5B4FC;">skills</span> — inspect technical capabilities<br>
            • <span style="color:#A5B4FC;">works</span> — list production projects<br>
            • <span style="color:#A5B4FC;">hire</span> — get in touch / hire Raksha<br>
            • <span style="color:#A5B4FC;">whoami</span> — developer profile manifesto<br>
            • <span style="color:#A5B4FC;">clear</span> — clear terminal buffer<br>
            • <span style="color:#A5B4FC;">matrix</span> — initiate neural glitch
          `;
        } else if (cmd === 'skills') {
          responseLine.innerHTML = `Stack: [Next.js 15, React 19, TypeScript, Go, WebGL/Three.js, Kubernetes, PostgreSQL, Redis]`;
        } else if (cmd === 'works' || cmd === 'projects') {
          responseLine.innerHTML = `Projects: Syncflow AI, Lumina AI 3D, PulsePay Global, DevOrbit, Aura BioTrack, HyperSonic UI`;
        } else if (cmd === 'hire' || cmd === 'contact') {
          responseLine.innerHTML = `Direct contact: <span style="color:#FDE047;">raksha.shetty.dev@gmail.com</span> (Bangalore, India)`;
          showToast('🎉 Let’s build something extraordinary together!');
        } else if (cmd === 'whoami') {
          responseLine.innerHTML = `Raksha Shetty — Senior Full-Stack Engineer & Creative Architect`;
        } else if (cmd === 'clear') {
          cliHistory.innerHTML = '';
          return;
        } else if (cmd === 'matrix') {
          responseLine.innerHTML = `Wake up, Neo... The matrix has you. 🟢`;
          document.body.style.filter = 'hue-rotate(90deg)';
          setTimeout(() => (document.body.style.filter = ''), 2000);
        } else {
          responseLine.innerHTML = `command not found: "${escapeHTML(rawCmd)}". Type 'help' for instructions.`;
        }

        cliHistory.appendChild(responseLine);
        const terminalBody = document.getElementById('terminal-code-body');
        if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
        playHarmonicTone(1, 0.08);
      }
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, (tag) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
  }

  /* ==========================================================================
     ATMOSPHERE / THEME SWITCHER
     ========================================================================== */
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themes = ['default', 'dark', 'wine', 'garnet'];
  let currentThemeIdx = 0;

  // Restore persisted theme from localStorage
  const savedTheme = localStorage.getItem('rs_portfolio_theme');
  if (savedTheme && themes.includes(savedTheme)) {
    currentThemeIdx = themes.indexOf(savedTheme);
    applyTheme(savedTheme, false);
  }

  function applyTheme(theme, showToastMsg = true) {
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
      if (showToastMsg) showToast('🍷 Atmosphere: Royal Maroon & Alabaster');
    } else if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (showToastMsg) showToast('🌙 Atmosphere: Velvet Obsidian & Deep Maroon');
    } else if (theme === 'wine') {
      document.documentElement.setAttribute('data-theme', 'wine');
      if (showToastMsg) showToast('🍇 Atmosphere: Imperial Wine & Velvet Glow');
    } else if (theme === 'garnet') {
      document.documentElement.setAttribute('data-theme', 'garnet');
      if (showToastMsg) showToast('💎 Atmosphere: Radiant Garnet & Pure Gold');
    }
    localStorage.setItem('rs_portfolio_theme', theme);
  }

  function cycleTheme() {
    currentThemeIdx = (currentThemeIdx + 1) % themes.length;
    applyTheme(themes[currentThemeIdx], true);
    playHarmonicTone(4, 0.1);
  }

  if (themeBtn) themeBtn.addEventListener('click', cycleTheme);

  /* ==========================================================================
     COPY CODE & COPY EMAIL ACTIONS
     ========================================================================== */
  const copyCodeBtn = document.getElementById('copy-code-btn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const codeText = document.getElementById('terminal-code-body').innerText;
      navigator.clipboard.writeText(codeText).then(() => {
        playHarmonicTone(5, 0.1);
        showToast('📋 Terminal history copied to clipboard!');
      });
    });
  }

  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('raksha.shetty.dev@gmail.com').then(() => {
        playHarmonicTone(5, 0.1);
        showToast('📬 Email copied: raksha.shetty.dev@gmail.com');
      });
    });
  }

  /* ==========================================================================
     CONTACT FORM SUBMISSION SIMULATION
     ========================================================================== */
  const contactForm = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('submit-form-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();

      if (!name || !email) {
        showToast('⚠️ Please fill in all required fields.');
        return;
      }

      const originalContent = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <span>Transmitting Message...</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.3"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
      `;
      submitBtn.disabled = true;
      playHarmonicTone(2, 0.1);

      setTimeout(() => {
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
        contactForm.reset();
        playHarmonicTone(6, 0.25);
        showToast(`🎉 Thank you, ${name}! Your message was delivered.`);
      }, 1400);
    });
  }

  /* ==========================================================================
     LIVE IST CLOCK (Bangalore, India)
     ========================================================================== */
  const clockEl = document.getElementById('live-ist-clock');
  function updateISTClock() {
    if (!clockEl) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
      clockEl.textContent = `Bangalore, India • ${timeStr} IST`;
    } catch (e) {
      // Fallback
    }
  }
  updateISTClock();
  setInterval(updateISTClock, 1000);

  /* ==========================================================================
     TOAST NOTIFICATION HELPER
     ========================================================================== */
  const toast = document.getElementById('toast-notify');
  const toastMsg = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('active');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('active');
    }, 3800);
  }

  /* ==========================================================================
     ACTIVE NAVIGATION SPY & SMOOTH SCROLL
     ========================================================================== */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 240;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      if (window.pageYOffset > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0.6';
      }
    }
  });

  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playHarmonicTone(4, 0.1);
    });
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksMenu = document.getElementById('nav-links-menu');
  if (mobileMenuBtn && navLinksMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksMenu.classList.toggle('mobile-open');
      playHarmonicTone(3, 0.08);
    });

    navLinksMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksMenu.classList.remove('mobile-open');
      });
    });
  }

  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeCommandPalette();
      if (resumeModal) {
        resumeModal.classList.remove('active');
        document.body.style.overflow = '';
      }
      if (navLinksMenu) {
        navLinksMenu.classList.remove('mobile-open');
      }
    }
  });
});
