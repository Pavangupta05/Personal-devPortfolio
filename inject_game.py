import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

cyber_core_js = """
    // ── CYBER-CORE (Interactive Hero Object) ──────────────────────────────────
    const coreGroup = new THREE.Group();
    const coreMat = new THREE.MeshPhysicalMaterial({ color: 0x00E6FF, emissive: 0x004466, roughness: 0.1, metalness: 0.9, clearcoat: 1.0 });
    const innerCore = new THREE.Mesh(new THREE.IcosahedronGeometry(8, 0), coreMat);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x00E6FF, transparent: true, opacity: 0.4 });
    const outerWire = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(12, 1)), wireMat);
    
    coreGroup.add(innerCore);
    coreGroup.add(outerWire);
    
    // Position it in front of the initial camera (Hero Section)
    coreGroup.position.set(35, 335, 590); 
    scene.add(coreGroup);
    
    const cyberCoreRay = new THREE.Mesh(new THREE.SphereGeometry(15, 16, 16), new THREE.MeshBasicMaterial({visible: false}));
    coreGroup.add(cyberCoreRay);
"""

game_js = """
// ── ASTEROIDS MINI-GAME ───────────────────────────────────────────────────
const Konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;
let gameActive = false;
const GameState = {
  ship: null, lasers: [], asteroids: [], 
  keys: { ArrowUp: false, ArrowLeft: false, ArrowRight: false, Space: false },
  score: 0
};

window.addEventListener('keydown', (e) => {
  if (!gameActive) {
    if (e.key === Konami[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === Konami.length) { startMiniGame(); konamiIndex = 0; }
    } else { konamiIndex = 0; }
  } else {
    if (e.code === 'ArrowUp') GameState.keys.ArrowUp = true;
    if (e.code === 'ArrowLeft') GameState.keys.ArrowLeft = true;
    if (e.code === 'ArrowRight') GameState.keys.ArrowRight = true;
    if (e.code === 'Space') { e.preventDefault(); GameState.keys.Space = true; }
  }
});
window.addEventListener('keyup', (e) => {
  if (gameActive) {
    if (e.code === 'ArrowUp') GameState.keys.ArrowUp = false;
    if (e.code === 'ArrowLeft') GameState.keys.ArrowLeft = false;
    if (e.code === 'ArrowRight') GameState.keys.ArrowRight = false;
    if (e.code === 'Space') GameState.keys.Space = false;
  }
});

function startMiniGame() {
  gameActive = true;
  document.body.style.overflow = 'hidden';
  const ui = document.createElement('div');
  ui.id = 'game-ui';
  ui.innerHTML = '<h1 style="color:#ff3333; font-family:Space Grotesk; font-size:4rem; text-align:center; margin-top:20vh; animation: pulse 1s infinite">SYSTEM BREACH</h1><h2 id="game-score" style="color:#00E6FF; text-align:center; font-family:Space Grotesk">SCORE: 0</h2>';
  ui.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:99999; pointer-events:none; background:rgba(0,0,0,0.7); transition:opacity 1s;';
  document.body.appendChild(ui);
  setTimeout(() => { ui.querySelector('h1').style.display = 'none'; }, 2000);
  
  if(typeof AudioEngine !== 'undefined' && AudioEngine.ctx) AudioEngine.playHover();
  
  const shipGeo = new THREE.ConeGeometry(2, 6, 3);
  shipGeo.rotateX(Math.PI / 2);
  GameState.ship = new THREE.Mesh(shipGeo, new THREE.MeshBasicMaterial({ color: 0x00E6FF, wireframe: true }));
  GameState.ship.position.copy(camera.position);
  GameState.ship.position.z -= 50; 
  GameState.ship.position.y -= 10;
  scene.add(GameState.ship);
}

function updateMiniGame(time) {
  if (!gameActive || !GameState.ship) return;
  camera.position.x = GameState.ship.position.x;
  camera.position.z = GameState.ship.position.z + 60;
  camera.position.y = GameState.ship.position.y + 100;
  camera.lookAt(GameState.ship.position);
  
  if (GameState.keys.ArrowLeft) GameState.ship.rotation.y += 0.08;
  if (GameState.keys.ArrowRight) GameState.ship.rotation.y -= 0.08;
  if (GameState.keys.ArrowUp) {
    GameState.ship.position.x -= Math.sin(GameState.ship.rotation.y) * 1.5;
    GameState.ship.position.z -= Math.cos(GameState.ship.rotation.y) * 1.5;
  }
  
  if (GameState.keys.Space && Math.random() > 0.5) {
    const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4), new THREE.MeshBasicMaterial({color: 0xFFB347}));
    laser.rotation.copy(GameState.ship.rotation);
    laser.rotation.x = Math.PI / 2;
    laser.position.copy(GameState.ship.position);
    laser.userData = { vx: -Math.sin(GameState.ship.rotation.y) * 4, vz: -Math.cos(GameState.ship.rotation.y) * 4, life: 100 };
    scene.add(laser); GameState.lasers.push(laser); GameState.keys.Space = false; 
  }
  
  if (Math.random() < 0.02) {
    const ast = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.random()*4+2, 0), new THREE.MeshStandardMaterial({color: 0x555555, roughness: 0.8}));
    const angle = Math.random() * Math.PI * 2;
    ast.position.set(GameState.ship.position.x + Math.sin(angle)*150, GameState.ship.position.y, GameState.ship.position.z + Math.cos(angle)*150);
    ast.userData = { vx: -Math.sin(angle)*0.5, vz: -Math.cos(angle)*0.5 };
    scene.add(ast); GameState.asteroids.push(ast);
  }
  
  for (let i = GameState.lasers.length - 1; i >= 0; i--) {
    let l = GameState.lasers[i]; l.position.x += l.userData.vx; l.position.z += l.userData.vz; l.userData.life--;
    if (l.userData.life <= 0) { scene.remove(l); GameState.lasers.splice(i, 1); }
  }
  
  for (let i = GameState.asteroids.length - 1; i >= 0; i--) {
    let a = GameState.asteroids[i]; a.position.x += a.userData.vx; a.position.z += a.userData.vz; a.rotation.x += 0.01; a.rotation.y += 0.01;
    for (let j = GameState.lasers.length - 1; j >= 0; j--) {
      let l = GameState.lasers[j];
      if (a.position.distanceTo(l.position) < 5) {
        scene.remove(a); scene.remove(l); GameState.asteroids.splice(i, 1); GameState.lasers.splice(j, 1);
        GameState.score += 100; document.getElementById('game-score').innerText = 'SCORE: ' + GameState.score; break;
      }
    }
    if (a && GameState.ship && a.position.distanceTo(GameState.ship.position) < 5) {
      document.getElementById('game-score').innerHTML = 'GAME OVER<br>SCORE: ' + GameState.score;
      scene.remove(GameState.ship); GameState.ship = null;
    }
  }
}
"""

render_js = """
      // ── CYBER CORE ──────────────────────────────────────────────────────────
      if (typeof coreGroup !== 'undefined') {
        coreGroup.rotation.y += 0.005;
        coreGroup.rotation.x += 0.002;
        coreGroup.rotation.z = (typeof tMX !== 'undefined' ? tMX : 0) * Math.PI * 0.1;
        
        if (typeof raycaster !== 'undefined') {
          const coreIntersects = raycaster.intersectObject(coreGroup, true);
          if (coreIntersects.length > 0) {
            coreGroup.children[0].material.emissiveIntensity = 2.0;
            if (typeof tooltip !== 'undefined' && tooltip.classList.contains('hidden')) {
              tooltipTitle.innerText = "CYBER-CORE";
              tooltipSub.innerText = "ONLINE";
              tooltip.classList.remove('hidden');
            }
          } else {
            coreGroup.children[0].material.emissiveIntensity = 0.5;
          }
        }
      }

      // ── MINI GAME ───────────────────────────────────────────────────────────
      if (typeof gameActive !== 'undefined' && gameActive) {
        updateMiniGame(time);
        return; // Skip normal camera updates if game is active
      }
"""

if 'CYBER-CORE' not in content:
    target1 = '    // ── LIGHTING ─────────────────────────────────────────────────────────────'
    content = content.replace(target1, target1 + '\n' + cyber_core_js)
    
    content += '\n' + game_js
    
    target2 = '      window.lastSp = sp;'
    content = content.replace(target2, target2 + '\n' + render_js)
    
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS')
else:
    print('ALREADY INSTALLED')
