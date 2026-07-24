const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

const minimalLoader = `
  <!-- ===== MINIMAL LOADING SCREEN ===== -->
  <div id="loader-overlay" style="background-color: #000; position: fixed; inset: 0; z-index: 99999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.6s ease;">
    <div class="loader-logo" style="font-size: 2.5rem; font-weight: 700; color: #fff; margin-bottom: 20px; letter-spacing: 2px;">PG</div>
    <div style="width: 180px; height: 2px; background: rgba(255,255,255,0.15); overflow: hidden; border-radius: 2px;">
      <div id="loaderBarFill" style="width: 0%; height: 100%; background: #fff; transition: width 0.1s linear;"></div>
    </div>
    <div id="loaderPercent" style="margin-top: 15px; font-family: 'Space Grotesk', monospace; font-size: 0.85rem; color: #aaa; letter-spacing: 1px;">0%</div>
  </div>
  <script>
  (function() {
    var overlay = document.getElementById('loader-overlay');
    var barFill = document.getElementById('loaderBarFill');
    var pctEl   = document.getElementById('loaderPercent');
    if (!overlay || !barFill || !pctEl) return;
    document.body.classList.add('loading');
    var pct = 0;
    var intv = setInterval(function() {
      pct += Math.floor(Math.random() * 12) + 4;
      if (pct >= 100) { pct = 100; clearInterval(intv); }
      barFill.style.width = pct + '%';
      pctEl.textContent = pct + '%';
      if (pct === 100) {
        setTimeout(function() {
          overlay.style.opacity = '0';
          setTimeout(function() {
            overlay.style.display = 'none';
            document.body.classList.remove('loading');
          }, 600);
        }, 400);
      }
    }, 45);
  })();
  </script>
`;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // 1. Remove Three.js scripts
  content = content.replace(/<!-- Three\.js & Post-Processing -->[\s\S]*?<!-- GSAP & Lenis -->/g, '<!-- GSAP & Lenis -->');
  
  // 2. Remove ambient glow blobs
  content = content.replace(/<!-- ===== AMBIENT GLOW BLOBS ===== -->[\s\S]*?<\/div>\s*<!-- ===== PREMIUM LOADING SCREEN ===== -->/g, '<!-- ===== PREMIUM LOADING SCREEN ===== -->');
  
  // 3. Replace the heavy loader overlay and script with the minimal one
  // We match from PREMIUM LOADING SCREEN up to the end of the inline loader script
  content = content.replace(/<!-- ===== PREMIUM LOADING SCREEN ===== -->[\s\S]*?<\/script>/g, minimalLoader.trim());
  
  fs.writeFileSync(f, content);
});

console.log('Cleaned up HTML files: removed 3D scripts and added minimal loader.');
