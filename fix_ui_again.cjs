const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

const toggleDesktopHtml = `
      <button class="theme-toggle-btn desktop-theme-btn" aria-label="Toggle theme" onclick="toggleTheme()">
        <i class="fa-solid fa-moon" id="themeIconDesktop"></i>
      </button>
`;

const toggleMobileHtml = `
      <button class="mdn-btn theme-toggle-btn mobile-theme-btn" aria-label="Toggle theme" onclick="toggleTheme()">
        <i class="fa-solid fa-moon" id="themeIconMobile"></i>
      </button>
`;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');

  // 1. Remove floating toggle
  content = content.replace(/<!-- Floating Theme Toggle -->\s*<button class="floating-theme-toggle"[\s\S]*?<\/button>\s*/g, '');

  // 2. Remove any old navbar toggles just in case
  content = content.replace(/<button class="theme-toggle-btn desktop-theme-btn"[\s\S]*?<\/button>\s*/g, '');
  content = content.replace(/<button class="mdn-btn theme-toggle-btn mobile-theme-btn"[\s\S]*?<\/button>\s*/g, '');
  content = content.replace(/<button class="theme-toggle-btn"[\s\S]*?<\/button>\s*/g, '');
  content = content.replace(/<button class="mdn-btn theme-toggle-btn"[\s\S]*?<\/button>\s*/g, '');

  // 3. Inject Desktop Toggle inside nav-glass-container but outside nav-links-pill
  content = content.replace(/<\/div>\s*(?=<\/div>\s*<\/nav>)/, (match) => {
    // This targets the closing div of nav-links-pill. We append the button right after it.
    return match + '\n' + toggleDesktopHtml;
  });

  // 4. Inject Mobile Toggle inside mdn-right, before the terminal button
  content = content.replace(/<button class="mdn-btn" onclick="openTerminal\(\)">/, (match) => {
    return toggleMobileHtml + '\n      ' + match;
  });

  fs.writeFileSync(f, content);
});

// Update CSS
let css = fs.readFileSync('style.css', 'utf8');

// Remove the floating toggle CSS
css = css.replace(/\/\* Floating Theme Toggle \*\/[\s\S]*?\/\* Aggressive Light Mode Text Color Overrides \*\//, '/* Aggressive Light Mode Text Color Overrides */');

const uiFixesCss = `
/* Navbar Theme Toggle Placements */
.desktop-navbar .nav-glass-container {
  display: flex;
  align-items: center;
  gap: 15px; /* Separate the pill from the button */
}
.desktop-theme-btn {
  background: var(--glass-bg);
  border: var(--glass-border);
  backdrop-filter: blur(10px);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}
.desktop-theme-btn:hover {
  background: var(--lg-bg-hover);
  transform: scale(1.1);
}

/* Light Mode Glass Cards */
body.light-mode .project-card,
body.light-mode .skill-card {
  background: rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(20px) saturate(150%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(150%) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.08) !important;
  color: var(--text-primary) !important;
}

/* Light Mode Buttons */
body.light-mode .btn-primary {
  background: var(--accent) !important;
  color: #ffffff !important; /* White text on accent color */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
}
body.light-mode .btn-secondary {
  background: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
  color: var(--text-primary) !important;
}
body.light-mode .btn-primary:hover,
body.light-mode .btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
}
`;

if (!css.includes('/* Navbar Theme Toggle Placements */')) {
  fs.writeFileSync('style.css', css + '\n' + uiFixesCss);
} else {
  // If we already added it previously during tests, just rewrite the file
  fs.writeFileSync('style.css', css.replace(/\/\* Navbar Theme Toggle Placements \*\/[\s\S]*$/, uiFixesCss));
}

// Revert theme.js to target Desktop and Mobile IDs
let themeJs = fs.readFileSync('theme.js', 'utf8');
themeJs = themeJs.replace(
  /const floatingIcon = document.getElementById\('floatingThemeIcon'\);\s*if \(floatingIcon\) \{\s*floatingIcon.className = isLight \? 'fa-solid fa-sun' : 'fa-solid fa-moon';\s*\}/g,
  `const desktopIcon = document.getElementById('themeIconDesktop');
  const mobileIcon = document.getElementById('themeIconMobile');
  if (desktopIcon) {
    desktopIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
  if (mobileIcon) {
    mobileIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }`
);
fs.writeFileSync('theme.js', themeJs);

console.log('Fixed cards, buttons, and moved toggle back into navbars (cleanly separated).');
