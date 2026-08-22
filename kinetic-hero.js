/**
 * kinetic-hero.js
 * S-Curve Wave Kinetic Hero Animation with Light & Dark Mode Support
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
      const rightEnterX = W * 1.20;       // > 120% width = opacity 0 (far right)
      const rightSettleX = W * 0.50;      // 50% width = settled center
      const leftExitSettleX = W * 0.30;   // 30% width = start exit
      const leftExitX = -W * 0.15;        // -15% width = opacity 0 (far left)

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

          xOffset = Math.sin(progress * Math.PI) * 18 * dir;
          yOffset = dir * 85 * easeProgress + Math.sin(progress * Math.PI * 1.5) * 18;
          rotation = rotDir * (20 * easeProgress + Math.sin(progress * Math.PI) * 8 * dir);

          scale = 1 - easeProgress * 0.08;
          grayVal = Math.round(baseGray - easeProgress * (baseGray - enterGray));
          shadowOpacity = (1 - easeProgress) * 0.9;

        } else if (charCenter < leftExitSettleX) {
          // ── LEFT EXIT ZONE ──
          let exitProgress = (leftExitSettleX - charCenter) / (leftExitSettleX - leftExitX);
          if (exitProgress > 1) exitProgress = 1;

          const easeExit = Math.pow(exitProgress, 1.5);
          letterOpacity = 1 - easeExit;

          xOffset = -Math.sin(exitProgress * Math.PI) * 14 * dir;
          yOffset = -dir * 45 * easeExit;
          rotation = -rotDir * 14 * easeExit;
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
            x: xOffset,
            y: yOffset,
            rotation: rotation,
            scale: scale,
            opacity: shadowOpacity,
            color: isLight ? 'rgba(0,0,0,0.12)' : '#000000',
            force3D: true
          });
        }
      });
    }

    // GSAP ScrollTrigger setup
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1.5,
        start: "top top",
        end: "+=400%",
        onUpdate: recalculateLetters,
        onRefresh: recalculateLetters
      }
    });

    timeline.to(textRow, {
      xPercent: -88,
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
