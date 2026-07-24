const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const uiFixes = `
/* ==========================================================
   NAVBAR LIGHT MODE FIXES
   ========================================================== */
body.light-mode .nav-glass-container {
  background: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(25px) saturate(200%) !important;
  -webkit-backdrop-filter: blur(25px) saturate(200%) !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8) !important;
}

body.light-mode .nav-links-pill a {
  color: #333333 !important;
}

body.light-mode .nav-links-pill a:hover,
body.light-mode .nav-links-pill a.active {
  color: #000000 !important;
  background: rgba(0, 0, 0, 0.05) !important;
  text-shadow: none !important;
  box-shadow: none !important;
}
`;

if (!css.includes('NAVBAR LIGHT MODE FIXES')) {
  fs.appendFileSync('style.css', '\n' + uiFixes);
  console.log('Appended light mode navbar fixes to CSS.');
}

// 2. Fix Theme Icons in HTML
const htmlFiles = ['index.html', 'projects.html', 'about.html', 'skills.html', 'experience.html', 'contact.html'];

htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Ensure desktop theme icon is a moon default
    content = content.replace(/<i class="fa-solid fa-[a-z-]+" id="themeIconDesktop"><\/i>/, '<i class="fa-solid fa-moon" id="themeIconDesktop"></i>');
    // Ensure mobile theme icon is a moon default
    content = content.replace(/<i class="fa-solid fa-[a-z-]+" id="themeIconMobile"><\/i>/, '<i class="fa-solid fa-moon" id="themeIconMobile"></i>');
    fs.writeFileSync(file, content);
    console.log('Fixed theme icons in ' + file);
  }
});
