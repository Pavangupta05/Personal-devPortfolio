const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Replace the Certificates link with Projects in the desktop navbar
  content = content.replace(
    /<a href="experience\.html#certificates">Certificates<\/a>/g, 
    '<a href="projects.html">Projects</a>'
  );
  
  fs.writeFileSync(f, content);
});

console.log('Replaced Certificates link with Projects link in navbars.');
