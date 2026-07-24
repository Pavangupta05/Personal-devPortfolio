const fs = require('fs');

// 1. Fix CSS
let css = fs.readFileSync('style.css', 'utf8');

// Strip !important from scroll-reveal transitions
css = css.replace(/transition:\s*all\s*1s\s*cubic-bezier\([^)]+\)\s*!important;/g, (match) => {
  return match.replace('!important', '');
});
css = css.replace(/transition:\s*all\s*1s\s*ease-out\s*!important;/g, (match) => {
  return match.replace('!important', '');
});

fs.writeFileSync('style.css', css);
console.log('Removed !important from CSS scroll-reveal transitions.');

// 2. Fix JS to dynamically disable transitions during hover
let js = fs.readFileSync('script.js', 'utf8');

const oldMouse = `      container.addEventListener('mouseenter', () => {
        // Cache the exact base layout before any scaling transforms warp the bounding boxes!
        cachedRects = cards.map(c => c.getBoundingClientRect());
      });`;

const newMouse = `      container.addEventListener('mouseenter', () => {
        cachedRects = cards.map(c => c.getBoundingClientRect());
        // Force disable CSS transitions so GSAP can run at 60fps without being frozen!
        cards.forEach(card => card.style.setProperty('transition', 'none', 'important'));
      });`;

js = js.replace(oldMouse, newMouse);

const oldReset = `        // Reset all cards
        cards.forEach(card => {
          card.scaleTo(1);
          card.yTo(0);
          card.zTo(1);
          card.style.border = "";
        });`;

const newReset = `        // Reset all cards
        cards.forEach(card => {
          card.scaleTo(1);
          card.yTo(0);
          card.zTo(1);
          card.style.border = "";
          // Re-enable CSS transitions after GSAP animations complete
          setTimeout(() => {
            card.style.removeProperty('transition');
          }, 350);
        });`;

js = js.replace(oldReset, newReset);

fs.writeFileSync('script.js', js);
console.log('Added dynamic CSS transition toggle to JS.');
