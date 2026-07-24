const fs = require('fs');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

const themeToggleDesktop = `
        <button class="theme-toggle-btn" aria-label="Toggle light/dark theme" onclick="toggleTheme()">
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

  // 1. Update Preloader Colors
  content = content.replace(/background-color: #000;/g, 'background-color: var(--bg-primary-from);');
  content = content.replace(/color: #fff;/g, 'color: var(--text-primary);');
  content = content.replace(/background: rgba\(255,255,255,0\.15\);/g, 'background: var(--lg-border);');
  content = content.replace(/background: #fff;/g, 'background: var(--text-primary);');
  content = content.replace(/color: #aaa;/g, 'color: var(--text-secondary);');

  // 2. Inject body script for no-flash loading
  if (!content.includes("localStorage.getItem('theme') === 'light'")) {
    content = content.replace('<body>', "<body>\n  <script>if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');</script>");
  }

  // 3. Inject Desktop Toggle Button
  if (!content.includes('id="themeIconDesktop"')) {
    content = content.replace('</div>\n    </div>\n  </nav>', themeToggleDesktop + '      </div>\n    </div>\n  </nav>');
  }

  // 4. Inject Mobile Toggle Button
  if (!content.includes('id="themeIconMobile"')) {
    content = content.replace('</div>\n  </nav>', themeToggleMobile + '    </div>\n  </nav>');
  }

  // 5. Link theme.js at bottom
  if (!content.includes('theme.js')) {
    content = content.replace('</body>', '  <script src="theme.js"></script>\n</body>');
  }

  fs.writeFileSync(f, content);
});

// Update style.css to support HTML/Body light-mode class mapping if needed
let css = fs.readFileSync('style.css', 'utf8');
css = css.replace(/body\.light-mode/g, 'body.light-mode'); // No change needed since we inject into <body> tag directly
fs.writeFileSync('style.css', css);

console.log('Injected Theme Toggles, Scripts, and Updated Preloader in HTML.');
