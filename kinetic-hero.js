/**
 * kinetic-hero.js
 * S-Curve Wave Kinetic Hero Animation with Light & Dark Mode + Mobile Perfection
 * 
 * Phrase: "FROM CONCEPT TO REALITY - I BUILD WHAT MATTERS."
 */

(function () {
  'use strict';

  function initKineticHero() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('KineticHero: GSAP or ScrollTrigger not loaded.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const section = document.getElementById('kinetic-hero');
    const textRow = document.getElementById('kineticTextRow');

    if (!section || !textRow) return;

    const phrase = "FROM CONCEPT TO REALITY - I BUILD WHAT MATTERS.";

    // Build letter HTML dynamically if empty
    if (!textRow.children.length) {
      let letterIndexCount = 0;
      const lettersHtml = phrase.split('').map(char => {
        if (char === ' ') {
          return `<span class="kinetic-letter-wrapper kinetic-space-wrapper" aria-hidden="true"></span>`;
        }
        const html = `
          <span class="kinetic-letter-wrapper" data-char-index="${letterIndexCount}">
            <span class="kinetic-letter-shadow" aria-hidden="true">${char}</span>
            <span class="kinetic-letter-front">${char}</span>
          </span>
        `;
        letterIndexCount++;
        return html;
      }).join('');
      textRow.innerHTML = lettersHtml;
    }

    const frontLetters = Array.from(textRow.querySelectorAll('.kinetic-letter-front'));
    const shadowLetters = Array.from(textRow.querySelectorAll('.kinetic-letter-shadow'));

    function recalculateLetters() {
      const W = window.innerWidth;
      const isMobile = W <= 768;
      
      const rightEnterX = isMobile ? W * 1.12 : W * 1.20;       // Enter zone
      const rightSettleX = isMobile ? W * 0.52 : W * 0.50;      // Settle center
      const leftExitSettleX = isMobile ? W * 0.28 : W * 0.30;   // Exit start
      const leftExitX = isMobile ? -W * 0.10 : -W * 0.15;        // Exit complete

      // Dynamic amplitude scaling for mobile viewports
      const amp = isMobile ? 0.42 : 1.0;
      const shadowX = isMobile ? 4 : 8;
      const shadowY = isMobile ? 6 : 12;

      const isLight = document.body.classList.contains('light-mode') || document.documentElement.classList.contains('light-mode');
      const baseGray = isLight ? 15 : 255;
      const enterGray = isLight ? 100 : 138;
      const exitGray = isLight ? 110 : 120;

      frontLetters.forEach((frontEl, idx) => {
        const shadowEl = shadowLetters[idx];
        if (!frontEl) return;

        const rect = frontEl.getBoundingClientRect();
        const charCenter = rect.left + rect.width / 2;

        const dir = (idx % 2 === 0) ? -1 : 1;
        const rotDir = (idx % 3 === 0) ? 1 : -1;

        let letterOpacity = 1;
        let xOffset = 0;
        let yOffset = 0;
        let rotation = 0;
        let scale = 1;
        let grayVal = baseGray;
        let shadowOpacity = 1;

        if (charCenter > rightSettleX) {
          // ── RIGHT S-CURVE ENTRANCE ZONE ──
          let progress = (charCenter - rightSettleX) / (rightEnterX - rightSettleX);
          if (progress > 1) progress = 1;

          const easeProgress = Math.pow(progress, 1.8);
          letterOpacity = 1 - easeProgress;

          xOffset = Math.sin(progress * Math.PI) * 18 * dir * amp;
          yOffset = dir * 85 * easeProgress * amp + Math.sin(progress * Math.PI * 1.5) * (18 * amp);
          rotation = rotDir * (20 * easeProgress * amp + Math.sin(progress * Math.PI) * 8 * dir * amp);

          scale = 1 - easeProgress * 0.08;
          grayVal = Math.round(baseGray - easeProgress * (baseGray - enterGray));
          shadowOpacity = (1 - easeProgress) * 0.9;

        } else if (charCenter < leftExitSettleX) {
          // ── LEFT EXIT ZONE ──
          let exitProgress = (leftExitSettleX - charCenter) / (leftExitSettleX - leftExitX);
          if (exitProgress > 1) exitProgress = 1;

          const easeExit = Math.pow(exitProgress, 1.5);
          letterOpacity = 1 - easeExit;

          xOffset = -Math.sin(exitProgress * Math.PI) * 14 * dir * amp;
          yOffset = -dir * 45 * easeExit * amp;
          rotation = -rotDir * 14 * easeExit * amp;
          scale = 1 - easeExit * 0.08;
          grayVal = Math.round(baseGray - easeExit * (baseGray - exitGray));
          shadowOpacity = (1 - easeExit) * 0.8;

        } else {
          // ── CENTER SETTLED ZONE ──
          letterOpacity = 1;
          xOffset = 0;
          yOffset = 0;
          rotation = 0;
          scale = 1;
          grayVal = baseGray;
          shadowOpacity = 0.9;
        }

        const colorStr = `rgb(${grayVal}, ${grayVal}, ${grayVal})`;

        gsap.set(frontEl, {
          x: xOffset,
          y: yOffset,
          rotation: rotation,
          scale: scale,
          opacity: letterOpacity,
          color: colorStr,
          transformOrigin: 'center center',
          force3D: true
        });

        if (shadowEl) {
          gsap.set(shadowEl, {
            x: xOffset + shadowX,
            y: yOffset + shadowY,
            rotation: rotation,
            scale: scale,
            opacity: shadowOpacity,
            color: isLight ? 'rgba(0,0,0,0.12)' : '#000000',
            force3D: true
          });
        }
      });
    }

    const isMobile = window.innerWidth <= 768;

    // GSAP ScrollTrigger setup with mobile optimization
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        anticipatePin: 1,
        scrub: isMobile ? 0.8 : 1.5,
        start: "top top",
        end: isMobile ? "+=220%" : "+=350%",
        onUpdate: recalculateLetters,
        onRefresh: recalculateLetters
      }
    });

    timeline.to(textRow, {
      xPercent: isMobile ? -92 : -88,
      ease: "none"
    });

    // Initial recalculation
    recalculateLetters();

    window.addEventListener('resize', recalculateLetters, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initKineticHero, 80));
  } else {
    setTimeout(initKineticHero, 80);
  }
})();
