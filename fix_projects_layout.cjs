const fs = require('fs');

let html = fs.readFileSync('projects.html', 'utf8');

// Change the section ID to avoid legacy CSS overrides that force a vertical list
html = html.replace('<section id="projects" class="section"', '<section id="portfolio-grid" class="section"');

fs.writeFileSync('projects.html', html);
console.log('Fixed projects.html layout by renaming section ID.');
