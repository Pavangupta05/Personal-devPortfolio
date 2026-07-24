const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

// Remove .text-reveal from typing-title because it conflicts with the typing animation script
indexHtml = indexHtml.replace(/class="typing-title text-reveal"/g, 'class="typing-title"');

fs.writeFileSync('index.html', indexHtml);
console.log('Removed text-reveal from typing-title to prevent conflicts.');
