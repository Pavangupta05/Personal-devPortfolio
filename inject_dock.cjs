const fs = require('fs');

let scriptContent = fs.readFileSync('script.js', 'utf8');

const dockScript = `
// ========================================================
// FEATURE: GSAP DOCK MAGNIFICATION EFFECT
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  // Guard for touch devices and reduced-motion preferences
  const isFinePointer = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
  if (!isFinePointer) return; // Skip entirely on mobile or if motion is disabled

  // Configuration for different card types
  const configs = [
    {
      containerSelector: '.skills-container, .soft-skills-container',
      cardSelector: '.skill-card, .soft-skill-item',
      maxScale: 1.45,
      maxY: -15,
      radius: 160 // px
    },
    {
      containerSelector: '.project-grid',
      cardSelector: '.project-card',
      maxScale: 1.06, // subtle for projects
      maxY: -8,
      radius: 200 // px
    }
  ];

  configs.forEach(config => {
    const containers = document.querySelectorAll(config.containerSelector);
    if (!containers.length) return;

    containers.forEach(container => {
      const cards = Array.from(container.querySelectorAll(config.cardSelector));
      if (!cards.length) return;

      // Set up quickTo instances for each card
      cards.forEach(card => {
        card.scaleTo = gsap.quickTo(card, "scale", { duration: 0.3, ease: "power2.out" });
        card.yTo = gsap.quickTo(card, "y", { duration: 0.3, ease: "power2.out" });
        card.zTo = gsap.quickSetter(card, "zIndex");
        
        // Ensure default transform origin
        gsap.set(card, { transformOrigin: "center center" });

        // Focus accessibility
        card.addEventListener('focus', () => {
          card.scaleTo(config.maxScale);
          card.yTo(config.maxY);
          card.zTo(10);
        });
        card.addEventListener('blur', () => {
          card.scaleTo(1);
          card.yTo(0);
          card.zTo(1);
        });
      });

      let mouseX = 0;
      let mouseY = 0;
      let isHovering = false;
      let rafId = null;

      // Distance calculation and scale mapping
      const updateDock = () => {
        if (!isHovering) return;

        // Find the nearest card to determine the active row (prevents multi-row bleeding)
        let nearestCard = null;
        let minDistance = Infinity;
        let cardRects = cards.map(c => c.getBoundingClientRect());

        cardRects.forEach((rect, i) => {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          // Euclidean distance
          const dist = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
          if (dist < minDistance) {
            minDistance = dist;
            nearestCard = { index: i, rect: rect };
          }
        });

        if (!nearestCard) return;

        // Apply scaling only to cards in the same row as the nearest card
        cards.forEach((card, i) => {
          const rect = cardRects[i];
          
          // Check if it's in the same visual row (tolerance of 30px to account for minor alignment differences)
          const isSameRow = Math.abs(rect.y - nearestCard.rect.y) < 30;
          
          if (isSameRow) {
            const centerX = rect.left + rect.width / 2;
            const distX = Math.abs(mouseX - centerX);

            // Cosine falloff (bell curve shape)
            if (distX < config.radius) {
              // Map distance (0 to radius) to a normalized value (1 to 0)
              const normalizedDist = 1 - (distX / config.radius);
              
              // Use Math.cos for smooth ease-in-out curve: from 1 at center down to 0 at edges
              const curve = (Math.cos((1 - normalizedDist) * Math.PI) + 1) / 2;
              
              const currentScale = 1 + ((config.maxScale - 1) * curve);
              const currentY = config.maxY * curve;

              card.scaleTo(currentScale);
              card.yTo(currentY);
              // Bump z-index based on proximity so scaling cards stay on top
              card.zTo(Math.round(10 * curve));
            } else {
              // Outside radius but in same row
              card.scaleTo(1);
              card.yTo(0);
              card.zTo(1);
            }
          } else {
            // Different row: stay flat
            card.scaleTo(1);
            card.yTo(0);
            card.zTo(1);
          }
        });

        rafId = requestAnimationFrame(updateDock);
      };

      container.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isHovering) {
          isHovering = true;
          rafId = requestAnimationFrame(updateDock);
        }
      });

      container.addEventListener('mouseleave', () => {
        isHovering = false;
        cancelAnimationFrame(rafId);
        // Reset all cards
        cards.forEach(card => {
          card.scaleTo(1);
          card.yTo(0);
          card.zTo(1);
        });
      });
    });
  });
});
`;

if (!scriptContent.includes('FEATURE: GSAP DOCK MAGNIFICATION EFFECT')) {
  scriptContent += '\n' + dockScript;
  fs.writeFileSync('script.js', scriptContent);
}

console.log('Appended GSAP Dock Effect to script.js');
