const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// The original CSS string to replace
const originalCSS = `
.profile-photo-wrap {
  position: relative;
  width: 100%;
  max-width: 450px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  cursor: crosshair;
  aspect-ratio: 1 / 1.1; /* Optional: maintains a nice portrait ratio if images differ */
}
`;

// The new CSS string
const newCSS = `
.profile-photo-wrap {
  position: relative;
  width: 100%;
  max-width: 450px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: none; /* Removed the box shadow per user request */
  cursor: crosshair;
  aspect-ratio: 1 / 1.1;
  margin-top: 40px; /* Pushed the image slightly below */
}
`;

if (css.includes('box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);')) {
  css = css.replace(originalCSS.trim(), newCSS.trim());
  fs.writeFileSync('style.css', css);
  console.log('Successfully updated .profile-photo-wrap CSS.');
} else {
  console.log('Could not find exact CSS block to replace.');
}
