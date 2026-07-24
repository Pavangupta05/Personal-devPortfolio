const fs = require('fs');

// ========================================================
// 1. REWRITE PROJECTS.HTML
// ========================================================
let html = fs.readFileSync('projects.html', 'utf8');

const newProjectsContent = `
  <!-- Projects Section -->
  <section id="portfolio-grid" class="section portfolio-stack-section" style="padding-top: 120px; padding-bottom: 120px;">
    <h2 class="section-title">Featured Projects</h2>
    
    <div class="portfolio-stack-container">
      
      <!-- Project 1 -->
      <div class="project-card sticky-card">
        <div class="sticky-card-overlay"></div>
        <div class="card-inner">
          <div class="card-left">
            <h3>StarNote AI</h3>
            <p class="desc-line">AI-powered Smart Study Platform that transforms the way you learn.</p>
            <ul class="project-features">
              <li><i class="fa-solid fa-chevron-right"></i> Generates comprehensive summaries from uploaded materials</li>
              <li><i class="fa-solid fa-chevron-right"></i> Interactive quizzes to test your knowledge</li>
              <li><i class="fa-solid fa-chevron-right"></i> Automated flashcard creation for spaced repetition</li>
            </ul>
            <div class="badge-list outline-badges">
              <span class="badge"><i class="fa-brands fa-react"></i> React</span>
              <span class="badge"><i class="fa-brands fa-node-js"></i> Node.js</span>
              <span class="badge"><i class="fa-solid fa-brain"></i> Gemini API</span>
            </div>
            <div class="project-actions">
              <a href="https://starnote-ai.vercel.app" target="_blank" rel="noopener noreferrer" class="btn btn-outline"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Site</a>
              <a href="#" target="_blank" rel="noopener noreferrer" class="btn btn-outline"><i class="fa-brands fa-github"></i> GitHub</a>
            </div>
          </div>
          <div class="card-right">
            <div class="browser-mockup">
              <div class="browser-header">
                <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
              </div>
              <img src="/StarNote.png" alt="StarNote AI Preview" onerror="this.src='https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop'">
            </div>
          </div>
        </div>
      </div>

      <!-- Project 2 -->
      <div class="project-card sticky-card">
        <div class="sticky-card-overlay"></div>
        <div class="card-inner">
          <div class="card-left">
            <h3>TalkNow Chat</h3>
            <p class="desc-line">A high-performance Real-Time Chat Application featuring instant messaging.</p>
            <ul class="project-features">
              <li><i class="fa-solid fa-chevron-right"></i> WebSockets for zero-latency communication</li>
              <li><i class="fa-solid fa-chevron-right"></i> Online user presence tracking in real-time</li>
              <li><i class="fa-solid fa-chevron-right"></i> Dynamic group chats with role-based access</li>
            </ul>
            <div class="badge-list outline-badges">
              <span class="badge"><i class="fa-brands fa-react"></i> React</span>
              <span class="badge"><i class="fa-solid fa-bolt"></i> Socket.io</span>
              <span class="badge"><i class="fa-brands fa-node"></i> Express</span>
              <span class="badge"><i class="fa-solid fa-database"></i> MongoDB</span>
            </div>
            <div class="project-actions">
              <a href="https://chat-app-frontend-kappa-tan.vercel.app" target="_blank" rel="noopener noreferrer" class="btn btn-outline"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Site</a>
              <a href="#" target="_blank" rel="noopener noreferrer" class="btn btn-outline"><i class="fa-brands fa-github"></i> GitHub</a>
            </div>
          </div>
          <div class="card-right">
            <div class="browser-mockup">
              <div class="browser-header">
                <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
              </div>
              <img src="/TalkNow.png" alt="TalkNow Preview" onerror="this.src='https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop'">
            </div>
          </div>
        </div>
      </div>

      <!-- Project 3 -->
      <div class="project-card sticky-card">
        <div class="sticky-card-overlay"></div>
        <div class="card-inner">
          <div class="card-left">
            <h3>Smart Civic Eye</h3>
            <p class="desc-line">An AI-driven Civic Issue Reporting System that empowers citizens.</p>
            <ul class="project-features">
              <li><i class="fa-solid fa-chevron-right"></i> Automated AI categorization for fast routing</li>
              <li><i class="fa-solid fa-chevron-right"></i> Geolocation tracking for precise issue mapping</li>
              <li><i class="fa-solid fa-chevron-right"></i> Dashboard for municipal authorities to track resolution</li>
            </ul>
            <div class="badge-list outline-badges">
              <span class="badge"><i class="fa-brands fa-react"></i> MERN Stack</span>
              <span class="badge"><i class="fa-solid fa-brain"></i> AI Classification</span>
              <span class="badge"><i class="fa-solid fa-map-location-dot"></i> Geolocation</span>
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
              <img src="/CivicEye.png" alt="Smart Civic Eye Preview" onerror="this.src='https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop'">
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </section>
`;

html = html.replace(/<section id="portfolio-grid"[\s\S]*?<\/section>/, newProjectsContent);
fs.writeFileSync('projects.html', html);
console.log('Rewrote projects.html with sticky stack DOM layout.');

// ========================================================
// 2. ADD CSS TO STYLE.CSS
// ========================================================
let css = fs.readFileSync('style.css', 'utf8');

const stickyCss = `
/* ========================================================
   STICKY SCROLL-STACK EFFECT (PROJECTS)
   ======================================================== */
.portfolio-stack-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding-bottom: 200px; /* Space to scroll past the last card */
}

/* Card Structure */
.sticky-card {
  position: sticky !important;
  top: 120px !important;
  background: var(--bg-primary-to) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 24px !important;
  overflow: hidden !important;
  height: auto !important;
  min-height: auto !important;
  will-change: transform, opacity !important;
  /* z-index is applied via JS inline */
  box-shadow: 0 -15px 40px rgba(0,0,0,0.4) !important; /* Cast shadow on card behind it */
}
body.light-mode .sticky-card {
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(0,0,0,0.1) !important;
  box-shadow: 0 -15px 40px rgba(0,0,0,0.05) !important;
}

/* The dark dimming overlay used by GSAP */
.sticky-card-overlay {
  position: absolute;
  inset: 0;
  background: #000;
  opacity: 0;
  z-index: 5;
  pointer-events: none;
}
body.light-mode .sticky-card-overlay {
  background: rgba(240, 240, 245, 0.8);
}

.sticky-card .card-inner {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 40px;
  padding: 40px;
  position: relative;
  z-index: 10;
}

/* Left Column */
.sticky-card .card-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.sticky-card h3 {
  font-size: 2.2rem;
  margin-bottom: 15px;
  color: var(--text-primary);
}
.sticky-card .desc-line {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 25px;
  line-height: 1.5;
}
.project-features {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
}
.project-features li {
  margin-bottom: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.95rem;
}
.project-features li i {
  color: var(--accent);
  margin-top: 4px;
  font-size: 0.8rem;
}

/* Outlined Badges */
.outline-badges {
  margin-bottom: 35px !important;
}
.outline-badges .badge {
  background: transparent !important;
  border: 1px solid rgba(255,255,255,0.2) !important;
  color: var(--text-primary) !important;
}
body.light-mode .outline-badges .badge {
  border: 1px solid rgba(0,0,0,0.2) !important;
}

/* Outlined Buttons */
.project-actions {
  display: flex;
  gap: 15px;
}
.btn-outline {
  background: transparent !important;
  border: 1px solid rgba(255,255,255,0.3) !important;
  color: var(--text-primary) !important;
  padding: 10px 20px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
body.light-mode .btn-outline {
  border: 1px solid rgba(0,0,0,0.3) !important;
}
.btn-outline:hover {
  background: var(--text-primary) !important;
  color: var(--bg-primary-to) !important;
}
body.light-mode .btn-outline:hover {
  background: var(--text-primary) !important;
  color: #fff !important;
}

/* Right Column (Browser Mockup) */
.browser-mockup {
  background: rgba(10,10,15,0.8);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  height: 100%;
  display: flex;
  flex-direction: column;
}
body.light-mode .browser-mockup {
  background: rgba(240,240,245,1);
  border: 1px solid rgba(0,0,0,0.1);
}
.browser-header {
  padding: 10px 15px;
  background: rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  gap: 8px;
}
body.light-mode .browser-header {
  background: rgba(0,0,0,0.05);
  border-bottom: 1px solid rgba(0,0,0,0.1);
}
.browser-header .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.browser-header .red { background: #ff5f56; }
.browser-header .yellow { background: #ffbd2e; }
.browser-header .green { background: #27c93f; }
.browser-mockup img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Mobile Fallback */
@media (max-width: 900px) {
  .sticky-card .card-inner {
    grid-template-columns: 1fr;
    padding: 30px;
  }
  .browser-mockup {
    height: 250px;
  }
}
@media (max-width: 767px) {
  .portfolio-stack-container {
    gap: 30px;
    padding-bottom: 60px;
  }
  .sticky-card {
    position: relative !important;
    top: auto !important;
  }
}
`;

if (!css.includes('STICKY SCROLL-STACK EFFECT')) {
  css += '\n' + stickyCss;
  fs.writeFileSync('style.css', css);
  console.log('Appended Sticky Stack CSS to style.css');
}

// ========================================================
// 3. FIX GSAP DOCK CONFIG & ADD SCROLLTRIGGER
// ========================================================
let js = fs.readFileSync('script.js', 'utf8');

// A. Remove .project-grid from Dock config
const oldDockConfig = `    {
      containerSelector: '.project-grid',
      cardSelector: '.project-card',
      maxScale: 1.06, // subtle for projects
      maxY: -8,
      radius: 200 // px
    }`;
js = js.replace(oldDockConfig, ''); // Wipe it out completely

// B. Append Sticky Stack GSAP ScrollTrigger
const scrollTriggerJS = `
// ========================================================
// FEATURE: STICKY SCROLL-STACK REVEAL
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.matchMedia({
    // Desktop only
    "(min-width: 768px)": function() {
      const cards = gsap.utils.toArray('.sticky-card');
      if (!cards.length) return;

      cards.forEach((card, i) => {
        // Enforce DOM z-index so lower cards sit on top of earlier cards
        card.style.zIndex = i + 1;

        // Skip the very last card because there is no "next card" to cover it!
        if (i === cards.length - 1) return;

        // The overlay div inside the card used for dimming
        const overlay = card.querySelector('.sticky-card-overlay');

        // We want the current card to dim/scale exactly as the NEXT card slides over it.
        // The trigger is the current card hitting its sticky top (120px).
        // The scrub ends when the current card has scrolled up by an amount equal to its own height.
        gsap.to(card, {
          scale: 0.94,
          scrollTrigger: {
            trigger: card,
            start: "top top+=120",
            end: () => "+=" + card.offsetHeight, // The distance it takes for the next card to fully cover it
            scrub: true,
            invalidateOnRefresh: true // Re-calc height on resize
          }
        });

        if (overlay) {
          gsap.to(overlay, {
            opacity: 0.7,
            scrollTrigger: {
              trigger: card,
              start: "top top+=120",
              end: () => "+=" + card.offsetHeight,
              scrub: true,
              invalidateOnRefresh: true
            }
          });
        }
      });
    }
  });
});
`;

if (!js.includes('STICKY SCROLL-STACK REVEAL')) {
  js += '\n' + scrollTriggerJS;
  fs.writeFileSync('script.js', js);
  console.log('Appended Sticky Stack ScrollTrigger to script.js');
}

