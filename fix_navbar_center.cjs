const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// Fix the transform overwrite!
css = css.replace('transform: translateZ(9999px) !important; /* Forces hardware acceleration and 3D top layer */', '');
css = css.replace('.desktop-navbar, .mobile-dynamic-nav, .mobile-hamburger-btn {', '.desktop-navbar { transform: translateX(-50%) translateZ(999px) !important; }\n.desktop-navbar, .mobile-dynamic-nav, .mobile-hamburger-btn {');

fs.writeFileSync('style.css', css);
console.log('Fixed navbar centering issue.');
