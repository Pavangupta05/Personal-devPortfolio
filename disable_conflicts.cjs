const fs = require('fs');

let js = fs.readFileSync('script.js', 'utf8');

// Disable ScrollReveal on .about-text and .section-title so it doesn't fight GSAP!
js = js.replace(/sr\.reveal\('\.section-title'/g, '// sr.reveal(\'.section-title\'');
js = js.replace(/sr\.reveal\('\.about-text'/g, '// sr.reveal(\'.about-text\'');

fs.writeFileSync('script.js', js);
console.log('Disabled conflicting ScrollReveal animations.');
