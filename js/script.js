/* =============================================================
   DSA Automotive Inc — script.js
   Preset F: Desert Mono
   ============================================================= */

'use strict';

// ── Utility ──────────────────────────────────────────────────
function qs(sel, ctx)  { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

// ── GSAP Guard ───────────────────────────────────────────────
// All GSAP logic is inside this guard. The page remains fully readable without it.
document.addEventListener('DOMContentLoaded', () => {

  // ── Dynamic values from founding year ────────────────────
  const FOUNDED       = 1991;
  const RATE_PER_YEAR = 60;
  const currentYear   = new Date().getFullYear();
  const yearsActive   = currentYear - FOUNDED;

  const vehiclesEl = qs('.metric-num[data-metric="vehicles"]');
  const yearsEl    = qs('.metric-num[data-metric="years"]');
  const footerYear = qs('#footer-year');

  if (vehiclesEl) vehiclesEl.dataset.target = yearsActive * RATE_PER_YEAR;
  if (yearsEl)    yearsEl.dataset.target    = yearsActive;
  if (footerYear) footerYear.textContent    = currentYear;

  // ============================================================
  // NAVBAR LOGIC
  // ============================================================
  const navbar      = qs('#navbar');
  const navbarInner = qs('#navbar-inner');
  const hamburger   = qs('#hamburger');
  const mobileMenu  = qs('#mobile-menu');
  const hero        = qs('#hero');

  // ── Scroll Morph via IntersectionObserver ──
  if (navbar && hero) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          navbarInner.classList.remove('scrolled');
        } else {
          navbarInner.classList.add('scrolled');
        }
      },
      { threshold: 0.15 }
    );
    heroObserver.observe(hero);
  }

  // ── Mobile Menu Toggle ──
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    mobileMenu.classList.add('is-open');
    mobileMenu.classList.remove('hidden');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOpen = false;
    mobileMenu.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Delay re-hiding to allow opacity transition
    setTimeout(() => {
      if (!menuOpen) mobileMenu.classList.add('hidden');
    }, 300);
  }

  if (hamburger && mobileMenu) {
    // Make sure hidden is set initially via Tailwind but removed on open
    mobileMenu.classList.add('hidden');

    hamburger.addEventListener('click', () => {
      menuOpen ? closeMenu() : openMenu();
    });

    // Close on mobile link tap
    qsa('.mobile-link', mobileMenu).forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    const mobileCtaBtn = qs('a[href="#cta"]', mobileMenu);
    if (mobileCtaBtn) mobileCtaBtn.addEventListener('click', closeMenu);
  }


  // ============================================================
  // GSAP + SCROLL TRIGGER ANIMATIONS
  // ============================================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

    gsap.registerPlugin(ScrollTrigger);
    initAnimations();

  } else {
    // Fallback: ensure all animated elements are visible
    console.warn('DSA: GSAP not loaded — showing all elements in default visible state.');
  }

  // ============================================================
  // FEATURE CARDS — Lazy init via IntersectionObserver
  // ============================================================
  initMetricTicker();
  initPipeline();
  initNetworkGraph();

}); // end DOMContentLoaded


// ============================================================
// GSAP ANIMATIONS (runs only if GSAP loaded)
// ============================================================
function initAnimations() {

  // ── HERO ANIMATIONS ──────────────────────────────────────
  const heroEls = document.querySelectorAll('[data-hero-animate]');

  // Set initial hidden state (GSAP-owned — not in CSS)
  gsap.set(heroEls, { opacity: 0, y: 40 });

  gsap.to(heroEls, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.12,
    delay: 0.2,
  });


  // ── FEATURES SECTION — stagger in cards ──────────────────
  gsap.from('.feature-card', {
    scrollTrigger: {
      trigger: '#features',
      start: 'top 80%',
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.15,
  });


  // ── PHILOSOPHY — Word-by-word reveal ─────────────────────
  const philLine1 = qs('#phil-line-1');
  const philLine2 = qs('#phil-line-2');

  function splitWords(el) {
    if (!el) return;
    const raw = el.innerHTML;
    // Preserve <em> tags — split only text nodes
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);

    textNodes.forEach(tn => {
      const words = tn.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach(w => {
        if (/^\s+$/.test(w)) {
          frag.appendChild(document.createTextNode(w));
        } else if (w.length > 0) {
          const span = document.createElement('span');
          span.className = 'word-span';
          span.style.display = 'inline-block';
          span.textContent = w;
          frag.appendChild(span);
        }
      });
      tn.parentNode.replaceChild(frag, tn);
    });
  }

  splitWords(philLine1);
  splitWords(philLine2);

  const philWords1 = qsa('.word-span', philLine1);
  const philWords2 = qsa('.word-span', philLine2);

  if (philWords1.length) {
    gsap.set(philWords1, { opacity: 0, y: 20 });
    gsap.to(philWords1, {
      scrollTrigger: {
        trigger: '#philosophy',
        start: 'top 70%',
      },
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.04,
    });
  }

  if (philWords2.length) {
    gsap.set(philWords2, { opacity: 0, y: 25 });
    gsap.to(philWords2, {
      scrollTrigger: {
        trigger: '#philosophy',
        start: 'top 60%',
      },
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.05,
      delay: 0.3,
    });
  }


  // ── PHILOSOPHY PARALLAX (desktop only) ───────────────────
  ScrollTrigger.matchMedia({
    '(min-width: 768px)': function () {
      const philBg = qs('#philosophy-bg');
      if (philBg) {
        gsap.to(philBg, {
          y: '20%',
          ease: 'none',
          scrollTrigger: {
            trigger: '#philosophy',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      }
    }
  });


  // ── PROTOCOL — Cinematic card stack (desktop only) ────────
  // Uses gsap.matchMedia() (modern API, replaces deprecated
  // ScrollTrigger.matchMedia). fromTo() with explicit blur(0px)
  // start is required — GSAP cannot tween 'filter:none' to
  // 'blur(10px)', so it would jump to end state immediately.
  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    const cards  = qsa('.protocol-card');
    const outers = qsa('.protocol-card-outer');
    if (!cards.length) return;

    // Later cards render on top as they slide over earlier ones
    cards.forEach((card, i) => { card.style.zIndex = i + 1; });

    // For each card except the last: scale + blur it back as the
    // NEXT outer wrapper (and its card) enters from below.
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      const nextOuter = outers[i + 1];
      if (!nextOuter) return;

      gsap.fromTo(
        card,
        // Explicit start state — prevents the filter:none→blur jump
        { scale: 1, filter: 'blur(0px)', opacity: 1 },
        {
          scale:   0.88,
          filter:  'blur(10px)',
          opacity: 0.5,
          ease:    'none',
          scrollTrigger: {
            trigger:            nextOuter,
            start:              'top bottom',
            end:                'top top',
            scrub:              true,
            invalidateOnRefresh: true,
          }
        }
      );
    });

    // Cleanup: restore cards when viewport drops below 768px
    return () => {
      cards.forEach(card => gsap.set(card, { clearProps: 'scale,filter,opacity' }));
    };
  });


  // ── PROTOCOL — EKG Waveform animation (Card 3) ──────────
  // Card is absolutely positioned inside a pinned wrap, so we
  // run it as a standalone looping animation (no scrollTrigger needed).
  const ekgPath = qs('#ekg-path');
  if (ekgPath) {
    gsap.fromTo(
      ekgPath,
      { strokeDashoffset: 800 },
      {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: 'power2.inOut',
        repeat: -1,
        repeatDelay: 0.6,
      }
    );
  }


  // ── PROTOCOL — Rotating Rings (Card 1) ───────────────────
  const geoRings = qs('#geo-rings');
  if (geoRings) {
    gsap.to(geoRings, {
      rotation: 360,
      duration: 40,
      ease: 'none',
      repeat: -1,
      transformOrigin: '50% 50%',
      scrollTrigger: {
        trigger: '.protocol-card[data-card="1"]',
        start: 'top bottom',
        toggleActions: 'play pause resume pause',
      }
    });
  }


  // ── CTA SECTION — fade up ─────────────────────────────────
  gsap.from('#cta > div > *', {
    scrollTrigger: {
      trigger: '#cta',
      start: 'top 75%',
    },
    opacity: 0,
    y: 30,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.1,
  });


  // ── FOOTER — fade up ──────────────────────────────────────
  gsap.from('footer > div > *', {
    scrollTrigger: {
      trigger: 'footer',
      start: 'top 85%',
    },
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.08,
  });

} // end initAnimations()


// ============================================================
// FEATURE CARD 1 — Metric Ticker (Card Type 6)
// Triggered on scroll via IntersectionObserver
// ============================================================
function initMetricTicker() {
  const card = qs('#card-metric');
  if (!card) return;

  const nums = qsa('.metric-num', card);
  let hasRun = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasRun) {
          hasRun = true;
          runCountUp(nums);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(card);
}

function runCountUp(nums) {
  if (typeof gsap !== 'undefined') {
    nums.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const obj    = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        snap: { val: 1 },
        onUpdate: () => {
          el.textContent = obj.val + (el.dataset.target === '98' ? '%' : '+');
        },
        onComplete: () => {
          el.classList.add('glowing');
          setTimeout(() => el.classList.remove('glowing'), 1200);
        }
      });
    });
  } else {
    // Fallback without GSAP
    nums.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.target === '98' ? '%' : '+';
      const step   = Math.ceil(target / 60);
      let current  = 0;
      const tick   = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) {
          clearInterval(tick);
          el.classList.add('glowing');
          setTimeout(() => el.classList.remove('glowing'), 1200);
        }
      }, 30);
    });
  }
}


// ============================================================
// FEATURE CARD 2 — Progress Pipeline (Card Type 5)
// Nodes fill sequentially on a loop
// ============================================================
function initPipeline() {
  const card = qs('#card-pipeline');
  if (!card) return;

  const nodes      = qsa('.pipe-node', card);
  const labels     = qsa('.pipe-stage-label', card);
  const accentFill = '#C75C2E';
  const defaultFill   = '#F5F0E8';
  const defaultStroke = '#C2B59B';

  let currentIndex = 0;
  let intervalId   = null;

  function resetAll() {
    nodes.forEach((n, i) => {
      n.setAttribute('fill', defaultFill);
      n.setAttribute('stroke', defaultStroke);
      n.classList.remove('active');
    });
    labels.forEach(l => l.setAttribute('opacity', '0'));
  }

  function activateNode(index) {
    if (!nodes[index]) return;
    nodes[index].setAttribute('fill', accentFill);
    nodes[index].setAttribute('stroke', accentFill);
    nodes[index].classList.add('active');
    if (labels[index]) {
      labels[index].setAttribute('opacity', '1');
    }
  }

  function step() {
    if (currentIndex === 0) resetAll();
    activateNode(currentIndex);
    currentIndex++;
    if (currentIndex > nodes.length) {
      // pause then restart
      clearInterval(intervalId);
      setTimeout(() => {
        currentIndex = 0;
        startPipeline();
      }, 1500);
    }
  }

  function startPipeline() {
    intervalId = setInterval(step, 700);
  }

  function pausePipeline() {
    clearInterval(intervalId);
    intervalId = null;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!intervalId) startPipeline();
        } else {
          pausePipeline();
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(card);
}


// ============================================================
// FEATURE CARD 3 — Network Graph (Card Type 8)
// Floating nodes + traveling packet
// ============================================================
function initNetworkGraph() {
  const card = qs('#card-network');
  if (!card) return;

  const nodeIds = ['net-hub', 'nn1', 'nn2', 'nn3', 'nn4', 'nn5'];
  const nodes   = nodeIds.map(id => qs(`#${id}`, card)).filter(Boolean);
  const packet  = qs('#net-packet', card);

  // Route definitions: [fromX, fromY, toX, toY]
  const routes = [
    [130, 85,  55,  45],
    [130, 85,  205, 45],
    [130, 85,  35,  125],
    [130, 85,  225, 125],
    [130, 85,  130, 155],
    [55,  45,  205, 45],
    [35,  125, 225, 125],
  ];

  let floatAnimations = [];
  let packetInterval  = null;
  let routeIndex      = 0;

  function startFloating() {
    if (typeof gsap === 'undefined') return;

    nodes.forEach(node => {
      const anim = gsap.to(node, {
        x: `random(-5, 5)`,
        y: `random(-5, 5)`,
        duration: `random(2, 4)`,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
      floatAnimations.push(anim);
    });
  }

  function stopFloating() {
    floatAnimations.forEach(a => a.kill());
    floatAnimations = [];
  }

  function animatePacket() {
    if (!packet || typeof gsap === 'undefined') return;

    const route = routes[routeIndex % routes.length];
    routeIndex++;

    const [x1, y1, x2, y2] = route;

    gsap.set(packet, { attr: { cx: x1, cy: y1 }, opacity: 1 });
    gsap.to(packet, {
      attr: { cx: x2, cy: y2 },
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut',
    });
  }

  function startPackets() {
    animatePacket();
    packetInterval = setInterval(animatePacket, 2200);
  }

  function stopPackets() {
    clearInterval(packetInterval);
    packetInterval = null;
    if (packet) gsap.set(packet, { opacity: 0 });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startFloating();
          startPackets();
        } else {
          stopFloating();
          stopPackets();
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(card);
}
