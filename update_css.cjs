const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const lightModeCss = `
/* ========================================================
   LIGHT MODE THEME
======================================================== */
body.light-mode {
  --bg-primary-from: #f0f2f5;
  --bg-primary-to: #e5e7eb;
  --text-primary: #111827;
  --text-secondary: #4b5563;
  --accent: #0284c7; /* Sky blue */
  --accent-2: #ea580c; /* Orange */
  --accent-3: #7c3aed; /* Purple */
  
  --card-bg: rgba(255, 255, 255, 0.6);
  --card-border: rgba(0, 0, 0, 0.08);
  --shadow-sm: 0 4px 14px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 10px 40px rgba(0, 0, 0, 0.05);
  
  --glass-bg: rgba(255, 255, 255, 0.65);
  --glass-border: 1px solid rgba(0, 0, 0, 0.1);
  --glass-blur: blur(20px) saturate(150%);
  
  /* Liquid Glass System for Light Mode */
  --lg-bg: rgba(255, 255, 255, 0.7);
  --lg-bg-hover: rgba(255, 255, 255, 0.85);
  --lg-border: rgba(0, 0, 0, 0.1);
  --lg-border-bright: rgba(0, 0, 0, 0.2);
  --lg-highlight: rgba(0, 0, 0, 0.03);
  --lg-shadow: 0 8px 32px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  --lg-shadow-hover: 0 16px 48px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8);
  
  background-color: var(--bg-primary-from) !important;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.1) 1.5px, transparent 1.5px) !important;
}

body.light-mode .ambient-blob {
  display: none !important;
}

body.light-mode .about-card, 
body.light-mode .sticky-about-card {
  background: rgba(255, 255, 255, 0.9) !important;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.05);
}

/* Theme Toggle Button Styles */
.theme-toggle-btn {
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease, color 0.3s ease;
  padding: 8px;
  border-radius: 50%;
}
.theme-toggle-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.theme-toggle-btn:hover {
  transform: scale(1.1);
  color: var(--accent);
}

/* Mobile UI Fixes */
@media (max-width: 768px) {
  .typing-title {
    font-size: 2.5rem !important; /* Scale down hero text */
  }
  .project-grid, .skills-grid {
    grid-template-columns: 1fr !important;
  }
  .mobile-dynamic-nav {
    z-index: 10000; /* Ensure nav is above content */
  }
}
`;

// Remove previous light mode block if it exists (for idempotency)
if (css.includes('/* ========================================================\n   LIGHT MODE THEME')) {
  css = css.substring(0, css.indexOf('/* ========================================================\n   LIGHT MODE THEME'));
}

// Ensure the dot background override uses the CSS variable properly in dark mode too
css = css.replace(/body \{\s*background-color: #000 !important;\s*background-image: radial-gradient\(circle, rgba\(255, 255, 255, 0.18\) 1px, transparent 1px\) !important;\s*background-size: 26px 26px !important;\s*background-attachment: fixed !important;\s*\}/, 
`body {
  background-color: var(--bg-primary-from) !important;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.18) 1px, transparent 1px) !important;
  background-size: 26px 26px !important;
  background-attachment: fixed !important;
}`);

fs.writeFileSync('style.css', css + '\n' + lightModeCss);
console.log('Updated style.css with Light Mode variables and Mobile Fixes.');
