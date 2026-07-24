const fs = require('fs');
const path = require('path');

// 1. Fix HTML: Remove old toggles, inject floating toggle
const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

const floatingToggle = `
<!-- Floating Theme Toggle -->
<button class="floating-theme-toggle" aria-label="Toggle theme" onclick="toggleTheme()">
  <i class="fa-solid fa-moon" id="floatingThemeIcon"></i>
</button>
`;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');

  // Remove old desktop toggle
  content = content.replace(/<button class="theme-toggle-btn"[\s\S]*?<\/button>/g, '');
  // Remove old mobile toggle
  content = content.replace(/<button class="mdn-btn theme-toggle-btn"[\s\S]*?<\/button>/g, '');

  // Inject floating toggle before </body> if not present
  if (!content.includes('floating-theme-toggle')) {
    content = content.replace('</body>', floatingToggle + '\n</body>');
  }

  fs.writeFileSync(f, content);
});

// 2. Fix CSS: Add floating toggle styles & fix light mode text colors
let css = fs.readFileSync('style.css', 'utf8');

const additionalCss = `
/* Floating Theme Toggle */
.floating-theme-toggle {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--glass-bg);
  border: var(--glass-border);
  backdrop-filter: var(--glass-blur);
  color: var(--text-primary);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100000;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease, color 0.3s ease;
}
.floating-theme-toggle:hover {
  transform: scale(1.1) rotate(15deg);
  color: var(--accent);
}

/* Aggressive Light Mode Text Color Overrides */
body.light-mode {
  color: var(--text-primary) !important;
}
body.light-mode h1, 
body.light-mode h2, 
body.light-mode h3, 
body.light-mode h4, 
body.light-mode h5, 
body.light-mode h6, 
body.light-mode p,
body.light-mode li,
body.light-mode .project-card,
body.light-mode .skill-card,
body.light-mode .typing-text,
body.light-mode .hero-greeting,
body.light-mode .home-subtitle {
  color: var(--text-primary) !important;
}
body.light-mode .desktop-navbar a,
body.light-mode .mobile-dynamic-nav a,
body.light-mode .nav-links-pill a,
body.light-mode .mobile-dynamic-nav span {
  color: var(--text-primary) !important;
}

/* Navbar Light Mode Fixes */
body.light-mode .desktop-navbar .nav-glass-container {
  background: var(--glass-bg) !important;
  border: var(--glass-border) !important;
}
body.light-mode .mobile-dynamic-nav .mdn-background {
  background: var(--glass-bg) !important;
  border-top: var(--glass-border) !important;
}
`;

// Append only once
if (!css.includes('/* Floating Theme Toggle */')) {
  fs.writeFileSync('style.css', css + '\n' + additionalCss);
}

// 3. Update theme.js to use floatingThemeIcon
let themeJs = fs.readFileSync('theme.js', 'utf8');
themeJs = themeJs.replace(
  /const desktopIcon = document.getElementById\('themeIconDesktop'\);\s*const mobileIcon = document.getElementById\('themeIconMobile'\);\s*if \(desktopIcon\) \{\s*desktopIcon.className = isLight \? 'fa-solid fa-sun' : 'fa-solid fa-moon';\s*\}\s*if \(mobileIcon\) \{\s*mobileIcon.className = isLight \? 'fa-solid fa-sun' : 'fa-solid fa-moon';\s*\}/g,
  `const floatingIcon = document.getElementById('floatingThemeIcon');
  if (floatingIcon) {
    floatingIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }`
);
fs.writeFileSync('theme.js', themeJs);

console.log('Fixed HTML, CSS, and JS for floating toggle and text colors.');
