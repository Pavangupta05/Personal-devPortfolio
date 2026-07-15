import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Robot Setup (Position, Lighting, Animations Map)
new_robot_setup = """
    // ── GLTF REALISTIC ROBOT ──────────────────────────────────────────────────
    window.robotMixer = null;
    window.robotModel = null;
    window.robotRay = null;
    window.robotActions = {};
    window.robotActiveAction = null;
    window.robotIsBusy = false;
    
    const loader = new THREE.GLTFLoader();
    const url = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/models/gltf/RobotExpressive/RobotExpressive.glb';
    loader.load(url, (gltf) => {
      const model = gltf.scene;
      
      // Position: Closer, slightly lower on the right to look incredibly cinematic
      model.position.set(20, 328, 620);
      model.scale.set(3.5, 3.5, 3.5);
      model.rotation.y = -Math.PI / 6; 
      
      // Cinematic Rim Lighting just for the robot
      const robotLight = new THREE.PointLight(0x00E6FF, 2, 50);
      robotLight.position.set(5, 10, 5);
      model.add(robotLight);
      
      const rimLight = new THREE.SpotLight(0xFFB347, 5, 50, Math.PI/4, 0.5, 2);
      rimLight.position.set(-10, 10, -10);
      rimLight.target = model;
      model.add(rimLight);
      
      model.traverse(function (object) {
        if (object.isMesh) {
          object.castShadow = true;
          object.receiveShadow = true;
          if (object.material) {
            object.material.envMapIntensity = 2.0; // Boost reflections
          }
        }
      });
      
      scene.add(model);
      window.robotModel = model;
      
      // Animations Setup
      window.robotMixer = new THREE.AnimationMixer(model);
      
      gltf.animations.forEach((clip) => {
        const action = window.robotMixer.clipAction(clip);
        window.robotActions[clip.name] = action;
        // Make non-idle animations play once
        if (clip.name !== 'Idle' && clip.name !== 'Walking' && clip.name !== 'Running') {
          action.clampWhenFinished = true;
          action.loop = THREE.LoopOnce;
        }
      });
      
      // Start Idle
      if (window.robotActions['Idle']) {
        window.robotActiveAction = window.robotActions['Idle'];
        window.robotActiveAction.play();
      }
      
      // Event listener when animation finishes to return to idle
      window.robotMixer.addEventListener('finished', (e) => {
        if (window.robotActiveAction !== window.robotActions['Idle']) {
          fadeToAction('Idle', 0.5);
          window.robotIsBusy = false;
        }
      });
      
      // Add invisible raycast box around it
      const rayBox = new THREE.Mesh(new THREE.BoxGeometry(6, 12, 6), new THREE.MeshBasicMaterial({visible: false}));
      rayBox.position.set(0, 4, 0);
      model.add(rayBox);
      window.robotRay = rayBox;
    });
    
    window.fadeToAction = function(name, duration) {
      const prevAction = window.robotActiveAction;
      const activeAction = window.robotActions[name];
      if (prevAction !== activeAction && activeAction) {
        prevAction.fadeOut(duration);
        activeAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(duration).play();
        window.robotActiveAction = activeAction;
      }
    };
"""

# Extract the old block
start_marker = "    // ── GLTF REALISTIC ROBOT ──────────────────────────────────────────────────"
end_marker = "window.robotRay = rayBox;\n    });"

if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker) + len(end_marker)
    old_setup = content[start_idx:end_idx]
    content = content.replace(old_setup, new_robot_setup)

# 2. Update Render Loop (Click Interaction)
new_robot_render = """
      // ── GLTF REALISTIC ROBOT ────────────────────────────────────────────────
      if (window.robotMixer) {
        const delta = dt || 0.016; 
        window.robotMixer.update(delta);
      }
      
      if (window.robotModel) {
        const rGroup = window.robotModel;
        // Hover bobbing (if idle)
        if (!window.robotIsBusy) {
           rGroup.position.y = 328 + Math.sin(time / 500) * 0.5;
           
           // Mouse Tracking (Only while idle)
           const targetRotY = (-Math.PI / 6) + (typeof tMX !== 'undefined' ? -tMX : 0) * 0.5;
           rGroup.rotation.y += (targetRotY - rGroup.rotation.y) * 0.1;
        }
        
        // Raycasting
        if (typeof raycaster !== 'undefined' && window.robotRay) {
          const robotHits = raycaster.intersectObject(window.robotRay, true);
          if (robotHits.length > 0) {
            document.body.style.cursor = 'pointer';
            if (typeof tooltip !== 'undefined' && tooltip.classList.contains('hidden')) {
              if (window.AudioEngine && typeof window.AudioEngine.playHover === 'function') window.AudioEngine.playHover();
              tooltipTitle.innerText = "ROBOT.EXPRESSIVE";
              tooltipSub.innerText = "CLICK ME!";
              tooltip.classList.remove('hidden');
            }
          }
        }
      }
"""

start_marker2 = "      // ── GLTF REALISTIC ROBOT ────────────────────────────────────────────────"
end_marker2 = "        // Raycasting"

if start_marker2 in content:
    start_idx2 = content.find(start_marker2)
    end_marker_real = "      // ── MINI GAME ───────────────────────────────────────────────────────────"
    end_idx2 = content.find(end_marker_real)
    old_render = content[start_idx2:end_idx2]
    content = content.replace(old_render, new_robot_render + '\n')


# 3. Add Click Event Listener for Robot Interactions
click_listener = """
  // Robot Click Interaction
  window.addEventListener('click', () => {
    if (typeof raycaster !== 'undefined' && window.robotRay && !window.robotIsBusy) {
      const hits = raycaster.intersectObject(window.robotRay, true);
      if (hits.length > 0) {
        window.robotIsBusy = true;
        const actions = ['Wave', 'Jump', 'ThumbsUp', 'Dance', 'Punch'];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        if (typeof window.fadeToAction === 'function') {
           window.fadeToAction(randomAction, 0.2);
           if (window.AudioEngine && typeof window.AudioEngine.playHover === 'function') window.AudioEngine.playHover();
        }
      }
    }
  });
"""

if 'Robot Click Interaction' not in content:
    target_click = "document.body.addEventListener('click', () => window.AudioEngine.init(), { once: true });"
    content = content.replace(target_click, target_click + '\n' + click_listener)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('SUCCESS')
