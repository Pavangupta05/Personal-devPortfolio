import sys
import re

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. New GLTF Robot Setup
new_robot_setup = """
  // ── GLTF REALISTIC ROBOT ──────────────────────────────────────────────────
  window.robotMixer = null;
  window.robotModel = null;
  window.robotRay = null;
  
  if (typeof THREE.GLTFLoader !== 'undefined') {
    const loader = new THREE.GLTFLoader();
    const url = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/models/gltf/RobotExpressive/RobotExpressive.glb';
    loader.load(url, (gltf) => {
      const model = gltf.scene;
      
      // Responsive Robot Placement
      if (window.innerWidth < 768) {
        model.scale.set(2, 2, 2); // Smaller on mobile
        model.position.set(0, 320, 600); // Center on mobile
      } else {
        model.scale.set(3.5, 3.5, 3.5);
        model.position.set(20, 328, 620); // Right side on desktop
      }
      
      model.rotation.y = -Math.PI / 4; // Angle slightly towards camera
      
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
      
      let idleAnim = gltf.animations.find(a => a.name.toLowerCase() === 'idle');
      if (!idleAnim && gltf.animations.length > 0) idleAnim = gltf.animations[0];
      if (idleAnim) {
        window.robotMixer.clipAction(idleAnim).play();
      }
      
      // Add invisible raycast box around it
      const rayBox = new THREE.Mesh(new THREE.BoxGeometry(10, 15, 10), new THREE.MeshBasicMaterial({visible: false}));
      model.add(rayBox);
      window.robotRay = rayBox;
      
      // Store animations for click events
      window.robotAnims = gltf.animations;
      
      if (typeof resize === 'function') resize();
    });
  }
"""

target_setup = "  const controls = new THREE.OrbitControls(camera, renderer.domElement);"
if target_setup in content and "GLTF REALISTIC ROBOT" not in content:
    content = content.replace(target_setup, target_setup + "\n" + new_robot_setup)


# 2. New GLTF Render Loop
new_robot_render = """
      // ── GLTF REALISTIC ROBOT RENDER ──────────────────────────────────────────
      if (window.robotMixer) {
        const delta = dt || 0.016; 
        window.robotMixer.update(delta);
      }
      
      if (window.robotModel) {
        const rGroup = window.robotModel;
        rGroup.position.y = (window.innerWidth < 768 ? 320 : 328) + Math.sin(time / 500) * 1.5;
        
        const targetRotY = (typeof tMX !== 'undefined' ? -tMX : 0) * 0.8;
        rGroup.rotation.y += (targetRotY - rGroup.rotation.y) * 0.1;
        
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

target_render = "    controls.update();"
if target_render in content and "GLTF REALISTIC ROBOT RENDER" not in content:
    content = content.replace(target_render, target_render + "\n" + new_robot_render)


# 3. Click Listener for Robot
robot_click = """
  // Robot Click Interaction
  window.addEventListener('click', () => {
    if (typeof raycaster !== 'undefined' && window.robotRay) {
      const hits = raycaster.intersectObject(window.robotRay, true);
      if (hits.length > 0 && window.robotAnims && window.robotMixer) {
        if (window.AudioEngine && typeof window.AudioEngine.playHover === 'function') window.AudioEngine.playHover();
        
        const actions = ['Wave', 'Jump', 'ThumbsUp', 'Dance', 'Punch'];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        const animClip = window.robotAnims.find(a => a.name === randomAction);
        if (animClip) {
           const action = window.robotMixer.clipAction(animClip);
           action.reset();
           action.setLoop(THREE.LoopOnce, 1);
           action.clampWhenFinished = true;
           
           // Crossfade from current
           window.robotMixer.stopAllAction();
           action.play();
           
           // Return to idle after
           setTimeout(() => {
             const idleClip = window.robotAnims.find(a => a.name.toLowerCase() === 'idle');
             if (idleClip) {
                const idleAct = window.robotMixer.clipAction(idleClip);
                idleAct.reset();
                idleAct.crossFadeFrom(action, 0.5, true);
                idleAct.play();
             }
           }, animClip.duration * 1000);
        }
      }
    }
  });
"""

if "Robot Click Interaction" not in content:
    content += "\n" + robot_click

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('SUCCESS')
