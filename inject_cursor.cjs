const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Remove the old HTML cursors
  content = content.replace(/<div class="cursor"><\/div>\s*<div class="cursor-follower"><\/div>/g, '');
  
  // Inject the magic-cursor.js script right before </body> if it's not already there
  if (!content.includes('magic-cursor.js')) {
    content = content.replace('</body>', '  <script src="magic-cursor.js"></script>\n</body>');
    fs.writeFileSync(f, content);
  } else {
    // Write anyway in case the old cursors were removed
    fs.writeFileSync(f, content);
  }
});

console.log('Injected magic-cursor.js and cleaned up old cursors in all HTML files!');
