
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  updateThemeIcons();
}

function updateThemeIcons() {
  const isLight = document.body.classList.contains('light-mode');
  const desktopIcon = document.getElementById('themeIconDesktop');
  const mobileIcon = document.getElementById('themeIconMobile');
  if (desktopIcon) {
    desktopIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
  if (mobileIcon) {
    mobileIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }
  updateThemeIcons();
});


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
