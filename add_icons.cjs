const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

const newIcons = `
    <a href="https://wa.me/YOUR_NUMBER" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="WhatsApp">
      <i class="fa-brands fa-whatsapp" style="font-size: 1.2rem;"></i>
    </a>
    <a href="https://instagram.com/YOUR_HANDLE" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="Instagram">
      <i class="fa-brands fa-instagram" style="font-size: 1.2rem;"></i>
    </a>`;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Inject the new icons right before the download button
  // The download button href usually starts with https://drive.google.com
  content = content.replace(/(<a href="https:\/\/drive\.google\.com)/, newIcons + '\n    $1');
  
  fs.writeFileSync(f, content);
});

// Let's also make sure the light mode hover for social icons is correct in style.css
let css = fs.readFileSync('style.css', 'utf8');

const hoverCss = `
/* Light Mode Icon Hover Fix */
body.light-mode .social-icon-btn:hover {
  background: var(--lg-bg-hover) !important;
  color: var(--accent) !important;
  border-color: var(--accent) !important;
}
body.light-mode .social-icon-btn:hover svg,
body.light-mode .social-icon-btn:hover i {
  fill: var(--accent) !important;
  color: var(--accent) !important;
}
`;

if (!css.includes('/* Light Mode Icon Hover Fix */')) {
  css += '\n' + hoverCss;
  fs.writeFileSync('style.css', css);
}

console.log('Injected WhatsApp and Instagram icons and fixed hover state.');
