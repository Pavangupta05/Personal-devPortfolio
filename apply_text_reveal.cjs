const fs = require('fs');

const htmlFiles = ['index.html', 'projects.html', 'about.html', 'skills.html', 'experience.html', 'contact.html'];

htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Inject script if not present
    if (!content.includes('text-reveal.js')) {
      content = content.replace('</body>', '  <script src="text-reveal.js"></script>\n</body>');
    }

    // Add .text-reveal to .section-title
    content = content.replace(/class="section-title"/g, 'class="section-title text-reveal"');
    content = content.replace(/class="section-title scroll-reveal"/g, 'class="section-title text-reveal"'); // Override scroll-reveal

    // Home page specific
    if (file === 'index.html') {
      content = content.replace(/class="hero-greeting"/g, 'class="hero-greeting text-reveal"');
      content = content.replace(/class="home-subtitle"/g, 'class="home-subtitle text-reveal"');
      content = content.replace(/class="typing-title"/g, 'class="typing-title text-reveal"');
    }

    // About page specific
    if (file === 'about.html') {
      content = content.replace(/<h2 style="/g, '<h2 class="text-reveal" style="');
    }

    fs.writeFileSync(file, content);
    console.log('Applied text reveal to ' + file);
  }
});
