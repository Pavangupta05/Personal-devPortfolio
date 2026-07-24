/**
 * gsap-motion.js — Project Card Stacking Scroll Effect
 *
 * As the user scrolls through #projects, each card slides up and
 * pins in a stacked deck. Earlier cards scale down slightly as
 * new ones land on top. Clicking a card opens the existing modal.
 */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('gsap-motion: GSAP not available.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─────────────────────────────────────────────────────────────────────────
  //  PROJECT CARD STACKING
  //  Each card gets position:sticky with an increasing top offset so they
  //  "stack" as the user scrolls. Later cards slide over earlier ones.
  //  A GSAP scrub dims/scales the previous card as the next one comes in.
  // ─────────────────────────────────────────────────────────────────────────
  function setupProjectStack() {
    const grid = document.querySelector('#projects .project-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.project-card:not(.filter-hidden)'));
    if (!cards.length) return;

    const total = grid.querySelectorAll('.project-card').length;

    // Top offset for the first (topmost) sticky card — leave room for the
    // sticky site nav bar which is approximately 70px tall.
    const BASE_TOP = 80;   // px from viewport top
    const STEP     = 22;   // px gap between each card's sticky top value

    cards.forEach(function (card, i) {
      // ── Inject project number label if not already present ───────────
      var info = card.querySelector('.project-info');
      if (info && !card.querySelector('.stack-number')) {
        var label = document.createElement('div');
        label.className = 'stack-number';
        label.textContent = 'Project ' +
          String(i + 1).padStart(2, '0') + ' / ' +
          String(total).padStart(2, '0');
        info.insertBefore(label, info.firstChild);
      }

      // ── Sticky stacking position ──────────────────────────────────────
      card.style.top     = (BASE_TOP + i * STEP) + 'px';
      card.style.zIndex  = String(i + 2);  // +2 so it's above any site chrome at z-index:1

      if (prefersReduced) return;

      // ── Scale-dim the card ABOVE as this one slides over it ──────────
      if (i > 0) {
        var prevCard = cards[i - 1];
        gsap.to(prevCard, {
          scale:      0.94,
          filter:     'brightness(0.55)',
          ease:       'none',
          scrollTrigger: {
            trigger:  card,
            start:    'top 85%',
            end:      'top 12%',
            scrub:    1.2
          }
        });
      }
    });

    // Re-run when the filter changes so newly visible cards get stacked too
    document.querySelectorAll('.project-filter-bar .filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Small delay so the DOM updates (filter-hidden toggles) before we recalculate
        setTimeout(function () {
          var visible = Array.from(grid.querySelectorAll('.project-card:not(.filter-hidden)'));
          visible.forEach(function (card, i) {
            card.style.top    = (BASE_TOP + i * STEP) + 'px';
            card.style.zIndex = String(i + 2);
          });
          ScrollTrigger.refresh();
        }, 50);
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  function init() {
    setupProjectStack();
    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // Debounced resize
  var _rt;
  window.addEventListener('resize', function () {
    clearTimeout(_rt);
    _rt = setTimeout(function () { ScrollTrigger.refresh(); }, 250);
  }, { passive: true });

})();
