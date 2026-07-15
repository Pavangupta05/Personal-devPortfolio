import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the setup logic to make them orbit the sun and restore 2D grid
new_gallery_setup = """
    // ── 3D PROJECTS GALLERY ───────────────────────────────────────────────────
    const galleryGroup = new THREE.Group();
    // Center it on the sun (0,0,0)
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
        
        // Position them in a circle around the sun
        const angle = (i / totalProjects) * Math.PI * 2;
        panel.position.set(
          Math.cos(angle) * radius,
          (i % 2 === 0 ? 30 : -30), // slight height variation
          Math.sin(angle) * radius
        );
        
        // Make them look outward or inward
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

    // Make sure the 2D grid is visible so mobile/accessibility still works!
    const projectGrid = document.querySelector('.project-grid');
    if (projectGrid) projectGrid.style.display = 'grid'; // restore grid
"""

start_marker = "    // ── 3D PROJECTS GALLERY ───────────────────────────────────────────────────"
end_marker = "    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {"
if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    # find end of scroll trigger block
    end_idx = content.find("      });\n    }", content.find(end_marker)) + 14
    old_setup = content[start_idx:end_idx]
    content = content.replace(old_setup, new_gallery_setup)

# 2. Update render loop to rotate the gallery
new_gallery_render = """
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

start_render_marker = "        // Gallery Raycasting"
end_render_marker = "        }"

if start_render_marker in content:
    start_r_idx = content.find(start_render_marker)
    # The block ends after the else block
    end_r_idx = content.find("        }", content.find("} else {")) + 9
    old_render = content[start_r_idx:end_r_idx]
    content = content.replace(old_render, new_gallery_render)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('SUCCESS')
