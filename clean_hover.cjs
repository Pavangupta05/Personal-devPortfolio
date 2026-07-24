const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// Strip out any !important transforms on hover states for project-card and skill-card
css = css.replace(/transform:\s*[^;]*!important;/g, (match, offset, string) => {
  // Only remove if it's related to hover transform and not something else critical.
  // Actually, to be safe, just let's remove the transform from the aggressive override block
  return match.includes('translateY') || match.includes('scale') ? match.replace('!important', '') : match;
});

// Specifically target line 6955
css = css.replace('transform: translateY(-8px) scale(1.02) !important;', 'transform: translateY(-8px) scale(1.02);');
css = css.replace('transform: translateY(-6px) !important;', 'transform: translateY(-6px);');
css = css.replace('transform: none !important;', 'transform: none;');

// Add classes to ensure layout doesn't break
const dockCss = `
/* GSAP Dock Effect Layout Support */
.project-grid, .skills-container, .soft-skills-container, .project-card, .skill-card, .soft-skill-item {
  will-change: transform;
}
.project-grid, .skills-container, .soft-skills-container {
  overflow: visible !important;
  padding-top: 30px !important;
  padding-bottom: 30px !important;
}
`;

if (!css.includes('/* GSAP Dock Effect Layout Support */')) {
  css += '\n' + dockCss;
}

fs.writeFileSync('style.css', css);
console.log('Cleaned up hover transforms in style.css for GSAP compatibility.');
