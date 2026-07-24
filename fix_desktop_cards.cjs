const fs = require('fs');

// ========================================================
// 1. UPDATE HTML
// ========================================================
let html = fs.readFileSync('projects.html', 'utf8');

const imgs = [
  'Screenshot 2025-08-29 162918.png',
  'Screenshot 2025-08-29 162948.png',
  'Screenshot 2025-08-29 163807.png'
];

html = html.replace(/class="project-card sticky-card"/g, 'class="stack-project-card sticky-card"');

html = html.replace(/<img src="\/StarNote.png"[^>]+>/, '<img src="' + imgs[0] + '" alt="StarNote AI">');
html = html.replace(/<img src="\/TalkNow.png"[^>]+>/, '<img src="' + imgs[1] + '" alt="TalkNow Chat">');
html = html.replace(/<img src="\/CivicEye.png"[^>]+>/, '<img src="' + imgs[2] + '" alt="Smart Civic Eye">');

fs.writeFileSync('projects.html', html);
console.log('Fixed HTML structure and images for projects.');

// ========================================================
// 2. UPDATE CSS
// ========================================================
let css = fs.readFileSync('style.css', 'utf8');

css = css.replace(/display:\s*flex;\s*flex-direction:\s*column;\s*gap:\s*60px;/g, 'display: block;');
css = css.replace(/\/\* Card Structure \*\//, '/* Card Structure */\n.sticky-card {\n  margin-bottom: 60px;\n}');

const newCardCSS = `
/* Fixed Desktop Grid for Sticky Cards */
.stack-project-card {
  width: 100%;
  display: block !important;
}
.sticky-card .card-inner {
  display: grid !important;
  grid-template-columns: 1fr 1.2fr !important;
  gap: 40px !important;
  padding: 40px !important;
  position: relative !important;
  z-index: 10 !important;
}
.sticky-card .card-left {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
}
.sticky-card .card-right {
  display: block !important;
  width: 100% !important;
}
@media (max-width: 900px) {
  .sticky-card .card-inner {
    grid-template-columns: 1fr !important;
  }
}
`;

if (!css.includes('.stack-project-card {\\n  width: 100%;')) {
  css += '\n' + newCardCSS;
}

fs.writeFileSync('style.css', css);
console.log('Fixed CSS grid and sticky block layout.');
