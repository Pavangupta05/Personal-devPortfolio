const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Remove .left-social-sidebar from the glass card group
css = css.replace('.skill-card, .project-card, .desktop-navbar .nav-glass-container, .left-social-sidebar, \n.certificate-card', '.skill-card, .project-card, .desktop-navbar .nav-glass-container, .certificate-card');
css = css.replace('.skill-card, .project-card, .desktop-navbar .nav-glass-container, .left-social-sidebar, .certificate-card', '.skill-card, .project-card, .desktop-navbar .nav-glass-container, .certificate-card');

// 2. Add .skill-tooltip CSS
const tooltipCss = `
/* Missing Skill Tooltip Styling */
.skill-tooltip {
  position: fixed;
  pointer-events: none;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  padding: 12px 18px;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.9rem;
  z-index: 100000;
  opacity: 0;
  transform: translate(15px, 15px); /* Offset from cursor */
  transition: opacity 0.2s ease;
  box-shadow: var(--shadow-md);
}
.skill-tooltip.visible {
  opacity: 1;
}
.skill-tooltip-header {
  font-weight: 700;
  margin-bottom: 5px;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 5px;
}
.skill-tooltip-detail {
  font-size: 0.8rem;
  color: var(--text-secondary);
}
`;

if (!css.includes('/* Missing Skill Tooltip Styling */')) {
  css += '\n' + tooltipCss;
}

// 3. Add soft-skill-item to light mode glass styling
css = css.replace('body.light-mode .project-card,\nbody.light-mode .skill-card {', 'body.light-mode .project-card,\nbody.light-mode .skill-card,\nbody.light-mode .soft-skill-item {');

fs.writeFileSync('style.css', css);
console.log('Fixed left sidebar, skill tooltip, and soft skill cards.');
