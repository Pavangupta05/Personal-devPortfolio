const fs = require('fs');

// 1. Fix CSS Light Mode Text Background Issue
let css = fs.readFileSync('style.css', 'utf8');

const badCssBlock = `body.light-mode h1, 
body.light-mode h2, 
body.light-mode h3, 
body.light-mode h4, 
body.light-mode h5, 
body.light-mode h6, 
body.light-mode p,
body.light-mode li,
body.light-mode .project-card,
body.light-mode .skill-card,
body.light-mode .soft-skill-item,
body.light-mode .timeline-content,
body.light-mode .certificate-card {
  background: rgba(255, 253, 250, 0.5) !important;
  backdrop-filter: blur(20px) saturate(150%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(150%) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.08) !important;
  color: var(--text-primary) !important;
}`;

const goodCssBlock = `/* Text gets simple color */
body.light-mode h1, 
body.light-mode h2, 
body.light-mode h3, 
body.light-mode h4, 
body.light-mode h5, 
body.light-mode h6, 
body.light-mode p,
body.light-mode li {
  color: var(--text-primary) !important;
}

/* Cards get glassmorphism */
body.light-mode .project-card,
body.light-mode .skill-card,
body.light-mode .soft-skill-item,
body.light-mode .timeline-content,
body.light-mode .certificate-card {
  background: rgba(255, 253, 250, 0.5) !important;
  backdrop-filter: blur(20px) saturate(150%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(150%) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.08) !important;
}`;

css = css.replace(badCssBlock, goodCssBlock);
fs.writeFileSync('style.css', css);
console.log('Fixed CSS light mode backgrounds on text.');

// 2. Remove Red Debug Border from JS
let js = fs.readFileSync('script.js', 'utf8');
js = js.replace(/card\.style\.border\s*=\s*"2px solid red";/g, '');
js = js.replace(/card\.style\.border\s*=\s*"";/g, '');
fs.writeFileSync('script.js', js);
console.log('Removed red debug borders from GSAP dock effect.');
