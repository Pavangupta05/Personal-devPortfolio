const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

// 1. Completely remove the problematic matchMedia guard
const badGuard = `  const isFinePointer = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches;\n  if (!isFinePointer) return; // Skip entirely on mobile or if motion is disabled`;
const goodGuard = `  if (window.innerWidth < 768) return;`;

js = js.replace(badGuard, goodGuard);

// Also remove it if it got mangled previously
js = js.replace(/const isFinePointer = window\.matchMedia.*\.matches;\s*if \(!isFinePointer\) return;/g, 'if (window.innerWidth < 768) return;');

// 2. Add debug red border inside the GSAP loop
// Find the card.scaleTo(currentScale); block
const scaleLine = `card.scaleTo(currentScale);`;
const debugScale = `card.scaleTo(currentScale);\n              card.style.border = "2px solid red";`;
js = js.replace(scaleLine, debugScale);

// Reset the border on the "else" block (outside radius)
const resetLine = `card.scaleTo(1);`;
const debugReset = `card.scaleTo(1);\n              card.style.border = "";`;
js = js.replace(/card\.scaleTo\(1\);/g, debugReset);

fs.writeFileSync('script.js', js);
console.log('Fixed media query guard and injected red border debugger.');
