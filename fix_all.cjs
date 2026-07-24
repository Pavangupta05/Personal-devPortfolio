const fs = require('fs');

// 1. Fix Cursor Z-index & Enable Mobile Stacking in CSS
let css = fs.readFileSync('style.css', 'utf8');

const cursorZIndexFix = `
/* ==========================================================
   CURSOR Z-INDEX FIX
   ========================================================== */
.cursor-dot, .cursor-outline, .cursor-follower, .magic-cursor {
  z-index: 2147483647 !important; /* Absolute max to always float above navbar */
}
`;

if (!css.includes('CURSOR Z-INDEX FIX')) {
  css += '\n' + cursorZIndexFix;
}

css = css.replace('.sticky-card {\\n    position: relative !important;\\n    top: auto !important;\\n  }', '.sticky-card {\\n    top: 100px !important;\\n  }');
css = css.replace('.sticky-card {\\r\\n    position: relative !important;\\r\\n    top: auto !important;\\r\\n  }', '.sticky-card {\\r\\n    top: 100px !important;\\r\\n  }');

fs.writeFileSync('style.css', css);
console.log('Fixed CSS (cursor z-index & mobile stack)');


// 2. Enable Mobile GSAP Stacking in script.js
let js = fs.readFileSync('script.js', 'utf8');
js = js.replace('"(min-width: 768px)": function() {', '"all": function() {');
fs.writeFileSync('script.js', js);
console.log('Enabled GSAP stack for mobile in script.js');


// 3. Fix Theme Toggle explicitly binding it in theme.js
let themeJs = fs.readFileSync('theme.js', 'utf8');

const newInit = "window.addEventListener('DOMContentLoaded', () => {\n  updateThemeIcons();\n  \n  const desktopBtn = document.getElementById('themeToggleDesktop');\n  if (desktopBtn) {\n    desktopBtn.addEventListener('click', function(e) {\n      e.preventDefault();\n      toggleTheme();\n    });\n  }\n});";

if (!themeJs.includes("addEventListener('click', function(e)")) {
  themeJs = themeJs.replace("window.addEventListener('DOMContentLoaded', () => {\n  updateThemeIcons();\n});", newInit);
  themeJs = themeJs.replace("window.addEventListener('DOMContentLoaded', () => {\r\n  updateThemeIcons();\r\n});", newInit);
  fs.writeFileSync('theme.js', themeJs);
  console.log('Explicitly bound theme toggle in theme.js');
}
