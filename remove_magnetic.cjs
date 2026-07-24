const fs = require('fs');

// 1. Remove dynamic magnetic shadow from all HTML files
const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

htmlFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');

  // Strip the dynamic boxShadow assignment inside the inline script
  content = content.replace(/card\.style\.boxShadow\s*=\s*`0 \$\{20[^\n]*`;/g, '');
  content = content.replace(/card\.style\.boxShadow\s*=\s*'';/g, '');
  
  // Also strip the transition for boxShadow to be safe
  content = content.replace(/,\s*box-shadow\s*0\.3s\s*ease/g, '');
  content = content.replace(/,\s*box-shadow\s*0\.5s\s*ease/g, '');

  fs.writeFileSync(f, content);
});

console.log('Removed dynamic magnetic shadow from HTML files.');

// 2. Remove magnetic cursor swell from magic-cursor.js
let cursorJs = fs.readFileSync('magic-cursor.js', 'utf8');

// Strip out the custom scale enlargement on project-card and skill-card
cursorJs = cursorJs.replace(/if\s*\([^)]*\.classList\.contains\('project-card'\)[^}]+\{\s*dynamicScale\s*=\s*3\.5;\s*\}/, '');

fs.writeFileSync('magic-cursor.js', cursorJs);
console.log('Removed magnetic cursor scale from magic-cursor.js.');
