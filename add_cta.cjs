const fs = require('fs');

// 1. Appending CSS
let css = fs.readFileSync('style.css', 'utf8');

const ctaCSS = `
/* ==========================================================
   PROJECT CTA SECTION
   ========================================================== */
.cta-section {
  position: relative;
  width: 100%;
  padding: 120px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: 
    radial-gradient(ellipse at center, rgba(30, 35, 50, 0.4) 0%, rgba(10, 12, 18, 0.95) 80%),
    url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.04"/></svg>'),
    linear-gradient(135deg, #111, #000);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 20px 100px rgba(0,0,0,0.8);
  overflow: hidden;
  z-index: 10;
}

body.light-mode .cta-section {
  background: 
    radial-gradient(ellipse at center, rgba(255, 255, 255, 0.9) 0%, rgba(240, 240, 245, 0.95) 80%),
    url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.03"/></svg>'),
    linear-gradient(135deg, #f0f0f0, #ffffff);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: inset 0 20px 100px rgba(0,0,0,0.05);
}

.cta-section::before {
  content: '';
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: radial-gradient(circle at 50% 50%, rgba(0, 150, 255, 0.08), transparent 40%);
  pointer-events: none;
  animation: rotateGlow 30s linear infinite;
}

@keyframes rotateGlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.cta-headline {
  font-size: clamp(2rem, 5vw, 4.5rem);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -1px;
  color: var(--text-primary);
  margin-bottom: 50px;
  text-transform: uppercase;
  z-index: 2;
  position: relative;
}

.cta-headline span.highlight {
  background: linear-gradient(90deg, #fff, #999);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 900;
}
body.light-mode .cta-headline span.highlight {
  background: linear-gradient(90deg, #111, #555);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cta-badge-container {
  position: relative;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  z-index: 2;
}

.cta-badge-text {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  animation: spinText 10s linear infinite;
}

.cta-badge-text svg {
  width: 100%;
  height: 100%;
}

.cta-badge-text text {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 4px;
  fill: #0088ff;
  text-transform: uppercase;
}

@keyframes spinText {
  100% { transform: rotate(360deg); }
}

.cta-badge-star {
  font-size: 2rem;
  color: var(--text-primary);
  filter: drop-shadow(0 0 10px rgba(255,255,255,0.4));
  z-index: 2;
}
body.light-mode .cta-badge-star {
  filter: drop-shadow(0 0 10px rgba(0,0,0,0.2));
}

.cta-btn {
  background: rgba(10, 12, 25, 0.8);
  border: 1px solid rgba(100, 150, 255, 0.4);
  color: #fff;
  padding: 14px 32px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 100, 255, 0.2);
}

.cta-btn:hover {
  background: rgba(20, 35, 60, 0.9);
  border-color: rgba(100, 150, 255, 0.8);
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 100, 255, 0.4);
  color: #fff;
}

body.light-mode .cta-btn {
  background: #111;
  color: #fff;
}

.cta-subtext {
  margin-top: 30px;
  color: var(--text-secondary);
  font-size: 1rem;
  max-width: 600px;
  line-height: 1.6;
  z-index: 2;
  position: relative;
}

.cta-subtext strong {
  color: var(--text-primary);
  display: block;
  font-size: 1.15rem;
  margin-bottom: 10px;
}
`;

if (!css.includes('PROJECT CTA SECTION')) {
  fs.appendFileSync('style.css', '\n' + ctaCSS);
  console.log('Appended CTA CSS.');
}

// 2. Injecting HTML into projects.html
let html = fs.readFileSync('projects.html', 'utf8');

const ctaHTML = `
  <section class="cta-section">
    <h2 class="cta-headline">FROM CONCEPT TO <span class="highlight">CREATION</span><br>LET'S MAKE IT <span class="highlight">HAPPEN!</span></h2>
    
    <div class="cta-badge-container">
      <div class="cta-badge-text">
        <svg viewBox="0 0 100 100">
          <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
          <text>
            <textPath href="#circlePath" startOffset="0">
              OPEN TO WORK • OPEN TO WORK • 
            </textPath>
          </text>
        </svg>
      </div>
      <i class="fa-solid fa-star cta-badge-star"></i>
    </div>

    <a href="contact.html" class="cta-btn magnetic-btn">
      Let's get in touch <i class="fa-solid fa-paper-plane"></i>
    </a>

    <div class="cta-subtext">
      <strong>I'm available for full-time roles & freelance projects.</strong>
      I thrive on crafting dynamic web applications, and<br>delivering seamless user experiences.
    </div>
  </section>
`;

if (!html.includes('cta-section')) {
  // Find </section> that closes the project-showcase.
  // The structure is usually <section class="project-showcase"> ... </section> followed by AI bot HTML
  const sectionCloseIndex = html.lastIndexOf('</section>');
  if (sectionCloseIndex !== -1) {
    html = html.substring(0, sectionCloseIndex + 10) + '\n' + ctaHTML + '\n' + html.substring(sectionCloseIndex + 10);
    fs.writeFileSync('projects.html', html);
    console.log('Injected CTA HTML.');
  } else {
    console.log('Could not find suitable injection point for HTML.');
  }
} else {
  console.log('CTA HTML already injected.');
}
