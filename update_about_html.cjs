const fs = require('fs');

let html = fs.readFileSync('about.html', 'utf8');

const originalImg = '<img src="/ProfilePhoto.png" alt="Pavan\'s Profile Photo" class="img-skeleton" onload="this.classList.remove(\'img-skeleton\')">';

const newStructure = `
<div class="profile-photo-wrap" id="spotlightWrap">
  <img src="/ProfilePhoto.png" alt="Pavan's Profile Photo" class="photo-base">
  <img src="/pavan.jpg" alt="Alternate Profile" class="photo-reveal" aria-hidden="true">
  <div class="spotlight-ring"></div>
</div>
`;

html = html.replace(originalImg, newStructure);

// Inject spotlight.js at the end
if (!html.includes('spotlight.js')) {
  html = html.replace('</body>', '  <script src="spotlight.js"></script>\n</body>');
}

fs.writeFileSync('about.html', html);
console.log('Updated about.html for spotlight reveal.');
