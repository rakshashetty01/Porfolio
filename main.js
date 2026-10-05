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
        if (el.classList.contains('symbol-dock-btn') || el.closest('.hero-symbols-dock')) {
          document.body.classList.add('cursor-dock-hover');
        } else {
          document.body.classList.add('cursor-hover');
        }
        playHarmonicTone(idx % notes.length, 0.06);
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover', 'cursor-dock-hover');
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
     SMART FLOATING NAVBAR SCROLL STATE
     ========================================================================== */
  const mainNav = document.getElementById('main-nav');
  if (mainNav) {
    const handleNavScroll = () => {
      if (window.scrollY > 30) {
        mainNav.classList.add('scrolled');
      } else {
        mainNav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

  /* ==========================================================================
     THREE.JS 3D WEBGL INTERACTIVE CANVAS (Safely Guarded)
     ========================================================================== */
  const webglContainer = document.getElementById('webgl-canvas-container');
  if (webglContainer && typeof THREE !== 'undefined') {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 85;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      webglContainer.appendChild(renderer.domElement);

      let targetX = 0;
      let targetY = 0;
      window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth) * 2 - 1;
        targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      }, { passive: true });

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, { passive: true });

      function animate3D() {
        requestAnimationFrame(animate3D);
        camera.position.x += (targetX * 6 - camera.position.x) * 0.04;
        camera.position.y += (targetY * 4 - camera.position.y) * 0.04;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      }
      animate3D();
    } catch (err) {
      console.warn('Three.js canvas safely bypassed:', err);
    }
  }

  /* ==========================================================================
     DYMAS ALFIN ANIMATION SEQUENCE (ENTRY & SCROLL CHOREOGRAPHY)
     Sequence:
     1. Giant Font ("RAKSHA") animates in first!
     2. Then the Photo slides UP from bottom into full visibility & begins organic float!
     3. Then the Role text and buttons slide up into place!
     ========================================================================== */
  if (typeof gsap !== 'undefined') {
    // 1. Initial Hero Entrance Sequence
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Step 1: The giant font ("RAKSHA" outline + "SHETTY" solid) comes in FIRST
    heroTl.fromTo(
      ['.hero-word-outline', '.hero-word-solid'],
      { y: 55, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.15, stagger: 0.12, ease: 'power3.out' }
    );

    // Step 2: Then the portrait photo slides UP from bottom into visibility
    heroTl.fromTo(
      '#hero-portrait-photo',
      { y: 170, opacity: 0, scale: 0.94 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.25,
        ease: 'power3.out',
        onComplete: () => {
          // Continuous, organic breathing / floating animation
          gsap.to('#hero-portrait-photo', {
            y: -10,
            duration: 3.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        }
      },
      '-=0.85'
    );

    // Step 2b: Radiance halo aura behind portrait expands
    heroTl.fromTo(
      '.portrait-glow-halo',
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' },
      '-=1.1'
    );

    // Step 3: Role block on left slides up
    heroTl.fromTo(
      '#hero-role-block',
      { y: 35, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
      '-=0.75'
    );

    // Step 4: Symbol dock buttons stagger in
    heroTl.fromTo(
      '.symbol-dock-btn',
      { y: 20, scale: 0.8, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.65, stagger: 0.07, ease: 'back.out(1.7)' },
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
      const sections = ['#works', '#services', '#skills', '#about', '#experience', '#education', '#contact'];

      sections.forEach((secId) => {
        const section = document.querySelector(secId);
        if (!section) return;

        const head = section.querySelector('.reveal-head');
        const cards = section.querySelectorAll('.reveal-card');

        const secTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none none'
          },
          defaults: { ease: 'power3.out' }
        });

        // Step 1: Font/Headline animates in FIRST
        if (head) {
          secTl.fromTo(
            head,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9 }
          );
        }

        // Step 2: Photos / Cards slide UP into visibility with transform cleared on finish
        if (cards && cards.length > 0) {
          secTl.fromTo(
            cards,
            { y: 110, opacity: 0, scale: 0.93 },
            { y: 0, opacity: 1, scale: 1, duration: 1.0, stagger: 0.14, clearProps: 'transform' },
            '-=0.5' // Photo/cards rise up as font settles
          );
        }
      });

      // 4. SKILL PROGRESS BARS REVEAL
      const skillsSection = document.querySelector('#skills');
      if (skillsSection) {
        const skillFills = skillsSection.querySelectorAll('.skill-meter-fill');
        if (skillFills.length > 0) {
          gsap.from(skillFills, {
            width: '0%',
            duration: 1.3,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: '#skills',
              start: 'top 75%',
              toggleActions: 'play none none none'
            }
          });
        }
      }
    }
  }



  /* ==========================================================================
     DYMAS ALFIN 3D MOUSE PARALLAX (Silky GSAP Floating Response)
     ========================================================================== */
  const heroSection = document.getElementById('hero');
  const portraitStage = document.getElementById('hero-portrait-stage');
  const giantTypography = document.getElementById('hero-giant-text');

  if (heroSection && !isTouch && typeof gsap !== 'undefined') {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
      const yNorm = (e.clientY - rect.top) / rect.height - 0.5;

      if (portraitStage) {
        gsap.to(portraitStage, {
          xPercent: -50,
          x: xNorm * 20,
          y: yNorm * 10,
          duration: 0.65,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }

      if (giantTypography) {
        gsap.to(giantTypography, {
          xPercent: -50,
          yPercent: -50,
          x: xNorm * -20,
          y: yNorm * -10,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      if (portraitStage) {
        gsap.to(portraitStage, { xPercent: -50, x: 0, y: 0, duration: 0.85, ease: 'power2.out' });
      }
      if (giantTypography) {
        gsap.to(giantTypography, { xPercent: -50, yPercent: -50, x: 0, y: 0, duration: 0.85, ease: 'power2.out' });
      }
    });
  }

  /* ==========================================================================
     3D TILT PHYSICS FOR PROJECT CARDS & CAPSTONE SPOTLIGHT
     ========================================================================== */
  const allWorkCards = document.querySelectorAll('.project-card, .capstone-spotlight-card');
  allWorkCards.forEach((card) => {
    if (!isTouch) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const maxTilt = card.classList.contains('capstone-spotlight-card') ? 3 : 6;
        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    }
  });

  /* ==========================================================================
     CATEGORY FILTER TABS (Spotlight Project vs Clinical Experience)
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const capstoneHeroCard = document.getElementById('capstone-hero-card');
  const experienceSubhead = document.getElementById('experience-subhead');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      playHarmonicTone(2, 0.08);

      const filterVal = btn.getAttribute('data-filter');

      // Capstone spotlight card visibility
      if (capstoneHeroCard) {
        if (filterVal === 'all' || filterVal === 'capstone') {
          capstoneHeroCard.style.display = 'grid';
          capstoneHeroCard.style.opacity = '0';
          setTimeout(() => {
            capstoneHeroCard.style.transition = 'opacity 0.3s ease';
            capstoneHeroCard.style.opacity = '1';
          }, 30);
        } else {
          capstoneHeroCard.style.display = 'none';
        }
      }

      // Experience subhead divider visibility
      if (experienceSubhead) {
        if (filterVal === 'all') {
          experienceSubhead.style.display = 'flex';
        } else {
          experienceSubhead.style.display = 'none';
        }
      }

      // Regular experience cards visibility
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
     CAPABILITIES DOMAIN FILTER TABS (Clinical Care vs Data/Tech)
     ========================================================================== */
  const capFilterBtns = document.querySelectorAll('.cap-filter-btn');
  const capabilityCards = document.querySelectorAll('.services-grid .service-card');

  capFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      capFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      playHarmonicTone(3, 0.08);

      const filterVal = btn.getAttribute('data-cap-filter');

      capabilityCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 35);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     PROJECT DATA & DEEP DIVE MODAL (AUTHENTIC RESUME DATA)
     ========================================================================== */
  const projectsData = {
    interior: {
      title: '3D Virtual Interior Design Web Simulator',
      tagline: 'Academic Capstone Project • Pure Vanilla HTML5, CSS3 & JavaScript ES6 Engine',
      img: 'assets/proj_interior_simulator.jpg',
      specs: [
        { label: 'Role', val: 'Web Developer & Project Creator' },
        { label: 'Architecture', val: 'Pure Vanilla JS ES6 (Zero External Libraries)' },
        { label: 'Spatial Engine', val: 'HTML5 Canvas 2D/3D Matrix Transform' },
        { label: 'Academic Standing', val: 'BCA High Distinction (CGPA 8.65)' }
      ],
      desc: 'Raksha\'s sole interactive web application capstone developed from first principles using pure vanilla HTML5, CSS3, and JavaScript ES6. Users can interactively manipulate room dimensions, place virtual furniture models, calculate spatial clearances, and experiment with room aesthetics in an interactive, fluid browser experience with zero framework overhead.',
      features: [
        'Interactive 2D/3D coordinate canvas allowing real-time furniture positioning and isometric perspective.',
        'Live dimensioning engine calculating room area (16×14ft = 224 sq.ft) and spatial clearance automatically.',
        'Multi-ambiance lighting engine shifting canvas shadows and color temperatures in real time.',
        'Zero-framework architecture achieving 60 FPS performance and instant load times with zero bundle overhead.'
      ]
    },
    ivf: {
      title: 'IVF Healthcare Counseling & Patient Intake',
      tagline: 'Empathetic Healthcare Counseling & Confidential Records Operations',
      img: 'assets/proj_aurabiotrack.jpg',
      specs: [
        { label: 'Clinic', val: 'IVF Access, Rajajinagar, Bengaluru' },
        { label: 'Tenure', val: '2026 — Present' },
        { label: 'Focus', val: 'Patient Needs Counseling & Coordination' },
        { label: 'Integrity', val: '100% Strict Medical Record Confidentiality' }
      ],
      desc: 'Direct client counseling and healthcare operational coordination at IVF Access, Rajajinagar. Guiding prospective and ongoing clients through specialized clinical care pathways, explaining clinical protocols with deep empathy, and managing comprehensive medical intake registrations.',
      features: [
        'Counsel clients and evaluate unique care requirements with compassion, active listening, and clarity.',
        'Coordinate patient registrations, ongoing follow-ups, and proactive communication cycles.',
        'Maintain absolute confidentiality and meticulous record-keeping across clinical documentation.',
        'Collaborate closely with doctors, nurses, and administrative teams for seamless healthcare service delivery.'
      ]
    },
    analytics: {
      title: 'Business Analytics & Power BI Suite',
      tagline: 'Interactive Data Modeling, Trend Analysis & KPI Telemetry',
      img: 'assets/proj_cloudflow.jpg',
      specs: [
        { label: 'Organization', val: 'Certisured Internship (2025)' },
        { label: 'Tools', val: 'Power BI, Advanced Excel, Pivot Tables, SQL' },
        { label: 'Scope', val: 'Business Intelligence & Performance Analytics' },
        { label: 'Output', val: 'Executive Reporting Dashboards' }
      ],
      desc: 'Completed an intensive Business Analytics Internship at Certisured, engineering interactive Power BI dashboards and advanced Excel models. Transformed complex multi-variate business datasets into clear executive reports with actionable statistical insights.',
      features: [
        'Advanced Microsoft Excel modeling featuring nested formulas, pivot tables, and dynamic charting.',
        'Interactive Power BI dashboards enabling multi-dimensional slicing and drill-down KPI exploration.',
        'Automated analytical data cleaning, filtering, and trend variance calculations.',
        'Executive presentation layouts designed to guide strategic data-backed operational decisions.'
      ]
    },
    tally: {
      title: 'Tally ERP Billing & Clinic Administration',
      tagline: 'Healthcare Financial Ledgers, Invoicing & Operational Workflows',
      img: 'assets/proj_pulsepay.jpg',
      specs: [
        { label: 'Organization', val: 'IVF Access, Rajajinagar, Bengaluru' },
        { label: 'Period', val: '2025 — 2026' },
        { label: 'System', val: 'Tally ERP & Microsoft Excel' },
        { label: 'Role', val: 'Accountant & Administration Executive' }
      ],
      desc: 'Managed end-to-end accounting operations, billing verification, and routine administration at IVF Access Rajajinagar. Maintained pristine financial ledgers, processed patient service invoices, and streamlined routine clinic office operations.',
      features: [
        'Managed daily billing, invoice generation, receipts, and multi-mode payment reconciliations.',
        'Maintained structured spreadsheets and business records in Excel and Tally ERP.',
        'Conducted routine audit trail checks ensuring zero discrepancy in clinic operational expenses.',
        'Coordinated administrative tasks, vendor communications, and routine office logistics.'
      ]
    },
    java: {
      title: 'Core Java & Relational Database System',
      tagline: 'Certified Object-Oriented Software Architecture & SQL Database Querying',
      img: 'assets/proj_devorbit.jpg',
      specs: [
        { label: 'Certification', val: 'Anudip Foundation' },
        { label: 'Language', val: 'Core Java (OOP, Collections, JDBC)' },
        { label: 'Database', val: 'Relational SQL & Schema Architecture' },
        { label: 'Stack', val: 'Java, SQL, HTML5, CSS3, JavaScript' }
      ],
      desc: 'Certified by Anudip Foundation in Java Core and Web Development. Engineered structured Java applications employing Object-Oriented Programming (OOP) paradigms, JDBC relational database connections, and optimized SQL data schemas.',
      features: [
        'Robust OOP class hierarchy modeling entities, encapsulation, and modular design.',
        'Relational SQL database tables with primary/foreign keys, joins, and indexing.',
        'Secure database connectivity handling automated record insertion, updates, and lookups.',
        'Integration with web frontends utilizing HTML5, CSS3, and JavaScript.'
      ]
    },
    uiux: {
      title: 'UI/UX & Executive Visual Presentation Suite',
      tagline: 'Visual Dashboard Layouts, Client Journeys & Interface Wireframing',
      img: 'assets/proj_hypersonic.jpg',
      specs: [
        { label: 'Tools', val: 'Figma, Canva, Microsoft PowerPoint' },
        { label: 'Domain', val: 'Healthcare Dashboard & Information Design' },
        { label: 'Focus', val: 'Accessibility, Readability & Brand Harmony' },
        { label: 'Asset Types', val: 'Wireframes, Prototypes & Deck Templates' }
      ],
      desc: 'Designed clean, human-centered user interface layouts and executive presentation decks using Figma and Canva. Built specialized patient journey maps, clinic performance summaries, and high-impact visual assets.',
      features: [
        'Modern UI dashboard wireframes tailored for healthcare and administrative data monitoring.',
        'Cohesive color palettes with royal accents, clean typography hierarchy, and intuitive navigation.',
        'Comprehensive PowerPoint and Canva slide decks for stakeholder presentations.',
        'User journey flows mapping client intake touchpoints and follow-up milestones.'
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
  const modalSimulatorBox = document.getElementById('modal-interactive-simulator');

  let activeProjectId = null;

  /* ==========================================================================
     INTERACTIVE 3D ROOM SIMULATOR ENGINE (Vanilla JS & HTML5 Canvas)
     ========================================================================== */
  let currentPreset = 'living';
  let currentLight = 'warm';

  const roomPresets = {
    living: { width: 16, length: 14, area: 224, clearance: 68, name: 'Living Room' },
    studio: { width: 12, length: 12, area: 144, clearance: 76, name: 'Compact Studio' },
    suite:  { width: 20, length: 15, area: 300, clearance: 62, name: 'Master Suite' }
  };

  const lightThemes = {
    warm:  { floor: '#B88B58', floorBorder: '#A07545', wall: '#272221', ambient: 'rgba(255, 180, 80, 0.15)', text: '#FDE68A' },
    day:   { floor: '#D4C8B8', floorBorder: '#BAAC9A', wall: '#2C2E33', ambient: 'rgba(255, 255, 255, 0.10)', text: '#E2E8F0' },
    night: { floor: '#423732', floorBorder: '#332924', wall: '#15151B', ambient: 'rgba(255, 120, 60, 0.22)', text: '#FCA5A5' }
  };

  function renderRoomSimulator() {
    const canvas = document.getElementById('sim-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina support
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width > 0 ? rect.width : 760;
    const h = rect.height > 0 ? rect.height : 290;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const preset = roomPresets[currentPreset] || roomPresets.living;
    const theme = lightThemes[currentLight] || lightThemes.warm;

    // Background clear
    ctx.fillStyle = '#111116';
    ctx.fillRect(0, 0, w, h);

    // Ambient light overlay
    const radial = ctx.createRadialGradient(w / 2, h / 2 - 20, 20, w / 2, h / 2, w / 2);
    radial.addColorStop(0, theme.ambient);
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, w, h);

    // Isometric origin and scale
    const cx = w / 2;
    const cy = h / 2 + 30;
    const scale = Math.min(w / 40, 18);

    // Isometric projection helpers
    function toIso(x, y, z = 0) {
      const isoX = cx + (x - y) * Math.cos(Math.PI / 6) * scale;
      const isoY = cy + (x + y) * Math.sin(Math.PI / 6) * scale - z * scale;
      return { x: isoX, y: isoY };
    }

    const rw = preset.width / 2;
    const rl = preset.length / 2;

    // Draw Floor polygon
    const p1 = toIso(-rw, -rl);
    const p2 = toIso(rw, -rl);
    const p3 = toIso(rw, rl);
    const p4 = toIso(-rw, rl);

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fillStyle = theme.floor;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = theme.floorBorder;
    ctx.stroke();

    // Floor grid / wood planks
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1;
    for (let i = -rw + 2; i < rw; i += 2) {
      const g1 = toIso(i, -rl);
      const g2 = toIso(i, rl);
      ctx.beginPath();
      ctx.moveTo(g1.x, g1.y);
      ctx.lineTo(g2.x, g2.y);
      ctx.stroke();
    }

    // Left Wall
    const wallHeight = 7;
    const wTop1 = toIso(-rw, -rl, wallHeight);
    const wTop4 = toIso(-rw, rl, wallHeight);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(wTop1.x, wTop1.y);
    ctx.lineTo(wTop4.x, wTop4.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fillStyle = theme.wall;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.stroke();

    // Right Back Wall
    const wTop2 = toIso(rw, -rl, wallHeight);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(wTop1.x, wTop1.y);
    ctx.lineTo(wTop2.x, wTop2.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fill();
    ctx.stroke();

    // Helper to draw isometric 3D furniture box
    function drawIsoBox(bx, by, bw, bl, bh, colorTop, colorFront, colorSide, label) {
      const b1 = toIso(bx, by);
      const b2 = toIso(bx + bw, by);
      const b3 = toIso(bx + bw, by + bl);
      const b4 = toIso(bx, by + bl);

      const t1 = toIso(bx, by, bh);
      const t2 = toIso(bx + bw, by, bh);
      const t3 = toIso(bx + bw, by + bl, bh);
      const t4 = toIso(bx, by + bl, bh);

      // Shadow
      ctx.beginPath();
      ctx.ellipse(b3.x - 10, b3.y + 6, bw * scale * 0.7, bl * scale * 0.4, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fill();

      // Front Face
      ctx.beginPath();
      ctx.moveTo(b4.x, b4.y);
      ctx.lineTo(b3.x, b3.y);
      ctx.lineTo(t3.x, t3.y);
      ctx.lineTo(t4.x, t4.y);
      ctx.closePath();
      ctx.fillStyle = colorFront;
      ctx.fill();
      ctx.stroke();

      // Side Face
      ctx.beginPath();
      ctx.moveTo(b3.x, b3.y);
      ctx.lineTo(b2.x, b2.y);
      ctx.lineTo(t2.x, t2.y);
      ctx.lineTo(t3.x, t3.y);
      ctx.closePath();
      ctx.fillStyle = colorSide;
      ctx.fill();
      ctx.stroke();

      // Top Face
      ctx.beginPath();
      ctx.moveTo(t1.x, t1.y);
      ctx.lineTo(t2.x, t2.y);
      ctx.lineTo(t3.x, t3.y);
      ctx.lineTo(t4.x, t4.y);
      ctx.closePath();
      ctx.fillStyle = colorTop;
      ctx.fill();
      ctx.stroke();

      // Label Pin
      if (label) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, t3.x - 4, t3.y - 6);
      }
    }

    // Render furniture based on preset
    if (currentPreset === 'living') {
      // Beige Sofa
      drawIsoBox(-rw + 2, -2, 7, 3, 2.2, '#E8DCB8', '#D4C79F', '#C2B58C', 'Beige Sofa');
      // Walnut Table
      drawIsoBox(-rw + 3, 2.5, 4.5, 2.2, 1.2, '#7C5335', '#6B4529', '#57371F', 'Coffee Table');
      // Nordic Lounge Armchair
      drawIsoBox(2, 1.5, 2.8, 2.8, 2.0, '#E0D4BA', '#CFC2A6', '#BDAF92', 'Armchair');
      // Indoor Plant
      drawIsoBox(-rw + 0.8, -rl + 1.2, 1.5, 1.5, 3.2, '#3E8E41', '#327234', '#285C2B', '🪴 Plant');
      // Floor Lamp
      drawIsoBox(rw - 2.5, -rl + 2, 1.2, 1.2, 4.5, '#F59E0B', '#D97706', '#B45309', '💡 Lamp');
    } else if (currentPreset === 'studio') {
      // Daybed
      drawIsoBox(-rw + 1.5, -rl + 1.5, 6, 3, 2.0, '#CBD5E1', '#94A3B8', '#64748B', 'Daybed Studio');
      // Workdesk
      drawIsoBox(0.5, -rl + 2, 3.5, 2.0, 2.4, '#B45309', '#92400E', '#78350F', 'Compact Desk');
      // Chair
      drawIsoBox(1.5, 1, 1.8, 1.8, 1.8, '#475569', '#334155', '#1E293B', 'Chair');
      // Floor Lamp
      drawIsoBox(-rw + 1, rl - 2.5, 1, 1, 4.2, '#F59E0B', '#D97706', '#B45309', '💡 Lamp');
    } else {
      // Master Suite King Bed
      drawIsoBox(-rw + 2, -rl + 2, 7.5, 6.5, 2.4, '#F1F5F9', '#E2E8F0', '#CBD5E1', 'King Bed');
      // Nightstand L & R
      drawIsoBox(-rw + 0.5, -rl + 3, 1.2, 1.8, 1.8, '#7C5335', '#6B4529', '#57371F', '');
      drawIsoBox(-rw + 9.8, -rl + 3, 1.2, 1.8, 1.8, '#7C5335', '#6B4529', '#57371F', '');
      // Lounge Chair
      drawIsoBox(3, 1.5, 3.2, 3.2, 2.0, '#E8DCB8', '#D4C79F', '#C2B58C', 'Lounger');
      // Large Plant
      drawIsoBox(rw - 2.5, -rl + 2.5, 1.8, 1.8, 3.8, '#2E7D32', '#1B5E20', '#144618', '🌿 Palm');
    }

    // Dimension Overlays on outer perimeter
    ctx.strokeStyle = '#F87171';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    // Front Width dimension
    const dim1 = toIso(-rw, rl + 1.2);
    const dim2 = toIso(rw, rl + 1.2);
    ctx.beginPath();
    ctx.moveTo(dim1.x, dim1.y);
    ctx.lineTo(dim2.x, dim2.y);
    ctx.stroke();

    // Length dimension
    const dim3 = toIso(rw + 1.2, -rl);
    const dim4 = toIso(rw + 1.2, rl);
    ctx.beginPath();
    ctx.moveTo(dim3.x, dim3.y);
    ctx.lineTo(dim4.x, dim4.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dimension labels
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${preset.width} ft Width`, (dim1.x + dim2.x) / 2, (dim1.y + dim2.y) / 2 + 16);
    ctx.fillText(`${preset.length} ft Length`, (dim3.x + dim4.x) / 2 + 14, (dim3.y + dim4.y) / 2);

    // Update DOM Metrics Readout
    const areaEl = document.getElementById('sim-area-val');
    const dimEl = document.getElementById('sim-dim-val');
    const clearanceEl = document.getElementById('sim-clearance-val');
    if (areaEl) areaEl.textContent = `${preset.area} sq.ft`;
    if (dimEl) dimEl.textContent = `${preset.width}ft × ${preset.length}ft`;
    if (clearanceEl) clearanceEl.textContent = `${preset.clearance}% Free`;
  }

  function initRoomSimulator() {
    renderRoomSimulator();

    // Hook preset buttons
    const presetBtns = document.querySelectorAll('#sim-preset-btns button');
    presetBtns.forEach((btn) => {
      btn.onclick = () => {
        presetBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentPreset = btn.getAttribute('data-preset') || 'living';
        playHarmonicTone(3, 0.08);
        renderRoomSimulator();
      };
    });

    // Hook lighting buttons
    const lightBtns = document.querySelectorAll('#sim-light-btns button');
    lightBtns.forEach((btn) => {
      btn.onclick = () => {
        lightBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentLight = btn.getAttribute('data-light') || 'warm';
        playHarmonicTone(4, 0.08);
        renderRoomSimulator();
      };
    });
  }

  window.addEventListener('resize', () => {
    if (activeProjectId === 'interior') renderRoomSimulator();
  });

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    activeProjectId = projectId;
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

    // Toggle interactive simulator widget for interior capstone
    if (projectId === 'interior') {
      if (modalSimulatorBox) {
        modalSimulatorBox.style.display = 'block';
        setTimeout(initRoomSimulator, 50);
      }
      if (modalDemoBtn) {
        modalDemoBtn.innerHTML = `
          <span>Try Interactive Simulator</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        `;
      }
    } else {
      if (modalSimulatorBox) {
        modalSimulatorBox.style.display = 'none';
      }
      if (modalDemoBtn) {
        modalDemoBtn.innerHTML = `
          <span>Explore Detailed Workflow</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        `;
      }
    }

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playHarmonicTone(4, 0.1);
  }

  function closeProjectModal() {
    activeProjectId = null;
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
    playHarmonicTone(1, 0.08);
  }

  allWorkCards.forEach((card) => {
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
      if (activeProjectId === 'interior' && modalSimulatorBox) {
        modalSimulatorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast('🎯 Interactive Room Simulator focused!');
      } else {
        showToast('🚀 Verified professional workflow telemetry active!');
      }
    });
  }

  if (modalCodeBtn) {
    modalCodeBtn.addEventListener('click', () => {
      playHarmonicTone(3, 0.1);
      if (activeProjectId === 'interior') {
        showToast('⚡ Vanilla JS & Canvas Architecture: Zero Frameworks, 60 FPS Native DOM');
      } else {
        showToast('📋 Professional credentials & verified responsibilities loaded.');
      }
    });
  }

  /* ==========================================================================
     RESUME MODAL HANDLERS
     ========================================================================== */
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const resumeCloseBtn = document.getElementById('resume-close-btn');
  const downloadPdfBtn = document.getElementById('download-resume-pdf-btn');

  const aboutOpenResumeBtn = document.getElementById('about-open-resume-btn');

  [openResumeBtn, aboutOpenResumeBtn].forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', () => {
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        playHarmonicTone(4, 0.1);
      });
    }
  });

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
      showToast('✅ Raksha_Shetty_Resume.pdf downloaded successfully!');
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
        } else if (action === 'link') {
          const url = item.getAttribute('data-url');
          if (url) window.open(url, '_blank');
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
            • <span style="color:#A5B4FC;">skills</span> — inspect skills &amp; competencies<br>
            • <span style="color:#A5B4FC;">works</span> — capstone project &amp; career track<br>
            • <span style="color:#A5B4FC;">linkedin</span> — open Raksha's LinkedIn profile<br>
            • <span style="color:#A5B4FC;">education</span> — academic credentials (BCA CGPA: 8.65)<br>
            • <span style="color:#A5B4FC;">experience</span> — professional experience at IVF Access<br>
            • <span style="color:#A5B4FC;">activities</span> — internships, research head &amp; student council<br>
            • <span style="color:#A5B4FC;">hire</span> — connect with Raksha directly<br>
            • <span style="color:#A5B4FC;">whoami</span> — professional profile &amp; summary<br>
            • <span style="color:#A5B4FC;">languages</span> — spoken languages<br>
            • <span style="color:#A5B4FC;">drone</span> — VLOS drone training details<br>
            • <span style="color:#A5B4FC;">clear</span> — clear terminal buffer<br>
            • <span style="color:#A5B4FC;">matrix</span> — initiate neural glitch
          `;
        } else if (cmd === 'skills') {
          responseLine.innerHTML = `Skills: [Data Analysis &amp; Reporting (Power BI, Advanced Excel), Documentation (Word, PPT, Outlook), Business Systems (Tally ERP, CRM), Programming (Core Java, SQL, HTML, CSS, JS), Design (Figma, Canva)]`;
        } else if (cmd === 'works' || cmd === 'projects') {
          responseLine.innerHTML = `Sole Technical Project: 3D Virtual Interior Design Simulator (Academic Capstone) | Professional Experience: IVF Healthcare Counseling, Business Analytics Suite, Tally ERP Billing &amp; Ops, Core Java &amp; SQL Training, UI/UX Presentation Practice`;
        } else if (cmd === 'linkedin') {
          responseLine.innerHTML = `LinkedIn Profile: <a href="https://www.linkedin.com/in/raksha-shetty-591157250/" target="_blank" rel="noopener noreferrer" style="color:#60A5FA; text-decoration:underline;">linkedin.com/in/raksha-shetty-591157250</a>`;
          window.open('https://www.linkedin.com/in/raksha-shetty-591157250/', '_blank');
        } else if (cmd === 'education') {
          responseLine.innerHTML = `Education: BCA (CGPA: 8.65) @ KLE Society's S Nijalingappa College, Bangalore City University (2022–2025) | Pre-University @ R N Shetty PU College (2020–2022)`;
        } else if (cmd === 'experience') {
          responseLine.innerHTML = `Experience: Medical Counselor (2026–Present) @ IVF Access Rajajinagar | Accountant &amp; Admin Executive (2025–2026) @ IVF Access | Business Analytics Intern (2025) @ Certisured | Research Head &amp; Student Council (2023–2025)`;
        } else if (cmd === 'activities' || cmd === 'internships' || cmd === 'research') {
          responseLine.innerHTML = `
            <span style="color:#FDE047; font-weight:700;">Internships, Leadership &amp; Activities:</span><br>
            • 🔬 <strong>Research Head &amp; Student Council Member</strong> | 2023–2025 (KLE S Nijalingappa College)<br>
            • 📈 <strong>Business Analytics Internship</strong> | Certisured (2025)<br>
            • 🏆 <strong>Java Core &amp; Web Development</strong> | Certified by Anudip Foundation<br>
            • 🏛️ <strong>3D Virtual Interior Design Project</strong> | Web-Based Room Layout Simulator<br>
            • 🚁 <strong>VLOS Drone Operations</strong> | Hands-on Pilot Training &amp; Flight Safety
          `;
        } else if (cmd === 'hire' || cmd === 'contact') {
          responseLine.innerHTML = `Direct contact: <span style="color:#FDE047;">rakshashetty@gmail.com</span> | Rajajinagar, Bangalore-10<br>LinkedIn: <a href="https://www.linkedin.com/in/raksha-shetty-591157250/" target="_blank" rel="noopener noreferrer" style="color:#60A5FA; text-decoration:underline;">linkedin.com/in/raksha-shetty-591157250</a>`;
          showToast('🎉 Let’s connect and collaborate!');
        } else if (cmd === 'whoami') {
          responseLine.innerHTML = `Raksha — Medical Counselor &amp; Healthcare Administrator | BCA Graduate (CGPA: 8.65)`;
        } else if (cmd === 'languages') {
          responseLine.innerHTML = `Languages: English (Fluent), Kannada (Native / Fluent)`;
        } else if (cmd === 'drone') {
          responseLine.innerHTML = `VLOS Drone Operations: Completed hands-on training in Visual Line of Sight (VLOS) drone piloting, flight safety protocols, and operations.`;
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
      navigator.clipboard.writeText('rakshashetty@gmail.com').then(() => {
        playHarmonicTone(5, 0.1);
        showToast('📬 Email copied: rakshashetty@gmail.com');
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
