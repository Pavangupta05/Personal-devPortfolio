const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

css = css.replace('margin-top: 40px; /* Pushed the image slightly below */', 'margin-top: 85px; /* Pushed lower per request */');

fs.writeFileSync('style.css', css);
console.log('Updated margin-top on .profile-photo-wrap to 85px');
