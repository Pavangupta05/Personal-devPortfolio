const fs = require('fs');

let js = fs.readFileSync('script.js', 'utf8');

// Replace the buggy dynamic getBoundingClientRect inside the requestAnimationFrame
// We'll cache the rects when isHovering flips to true

const oldCode = `      let mouseX = 0;
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
        });`;

const newCode = `      let mouseX = 0;
      let mouseY = 0;
      let isHovering = false;
      let rafId = null;
      let cachedRects = []; // Cache rects to prevent infinite scaling jitter

      // Distance calculation and scale mapping
      const updateDock = () => {
        if (!isHovering) return;

        let nearestCard = null;
        let minDistance = Infinity;

        // Use cached rects (untransformed base positions) for perfectly stable math
        cachedRects.forEach((rect, i) => {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          // Euclidean distance
          const dist = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
          if (dist < minDistance) {
            minDistance = dist;
            nearestCard = { index: i, rect: rect };
          }
        });`;

js = js.replace(oldCode, newCode);

// Also need to replace the variable name `cardRects` with `cachedRects` in the second half of the loop
const oldLoop = `        if (!nearestCard) return;

        // Apply scaling only to cards in the same row as the nearest card
        cards.forEach((card, i) => {
          const rect = cardRects[i];`;

const newLoop = `        if (!nearestCard) return;

        // Apply scaling only to cards in the same row as the nearest card
        cards.forEach((card, i) => {
          const rect = cachedRects[i];`;

js = js.replace(oldLoop, newLoop);

// And we need to populate cachedRects on mouseenter (or when hovering flips to true)
const oldMouse = `      container.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isHovering) {
          isHovering = true;
          rafId = requestAnimationFrame(updateDock);
        }
      });`;

const newMouse = `      container.addEventListener('mouseenter', () => {
        // Cache the exact base layout before any scaling transforms warp the bounding boxes!
        cachedRects = cards.map(c => c.getBoundingClientRect());
      });

      container.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isHovering) {
          isHovering = true;
          rafId = requestAnimationFrame(updateDock);
        }
      });`;

js = js.replace(oldMouse, newMouse);

fs.writeFileSync('script.js', js);
console.log('Fixed GSAP jitter by caching getBoundingClientRect on mouseenter.');
