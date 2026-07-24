const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const fixCSS = `
/* ==========================================================
   MAC BROWSER HEADER & LIGHT MODE NAVBAR FIX
   ========================================================== */

/* Fix Mac Browser Mockup */
.browser-header {
  position: relative;
  z-index: 10;
  background: rgba(15, 15, 20, 0.98) !important; /* Solid dark background */
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}
body.light-mode .browser-header {
  background: rgba(245, 245, 250, 0.98) !important; /* Solid light background */
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

/* Ensure image stays under the header without overflowing the card */
.browser-mockup {
  position: relative;
  overflow: hidden;
}

/* Fix Light Mode Navbar text visibility */
body.light-mode .navbar {
  background: rgba(255, 255, 255, 0.85) !important;
  border-bottom: 1px solid rgba(0,0,0,0.08) !important;
}
body.light-mode .nav-links a, 
body.light-mode .logo {
  color: #1a1a1a !important; /* Dark text for light mode */
}
body.light-mode .nav-links a:hover {
  color: var(--accent) !important;
}
`;

if (!css.includes('MAC BROWSER HEADER & LIGHT MODE NAVBAR FIX')) {
  fs.appendFileSync('style.css', '\n' + fixCSS);
  console.log('Injected browser header and light mode navbar fixes.');
} else {
  console.log('Already fixed.');
}
