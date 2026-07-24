const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const fixCSS = `
/* Hide text-reveal elements initially to prevent Flash of Unstyled Content (FOUC) */
.text-reveal:not(.revealed-init) {
  opacity: 0;
  visibility: hidden;
}
`;

if (!css.includes('.text-reveal:not(.revealed-init)')) {
  fs.appendFileSync('style.css', '\n' + fixCSS);
  console.log('Injected FOUC prevention CSS.');
}
