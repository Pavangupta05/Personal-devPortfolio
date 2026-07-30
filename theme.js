
function updateAboutPhotos() {
  const isLight = document.body.classList.contains('light-mode');
  const spotlightWrap = document.getElementById('spotlightWrap');
  if (spotlightWrap) {
    const baseImg = spotlightWrap.querySelector('.photo-base');
    const revealImg = spotlightWrap.querySelector('.photo-reveal');
    if (baseImg) {
      baseImg.src = isLight ? 'Base_image_white.png' : 'Base_image.png';
    }
    if (revealImg) {
      revealImg.src = isLight ? 'Reaveal_image_white.png' : 'Reaveal_image.png';
    }
  }
}

function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  updateThemeIcons();
  updateAboutPhotos();
}

function updateThemeIcons() {
  const isLight = document.body.classList.contains('light-mode');
  const desktopIcons = document.querySelectorAll('#themeIconDesktop, .theme-icon-desktop');
  const mobileIcons = document.querySelectorAll('#themeIconMobile, .theme-icon-mobile');
  
  desktopIcons.forEach(icon => {
    icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  });
  mobileIcons.forEach(icon => {
    icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  });
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }
  updateThemeIcons();
  updateAboutPhotos();
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
