import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 3D Projects Gallery Setup (Orbiting Sun)
gallery_setup = """
    // ── 3D PROJECTS GALLERY ───────────────────────────────────────────────────
    const galleryGroup = new THREE.Group();
    scene.add(galleryGroup);
    window.galleryPanels = [];
    window.galleryGroup = galleryGroup;
    
    const projectCards = document.querySelectorAll('.project-card');
    const texLoader = new THREE.TextureLoader();
    
    const totalProjects = projectCards.length;
    const radius = 300; // Orbit radius around the sun
    
    projectCards.forEach((card, i) => {
      const imgEl = card.querySelector('img');
      if (!imgEl) return;
      
      const title = card.querySelector('h3') ? card.querySelector('h3').innerText : 'Project';
      const demoBtn = card.querySelector('.btn-primary');
      const codeBtn = card.querySelector('.btn-secondary');
      
      texLoader.load(imgEl.src, (texture) => {
        const width = 60;
        const height = 60 / (16/9);
        
        const geo = new THREE.PlaneGeometry(width, height);
        const mat = new THREE.MeshPhysicalMaterial({
          map: texture,
          transparent: true,
          roughness: 0.1,
          metalness: 0.8,
          clearcoat: 1.0,
          side: THREE.DoubleSide
        });
        const panel = new THREE.Mesh(geo, mat);
        
        const angle = (i / totalProjects) * Math.PI * 2;
        panel.position.set(
          Math.cos(angle) * radius,
          (i % 2 === 0 ? 30 : -30), // slight height variation
          Math.sin(angle) * radius
        );
        
        panel.lookAt(0, panel.position.y, 0); // Look at center
        
        panel.userData = { 
          isProject: true, 
          title: title, 
          demoUrl: demoBtn ? demoBtn.href : '', 
          codeUrl: codeBtn ? codeBtn.href : '' 
        };
        
        galleryGroup.add(panel);
        window.galleryPanels.push(panel);
      });
    });

    const projectGrid = document.querySelector('.project-grid');
    if (projectGrid) projectGrid.style.display = 'grid'; // Ensure grid is visible
"""

target_setup = "    window.robotRay = null;"

if target_setup in content and "3D PROJECTS GALLERY" not in content:
    content = content.replace(target_setup, gallery_setup + "\n" + target_setup)


# 2. Render Loop Raycasting
gallery_render = """
        // Gallery Animation and Raycasting
        if (typeof window.galleryGroup !== 'undefined') {
           window.galleryGroup.rotation.y += 0.001; // Slowly orbit the sun
        }
        
        if (typeof raycaster !== 'undefined' && window.galleryPanels && window.galleryPanels.length > 0) {
          const galleryHits = raycaster.intersectObjects(window.galleryPanels);
          if (galleryHits.length > 0) {
            document.body.style.cursor = 'pointer';
            const panel = galleryHits[0].object;
            
            // Hover Scale Effect
            window.galleryPanels.forEach(p => {
              if (p !== panel) p.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            });
            panel.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
            
            if (typeof tooltip !== 'undefined' && tooltip.classList.contains('hidden')) {
              if (window.AudioEngine && typeof window.AudioEngine.playHover === 'function') window.AudioEngine.playHover();
              tooltipTitle.innerText = "PROJECT DATA";
              tooltipSub.innerText = panel.userData.title;
              tooltip.classList.remove('hidden');
            }
          } else {
            window.galleryPanels.forEach(p => p.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1));
          }
        }
"""

target_render = "if (typeof gameActive !== 'undefined' && gameActive) {"

if target_render in content and "Gallery Animation and Raycasting" not in content:
    content = content.replace(target_render, gallery_render + "\n        " + target_render)


# 3. Click Listener for Gallery
gallery_click = """
  // Gallery Click Interaction
  window.addEventListener('click', () => {
    if (typeof raycaster !== 'undefined' && window.galleryPanels && window.galleryPanels.length > 0) {
      const hits = raycaster.intersectObjects(window.galleryPanels);
      if (hits.length > 0) {
        const panel = hits[0].object;
        if (panel.userData.demoUrl) {
           window.open(panel.userData.demoUrl, '_blank');
        } else if (panel.userData.codeUrl) {
           window.open(panel.userData.codeUrl, '_blank');
        }
      }
    }
  });
"""

target_click = "  // Robot Click Interaction"
if target_click in content and "Gallery Click Interaction" not in content:
    content = content.replace(target_click, gallery_click + "\n" + target_click)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('SUCCESS')
