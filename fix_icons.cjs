const fs = require('fs');

// 1. Update CSS for icons in light mode
let css = fs.readFileSync('style.css', 'utf8');

const iconCss = `
/* Light Mode Icons Fix */
body.light-mode .social-icon-btn {
  color: var(--text-primary) !important;
  background: rgba(255, 255, 255, 0.6) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
}
body.light-mode .social-icon-btn svg {
  fill: var(--text-primary) !important;
}
`;

if (!css.includes('/* Light Mode Icons Fix */')) {
  css += '\n' + iconCss;
}
fs.writeFileSync('style.css', css);


// 2. Remove footer from all HTML files
const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // The footer might span multiple lines, so we use a regex that matches across newlines
  content = content.replace(/<footer class="footer">[\s\S]*?<\/footer>/g, '');
  
  fs.writeFileSync(f, content);
});

console.log('Fixed icon visibility and removed the footer.');
