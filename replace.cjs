const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/href="#about"/g, 'href="about.html"')
                   .replace(/href="#projects"/g, 'href="projects.html"')
                   .replace(/href="#skills"/g, 'href="skills.html"')
                   .replace(/href="#experience"/g, 'href="experience.html"')
                   .replace(/href="#contact"/g, 'href="contact.html"')
                   .replace(/href="#home"/g, 'href="index.html"');
  fs.writeFileSync(f, content);
});

console.log('Replaced all hash links in HTML files');
