const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// Remove the heavy SVG noise filter from the background of cta-section
css = css.replace(
  /url\('data:image\/svg\+xml;utf8,[^']+'\),/g,
  ''
);

// Add hardware acceleration to spinText keyframes
css = css.replace(
  '@keyframes spinText {\n  100% { transform: rotate(360deg); }\n}',
  '@keyframes spinText {\n  0% { transform: rotate(0deg) translateZ(0); }\n  100% { transform: rotate(360deg) translateZ(0); }\n}'
);

css = css.replace(
  '.cta-badge-text {\n  position: absolute;\n  top: 0; left: 0;\n  width: 100%; height: 100%;\n  animation: spinText 10s linear infinite;\n}',
  '.cta-badge-text {\n  position: absolute;\n  top: 0; left: 0;\n  width: 100%; height: 100%;\n  animation: spinText 10s linear infinite;\n  will-change: transform;\n}'
);


fs.writeFileSync('style.css', css);
console.log('Optimized CTA background and animation for better FPS.');
