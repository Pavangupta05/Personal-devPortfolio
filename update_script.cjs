const fs = require('fs');

let content = fs.readFileSync('script.js', 'utf8');

// Replace the scroll spy logic inside the scroll handler with a one-time active link setter
const scrollSpyReplace = `
      // Active link logic moved to DOMContentLoaded
`;

const activeLinkLogic = `
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navPillLinks.forEach(link => {
    const href = link.getAttribute('href');
    const active = (href === currentPath) || (currentPath === '' && href === 'index.html');
    link.classList.toggle('active', active);
    if (active) updateSlider(link);
  });
  const mobileLinks = [...document.querySelectorAll('.mobile-nav-links a, .mdn-links a')];
  mobileLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', (href === currentPath) || (currentPath === '' && href === 'index.html'));
  });
`;

content = content.replace(/let current = '';\s*sections\.forEach\(s => \{ if \(sy >= s\.offsetTop - s\.clientHeight \/ 3\) current = s\.id; \}\);\s*navPillLinks\.forEach\(link => \{\s*const active = Boolean\(current && link\.getAttribute\('href'\)\.includes\(current\)\);\s*link\.classList\.toggle\('active', active\);\s*if \(active\) updateSlider\(link\);\s*\}\);\s*mobileLinks\.forEach\(link => \{\s*link\.classList\.toggle\('active', Boolean\(current && link\.getAttribute\('href'\)\.includes\(current\)\)\);\s*\}\);/g, scrollSpyReplace);

// Inject active link logic by replacing the existing const mobileLinks = ... line
content = content.replace(/const mobileLinks = \[\.\.\.document\.querySelectorAll\('\.mobile-nav-links a'\)\];/, activeLinkLogic);

fs.writeFileSync('script.js', content);

console.log('script.js updated correctly for multi-page active links!');
