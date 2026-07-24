const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const fixCSS = `
/* ==========================================================
   NAVBAR Z-INDEX FIX (Guarantees Navbar is ALWAYS on top)
   ========================================================== */
.desktop-navbar, .mobile-dynamic-nav, .mobile-hamburger-btn {
  z-index: 999999 !important;
  transform: translateZ(9999px) !important; /* Forces hardware acceleration and 3D top layer */
}

/* ==========================================================
   ABOUT SECTION SPACING FIX
   ========================================================== */
.section.about-section {
  padding-top: 150px !important; /* Pushes content down slightly below navbar */
}
`;

if (!css.includes('NAVBAR Z-INDEX FIX')) {
  fs.appendFileSync('style.css', '\n' + fixCSS);
  console.log('Appended layout fixes to style.css');
}
