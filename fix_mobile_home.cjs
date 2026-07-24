const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const fixCSS = `
/* ==========================================================
   MOBILE HOME UI FIXES (Tighten spacing & fix buttons)
   ========================================================== */
@media (max-width: 768px) {
  /* Fix massive gaps in hero container */
  .hero-container {
    min-height: auto !important;
    padding-top: 140px !important; /* Space for the navbar */
    padding-bottom: 60px !important;
    justify-content: flex-start !important;
  }
  
  /* Fix the massive height of the typing container */
  .typing-hero {
    min-height: auto !important;
    margin: 15px 0 !important;
  }
  
  #home .home-content {
    min-height: auto !important;
  }
  
  /* Fix giant chunky buttons to look elegant and centered */
  .home-cta {
    flex-direction: row !important;
    flex-wrap: wrap !important;
    justify-content: center !important;
    width: auto !important;
    max-width: none !important;
    margin: 30px auto 0 !important;
  }
  
  .home-cta .btn {
    width: auto !important;
    max-width: none !important;
    padding: 12px 24px !important;
    font-size: 0.95rem !important;
  }
}
`;

if (!css.includes('MOBILE HOME UI FIXES')) {
  css += '\n' + fixCSS;
  fs.writeFileSync('style.css', css);
  console.log('Applied Mobile UI Fixes to style.css');
} else {
  console.log('Mobile UI Fixes already applied.');
}
