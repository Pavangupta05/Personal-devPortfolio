const fs = require('fs');

let html = fs.readFileSync('about.html', 'utf8');

// Fix image paths to be relative and use the correct existing images
html = html.replace('src="/ProfilePhoto.png"', 'src="pavan.jpg"');
html = html.replace('src="/Suit photo.png"', 'src="Suit photo.png"');

fs.writeFileSync('about.html', html);
console.log('Fixed broken image paths in about.html');
