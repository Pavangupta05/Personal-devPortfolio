import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Append Audio, Boot, Warp
audio_js = """
// ── ELITE 3D FEATURES: AUDIO, BOOT, WARP ──────────────────────────────────
const AudioEngine = {
  ctx: null,
  humOsc: null,
  humGain: null,
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    this.humOsc = this.ctx.createOscillator();
    this.humOsc.type = 'sine';
    this.humOsc.frequency.setValueAtTime(45, this.ctx.currentTime);
    
    this.humGain = this.ctx.createGain();
    this.humGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.humGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 2);
    
    this.humOsc.connect(this.humGain);
    this.humGain.connect(this.ctx.destination);
    this.humOsc.start();
  },
  playHover() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }
};

document.body.addEventListener('click', () => AudioEngine.init(), { once: true });
document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => AudioEngine.playHover());
});

document.querySelectorAll('.nav-links a, #terminalNavBtn').forEach(el => {
  el.addEventListener('click', (e) => {
    if (el.getAttribute('href') && el.getAttribute('href').startsWith('#')) {
      document.body.classList.add('warping');
      setTimeout(() => document.body.classList.remove('warping'), 600);
    }
  });
});

const bootScreen = document.getElementById('boot-screen');
const bootProgress = document.querySelector('.boot-progress');
if (bootScreen && bootProgress) {
  setTimeout(() => { bootProgress.style.width = '100%'; }, 600);
  setTimeout(() => { bootScreen.classList.add('hidden'); }, 1800);
}
"""
if "AudioEngine" not in content:
    content += "\n" + audio_js

# 2. Raycaster Setup inside initThreeJS (After star field)
ray_setup = """
    // ── RAYCASTING ──────────────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouseRay = new THREE.Vector2(999, 999);
    const tooltip = document.getElementById('planet-tooltip');
    const tooltipTitle = document.querySelector('.tooltip-title');
    const tooltipSub = document.querySelector('.tooltip-sub');

    window.addEventListener('mousemove', (e) => {
      mouseRay.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRay.y = -(e.clientY / window.innerHeight) * 2 + 1;
      if (tooltip) {
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
      }
    }, { passive: true });
"""
target_setup = "    // ── LIGHTING ─────────────────────────────────────────────────────────────"
if "const raycaster = new THREE.Raycaster();" not in content:
    content = content.replace(target_setup, ray_setup + '\n' + target_setup)

# 3. Raycaster loop & Dust Parallax in render
ray_loop = """
      // ── SPACE DUST PARALLAX ─────────────────────────────────────────────────
      dustPoints.position.x += ((tMX * 80) - dustPoints.position.x) * 0.05;
      dustPoints.position.y += ((tMY * -80) - dustPoints.position.y) * 0.05;

      // ── RAYCASTING ──────────────────────────────────────────────────────────
      raycaster.setFromCamera(mouseRay, camera);
      const intersects = raycaster.intersectObjects(planetMeshesOrdered.map(p => p.mesh));
      if (intersects.length > 0 && sp < 0.7) {
        if (tooltip && tooltip.classList.contains('hidden')) {
          if (AudioEngine && typeof AudioEngine.playHover === 'function') AudioEngine.playHover();
          tooltip.classList.remove('hidden');
        }
        const hitMesh = intersects[0].object;
        const planetData = planetMeshesOrdered.find(p => p.mesh === hitMesh);
        if (planetData && tooltipTitle) {
          tooltipTitle.innerText = planetData.name.toUpperCase();
        }
      } else {
        if (tooltip && !tooltip.classList.contains('hidden')) {
          tooltip.classList.add('hidden');
        }
      }
"""
target_loop = "      dustPoints.rotation.x += 0.0003;"
if "raycaster.setFromCamera" not in content:
    content = content.replace(target_loop, target_loop + '\n' + ray_loop)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('SUCCESS')
