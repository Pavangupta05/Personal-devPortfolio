const fs = require('fs');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

const themeToggleDesktop = `
        <button class="theme-toggle-btn" aria-label="Toggle light/dark theme" onclick="toggleTheme()" style="margin-left: 10px;">
          <i class="fa-solid fa-moon" id="themeIconDesktop"></i>
        </button>
`;

const themeToggleMobile = `
      <button class="mdn-btn theme-toggle-btn" aria-label="Toggle light/dark theme" onclick="toggleTheme()">
        <i class="fa-solid fa-moon" id="themeIconMobile"></i>
      </button>
`;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');

  // Inject Desktop Toggle into nav-links-pill
  if (!content.includes('id="themeIconDesktop"')) {
    content = content.replace(/<\/div>\s*<\/div>\s*<\/nav>/, (match) => {
      // Assuming the last </div> before </nav> closes nav-glass-container or nav-links-pill
      return themeToggleDesktop + '\n' + match;
    });
  }

  // Inject Mobile Toggle into mdn-right
  if (!content.includes('id="themeIconMobile"')) {
    content = content.replace(/<\/div>\s*<\/nav>/, (match) => {
      // Find the mdn-right closing
      return themeToggleMobile + '\n' + match;
    });
  }

  fs.writeFileSync(f, content);
});

console.log('Robustly injected Theme Toggles.');
