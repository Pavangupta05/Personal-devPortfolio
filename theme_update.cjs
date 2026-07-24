const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Update Dark Mode (Default :root)
css = css.replace('--bg-primary-from: #000000;', '--bg-primary-from: #080808;');
css = css.replace('--bg-primary-to: #050510;', '--bg-primary-to: #111111;');
css = css.replace('--accent: #00E6FF; /* Starlight Cyan */', '--accent: #F59E0B; /* Amber Gold */');
css = css.replace('--accent-2: #FFB347; /* Solar Gold */', '--accent-2: #D97706; /* Deep Orange */');
css = css.replace('--accent-3: #8A2BE2; /* Nebula Purple */', '--accent-3: #FCD34D; /* Soft Gold */');

// Also update the hover shadow for cards in dark mode to match gold instead of cyan/purple
css = css.replace(
  'box-shadow: 0 12px 40px rgba(0, 230, 255, 0.15), 0 0 15px rgba(191, 90, 242, 0.1) !important; /* \nCyan & Purple glow */', 
  'box-shadow: 0 12px 40px rgba(245, 158, 11, 0.15), 0 0 15px rgba(217, 119, 6, 0.1) !important; /* Gold glow */'
);
// In case the newline parsing failed:
css = css.replace(/box-shadow: 0 12px 40px rgba\(0, 230, 255, 0\.15\), 0 0 15px rgba\(191, 90, 242, 0\.1\) !important;.*?/g, 'box-shadow: 0 12px 40px rgba(245, 158, 11, 0.15), 0 0 15px rgba(217, 119, 6, 0.1) !important; /* Gold glow */');

// 2. Update Light Mode Theme block
css = css.replace(
  /--bg-primary-from: #f0f2f5;\s*--bg-primary-to: #e5e7eb;\s*--text-primary: #111827;\s*--text-secondary: #4b5563;\s*--accent: #0284c7; \/\* Sky blue \*\/\s*--accent-2: #ea580c; \/\* Orange \*\/\s*--accent-3: #7c3aed; \/\* Purple \*\//,
  `--bg-primary-from: #fdfbf7;
  --bg-primary-to: #f4f1ea;
  --text-primary: #1f1a17;
  --text-secondary: #57534e;
  --accent: #d97706; /* Deep Amber */
  --accent-2: #ea580c; /* Warm Orange */
  --accent-3: #f59e0b; /* Gold */`
);

// 3. Ensure Light Mode cards have warmer glass
css = css.replace(
  /body\.light-mode \.project-card,[\s\S]*?body\.light-mode \.certificate-card \{[\s\S]*?background: rgba\(255, 255, 255, 0\.4\) !important;/g,
  `body.light-mode .project-card,
body.light-mode .skill-card,
body.light-mode .soft-skill-item,
body.light-mode .timeline-content,
body.light-mode .certificate-card {
  background: rgba(255, 253, 250, 0.5) !important;`
);

fs.writeFileSync('style.css', css);
console.log('Updated color palette to Midnight & Amber.');
