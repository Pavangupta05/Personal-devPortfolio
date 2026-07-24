const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');
content = content.replace('<span id="typingText"></span>', '<span id="typingText" class="typing-text"></span>');
content = content.replace('<p class="home-subtitle">', '<p class="home-subtitle shine-animation">');
fs.writeFileSync('index.html', content);

let aboutContent = fs.readFileSync('about.html', 'utf8');
aboutContent = aboutContent.replace('<h2>About Me</h2>', '<h2 class="coming-soon-text" style="font-size: 3rem;">About Me</h2>');
fs.writeFileSync('about.html', aboutContent);

console.log('Applied animations!');
