const fs = require('fs');

// 1. Appending CSS
let css = fs.readFileSync('style.css', 'utf8');

const transitionCSS = `
/* ==========================================================
   SMOOTH PAGE TRANSITIONS
   ========================================================== */
.page-transition-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #050505; /* Deep dark mode background */
  z-index: 9999999; /* Stay on top of everything */
  opacity: 1;
  pointer-events: none;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

body.light-mode .page-transition-overlay {
  background-color: #f8f9fa; /* Light mode background */
}

.page-transition-overlay.fade-out {
  opacity: 0;
}
`;

if (!css.includes('SMOOTH PAGE TRANSITIONS')) {
  fs.appendFileSync('style.css', '\n' + transitionCSS);
  console.log('Appended Page Transition CSS.');
}

// 2. Injecting HTML overlay into all HTML files right after <body>
const files = ['index.html', 'about.html', 'skills.html', 'experience.html', 'projects.html', 'contact.html'];
const overlayHTML = '\n  <div class="page-transition-overlay"></div>';

files.forEach(file => {
  if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');
    if (!html.includes('page-transition-overlay')) {
      // Find <body ...> or <body>
      html = html.replace(/(<body[^>]*>)/i, '$1' + overlayHTML);
      fs.writeFileSync(file, html);
      console.log('Injected transition overlay into ' + file);
    }
  }
});

// 3. Appending JS logic to theme.js
let themeJs = fs.readFileSync('theme.js', 'utf8');
const transitionJs = `

// Page Transition Logic
window.addEventListener('DOMContentLoaded', () => {
  const overlay = document.querySelector('.page-transition-overlay');
  
  // Fade IN on page load
  if (overlay) {
    // slight delay to ensure browser paints initial frame
    requestAnimationFrame(() => {
      overlay.classList.add('fade-out');
    });
  }

  // Intercept links for Fade OUT before navigating
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      
      // Check if it's an internal HTML page link
      if (
        href && 
        href.endsWith('.html') && 
        !link.hasAttribute('download') && 
        link.target !== '_blank'
      ) {
        e.preventDefault(); // Stop immediate navigation
        
        if (overlay) {
          overlay.classList.remove('fade-out'); // Fade to solid color
          
          // Wait for CSS transition (0.5s) to finish before changing page
          setTimeout(() => {
            window.location.href = href;
          }, 500); 
        } else {
          window.location.href = href;
        }
      }
    });
  });
});
`;

if (!themeJs.includes('Page Transition Logic')) {
  fs.appendFileSync('theme.js', transitionJs);
  console.log('Appended Page Transition Logic to theme.js.');
}
