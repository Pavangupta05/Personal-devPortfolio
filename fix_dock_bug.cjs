const fs = require('fs');

// 1. Fix CSS overrides
let css = fs.readFileSync('style.css', 'utf8');

// Aggressively remove transform: none !important; and similar
css = css.replace(/transform:\s*none\s*!important;/g, '');
css = css.replace(/transform:\s*[^;]*!important;/g, (match) => {
  if (match.includes('scale') || match.includes('translateY')) {
    return ''; // completely remove it so GSAP can take over
  }
  return match;
});

// Also remove standard transform from hover states to prevent CSS jumping before GSAP takes over
css = css.replace(/transform:\s*translateY\(-10px\);/g, '');
css = css.replace(/transform:\s*translateY\(-12px\)\s*scale\(1\.02\);/g, '');
css = css.replace(/transform:\s*translateY\(-6px\)\s*scale\(1\.02\);/g, '');

fs.writeFileSync('style.css', css);

// 2. Fix JS Media Query
let js = fs.readFileSync('script.js', 'utf8');

// Replace the strict isFinePointer check with a simpler window width check
js = js.replace(
  /const isFinePointer = window\.matchMedia\("\([^)]+\)"\)\.matches;\s*if \(!isFinePointer\) return;/g, 
  'if (window.innerWidth < 768) return; // Skip on mobile layouts'
);

fs.writeFileSync('script.js', js);
console.log('Fixed CSS transform overrides and relaxed JS mobile checks.');
