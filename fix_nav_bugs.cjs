const fs = require('fs');

const files = ['index.html', 'about.html', 'skills.html', 'experience.html', 'projects.html', 'contact.html'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');
    
    // Fix Theme Toggle HTML
    const oldThemeBtn = '<button id="themeToggleDesktop" class="theme-toggle nav-icon" aria-label="Toggle Theme">\n          <i class="fa-solid fa-moon"></i>';
    const newThemeBtn = '<button id="themeToggleDesktop" class="theme-toggle nav-icon" aria-label="Toggle Theme" onclick="toggleTheme()">\n          <i id="themeIconDesktop" class="fa-solid fa-moon"></i>';
    
    if (html.includes(oldThemeBtn)) {
      html = html.replace(oldThemeBtn, newThemeBtn);
      fs.writeFileSync(file, html);
      console.log('Fixed theme button in ' + file);
    }
  }
});

// Fix CSS (Remove translateZ and enforce flex alignment)
let css = fs.readFileSync('style.css', 'utf8');

css = css.replace('transform: translateX(-50%) translateZ(999px) !important;', 'transform: translateX(-50%) !important;');

if (!css.includes('align-items: center !important; justify-content: center !important;')) {
    css = css.replace(
        '.nav-links-pill .nav-icon {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;',
        '.nav-links-pill .nav-icon {\n  position: relative;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;'
    );
}

fs.writeFileSync('style.css', css);
console.log('Fixed translateZ cursor bug and enforced centering in style.css');
