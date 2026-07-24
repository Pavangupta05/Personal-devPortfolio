const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const ultimateFix = `
/* ==========================================================
   ULTIMATE STICKY UNBLOCKER
   ========================================================== */
html, body, main, .main-content, .portfolio-stack-section, .portfolio-stack-container {
  /* ANY overflow value other than visible completely breaks position: sticky */
  overflow: visible !important;
  overflow-x: visible !important;
  overflow-y: visible !important;
  
  /* Any transform on an ancestor breaks position: sticky */
  transform: none !important;
  will-change: auto !important;
  perspective: none !important;
  filter: none !important;
  backdrop-filter: none !important;
  contain: none !important;
}

/* Ensure the sticky card itself is perfectly set up */
.portfolio-stack-container {
  display: block !important;
  height: auto !important;
  padding-bottom: 50vh !important; /* Huge scroll area */
}

.sticky-card {
  position: -webkit-sticky !important; /* Safari fallback */
  position: sticky !important;
  top: 120px !important;
  display: block !important; /* NOT a flex child */
  margin-bottom: 80px !important;
  z-index: 1 !important;
}

.sticky-card:nth-child(1) { z-index: 10 !important; }
.sticky-card:nth-child(2) { z-index: 20 !important; }
.sticky-card:nth-child(3) { z-index: 30 !important; }
.sticky-card:nth-child(4) { z-index: 40 !important; }
`;

if (!css.includes('ULTIMATE STICKY UNBLOCKER')) {
  fs.appendFileSync('style.css', '\n' + ultimateFix);
  console.log('Injected ultimate sticky unblocker.');
}
