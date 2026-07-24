const fs = require('fs');

// 1. Fix script.js
let js = fs.readFileSync('script.js', 'utf8');

// Remove .skill-card from 3D Tilt (which fights GSAP Proximity Hover)
js = js.replace(
  "document.querySelectorAll('.skill-card, .project-card, .recruiter-card').forEach(card => {",
  "document.querySelectorAll('.project-card, .recruiter-card').forEach(card => {"
);

fs.writeFileSync('script.js', js);
console.log('Fixed script.js JS Tilt conflicts');

// 2. Fix style.css
let css = fs.readFileSync('style.css', 'utf8');

// Remove the `transition: all ... !important` from .skill-card:hover and .project-card:hover
// because it breaks JS animations heavily. We will replace the block with one that separates transition.
const oldHoverBlock = `.project-card:hover, .skill-card:hover {
  background: rgba(25, 25, 30, 0.75) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  transform: translateY(-8px) scale(1.02) ;
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}`;

const newHoverBlock = `.project-card:hover, .skill-card:hover {
  background: rgba(25, 25, 30, 0.75) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  /* Removed CSS transform and transition:all to allow JS GSAP/Tilt to control transform smoothly */
}`;

if (css.includes('transform: translateY(-8px) scale(1.02) ;')) {
    // using a broader replace just in case of whitespace differences
    css = css.replace(/transform:\s*translateY\(-8px\)\s*scale\(1\.02\)\s*;/g, '/* removed transform */');
    css = css.replace(/transition:\s*all\s*0\.4s[^;]+!important;/g, '/* removed transition all */');
}

// Append CSS to fix skill card transition specifically
const fixCSS = `
/* ==========================================================
   FIX SKILL CARD GSAP GLITCH
   ========================================================== */
.skill-card, .soft-skill-item {
  /* Override global transition to exclude transform, so GSAP runs smoothly */
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
}

/* Also disable any stray CSS hover transforms for skill cards */
.skills-container .skill-card:hover {
  transform: none; /* Let GSAP handle the transform inline */
}
`;

if (!css.includes('FIX SKILL CARD GSAP GLITCH')) {
  css += '\n' + fixCSS;
}

fs.writeFileSync('style.css', css);
console.log('Fixed style.css transition and transform conflicts');
