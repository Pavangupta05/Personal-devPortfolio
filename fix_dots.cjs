const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

const marker = '/* FINAL OVERRIDE FOR DOT BACKGROUND */';
if (css.includes(marker)) {
    css = css.substring(0, css.indexOf(marker));
}

// Slightly reduced visibility (opacity from 0.25 -> 0.18, size from 1.5px -> 1px)
const newCss = `
/* FINAL OVERRIDE FOR DOT BACKGROUND */
body {
  background-color: #000 !important;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.18) 1px, transparent 1px) !important;
  background-size: 26px 26px !important;
  background-attachment: fixed !important;
}
`;

fs.writeFileSync('style.css', css + newCss);
console.log('Dot grid reduced slightly.');
