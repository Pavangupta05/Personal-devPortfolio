import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. New GLTF Robot Setup
new_robot_setup = """
    // ── GLTF REALISTIC ROBOT ──────────────────────────────────────────────────
    window.robotMixer = null;
    window.robotModel = null;
    window.robotRay = null;
    
    const loader = new THREE.GLTFLoader();
    const url = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/models/gltf/RobotExpressive/RobotExpressive.glb';
    loader.load(url, (gltf) => {
      const model = gltf.scene;
      // Position the robot in the Hero section (same as old drone)
      model.position.set(45, 335, 590);
      model.scale.set(3, 3, 3);
      model.rotation.y = -Math.PI / 4; // Angle slightly towards camera
      
      // Make it cast/receive shadows, and adjust materials
      model.traverse(function (object) {
        if (object.isMesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
      
      scene.add(model);
      window.robotModel = model;
      
      // Animations
      window.robotMixer = new THREE.AnimationMixer(model);
      
      // Play 'Idle' animation or first animation
      let idleAnim = gltf.animations.find(a => a.name.toLowerCase() === 'idle');
      if (!idleAnim && gltf.animations.length > 0) idleAnim = gltf.animations[0];
      if (idleAnim) {
        window.robotMixer.clipAction(idleAnim).play();
      }
      
      // Add invisible raycast box around it
      const rayBox = new THREE.Mesh(new THREE.BoxGeometry(10, 15, 10), new THREE.MeshBasicMaterial({visible: false}));
      model.add(rayBox);
      window.robotRay = rayBox;
    });
"""

# Extract the exact block to replace using string slicing to avoid missing it due to spacing
start_marker = "    // ── ASTRO-DRONE (Interactive Hero Robot) ──────────────────────────────────"
end_marker = "    window.robotGroup = robotGroup;"

if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker) + len(end_marker)
    old_setup = content[start_idx:end_idx]
    content = content.replace(old_setup, new_robot_setup)

# 2. New GLTF Render Loop
new_robot_render = """
      // ── GLTF REALISTIC ROBOT ────────────────────────────────────────────────
      if (window.robotMixer) {
        // We need delta time for the mixer
        const delta = dt || 0.016; 
        window.robotMixer.update(delta);
      }
      
      if (window.robotModel) {
        const rGroup = window.robotModel;
        // Hover bobbing (if it doesn't already bob in the animation)
        rGroup.position.y = 335 + Math.sin(time / 500) * 1.5;
        
        // Mouse Tracking
        const targetRotY = (typeof tMX !== 'undefined' ? -tMX : 0) * 0.8;
        const targetRotX = (typeof tMY !== 'undefined' ? tMY : 0) * 0.2;
        rGroup.rotation.y += (targetRotY - rGroup.rotation.y) * 0.1;
        // Avoid aggressive X tilting for rigged characters
        
        // Raycasting
        if (typeof raycaster !== 'undefined' && window.robotRay) {
          const robotHits = raycaster.intersectObject(window.robotRay, true);
          if (robotHits.length > 0) {
            document.body.style.cursor = 'crosshair';
            if (typeof tooltip !== 'undefined' && tooltip.classList.contains('hidden')) {
              if (window.AudioEngine && typeof window.AudioEngine.playHover === 'function') window.AudioEngine.playHover();
              tooltipTitle.innerText = "ROBOT.EXPRESSIVE";
              tooltipSub.innerText = "ONLINE";
              tooltip.classList.remove('hidden');
            }
          }
        }
      }
"""

start_marker2 = "      // ── ASTRO-DRONE ─────────────────────────────────────────────────────────"
end_marker2 = "        // Raycasting"

if start_marker2 in content:
    start_idx2 = content.find(start_marker2)
    # find the end of the if block for Astro-Drone
    # It ends with three closing braces after Raycasting
    # Let's find "      // ── MINI GAME ───────────────────────────────────────────────────────────"
    end_marker_real = "      // ── MINI GAME ───────────────────────────────────────────────────────────"
    end_idx2 = content.find(end_marker_real)
    old_render = content[start_idx2:end_idx2]
    content = content.replace(old_render, new_robot_render + '\n')

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('SUCCESS')
