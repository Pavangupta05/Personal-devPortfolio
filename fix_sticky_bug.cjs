const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// The sticky-killer bug: .section has overflow: hidden
// We must force overflow: visible on the section containing the stack
const override = `
/* CRITICAL STICKY FIX */
.portfolio-stack-section {
  overflow: visible !important;
  clip-path: none !important;
}
`;

if (!css.includes('CRITICAL STICKY FIX')) {
  css += '\n' + override;
  fs.writeFileSync('style.css', css);
  console.log('Fixed .section overflow: hidden bug.');
} else {
  console.log('Already fixed.');
}
