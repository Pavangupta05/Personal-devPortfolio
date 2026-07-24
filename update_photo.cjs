const fs = require('fs');

let html = fs.readFileSync('about.html', 'utf8');

// Replace pavan.jpg with "Suit photo.png"
html = html.replace('src="/pavan.jpg"', 'src="/Suit photo.png"');

fs.writeFileSync('about.html', html);
console.log('Updated about.html to use Suit photo.png');
