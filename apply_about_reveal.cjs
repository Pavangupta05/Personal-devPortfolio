const fs = require('fs');

let html = fs.readFileSync('about.html', 'utf8');

// Ensure all paragraphs inside about-text also get the text-reveal class for sequential staggering
html = html.replace(/<p>/g, '<p class="text-reveal">');
html = html.replace(/<p style="/g, '<p class="text-reveal" style="');

fs.writeFileSync('about.html', html);
console.log('Applied text-reveal to paragraphs in about.html');
