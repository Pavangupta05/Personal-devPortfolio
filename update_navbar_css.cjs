const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const newNavCSS = `
/* ==========================================================
   MINIMAL FLOATING NAVBAR (Pill + Icons + Tooltips)
   ========================================================== */

/* Main container overrides */
.desktop-navbar {
  position: fixed !important;
  top: 20px !important;
  left: 50% !important;
  transform: translateX(-50%) translateZ(999px) !important;
  z-index: 999999 !important;
  display: flex !important; /* Force display on mobile too */
}

/* Glass Pill Base */
.desktop-navbar .nav-glass-container {
  background: var(--bg-secondary) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
  border-radius: 50px !important;
  padding: 8px 12px !important;
  display: flex !important;
  align-items: center !important;
  transition: background 0.3s ease, border-color 0.3s ease;
}

body.light-mode .desktop-navbar .nav-glass-container {
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(0,0,0,0.1) !important;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important;
}

/* Flex Row for Icons */
.nav-links-pill {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 8px !important;
}

/* Base Icon Buttons */
.nav-links-pill .nav-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: var(--text-secondary);
  font-size: 1.1rem;
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  /* Reset padding/margin from old links */
  padding: 0 !important;
  margin: 0 !important;
}

/* Active & Hover States */
.nav-links-pill .nav-icon:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.nav-links-pill .nav-icon.active {
  color: var(--text-primary) !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

body.light-mode .nav-links-pill .nav-icon {
  color: #555;
}

body.light-mode .nav-links-pill .nav-icon:hover {
  color: #000;
  background: rgba(0, 0, 0, 0.05);
}

body.light-mode .nav-links-pill .nav-icon.active {
  color: #000 !important;
  background: rgba(0, 0, 0, 0.08) !important;
}

/* Vertical Divider */
.nav-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 4px;
}

body.light-mode .nav-divider {
  background: rgba(0, 0, 0, 0.1);
}

/* Tooltips */
.nav-tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 1000000;
}

body.light-mode .nav-tooltip {
  background: #111; /* Keep tooltip dark for high contrast in light mode */
  color: #fff;
  border: none;
}

/* Show Tooltip on Hover */
.nav-links-pill .nav-icon:hover .nav-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(18px); /* Slide down gracefully */
}

/* Theme Toggle Specifics */
#themeToggleDesktop {
  outline: none;
}
/* Note: In light mode image it has no border, in dark mode it has a ring. */
#themeToggleDesktop.nav-icon {
  border: 1.5px solid transparent;
}
body:not(.light-mode) #themeToggleDesktop.nav-icon {
  border-color: rgba(255,255,255,0.2);
}


/* ==========================================================
   MOBILE UNIFICATION (DISABLE OLD DOCKS)
   ========================================================== */
@media (max-width: 767px) {
  /* Disable the bottom dock and hamburger completely */
  .mobile-top-dock,
  .mobile-dynamic-nav,
  .mobile-hamburger-btn {
    display: none !important;
  }

  /* Make the pill scrollable horizontally if it gets too wide */
  .desktop-navbar {
    width: 90%;
    max-width: 400px;
  }
  
  .nav-glass-container {
    width: 100%;
    padding: 6px 8px !important;
    overflow-x: auto; /* Swiping if needed */
    /* Hide scrollbar */
    -ms-overflow-style: none;  
    scrollbar-width: none;  
  }
  
  .nav-glass-container::-webkit-scrollbar {
    display: none;
  }
  
  /* Slightly smaller icons for mobile to fit without scrolling ideally */
  .nav-links-pill .nav-icon {
    width: 38px;
    height: 38px;
    font-size: 1rem;
  }
  
  .nav-divider {
    height: 20px;
  }
  
  /* Disable hover tooltips on mobile since there is no hover */
  .nav-tooltip {
    display: none !important;
  }
}
`;

if (!css.includes('MINIMAL FLOATING NAVBAR')) {
  fs.appendFileSync('style.css', '\n' + newNavCSS);
  console.log('Appended minimal floating navbar CSS.');
} else {
  console.log('CSS already added.');
}
