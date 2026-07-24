const fs = require('fs');

const files = ['index.html', 'about.html', 'skills.html', 'experience.html', 'projects.html', 'contact.html'];

const contactIconHTML = `
        <a href="contact.html" class="nav-icon" data-page="contact">
          <i class="fa-solid fa-envelope"></i>
          <span class="nav-tooltip">Contact</span>
        </a>`;

files.forEach(file => {
  if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');
    
    // Find the Projects icon block and insert Contact right after it
    const searchStr = '<a href="projects.html" class="nav-icon" data-page="projects">\n          <i class="fa-regular fa-folder-open"></i>\n          <span class="nav-tooltip">Projects</span>\n        </a>';
    
    // Handle potential \r\n differences
    const regex = /<a href="projects\.html" class="nav-icon" data-page="projects">[\s\S]*?<\/a>/;
    
    if (regex.test(html) && !html.includes('data-page="contact"')) {
      html = html.replace(regex, match => match + '\n' + contactIconHTML);
      fs.writeFileSync(file, html);
      console.log('Added Contact icon to navbar in ' + file);
    } else {
      console.log('Already added or could not find Projects icon in ' + file);
    }
  }
});
