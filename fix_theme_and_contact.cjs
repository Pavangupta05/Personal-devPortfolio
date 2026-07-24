const fs = require('fs');

// 1. Fix theme.js
const themeJsContent = `
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
`;

fs.writeFileSync('theme.js', themeJsContent);
console.log('Fixed theme.js to prevent double-firing.');


// 2. Add Contact Button to Home Page Hero Section
let html = fs.readFileSync('index.html', 'utf8');

const searchBtnStr = '<a href="./Resume.pdf" download="Pavan_Kumar_Gupta_Resume.pdf" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Download Resume</a>';
const contactBtnStr = '<a href="contact.html" class="btn btn-secondary">Contact Me</a>';

if (html.includes(searchBtnStr) && !html.includes(contactBtnStr)) {
  html = html.replace(searchBtnStr, searchBtnStr + '\n        ' + contactBtnStr);
  fs.writeFileSync('index.html', html);
  console.log('Added Contact button to Home page hero.');
} else {
  console.log('Contact button already exists or could not find injection point.');
}

