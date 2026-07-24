const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// Add timeline-content and certificate-card to the light mode glass cards
css = css.replace(
  'body.light-mode .project-card,\nbody.light-mode .skill-card,\nbody.light-mode .soft-skill-item {', 
  'body.light-mode .project-card,\nbody.light-mode .skill-card,\nbody.light-mode .soft-skill-item,\nbody.light-mode .timeline-content,\nbody.light-mode .certificate-card {'
);

fs.writeFileSync('style.css', css);
console.log('Fixed journey and certificate cards in light mode.');
