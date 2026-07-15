import sys

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove Cyber-Core Logic from Setup
core_setup_str = """
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

# 2. Add Robot Setup
robot_setup_str = """
    // ── ASTRO-DRONE (Interactive Hero Robot) ──────────────────────────────────
    const robotGroup = new THREE.Group();
    
    // Materials
    const plasticMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1, clearcoat: 0.8 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x050510, roughness: 0.05, metalness: 0.9, clearcoat: 1.0 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00E6FF });
    
    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 10), plasticMat);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(9.5, 5, 10.5), glassMat);
    visor.position.set(0, 0, 0.2);
    head.add(visor);
    
    // Eyes
    const eyeL = new THREE.Mesh(new THREE.CapsuleGeometry(0.8, 1.5, 4, 8), eyeMat);
    eyeL.rotation.z = Math.PI / 2; eyeL.position.set(-2, 0, 5.2);
    const eyeR = eyeL.clone();
    eyeR.position.set(2, 0, 5.2);
    head.add(eyeL); head.add(eyeR);
    window.robotEyeL = eyeL; window.robotEyeR = eyeR; // expose for blinking
    
    // Antenna
    const antBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3), plasticMat);
    antBase.position.set(0, 5.5, -2);
    const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.8), new THREE.MeshBasicMaterial({color: 0xff3333}));
    antTip.position.set(0, 1.5, 0);
    antBase.add(antTip);
    head.add(antBase);
    
    // Body
    const body = new THREE.Mesh(new THREE.ConeGeometry(4, 6, 4), plasticMat);
    body.position.set(0, -8, 0);
    body.rotation.x = Math.PI; // point down
    
    // Hands
    const handL = new THREE.Mesh(new THREE.SphereGeometry(2), plasticMat);
    handL.position.set(-8, -6, 2);
    const handR = handL.clone();
    handR.position.set(8, -6, 2);
    
    robotGroup.add(head);
    robotGroup.add(body);
    robotGroup.add(handL);
    robotGroup.add(handR);
    
    // Position it in front of the initial camera (Hero Section)
    robotGroup.position.set(45, 340, 580); 
    scene.add(robotGroup);
    
    // Raycasting Support
    const robotRay = new THREE.Mesh(new THREE.BoxGeometry(20, 25, 15), new THREE.MeshBasicMaterial({visible: false}));
    robotGroup.add(robotRay);
    window.robotGroup = robotGroup;
"""

# 3. Remove Cyber-Core Render Loop
core_render_str = """
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
"""

# 4. Add Robot Render Loop
robot_render_str = """
      // ── ASTRO-DRONE ─────────────────────────────────────────────────────────
      if (typeof window.robotGroup !== 'undefined') {
        const rGroup = window.robotGroup;
        // Hover bobbing
        rGroup.position.y = 340 + Math.sin(time / 500) * 4;
        
        // Mouse Tracking
        const targetRotY = (typeof tMX !== 'undefined' ? -tMX : 0) * 0.8;
        const targetRotX = (typeof tMY !== 'undefined' ? tMY : 0) * 0.5;
        rGroup.rotation.y += (targetRotY - rGroup.rotation.y) * 0.1;
        rGroup.rotation.x += (targetRotX - rGroup.rotation.x) * 0.1;
        
        // Blinking
        if (Math.random() < 0.005 && window.robotEyeL) {
          window.robotEyeL.scale.y = 0.1;
          window.robotEyeR.scale.y = 0.1;
          setTimeout(() => {
            if(window.robotEyeL) { window.robotEyeL.scale.y = 1; window.robotEyeR.scale.y = 1; }
          }, 150);
        }
        
        // Raycasting
        if (typeof raycaster !== 'undefined') {
          const robotHits = raycaster.intersectObject(rGroup, true);
          if (robotHits.length > 0) {
            document.body.style.cursor = 'crosshair';
            if (typeof tooltip !== 'undefined' && tooltip.classList.contains('hidden')) {
              if (AudioEngine && typeof AudioEngine.playHover === 'function') AudioEngine.playHover();
              tooltipTitle.innerText = "ASTRO-DRONE";
              tooltipSub.innerText = "STANDBY";
              tooltip.classList.remove('hidden');
            }
          }
        }
      }
"""

content = content.replace(core_setup_str, robot_setup_str)
content = content.replace(core_render_str, robot_render_str)

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('SUCCESS')
