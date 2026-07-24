const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'index.html');
const content = fs.readFileSync(indexFile, 'utf8');

const sectionsRegex = /<section id="([^"]+)"(?: class="[^"]*")?>([\s\S]*?)<\/section>/g;
const sections = {};
let match;
while ((match = sectionsRegex.exec(content)) !== null) {
  sections[match[1]] = match[0];
}

const headerEndIdx = content.indexOf('<section id="home"');
let header = content.substring(0, headerEndIdx);

header = header.replace(/href="#home"/g, 'href="index.html"');
header = header.replace(/href="#about"/g, 'href="about.html"');
header = header.replace(/href="#skills"/g, 'href="skills.html"');
header = header.replace(/href="#experience"/g, 'href="experience.html"');
header = header.replace(/href="#certificates"/g, 'href="experience.html#certificates"');
header = header.replace(/href="#projects"/g, 'href="projects.html"');
header = header.replace(/href="#contact"/g, 'href="contact.html"');

const footerStartIdx = content.indexOf('<footer class="footer">');
let footer = content.substring(footerStartIdx);

// Also remove the <section> tags from index.html itself in the footer, if any trailing ones remain.
// Actually, it's safer to just take everything from <footer onwards.

const files = {
  'index.html': sections['home'] || '',
  'about.html': sections['about'] || '',
  'skills.html': sections['skills'] || '',
  'experience.html': (sections['experience'] || '') + '\n' + (sections['certificates'] || ''),
  'projects.html': sections['projects'] || '',
  'contact.html': sections['contact'] || ''
};

for (const [filename, bodyContent] of Object.entries(files)) {
  if (bodyContent) {
    fs.writeFileSync(path.join(__dirname, filename), header + '\n' + bodyContent + '\n' + footer);
  }
}

console.log('Successfully generated HTML pages!', Object.keys(files));
