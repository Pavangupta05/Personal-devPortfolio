const fs = require('fs');

// ========================================================
// 1. FIX CSS GLOBAL OVERFLOW (The Sticky Killer)
// ========================================================
let css = fs.readFileSync('style.css', 'utf8');

// Replace overflow-x: hidden with clip on html and body to restore position: sticky
css = css.replace(/html\s*\{[^}]*overflow-x:\s*hidden;/g, match => match.replace('hidden', 'clip'));
css = css.replace(/body\s*\{[^}]*overflow-x:\s*hidden;/g, match => match.replace('hidden', 'clip'));

fs.writeFileSync('style.css', css);
console.log('Fixed CSS global overflow-x breaking position: sticky.');

// ========================================================
// 2. FIX IMAGES AND ADD PROJECT IN HTML
// ========================================================
let html = fs.readFileSync('projects.html', 'utf8');

// Encode spaces in image URLs to prevent broken image links
html = html.replace(/src="Screenshot 2025-08-29 162918.png"/g, 'src="Screenshot%202025-08-29%20162918.png"');
html = html.replace(/src="Screenshot 2025-08-29 162948.png"/g, 'src="Screenshot%202025-08-29%20162948.png"');
html = html.replace(/src="Screenshot 2025-08-29 163807.png"/g, 'src="Screenshot%202025-08-29%20163807.png"');

// Create a 4th project to append
const project4 = `
      <!-- Project 4 -->
      <div class="stack-project-card sticky-card">
        <div class="sticky-card-overlay"></div>
        <div class="card-inner">
          <div class="card-left">
            <h3>Advanced Portfolio UI</h3>
            <p class="desc-line">A cinematic, interactive portfolio featuring advanced GSAP scroll mechanics.</p>
            <ul class="project-features">
              <li><i class="fa-solid fa-chevron-right"></i> Custom 3D DOM stacking physics and parallax</li>
              <li><i class="fa-solid fa-chevron-right"></i> Dynamic theme injection with glassmorphism</li>
              <li><i class="fa-solid fa-chevron-right"></i> Fully responsive grid architectures</li>
            </ul>
            <div class="badge-list outline-badges">
              <span class="badge"><i class="fa-brands fa-js"></i> Vanilla JS</span>
              <span class="badge"><i class="fa-brands fa-css3-alt"></i> CSS3</span>
              <span class="badge"><i class="fa-solid fa-bolt"></i> GSAP ScrollTrigger</span>
            </div>
            <div class="project-actions">
              <a href="#" target="_blank" rel="noopener noreferrer" class="btn btn-outline"><i class="fa-brands fa-github"></i> Repository</a>
            </div>
          </div>
          <div class="card-right">
            <div class="browser-mockup">
              <div class="browser-header">
                <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
              </div>
              <img src="Screenshot%202025-10-05%20204623.png" alt="Portfolio Preview" onerror="this.src='https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=1000&auto=format&fit=crop'">
            </div>
          </div>
        </div>
      </div>
`;

// Insert it before the closing </div> of .portfolio-stack-container
if (!html.includes('Advanced Portfolio UI')) {
  html = html.replace(/(\s*)(<\/div>\s*<\/section>)/, (match, p1, p2) => {
    return p1 + project4 + p2;
  });
  fs.writeFileSync('projects.html', html);
  console.log('Added 4th project to HTML.');
} else {
  fs.writeFileSync('projects.html', html);
}
