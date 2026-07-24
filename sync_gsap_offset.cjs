const fs = require('fs');

let js = fs.readFileSync('script.js', 'utf8');

// Update all hardcoded "top+=120" and "top+=130" GSAP triggers to match the new 160px CSS top offset!
js = js.replace(/top\+=120/g, 'top+=160');
js = js.replace(/top\+=130/g, 'top+=170'); // The entry animation triggers slightly later

fs.writeFileSync('script.js', js);
console.log('Synced GSAP triggers with new 160px top offset.');
