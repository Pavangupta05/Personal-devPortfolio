import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 3D Projects Gallery Setup
gallery_setup = """
    // ── 3D PROJECTS GALLERY ───────────────────────────────────────────────────
    const galleryGroup = new THREE.Group();
    galleryGroup.position.z = -1000; // Start deep in space
    scene.add(galleryGroup);
    window.galleryPanels = [];
    
    const projectCards = document.querySelectorAll('.project-card');
    const texLoader = new THREE.TextureLoader();
    
    projectCards.forEach((card, i) => {
      const imgEl = card.querySelector('img');
      if (!imgEl) return;
      
      const title = card.querySelector('h3') ? card.querySelector('h3').innerText : 'Project';
      const demoBtn = card.querySelector('.btn-primary');
      const codeBtn = card.querySelector('.btn-secondary');
      
      texLoader.load(imgEl.src, (texture) => {
        const width = 80;
        const height = 45;
        
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
        
        // Position them along a Z-axis tunnel
        panel.position.set(
          (i % 2 === 0 ? -50 : 50), // Alternate left and right
          Math.random() * 40 - 20,
          -i * 200 // Spaced out along Z
        );
        
        panel.rotation.y = (i % 2 === 0 ? 0.2 : -0.2);
        
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

    // Hide HTML project grid
    const projectGrid = document.querySelector('.project-grid');
    if (projectGrid) projectGrid.style.display = 'none';
    
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.style.minHeight = (projectCards.length * 100) + 'vh';
    }

    // GSAP ScrollTrigger to pull the gallery forward
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      gsap.to(galleryGroup.position, {
        z: (projectCards.length * 200) - 200, // Pull it past the camera
        ease: "none",
        scrollTrigger: {
          trigger: "#projects",
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      });
    }
"""

target_setup = "    window.robotRay = null;"

if target_setup in content and "3D PROJECTS GALLERY" not in content:
    content = content.replace(target_setup, gallery_setup + "\n" + target_setup)

# 2. Render Loop Raycasting
gallery_render = """
        // Gallery Raycasting
        if (typeof raycaster !== 'undefined' && window.galleryPanels && window.galleryPanels.length > 0) {
          const galleryHits = raycaster.intersectObjects(window.galleryPanels);
          if (galleryHits.length > 0) {
            document.body.style.cursor = 'pointer';
            const panel = galleryHits[0].object;
            
            window.galleryPanels.forEach(p => {
              if (p !== panel) p.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            });
            panel.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1);
            
            if (typeof tooltip !== 'undefined' && tooltip.classList.contains('hidden')) {
              if (window.AudioEngine && typeof window.AudioEngine.playHover === 'function') window.AudioEngine.playHover();
              tooltipTitle.innerText = "PROJECT FILE";
              tooltipSub.innerText = panel.userData.title;
              tooltip.classList.remove('hidden');
            }
          } else {
            window.galleryPanels.forEach(p => p.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1));
          }
        }
"""

target_render = "if (typeof gameActive !== 'undefined' && gameActive) {"

if target_render in content and "Gallery Raycasting" not in content:
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
