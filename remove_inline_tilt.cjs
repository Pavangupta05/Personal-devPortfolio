const fs = require('fs');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');

  // Strip the transform and transition assignments inside the tilt script
  content = content.replace(/card\.style\.transform\s*=\s*`perspective\(700px\)[^`]+`;/g, '');
  content = content.replace(/card\.style\.transform\s*=\s*'';/g, '');
  content = content.replace(/card\.style\.transition\s*=\s*'transform[^']+';/g, '');
  
  // Also remove the tilt calculation comments for clean code
  content = content.replace(/\/\/\s*3D tilt\s*const tiltX[^;]+;\s*const tiltY[^;]+;/g, '');
  content = content.replace(/\/\/\s*Magnetic drag\s*const magX[^;]+;\s*const magY[^;]+;/g, '');

  fs.writeFileSync(f, content);
});

console.log('Removed 3D tilt transform overrides from all HTML files.');
