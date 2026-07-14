
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("dark-mode");
  document.body.style.overflow = "auto";


  // ── LIVE IST CLOCK ──────────────────────────────────────────────────────────
  function updateJaipurTime() {
    const el = document.getElementById('jaipur-time');
    if (!el) return;
    el.textContent = `IST ${new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true
    })}`;
  }
  updateJaipurTime();
  setInterval(updateJaipurTime, 1000);

  // ── CUSTOM CURSOR ───────────────────────────────────────────────────────────
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  if (cursor && cursorFollower) {
    let cursorX = window.innerWidth / 2, cursorY = window.innerHeight / 2;
    let followerX = cursorX, followerY = cursorY;
    
    // Hide custom cursor on mobile/touch devices since they don't use cursors
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouch && window.innerWidth <= 768) {
       cursor.style.display = 'none';
       cursorFollower.style.display = 'none';
    }
    
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursor.style.transform = `translate(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%))`;
    }, { passive: true });

    function followLoop() {
      followerX += (cursorX - followerX) * 0.15;
      followerY += (cursorY - followerY) * 0.15;
      cursorFollower.style.transform = `translate(calc(${followerX}px - 50%), calc(${followerY}px - 50%))`;
      requestAnimationFrame(followLoop);
    }
    followLoop();
    
    const hoverElements = document.querySelectorAll('a, button, .skill-card, .project-card, .blog-card, .dock-item, .nav-contact-btn');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        cursorFollower.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorFollower.classList.remove('active');
      });
    });
  }

  // ── FORM VALIDATION ─────────────────────────────────────────────────────────
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const fields = {
      name:    { el: document.getElementById("nameInput"),    err: document.getElementById("nameError"),    min: 2,  msg: "Name must be at least 2 characters" },
      email:   { el: document.getElementById("emailInput"),   err: document.getElementById("emailError"),   re: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: "Please enter a valid email" },
      message: { el: document.getElementById("messageInput"), err: document.getElementById("messageError"), min: 10, msg: "Message must be at least 10 characters" }
    };
    function validate(key) {
      const f = fields[key];
      if (!f.el) return true;
      const v = f.el.value.trim();
      const ok = f.re ? f.re.test(v) : v.length >= f.min;
      
      if (f.err) {
        f.err.textContent = ok ? '' : f.msg;
        f.err.style.color = ok ? '#30D158' : '#FF375F'; // green if ok, else red
      }
      f.el.classList.toggle('error', !ok);
      if (ok && v.length > 0) {
        f.el.style.borderColor = '#30D158'; // success green
        f.el.style.boxShadow = '0 0 8px rgba(48,209,88,0.3)';
      } else {
        f.el.style.borderColor = ''; // reset or error
        f.el.style.boxShadow = '';
      }
      return ok;
    }
    Object.keys(fields).forEach(k => {
      if (fields[k].el) {
        fields[k].el.addEventListener('blur', () => validate(k));
        fields[k].el.addEventListener('input', () => validate(k)); // Real-time validation
      }
    });
    contactForm.addEventListener('submit', e => {
      const valid = Object.keys(fields).map(validate).every(Boolean);
      if (!valid) e.preventDefault();
    });
  }

  // ── ADAPTIVE FOOTER YEAR ────────────────────────────────────────────────────
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ── REALISTIC 3D SOLAR SYSTEM BACKGROUND ─────────────────────────────────
  (function initSolarSystem() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || !window.THREE) return;

    const isMobile = window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 6000);

    // ── NEBULA BACKGROUND ────────────────────────────────────────────────────
    function makeProceduralTexture(w, h, drawFn) {
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const ctx = c.getContext('2d'); drawFn(ctx, w, h);
      return new THREE.CanvasTexture(c);
    }

    const nebulaTex = makeProceduralTexture(512, 256, (ctx, w, h) => {
      ctx.fillStyle = '#000008'; ctx.fillRect(0, 0, w, h);
      const clouds = [
        {x:0.2,y:0.3,r:120,c:'rgba(30,10,60,0.55)'},{x:0.7,y:0.6,r:150,c:'rgba(10,20,60,0.5)'},
        {x:0.5,y:0.2,r:100,c:'rgba(60,10,30,0.35)'},{x:0.85,y:0.3,r:90,c:'rgba(10,40,60,0.45)'},
        {x:0.1,y:0.7,r:110,c:'rgba(20,10,50,0.4)'}
      ];
      clouds.forEach(cl => {
        const g = ctx.createRadialGradient(cl.x*w, cl.y*h, 0, cl.x*w, cl.y*h, cl.r);
        g.addColorStop(0, cl.c); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      });
    });
    const skyGeo = new THREE.SphereGeometry(4000, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({ map: nebulaTex, side: THREE.BackSide });
    scene.add(new THREE.Mesh(skyGeo, skyMat));

    // ── STAR FIELD ───────────────────────────────────────────────────────────
    const starCount = isMobile ? 2000 : 5000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starColors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 600 + Math.random() * 2000;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      starPos[i*3]   = r * Math.sin(ph) * Math.cos(th);
      starPos[i*3+1] = r * Math.sin(ph) * Math.sin(th);
      starPos[i*3+2] = r * Math.cos(ph);
      starSizes[i] = Math.random() * 1.8 + 0.4;
      const c = Math.random();
      if      (c < 0.3)  { starColors[i*3]=1;   starColors[i*3+1]=1;   starColors[i*3+2]=1;   }
      else if (c < 0.55) { starColors[i*3]=0.75; starColors[i*3+1]=0.85;starColors[i*3+2]=1;   }
      else if (c < 0.75) { starColors[i*3]=1;    starColors[i*3+1]=0.97;starColors[i*3+2]=0.75;}
      else               { starColors[i*3]=1;    starColors[i*3+1]=0.7; starColors[i*3+2]=0.7; }
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color',    new THREE.BufferAttribute(starColors, 3));
    starGeo.setAttribute('size',     new THREE.BufferAttribute(starSizes, 1));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 1.2, vertexColors: true, transparent: true, opacity: 0.95, sizeAttenuation: true })));

    // ── LIGHTING ─────────────────────────────────────────────────────────────



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
      
      // Position robot near camera's starting position so it's visible in hero section
      // Camera starts at (0, 80, 580) looking at (0,0,0)
      // Robot should appear to the right side of hero, between camera and sun
      if (window.innerWidth < 768) {
        model.scale.set(2.5, 2.5, 2.5);
        model.position.set(0, 60, 400); // Center screen on mobile, slightly lower
      } else {
        model.scale.set(3.5, 3.5, 3.5);
        model.position.set(25, 65, 430); // Closer to center so it is immediately visible
      }
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
      if (typeof resize === 'function') resize(); // Trigger initial responsive placement
      
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



    scene.add(new THREE.PointLight(0xFFF5E4, isMobile ? 3 : 4.5, 2000, 1.1));
    scene.add(new THREE.AmbientLight(0x090918, 0.3));

    // ── SUN ──────────────────────────────────────────────────────────────────
    const sunTex = makeProceduralTexture(512, 512, (ctx, w, h) => {
      const cx = w/2, cy = h/2, r = w/2;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,   '#ffffff'); g.addColorStop(0.05, '#fffde0');
      g.addColorStop(0.2, '#ffe060'); g.addColorStop(0.5,  '#ff8800');
      g.addColorStop(0.8, '#ff3800'); g.addColorStop(1.0,  '#7a1200');
      ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
      for (let i = 0; i < 800; i++) {
        const rx = cx+(Math.random()-0.5)*w*0.9, ry = cy+(Math.random()-0.5)*h*0.9;
        if (Math.hypot(rx-cx, ry-cy) > r*0.9) continue;
        const gs = Math.random()*10+2;
        const gd = ctx.createRadialGradient(rx,ry,0,rx,ry,gs);
        gd.addColorStop(0,'rgba(255,255,150,0.22)'); gd.addColorStop(1,'rgba(255,100,0,0)');
        ctx.fillStyle = gd; ctx.beginPath(); ctx.arc(rx,ry,gs,0,Math.PI*2); ctx.fill();
      }
    });
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(22, isMobile ? 24 : 48, isMobile ? 24 : 48),
      new THREE.MeshStandardMaterial({ map: sunTex, emissive: new THREE.Color(0xff5500), emissiveIntensity: 2.2, emissiveMap: sunTex, roughness: 1 })
    );
    scene.add(sun);

    // Multi-layer corona glow
    function makeGlow(color1, color2, alpha1) {
      return makeProceduralTexture(256, 256, (ctx, w, h) => {
        const g = ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);
        g.addColorStop(0, color1); g.addColorStop(0.3, color2); g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
      });
    }
    [[`rgba(255,230,80,${0.95})`, 'rgba(255,100,0,0.3)', 85],
     [`rgba(255,160,40,${0.5})`, 'rgba(255,60,0,0.08)', 140],
     [`rgba(200,80,20,${0.25})`, 'rgba(150,30,0,0.0)', 220]
    ].forEach(([c1,c2,scale]) => {
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlow(c1,c2), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
      spr.scale.setScalar(scale);
      scene.add(spr);
    });

    // ── PLANET DEFINITIONS ────────────────────────────────────────────────────
    const PLANET_DEFS = [
      { name:'Mercury', radius:5.0,  dist:40,  speed:0.047, tilt:0.03,
        glowColor:'rgba(180,160,130,0.4)', glowSize:30,
        drawFn:(ctx,w,h)=>{
          const g=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);
          g.addColorStop(0,'#d8c8b8');g.addColorStop(0.6,'#9a8878');g.addColorStop(1,'#4a3830');
          ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
          for(let i=0;i<200;i++){const x=Math.random()*w,y=Math.random()*h,r=Math.random()*3+0.5;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=`rgba(50,40,30,${Math.random()*0.35})`;ctx.fill();}
      }},
      { name:'Venus',   radius:11.0,  dist:65,  speed:0.035, tilt:0.05,
        glowColor:'rgba(240,210,100,0.45)', glowSize:70,
        drawFn:(ctx,w,h)=>{
          const g=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);
          g.addColorStop(0,'#f8eec0');g.addColorStop(0.4,'#eac878');g.addColorStop(0.8,'#c89040');g.addColorStop(1,'#9a6820');
          ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
          for(let i=0;i<20;i++){const y=Math.random()*h;ctx.fillStyle=`rgba(248,232,160,${Math.random()*0.2})`;ctx.fillRect(0,y,w,Math.random()*14+4);}
      }},
      { name:'Earth',   radius:11.5,  dist:92,  speed:0.029, tilt:0.41,
        glowColor:'rgba(60,120,255,0.4)', glowSize:75,
        drawFn:(ctx,w,h)=>{
          ctx.fillStyle='#1a70b0';ctx.fillRect(0,0,w,h);
          [[0.48,0.28,0.13,0.19,'#3a9040'],[0.32,0.44,0.09,0.15,'#4aaa48'],
           [0.66,0.48,0.11,0.13,'#5a9038'],[0.18,0.33,0.07,0.10,'#6aaa48'],
           [0.78,0.62,0.08,0.10,'#d0c060'],[0.50,0.74,0.05,0.07,'#d8d090']
          ].forEach(([x,y,rx,ry,c])=>{ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x*w,y*h,rx*w,ry*h,Math.random()*3,0,Math.PI*2);ctx.fill();});
          for(let i=0;i<35;i++){const x=Math.random()*w,y=Math.random()*h;const cg=ctx.createRadialGradient(x,y,0,x,y,Math.random()*28+8);cg.addColorStop(0,'rgba(255,255,255,0.65)');cg.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=cg;ctx.fillRect(x-35,y-18,70,36);}
          ctx.fillStyle='rgba(255,255,255,0.88)';ctx.beginPath();ctx.ellipse(w/2,4,w*0.42,13,0,0,Math.PI*2);ctx.fill();
          ctx.beginPath();ctx.ellipse(w/2,h-4,w*0.30,11,0,0,Math.PI*2);ctx.fill();
      }},
      { name:'Mars',    radius:8.5,  dist:128, speed:0.024, tilt:0.44,
        glowColor:'rgba(220,80,30,0.38)', glowSize:53,
        drawFn:(ctx,w,h)=>{
          const g=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);
          g.addColorStop(0,'#f06835');g.addColorStop(0.5,'#c84820');g.addColorStop(1,'#8a2800');
          ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
          ctx.strokeStyle='rgba(110,35,5,0.7)';ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(w*0.18,h*0.44);ctx.lineTo(w*0.77,h*0.56);ctx.stroke();
          for(let i=0;i<70;i++){ctx.fillStyle=`rgba(210,130,65,${Math.random()*0.22})`;ctx.beginPath();ctx.arc(Math.random()*w,Math.random()*h,Math.random()*13+2,0,Math.PI*2);ctx.fill();}
          ctx.fillStyle='rgba(255,242,232,0.92)';ctx.beginPath();ctx.ellipse(w/2,3,w*0.20,9,0,0,Math.PI*2);ctx.fill();
      }},
      { name:'Jupiter', radius:28,   dist:175, speed:0.013, tilt:0.05,
        glowColor:'rgba(200,160,100,0.3)', glowSize:175,
        drawFn:(ctx,w,h)=>{
          ctx.fillStyle='#c8a870';ctx.fillRect(0,0,w,h);
          [{y:0.08,ht:0.06,c:'#ead098',a:0.95},{y:0.16,ht:0.05,c:'#905a38',a:0.88},
           {y:0.23,ht:0.08,c:'#d8aa72',a:0.90},{y:0.33,ht:0.06,c:'#a86840',a:0.95},
           {y:0.41,ht:0.09,c:'#e8c890',a:0.95},{y:0.52,ht:0.05,c:'#906038',a:0.90},
           {y:0.59,ht:0.08,c:'#caa060',a:0.90},{y:0.69,ht:0.06,c:'#804830',a:0.85},
           {y:0.77,ht:0.09,c:'#dab068',a:0.90},{y:0.88,ht:0.07,c:'#a87048',a:0.90}
          ].forEach(b=>{ctx.globalAlpha=b.a;ctx.fillStyle=b.c;ctx.fillRect(0,b.y*h,w,b.ht*h);});
          ctx.globalAlpha=1;
          const rx=w*0.60,ry=h*0.58;
          const gs=ctx.createRadialGradient(rx,ry,0,rx,ry,w*0.12);
          gs.addColorStop(0,'rgba(190,60,25,0.98)');gs.addColorStop(0.55,'rgba(165,48,18,0.75)');gs.addColorStop(1,'rgba(140,38,10,0)');
          ctx.fillStyle=gs;ctx.beginPath();ctx.ellipse(rx,ry,w*0.12,h*0.08,0,0,Math.PI*2);ctx.fill();
      }},
      { name:'Saturn',  radius:24.2,   dist:230, speed:0.0096,tilt:0.47,
        glowColor:'rgba(220,190,120,0.32)', glowSize:242,
        drawFn:(ctx,w,h)=>{
          ctx.fillStyle='#d8b878';ctx.fillRect(0,0,w,h);
          [{y:0.10,ht:0.05,c:'#ead090',a:0.88},{y:0.17,ht:0.04,c:'#c09050',a:0.82},
           {y:0.23,ht:0.08,c:'#e0ca8a',a:0.92},{y:0.33,ht:0.05,c:'#a87838',a:0.85},
           {y:0.40,ht:0.09,c:'#ead09a',a:0.92},{y:0.51,ht:0.06,c:'#c0a058',a:0.88},
           {y:0.59,ht:0.08,c:'#dcc888',a:0.90},{y:0.69,ht:0.05,c:'#987048',a:0.82}
          ].forEach(b=>{ctx.globalAlpha=b.a;ctx.fillStyle=b.c;ctx.fillRect(0,b.y*h,w,b.ht*h);});
          ctx.globalAlpha=1;
      }},
      { name:'Uranus',  radius:16.5,  dist:290, speed:0.0068,tilt:1.71,
        glowColor:'rgba(100,220,220,0.32)', glowSize:105.6,
        drawFn:(ctx,w,h)=>{
          const g=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);
          g.addColorStop(0,'#d0f8f8');g.addColorStop(0.4,'#78e0e0');g.addColorStop(1,'#38a8c8');
          ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
          for(let i=0;i<8;i++){ctx.fillStyle=`rgba(200,248,248,${0.12+i*0.02})`;ctx.fillRect(0,i*h/8,w,h/10);}
      }},
      { name:'Neptune', radius:15.4,  dist:360, speed:0.0054,tilt:0.49,
        glowColor:'rgba(40,80,255,0.38)', glowSize:96.8,
        drawFn:(ctx,w,h)=>{
          const g=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);
          g.addColorStop(0,'#5898f8');g.addColorStop(0.4,'#3068e0');g.addColorStop(1,'#0e1eb0');
          ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
          ctx.fillStyle='rgba(8,18,110,0.65)';ctx.beginPath();ctx.ellipse(w*0.38,h*0.43,w*0.13,h*0.085,0.28,0,Math.PI*2);ctx.fill();
          ctx.strokeStyle='rgba(180,215,255,0.45)';ctx.lineWidth=2;
          for(let i=0;i<9;i++){ctx.beginPath();ctx.moveTo(0,h*(0.08+i*0.1));ctx.lineTo(w,h*(0.10+i*0.1));ctx.stroke();}
      }},
    ];

    const planets = [];
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    // Calculate start angle for each planet so it perfectly intercepts the spiral camera
    const startAngles = PLANET_DEFS.map(def => {
      // Find the scroll progress (sp) at which the camera radius equals the planet distance
      // We stop the camera at radius 50 (safely outside the sun)
      const dist = Math.max(def.dist, 50.1); 
      const eased = (480 - dist) / (480 - 50);
      const sp = eased < 0.5 ? Math.sqrt(eased / 2) : 1 - Math.sqrt(2 * (1 - eased)) / 2;
      const angle = sp * Math.PI * 2.5; // Camera does 1.25 full rotations (2.5 PI)
      return angle - Math.PI / 2; // Offset so it aligns with the camera's vector
    });

    PLANET_DEFS.forEach((def, idx) => {
      // Orbit ring (subtle)
      const pts = [];
      for (let a = 0; a <= Math.PI*2; a += 0.05)
        pts.push(new THREE.Vector3(Math.cos(a)*def.dist, 0, Math.sin(a)*def.dist));
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const orbitMat = new THREE.LineBasicMaterial({ color: 0x2244668, transparent: true, opacity: 0.18 });
      orbitGroup.add(new THREE.Line(orbitGeo, orbitMat));

      // Planet mesh
      const pTex = makeProceduralTexture(isMobile ? 128 : 256, isMobile ? 128 : 256, def.drawFn);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(def.radius, isMobile ? 20 : 36, isMobile ? 20 : 36),
        new THREE.MeshStandardMaterial({ map: pTex, roughness: 0.75, metalness: 0.04 })
      );
      mesh.rotation.z = def.tilt;

      // Atmospheric glow sprite
      const glowTex = makeProceduralTexture(128, 128, (ctx, w, h) => {
        const g = ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);
        g.addColorStop(0, def.glowColor); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
      });
      const glowSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
      glowSpr.scale.setScalar(def.glowSize * 2.2);
      mesh.add(glowSpr);

      const pivot = new THREE.Object3D();
      pivot.rotation.y = startAngles[idx];
      pivot.add(mesh);
      mesh.position.set(def.dist, 0, 0);
      orbitGroup.add(pivot);

      // Saturn rings
      if (def.name === 'Saturn') {
        const ringTex = makeProceduralTexture(512, 32, (ctx, w, h) => {
          const g = ctx.createLinearGradient(0,0,w,0);
          g.addColorStop(0,   'rgba(210,180,110,0)');
          g.addColorStop(0.08,'rgba(200,168,100,0.7)');
          g.addColorStop(0.2, 'rgba(228,200,140,1.0)');
          g.addColorStop(0.4, 'rgba(195,162,95,0.85)');
          g.addColorStop(0.55,'rgba(220,192,132,1.0)');
          g.addColorStop(0.7, 'rgba(200,175,108,0.75)');
          g.addColorStop(0.88,'rgba(205,178,112,0.5)');
          g.addColorStop(1,   'rgba(205,178,112,0)');
          ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
          // Ring gaps
          ctx.globalAlpha=0.5; ctx.fillStyle='rgba(0,0,0,0.6)';
          ctx.fillRect(w*0.44,0,w*0.02,h); ctx.globalAlpha=1;
        });
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(def.radius*1.4, def.radius*2.6, 80),
          new THREE.MeshBasicMaterial({ map: ringTex, side: THREE.DoubleSide, transparent: true, opacity: 0.9, depthWrite: false })
        );
        ring.rotation.x = Math.PI * 0.43;
        mesh.add(ring);
      }

      // Earth moon
      if (def.name === 'Earth') {
        const moonTex = makeProceduralTexture(64, 64, (ctx,w,h)=>{
          ctx.fillStyle='#c0b8b0';ctx.fillRect(0,0,w,h);
          for(let i=0;i<40;i++){ctx.fillStyle=`rgba(70,60,50,${Math.random()*0.45})`;ctx.beginPath();ctx.arc(Math.random()*w,Math.random()*h,Math.random()*4+0.5,0,Math.PI*2);ctx.fill();}
        });
        const moon = new THREE.Mesh(
          new THREE.SphereGeometry(1.3, 12, 12),
          new THREE.MeshStandardMaterial({ map: moonTex, roughness: 0.95 })
        );
        const moonPivot = new THREE.Object3D();
        moonPivot.add(moon); moon.position.set(8.5, 0, 0);
        mesh.add(moonPivot);
        planets.push({ pivot: moonPivot, speed: 0.12, mesh: moon, isMoon: true });
      }

      planets.push({ pivot, speed: def.speed, mesh, name: def.name, dist: def.dist });
    });

    // Asteroid belt (Mars-Jupiter)
    if (!isMobile) {
      const abGeo = new THREE.BufferGeometry();
      const abPos = new Float32Array(800 * 3);
      for (let i = 0; i < 800; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 148 + Math.random() * 20;
        abPos[i*3]   = Math.cos(a) * r;
        abPos[i*3+1] = (Math.random() - 0.5) * 3;
        abPos[i*3+2] = Math.sin(a) * r;
      }
      abGeo.setAttribute('position', new THREE.BufferAttribute(abPos, 3));
      orbitGroup.add(new THREE.Points(abGeo, new THREE.PointsMaterial({ size: 0.55, color: 0x887766, transparent: true, opacity: 0.6 })));
    }

    // ── MOUSE PARALLAX & RAYCASTING ───────────────────────────────────────────
    let mouseX = 0, mouseY = 0, tMX = 0, tMY = 0;
    const heroRaycaster = new THREE.Raycaster();
    const heroMouse = new THREE.Vector2();

    window.addEventListener('mousemove', e => {
      tMX = (e.clientX / window.innerWidth  - 0.5) * 2;
      tMY = (e.clientY / window.innerHeight - 0.5) * 2;
      heroMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      heroMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    window.addEventListener('pointerdown', e => {
      heroMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      heroMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      heroRaycaster.setFromCamera(heroMouse, camera);
      
      if (window.robotRay && !window.robotIsBusy) {
        const hits = heroRaycaster.intersectObject(window.robotRay, true);
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

    const lerp = (a, b, t) => a + (b - a) * t;

    // ── PLANET APPROACH MAP ───────────────────────────────────────────────────
    // Camera starts at z=580 looking at sun (z=0). As it flies toward the sun,
    // it crosses each planet's orbit radius — that planet zooms toward viewer.
    // Planets (Z+ axis, facing camera): Neptune(360) → Saturn(230) → Jupiter(175)
    // → Mars(128) → Earth(92) → Venus(65) → Mercury(40) → Sun approach.
    // At each crossing, the planet orbit briefly slows so it stays in frame.
    const planetMeshesOrdered = planets.filter(p => !p.isMoon);  // [Mercury..Neptune]
    const orbitDists = PLANET_DEFS.map(d => d.dist); // [40,65,92,128,175,230,290,360]

    // ── ANIMATE ──────────────────────────────────────────────────────────────
    let lastT = 0, solId = null;
    const FPS = isMobile ? 1000/30 : 1000/60;

    // Smoothed camera Z (lerped each frame for cinematic feel)
    let cx = 0, cy = 80, cz = 580;
    let lx = 0, ly = 0, lz = 0; // smoothed look-at target

    function render(time) {
      solId = requestAnimationFrame(render);
      if (time - lastT < FPS) return;
      const dt = Math.min((time - lastT) / 1000, 0.05);
      lastT = time;

      // Scroll progress — direct read, no lag
      const maxS = document.documentElement.scrollHeight - window.innerHeight || 1;
      const sp   = Math.min(Math.max(window.scrollY / maxS, 0), 1);

      // Mouse
      mouseX += (tMX - mouseX) * 0.07;
      mouseY += (tMY - mouseY) * 0.07;

      // ── CAMERA: Spiral towards the sun ──────────────────────────────────────
      // Sun stays centered at (0,0,0) — camera looks at it the whole time.
      const eased = sp < 0.5 ? 2*sp*sp : -1+(4-2*sp)*sp; // smooth ease
      
      const radius = lerp(480, 50, eased); // Stop at 50, safely outside the Sun (radius 22)
      const angle = sp * Math.PI * 2.5; // spiral 1.25 full rotations as we fly in
      
      const tCX = Math.sin(angle) * radius;
      const tCZ = Math.cos(angle) * radius;
      const tCY = lerp(80,   8, eased); // dip down to orbit level

      if (typeof window.lastSp !== 'undefined' && Math.abs(sp - window.lastSp) > 0.05) {
        cx = tCX; cy = tCY; cz = tCZ;
      }
      window.lastSp = sp;



      // ── GLTF REALISTIC ROBOT ────────────────────────────────────────────────
      if (window.robotMixer) {
        const delta = dt || 0.016; 
        window.robotMixer.update(delta);
      }
      
      if (window.robotModel) {
        const rGroup = window.robotModel;
        
        // Gentle hover bob (no crazy vertical floating)
        const baseY = window.innerWidth < 768 ? 60 : 65;
        rGroup.position.y = baseY + Math.sin(time / 500) * 0.8;
        
        // Smoothly scale down and move backwards into space as you scroll
        const baseScale = window.innerWidth < 768 ? 2.5 : 3.5;
        const currentScale = Math.max(0, baseScale - (sp * baseScale * 3)); // Shrinks to 0 at 33% scroll
        rGroup.scale.setScalar(currentScale);
        
        const baseZ = window.innerWidth < 768 ? 400 : 430;
        rGroup.position.z = baseZ - (sp * 500); // Floats away into the sun
        
        // Mouse Tracking
        const targetRotY = (-Math.PI / 6) + tMX * -0.5; 
        rGroup.rotation.y += (targetRotY - rGroup.rotation.y) * 0.1;
        
        rGroup.visible = currentScale > 0.01;
        // Raycasting for hover tooltip
        if (window.robotRay) {
          heroRaycaster.setFromCamera(heroMouse, camera);
          const robotHits = heroRaycaster.intersectObject(window.robotRay, true);
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

      // ── MINI GAME ───────────────────────────────────────────────────────────
      
      // Gallery Animation and Raycasting
      if (typeof window.galleryGroup !== 'undefined') {
         window.galleryGroup.rotation.y += 0.001; // Slowly orbit the sun
      }
      
      if (typeof window.raycaster !== 'undefined' && window.galleryPanels && window.galleryPanels.length > 0) {
        const galleryHits = window.raycaster.intersectObjects(window.galleryPanels);
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

        if (typeof gameActive !== 'undefined' && gameActive) {
        updateMiniGame(time);
        return; // Skip normal camera updates if game is active
      }


      const lf = isMobile ? 0.09 : 0.072;
      cx += (tCX - cx) * lf;
      cy += (tCY - cy) * lf;
      cz += (tCZ - cz) * lf;

      // ── CAMERA PAN ──────────────────────────────────────────────────────────
      // At the footer (sp > 0.85), turn the camera smoothly away from the Sun
      // looking tangentially into deep space so the Sun completely exits the screen.
      const panAmount = Math.max(0, (sp - 0.85) / 0.15); // 0 to 1
      const easePan = panAmount * panAmount * (3 - 2 * panAmount); // smoothstep
      
      // Tangent to orbit: if pos is (sin, cos), tangent is (cos, -sin)
      const tangentX = cx + Math.cos(angle) * 1500;
      const tangentZ = cz - Math.sin(angle) * 1500;
      
      const targetLX = lerp(0, tangentX, easePan);
      const targetLY = lerp(0, cy, easePan);
      const targetLZ = lerp(0, tangentZ, easePan);
      
      lx += (targetLX - lx) * lf;
      ly += (targetLY - ly) * lf;
      lz += (targetLZ - lz) * lf;

      // Mouse parallax — tilt slightly
      const px = isMobile ? 2 : 8;
      camera.position.set(cx + mouseX * px, cy - mouseY * px * 0.3, cz);
      camera.lookAt(lx, ly, lz);

      // Orbit ring stays flat
      orbitGroup.rotation.x = 0.06;

      // ── PLANETS: orbit + slow down as camera approaches each one ─────────
      planetMeshesOrdered.forEach((p, i) => {
        const dist = orbitDists[i];
        // How close is the camera Z to this planet's orbit distance?
        const approach = Math.max(0, 1 - Math.abs(cz - dist) / (dist * 0.7));
        // Slow orbit when camera is near — planet lingers in frame
        const speedMult = lerp(1.0, 0.05, approach * approach);
        p.pivot.rotation.y += p.speed * dt * speedMult;
        p.mesh.rotation.y   += p.speed * 2.5 * dt;
      });

      // Moon orbits at normal speed
      planets.filter(p => p.isMoon).forEach(p => {
        p.pivot.rotation.y += p.speed * dt;
      });

      // Sun rotates very slowly, planets keep medium speed
      sun.rotation.y += 0.0006 * dt * 60;
      renderer.render(scene, camera);
    }


    render(0);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(solId); else render(0);
    });
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }, { passive: true });
  })();



  // Contact form async submit
  const successModal = document.getElementById("contact-success");
  if (contactForm && successModal) {
    contactForm.addEventListener("submit", async e => {
      if (e.defaultPrevented) return;
      e.preventDefault();
      const btn    = contactForm.querySelector("button");
      const btnTxt = btn && btn.querySelector(".btn-text");
      const spin   = btn && btn.querySelector(".spinner");
      if (btnTxt) btnTxt.style.display = "none";
      if (spin)   spin.style.display   = "block";
      if (btn)    btn.disabled = true;
      try {
        const res = await fetch(contactForm.action, {
          method: "POST", body: new FormData(contactForm),
          headers: { Accept: "application/json" }
        });
        if (res.ok) { successModal.classList.add("active"); contactForm.reset(); }
        else alert("Oops! There was a problem sending your message.");
      } catch { alert("Oops! A network error occurred."); }
      finally {
        if (btnTxt) btnTxt.style.display = "block";
        if (spin)   spin.style.display   = "none";
        if (btn)    btn.disabled = false;
      }
    });
  }


  // ── SCROLL REVEAL (single init) ─────────────────────────────────────────────
  if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
      origin: 'bottom', distance: '40px', duration: 700,
      delay: 80, easing: 'cubic-bezier(0.25,1,0.5,1)', reset: false
    });
    sr.reveal('.section-title',    { origin: 'left', distance: '30px' });
    sr.reveal('.about-img',        { origin: 'left', distance: '50px' });
    sr.reveal('.about-text',       { origin: 'right', distance: '50px' });
    sr.reveal('.project-card',     { interval: 120 });
    sr.reveal('.skill-card',       { interval: 80, scale: 0.9 });
    sr.reveal('.certificate-card', { interval: 120 });
    sr.reveal('.hobby-card',       { interval: 80 });
    sr.reveal('.timeline-item',    { interval: 100, origin: 'left', distance: '30px' });
    sr.reveal('.blog-card',        { interval: 120 });
    sr.reveal('.soft-skill-item',  { interval: 80 });
    sr.reveal('.contact-form, .recruiter-card', { delay: 100 });
  }

  // ── INPUT FOCUS ──────────────────────────────────────────────────────────────
  document.querySelectorAll(".contact-form input, .contact-form textarea").forEach(el => {
    el.addEventListener("focus", () => el.classList.add("focused"),    { passive: true });
    el.addEventListener("blur",  () => el.classList.remove("focused"), { passive: true });
  });

  // ── TYPEWRITER ───────────────────────────────────────────────────────────────
  const typingTarget = document.getElementById("typingText");
  if (typingTarget) {
    const phrases = [" Pavan Kumar Gupta", "MERN Stack Developer"];
    let pi = 0, ci = 0, deleting = false;
    function typeLoop() {
      const phrase = phrases[pi];
      typingTarget.textContent = deleting ? phrase.slice(0, ci - 1) : phrase.slice(0, ci + 1);
      deleting ? ci-- : ci++;
      if (!deleting && ci === phrase.length) { deleting = true; return setTimeout(typeLoop, 900); }
      if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; return setTimeout(typeLoop, 500); }
      setTimeout(typeLoop, deleting ? 45 : 70);
    }
    (function waitForLoader() {
      document.body.classList.contains('loading') ? setTimeout(waitForLoader, 200) : setTimeout(typeLoop, 400);
    })();
  }

  // ── DESKTOP NAVBAR SLIDER ───────────────────────────────────────────────────
  const desktopNav   = document.querySelector('.nav-links-pill');
  const navSlider    = document.getElementById('navSlider');
  const navPillLinks = desktopNav ? [...desktopNav.querySelectorAll('a')] : [];

  function updateSlider(link) {
    if (!link || !navSlider || !desktopNav) return;
    const lr = link.getBoundingClientRect();
    const nr = desktopNav.getBoundingClientRect();
    navSlider.style.transform = `translateX(${lr.left - nr.left}px)`;
    navSlider.style.width     = `${lr.width}px`;
  }

  if (desktopNav && navSlider && navPillLinks.length) {
    navPillLinks.forEach(link => link.addEventListener('mouseenter', () => updateSlider(link)));
    desktopNav.addEventListener('mouseleave', () => {
      updateSlider(document.querySelector('.nav-links-pill a.active') || navPillLinks[0]);
    });
    setTimeout(() => {
      const init = document.querySelector('.nav-links-pill a.active') || navPillLinks[0];
      if (init) { init.classList.add('active'); updateSlider(init); }
    }, 100);
  }

  const mobileLinks = [...document.querySelectorAll('.mobile-nav-links a')];
  const sections    = [...document.querySelectorAll('section')];
  const progressBar = document.getElementById("scroll-progress");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  // ── UNIFIED SCROLL HANDLER (passive + rAF) ───────────────────────────────────
  let scrollRafPending = false;
  window.addEventListener('scroll', () => {
    if (scrollRafPending) return;
    scrollRafPending = true;
    requestAnimationFrame(() => {
      const sy    = window.scrollY;
      const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (scrollTopBtn) scrollTopBtn.style.display = sy > 400 ? "block" : "none";
      if (progressBar)  progressBar.style.width = ((sy / total) * 100) + "%";

      let current = '';
      sections.forEach(s => { if (sy >= s.offsetTop - s.clientHeight / 3) current = s.id; });

      navPillLinks.forEach(link => {
        const active = Boolean(current && link.getAttribute('href').includes(current));
        link.classList.toggle('active', active);
        if (active) updateSlider(link);
      });
      mobileLinks.forEach(link => {
        link.classList.toggle('active', Boolean(current && link.getAttribute('href').includes(current)));
      });

      scrollRafPending = false;
    });
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── FILTER (SKILLS & PROJECTS) ───────────────────────────────────────────────
  function applyFilter(btnsSel, cardsSel, attr) {
    const btns  = [...document.querySelectorAll(btnsSel)];
    const cards = [...document.querySelectorAll(cardsSel)];
    if (!btns.length || !cards.length) return;
    btns.forEach(btn => btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const fv  = btn.getAttribute('data-filter');
      const out = cards.filter(c => c.style.display !== 'none' && !c.classList.contains('hide'));
      out.forEach(c => { c.classList.add('animating-out'); c.style.animationDelay = '0s'; });
      setTimeout(() => {
        out.forEach(c => { c.classList.remove('animating-out'); c.style.display = 'none'; });
        const show = cards.filter(c => fv === 'all' || (c.getAttribute(attr) || '').includes(fv));
        show.forEach((c, i) => {
          c.style.display = 'flex';
          c.classList.add('animating-in');
          c.style.animationDelay = `${i * 0.05}s`;
          setTimeout(() => { c.classList.remove('animating-in'); c.style.animationDelay = '0s'; }, 500 + i * 50);
        });
      }, 300);
    }));
  }
  applyFilter('.skill-filter-btn', '#skillsGrid .skill-card', 'data-category');
  applyFilter('.project-filters .filter-btn', '.project-card', 'data-project-tags');

  // ── MAGNETIC BUTTONS (rect cached on mouseenter) ──────────────────────────────
  document.querySelectorAll('.btn-primary, .btn-secondary, .nav-contact-btn').forEach(btn => {
    btn.classList.add('magnetic-btn');
    let rect;
    btn.addEventListener('mouseenter', () => { rect = btn.getBoundingClientRect(); });
    btn.addEventListener('mousemove', e => {
      if (!rect) return;
      btn.style.transform = `translate(${(e.clientX - rect.left - rect.width/2) * 0.3}px,${(e.clientY - rect.top - rect.height/2) * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; rect = null; });
  });

  // ── 3D TILT CARDS (rect cached on mouseenter) ────────────────────────────────
  document.querySelectorAll('.skill-card, .project-card, .recruiter-card').forEach(card => {
    let rect;
    card.addEventListener('mouseenter', () => { rect = card.getBoundingClientRect(); });
    card.addEventListener('mousemove', e => {
      if (!rect) return;
      const dx = (e.clientX - rect.left - rect.width/2)  / (rect.width/2);
      const dy = (e.clientY - rect.top  - rect.height/2) / (rect.height/2);
      card.style.transform = `perspective(600px) rotateX(${-dy*7}deg) rotateY(${dx*7}deg) translateY(-8px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; rect = null; });
  });

  // ── LIQUID RIPPLE ────────────────────────────────────────────────────────────
  if (!document.getElementById('lg-ripple-style')) {
    const s = document.createElement('style');
    s.id = 'lg-ripple-style';
    s.textContent = `@keyframes liquidRipple{0%{transform:translate(-50%,-50%) scale(0);opacity:1}100%{transform:translate(-50%,-50%) scale(30);opacity:0}}`;
    document.head.appendChild(s);
  }
  document.addEventListener('click', e => {
    if (e.target.closest('input,textarea,select')) return;
    const r = document.createElement('div');
    r.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:6px;height:6px;border-radius:50%;transform:translate(-50%,-50%) scale(0);background:rgba(10, 132, 255,.35);border:1.5px solid rgba(255,255,255,.55);pointer-events:none;z-index:99997;animation:liquidRipple 0.7s cubic-bezier(.23,1,.32,1) forwards`;
    document.body.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });

  // ── SKILL PROGRESS ANIMATION ────────────────────────────────────────────────
  const progressBars = document.querySelectorAll('.skill-progress-fill');
  if (progressBars.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Set width slightly later to allow smooth transition
          setTimeout(() => {
            el.style.width = el.getAttribute('data-progress') || '0%';
          }, 200);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    progressBars.forEach(p => observer.observe(p));
  }
});

// ── MOBILE MENU ────────────────────────────────────────────────────────────────
window.toggleMobileMenu = function() {
  const menu      = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('mobileHamburger');
  if (!menu) return;
  const active = menu.classList.toggle('active');
  if (hamburger) hamburger.classList.toggle('active', active);
  document.body.style.overflow = active ? 'hidden' : '';
};

// ── PROJECT MODAL ──────────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.project-clickable img').forEach(img => {
    img.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if(!card) return;
      const title = card.querySelector('h3').innerText;
      const bodyText = Array.from(card.querySelectorAll('p')).map(p => p.outerHTML).join('');
      const tags = card.querySelector('.badge-list').innerHTML;
      const actions = card.querySelector('.project-actions').innerHTML;
      const imgSrc = img.getAttribute('src');

      document.getElementById('modalProjectTitle').innerText = title;
      document.getElementById('modalProjectBody').innerHTML = bodyText;
      document.getElementById('modalProjectBadges').innerHTML = tags;
      document.getElementById('modalProjectActions').innerHTML = actions;
      document.getElementById('modalProjectImage').setAttribute('src', imgSrc);

      const modal = document.getElementById('projectModal');
      if(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
});

window.closeProjectModal = function() {
  const modal = document.getElementById('projectModal');
  if (modal) { 
    modal.classList.remove('active'); 
    document.body.style.overflow = 'auto'; 
  }
};

// ── COPY EMAIL ─────────────────────────────────────────────────────────────────
function copyEmail() {
  const email = 'pavangupta150605@gmail.com';
  const btn   = document.getElementById('copy-email-btn');
  function showOk() {
    if (!btn) return;
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.style.background  = 'rgba(0,230,118,.15)';
    btn.style.borderColor = 'rgba(0,230,118,.5)';
    btn.style.color       = '#00e676';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
      btn.style.background  = 'none';
      btn.style.borderColor = 'rgba(0,230,255,.3)';
      btn.style.color       = '#00e6ff';
    }, 2500);
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(showOk).catch(fallback);
  } else { fallback(); }
  function fallback() {
    const ta = document.createElement('textarea');
    ta.value = email;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showOk(); } catch(err) { console.error(err); }
    document.body.removeChild(ta);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  PREMIUM FEATURES v2.0
//  1. AI Chat Widget
//  2. Portfolio OS Desktop Mode
//  3. Live Dev Dashboard
//  5. 3D Tech Stack Galaxy
// ═══════════════════════════════════════════════════════════════════════════

// ── FEATURE 1: AI CHAT WIDGET ─────────────────────────────────────────────
function initAIChat() {
  const btn     = document.getElementById('ai-chat-btn');
  const panel   = document.getElementById('ai-chat-panel');
  const input   = document.getElementById('ai-chat-input');
  const msgs    = document.getElementById('ai-chat-messages');
  const sendBtn = document.getElementById('ai-chat-send');
  if (!btn || !panel) return;

  const INTENTS = [
    { re: /project|work|built|app|demo|show project|see project/i, id: 'projects' },
    { re: /skill|tech|stack|language|know|tool/i,                  id: 'skills'   },
    { re: /about|who|pavan|yourself|bio/i,                         id: 'about'    },
    { re: /contact|email|phone|reach|hire|connect/i,               id: 'contact'  },
    { re: /experience|intern|job|freelance/i,                      id: 'experience'},
    { re: /certificate|cert|course|credential/i,                   id: 'certs'    },
    { re: /hello|hi|hey|hola|greet/i,                              id: 'greet'    },
    { re: /resume|cv|download|pdf/i,                               id: 'resume'   },
    { re: /galaxy|3d|star|constellation/i,                         id: 'galaxy'   },
    { re: /dashboard|metric|live|server/i,                         id: 'dashboard'},
    { re: /terminal|quest|game|play/i,                             id: 'terminal' },
    { re: /scroll|go to|navigate|take me/i,                        id: 'navigate' },
  ];

  const REPLIES = {
    greet:      { text: "Hey! 👋 I'm Pavan's AI assistant. Ask about his **projects**, **skills**, or type **\"contact\"** to connect!", action: null },
    about:      { text: "**Pavan Kumar Gupta** — MERN Stack Developer from Jaipur 🇮🇳. Pursuing B.Tech IT at JECRC (2023–2027), specializing in AI-powered web apps.", action: '#about' },
    projects:   { text: "Pavan built 3 projects:\n\n🌟 **StarNote AI** — AI study platform\n💬 **TalkNow** — Real-time chat\n🏙️ **Smart Civic Eye** — Civic reporting\n\nScrolling to Projects... 🚀", action: '#projects' },
    skills:     { text: "Pavan's tech arsenal:\n\n⚛️ **Frontend**: React, JS, HTML5, CSS3\n🔧 **Backend**: Node.js, Express, Python\n🍃 **DB**: MongoDB\n🛠️ **Tools**: Figma, Git, Postman, n8n\n\nScrolling to Skills... ✨", action: '#skills' },
    contact:    { text: "Reach Pavan:\n\n📧 pavangupta150605@gmail.com\n📱 +91-8005872338\n📍 Jaipur, Rajasthan\n\nScrolling to Contact... 📞", action: '#contact' },
    experience: { text: "Pavan's journey:\n\n💼 **Upflairs Pvt. Ltd.** — Full Stack Intern (Jul-Aug 2025)\n🚀 **Freelance** — Web Dev (2024–Present)\n\nScrolling to Experience... 🗓️", action: '#experience' },
    certs:      { text: "Certifications:\n\n☕ Java — Infosys Springboard\n🐍 Python — Kaizen Innovations\n🌐 Full Stack — Upflairs Pvt. Ltd.\n\nScrolling to Certs... 🏆", action: '#certificates' },
    resume:     { text: "Opening Pavan's resume PDF... 📄", action: '_resume' },
    galaxy:     { text: "The **3D Tech Stack Galaxy** shows all technologies orbiting in 3D! 🌌 Drag to rotate, click nodes to see which projects use each tech. Scrolling there...", action: '#galaxy' },
    dashboard:  { text: "The **Live Dashboard** shows real-time metrics for StarNote AI & TalkNow — including sockets, DB queries, AI tokens, and uptime. Try the Stress Test! 📊 Scrolling...", action: '#dashboard' },
    terminal:   { text: "Press **Ctrl+J** to open the portfolio terminal! Type **\"quest\"** inside to play a debugging minigame. 🕹️ Try it!", action: null },
    navigate:   (msg) => {
      const secs = ['home','about','skills','experience','certificates','projects','galaxy','blog','dashboard','hobbies','contact'];
      const found = secs.find(s => msg.toLowerCase().includes(s));
      if (found) return { text: `Navigating to **${found[0].toUpperCase() + found.slice(1)}**! ✨`, action: '#' + found };
      return { text: "I can navigate to: Home, About, Skills, Experience, Projects, Galaxy, Dashboard, Contact. Which one?", action: null };
    },
    unknown:    { text: "I can help with Pavan's **projects**, **skills**, **experience**, or **contact**. Try: \"Show me his projects\" 😊", action: null }
  };

  function getReply(msg) {
    for (const { re, id } of INTENTS) {
      if (re.test(msg)) {
        const r = REPLIES[id];
        return typeof r === 'function' ? r(msg) : r;
      }
    }
    return REPLIES.unknown;
  }

  function scrollToSection(hash) {
    if (hash === '_resume') { window.open('./Resume.pdf', '_blank'); return; }
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function fmt(text) {
    return text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  function addMsg(text, isUser) {
    const div = document.createElement('div');
    div.className = `ai-msg ${isUser ? 'user' : 'bot'}`;
    div.innerHTML = `<div class="ai-msg-bubble">${fmt(text)}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    removeTyping();
    const div = document.createElement('div');
    div.className = 'ai-msg bot'; div.id = 'ai-typing-ind';
    div.innerHTML = `<div class="ai-typing-dots"><div class="ai-typing-dot"></div><div class="ai-typing-dot"></div><div class="ai-typing-dot"></div></div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('ai-typing-ind');
    if (t) t.remove();
  }

  async function sendMessage(text) {
    text = text.trim();
    if (!text) return;
    input.value = '';
    addMsg(text, true);
    showTyping();
    await new Promise(r => setTimeout(r, 700 + Math.random() * 500));
    removeTyping();
    const { text: reply, action } = getReply(text);
    addMsg(reply, false);
    if (action) setTimeout(() => scrollToSection(action), 550);
  }

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    panel.classList.toggle('open');
    if (panel.classList.contains('open') && msgs.children.length === 0) {
      setTimeout(() => addMsg("Hey! 👋 I'm Pavan's AI assistant. Ask about his **projects**, **skills**, **experience**, or type **\"contact\"** to reach him!", false), 350);
    }
    if (panel.classList.contains('open')) setTimeout(() => input.focus(), 400);
  });

  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(input.value); });
  document.querySelectorAll('.ai-suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => sendMessage(chip.textContent));
  });
}

// ── FEATURE 2: PORTFOLIO OS DESKTOP MODE ──────────────────────────────────
function initDesktopOS() {
  const osOverlay = document.getElementById('desktop-os');
  const toggleBtn = document.getElementById('osToggleBtn');
  if (!osOverlay || !toggleBtn) return;

  let osClockTimer = null;
  let highestZ = 10;

  function updateOsClock() {
    const el = document.getElementById('os-clock');
    if (el) el.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  function openOS() {
    osOverlay.classList.add('os-active');
    document.body.style.overflow = 'hidden';
    updateOsClock();
    if (!osClockTimer) osClockTimer = setInterval(updateOsClock, 1000);

    // Boot sequence
    const boot = document.getElementById('os-boot-screen');
    const bar = document.getElementById('os-boot-bar');
    if (boot && bar) {
      boot.style.display = 'flex'; boot.style.transition = 'none'; boot.style.opacity = '1';
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = '30%'; }, 150);
      setTimeout(() => { bar.style.width = '70%'; }, 500);
      setTimeout(() => { bar.style.width = '100%'; }, 900);
      setTimeout(() => {
        boot.style.transition = 'opacity 0.4s ease';
        boot.style.opacity = '0';
        setTimeout(() => { boot.style.display = 'none'; }, 400);
      }, 1200);
    }
  }

  function closeOS() {
    osOverlay.classList.remove('os-active');
    document.body.style.overflow = 'auto';
    if (osClockTimer) { clearInterval(osClockTimer); osClockTimer = null; }
  }

  toggleBtn.addEventListener('click', openOS);
  const exitBtn = document.getElementById('os-exit-btn');
  if (exitBtn) exitBtn.addEventListener('click', closeOS);

  function focusWin(win) {
    document.querySelectorAll('.os-window').forEach(w => w.classList.remove('focused'));
    win.classList.add('focused');
    win.style.zIndex = ++highestZ;
  }

  // Context Menu
  const ctxMenu = document.getElementById('os-context-menu');
  if (ctxMenu) {
    osOverlay.addEventListener('contextmenu', e => {
      if (e.target.closest('.os-window-body')) return; // Don't override inside apps
      e.preventDefault();
      ctxMenu.style.left = Math.min(e.clientX, window.innerWidth - 230) + 'px';
      ctxMenu.style.top = Math.min(e.clientY, window.innerHeight - 150) + 'px';
      ctxMenu.classList.add('active');
    });
    osOverlay.addEventListener('click', e => {
      if (!ctxMenu.contains(e.target)) ctxMenu.classList.remove('active');
    });
  }

  window.changeWallpaper = function() {
    const wp = document.getElementById('os-wallpaper');
    if (wp) wp.style.filter = `saturate(1.4) hue-rotate(${Math.random() * 360}deg)`;
    if (ctxMenu) ctxMenu.classList.remove('active');
  };

  window.osOpenWindow = function(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.style.display = 'flex';
    win.classList.remove('minimized');
    win.classList.add('opening');
    setTimeout(() => win.classList.remove('opening'), 350);
    focusWin(win);
    if (!win.dataset.positioned) {
      const area = osOverlay.querySelector('.os-desktop-area');
      const ar = area.getBoundingClientRect();
      win.style.left = Math.max(10, 60 + Math.random() * 100) + 'px';
      win.style.top  = Math.max(36, ar.top + 50 + Math.random() * 60) + 'px';
      win.dataset.positioned = '1';
      // Animate skill bars if skills window
      if (id === 'win-skills') {
        setTimeout(() => {
          win.querySelectorAll('.os-skill-fill').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width') || '0%';
          });
        }, 300);
      }
    }
  };

  window.osCloseWindow = function(id) {
    const win = document.getElementById(id);
    if (win) { win.style.display = 'none'; win.dataset.positioned = ''; }
  };

  window.osMinimize = function(id) {
    const win = document.getElementById(id);
    if (win) win.classList.add('minimized');
  };

  window.osMaximize = function(id) {
    const win = document.getElementById(id);
    if (!win) return;
    if (win.dataset.maxed === '1') {
      win.style.width = win.dataset.pw || '580px';
      win.style.height = win.dataset.ph || '';
      win.style.left = win.dataset.pl || '80px';
      win.style.top  = win.dataset.pt || '70px';
      win.dataset.maxed = '0';
    } else {
      win.dataset.pw = win.style.width; win.dataset.ph = win.style.height;
      win.dataset.pl = win.style.left;  win.dataset.pt = win.style.top;
      const area = osOverlay.querySelector('.os-desktop-area');
      const r = area.getBoundingClientRect();
      win.style.left = r.left + 'px'; win.style.top  = r.top + 'px';
      win.style.width = r.width + 'px'; win.style.height = r.height + 'px';
      win.dataset.maxed = '1';
    }
    focusWin(win);
  };

  // Drag windows
  document.querySelectorAll('.os-titlebar').forEach(bar => {
    const win = bar.closest('.os-window');
    if (!win) return;
    let dragging = false, sx, sy, sl, st;
    bar.addEventListener('mousedown', e => {
      if (e.target.classList.contains('os-traffic-dot')) return;
      dragging = true;
      win.classList.add('dragging');
      sx = e.clientX; sy = e.clientY;
      sl = win.offsetLeft; st = win.offsetTop;
      focusWin(win); e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      win.style.left = (sl + e.clientX - sx) + 'px';
      win.style.top  = Math.max(27, st + e.clientY - sy) + 'px';
    });
    document.addEventListener('mouseup', () => { 
      dragging = false; 
      document.querySelectorAll('.os-window').forEach(w => w.classList.remove('dragging'));
    });
    win.addEventListener('mousedown', () => focusWin(win));
  });

  // Mac Dock Physics
  const dock = document.querySelector('.os-dock-inner');
  const items = document.querySelectorAll('.os-dock-item');
  if (dock && items.length > 0) {
    dock.addEventListener('mousemove', e => {
      items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.sqrt(Math.pow(e.clientX - cx, 2) + Math.pow(e.clientY - cy, 2));
        const scale = Math.max(1, 1.4 - dist / 200);
        item.style.transform = `scale(${scale}) translateY(${-(scale-1)*25}px)`;
        item.style.margin = `0 ${(scale-1)*12}px`;
      });
    });
    dock.addEventListener('mouseleave', () => {
      items.forEach(item => {
        item.style.transform = 'scale(1) translateY(0)';
        item.style.margin = '0px';
      });
    });
  }
}



// ── FEATURE 5: 3D TECH STACK GALAXY ───────────────────────────────────────
// ── FEATURE 5: 3D TECH STACK GALAXY (Three.js) ────────────────────────────
function initGalaxy() {
  const container = document.querySelector('.galaxy-wrapper');
  const tooltip = document.getElementById('galaxy-tooltip');
  if (!container || !tooltip || !window.THREE) return;

  // Remove the old 2D canvas
  const oldCanvas = document.getElementById('galaxyCanvas');
  if (oldCanvas) oldCanvas.remove();

  const scene = new THREE.Scene();
  // Optional: add subtle fog to give depth
  scene.fog = new THREE.FogExp2(0x050510, 0.001);

  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 1, 3000);
  camera.position.z = 700;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ReinhardToneMapping;
  container.insertBefore(renderer.domElement, tooltip);

  // Setup Post-Processing (Bloom)
  const renderScene = new THREE.RenderPass(scene, camera);
  const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(container.clientWidth, container.clientHeight), 
    1.2, // strength
    0.5, // radius
    0.2  // threshold
  );
  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  // OrbitControls for dragging and rotation
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.0;
  controls.enablePan = false;
  controls.minDistance = 300;
  controls.maxDistance = 1200;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 1.5, 2000);
  pointLight.position.set(300, 400, 300);
  scene.add(pointLight);

  // Starfield Background
  const starGeo = new THREE.BufferGeometry();
  const starCount = 1200;
  const starPositions = new Float32Array(starCount * 3);
  for(let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 4000;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({ 
    color: 0xffffff, size: 2.5, transparent: true, opacity: 0.7, sizeAttenuation: true 
  });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // Nebula Background
  const createNebulaTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.2, 'rgba(255,255,255,0.6)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  };
  const nebulaTex = createNebulaTexture();
  const nebulaColors = [0x5E5CE6, 0x0A84FF, 0x8E75B2, 0x32D74B];
  for(let i=0; i<12; i++) {
    const mat = new THREE.SpriteMaterial({ 
      map: nebulaTex, color: nebulaColors[i % nebulaColors.length], 
      transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(1500 + Math.random()*1500, 1500 + Math.random()*1500, 1);
    sprite.position.set(
      (Math.random() - 0.5) * 3000,
      (Math.random() - 0.5) * 3000,
      (Math.random() - 0.5) * 2000 - 1000
    );
    scene.add(sprite);
  }

  const NODES = [
    { name:'React',      cat:'Frontend', icon:'https://img.icons8.com/color/128/react-native.png', size:26, pos:[ 250,  100,  150] },
    { name:'Node.js',    cat:'Backend',  icon:'https://img.icons8.com/color/128/nodejs.png', size:26, pos:[-200,  150, -250] },
    { name:'MongoDB',    cat:'Database', icon:'https://img.icons8.com/color/128/mongodb.png', size:22, pos:[ 150, -200,  200] },
    { name:'Express.js', cat:'Backend',  icon:'https://img.icons8.com/color/128/api.png', size:22, pos:[-280, -100,  120] },
    { name:'JavaScript', cat:'Frontend', icon:'https://img.icons8.com/color/128/javascript--v1.png', size:22, pos:[ 350, -150, -100] },
    { name:'HTML5',      cat:'Frontend', icon:'https://img.icons8.com/color/128/html-5--v1.png', size:18, pos:[-100,  300,   80] },
    { name:'CSS3',       cat:'Frontend', icon:'https://img.icons8.com/color/128/css3.png', size:18, pos:[  80, -300, -150] },
    { name:'Python',     cat:'Backend',  icon:'https://img.icons8.com/color/128/python--v1.png', size:20, pos:[ 180,  250, -280] },
    { name:'Socket.io',  cat:'Backend',  icon:'https://img.icons8.com/fluency/128/network.png', size:16, pos:[-150, -250, -200] },
    { name:'Gemini AI',  cat:'AI',       icon:'https://img.icons8.com/color/128/google-logo.png', size:22, pos:[ 400,  200,    0] },
    { name:'Figma',      cat:'Tools',    icon:'https://img.icons8.com/color/128/figma--v1.png', size:18, pos:[-350,  180,  150] },
    { name:'Git',        cat:'Tools',    icon:'https://img.icons8.com/color/128/git.png', size:18, pos:[ 280, -250,  250] },
    { name:'Bootstrap',  cat:'Frontend', icon:'https://img.icons8.com/color/128/bootstrap.png', size:18, pos:[-250, -300,  -80] },
    { name:'JWT',        cat:'Backend',  icon:'https://img.icons8.com/color/128/json--v1.png', size:16, pos:[  80,   80,  400] },
    { name:'Postman',    cat:'Tools',    icon:'https://img.icons8.com/dusk/128/api-settings.png', size:16, pos:[-120,  180,  350] },
  ];

  const PROJECTS = {
    'React':['StarNote AI','TalkNow','Smart Civic Eye'],'Node.js':['StarNote AI','TalkNow','Smart Civic Eye'],
    'MongoDB':['StarNote AI','TalkNow'],'Express.js':['StarNote AI','TalkNow','Smart Civic Eye'],
    'JavaScript':['StarNote AI','TalkNow','Smart Civic Eye'],'HTML5':['StarNote AI','TalkNow','Smart Civic Eye'],
    'CSS3':['StarNote AI','TalkNow','Smart Civic Eye'],'Python':['Smart Civic Eye'],'Socket.io':['TalkNow'],
    'Gemini AI':['StarNote AI'],'Figma':['StarNote AI','TalkNow'],'Git':['StarNote AI','TalkNow','Smart Civic Eye'],
    'Bootstrap':['TalkNow'],'JWT':['StarNote AI','TalkNow'],'Postman':['StarNote AI','TalkNow','Smart Civic Eye'],
  };

  const group = new THREE.Group();
  scene.add(group);

  const meshes = [];

  // MERN Core
  const coreGeo = new THREE.SphereGeometry(35, 32, 32);
  const coreMat = new THREE.MeshStandardMaterial({ 
    color: 0x0A84FF, emissive: 0x0A84FF, emissiveIntensity: 0.8, roughness: 0.1, metalness: 0.9 
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Orbital Rings
  const ringMat = new THREE.MeshBasicMaterial({ 
    color: 0x0A84FF, transparent: true, opacity: 0.15, side: THREE.DoubleSide, blending: THREE.AdditiveBlending 
  });
  [180, 280, 380].forEach(radius => {
    const ringGeo = new THREE.TorusGeometry(radius, 0.8, 16, 100);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  });

  // Utility to create text sprites
  function createTextSprite(message) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 256; canvas.height = 128;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.font = 'bold 36px -apple-system, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 10;
    ctx.fillText(message, 128, 64);
    
    const tex = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(120, 60, 1);
    return sprite;
  }

  // Create tech nodes as images using Sprites
  const textureLoader = new THREE.TextureLoader();
  NODES.forEach(n => {
    const tex = textureLoader.load(n.icon);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    
    const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: true });
    const sprite = new THREE.Sprite(spriteMat);
    const scaleSize = n.size * 2.5; 
    sprite.scale.set(scaleSize, scaleSize, 1);
    sprite.position.set(...n.pos);
    sprite.userData = { name: n.name, cat: n.cat, baseScale: scaleSize, isSprite: true, basePos: new THREE.Vector3(...n.pos), velocity: new THREE.Vector3(0,0,0) };
    
    group.add(sprite);
    meshes.push(sprite);

    const label = createTextSprite(n.name);
    label.position.set(n.pos[0], n.pos[1] - scaleSize / 2 - 20, n.pos[2]); 
    group.add(label);
    sprite.userData.label = label;
  });

  // Create constellation connecting lines based on categories
  const catColors = {
    'Frontend': new THREE.Color(0x0A84FF), 'Backend': new THREE.Color(0x32D74B),
    'Database': new THREE.Color(0xFF9F0A), 'AI': new THREE.Color(0xBF5AF2), 'Tools': new THREE.Color(0xFF375F)
  };
  const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
  const lineGeo = new THREE.BufferGeometry();
  
  const linePairs = [];
  for(let i=0; i<meshes.length; i++) {
    for(let j=i+1; j<meshes.length; j++) {
      if(meshes[i].userData.cat === meshes[j].userData.cat) {
        linePairs.push([meshes[i], meshes[j], catColors[meshes[i].userData.cat] || new THREE.Color(0xffffff)]);
      }
    }
  }
  const linePositions = new Float32Array(linePairs.length * 6);
  const lineColorsArray = new Float32Array(linePairs.length * 6);
  linePairs.forEach((pair, idx) => {
    const c = pair[2];
    lineColorsArray[idx*6] = c.r; lineColorsArray[idx*6+1] = c.g; lineColorsArray[idx*6+2] = c.b;
    lineColorsArray[idx*6+3] = c.r; lineColorsArray[idx*6+4] = c.g; lineColorsArray[idx*6+5] = c.b;
  });
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColorsArray, 3));
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lines);

  // Shockwave Ripples Array
  const ripples = [];

  // Core Label
  const coreLabel = createTextSprite("MERN");
  coreLabel.scale.set(160, 80, 1);
  coreLabel.position.set(0, -55, 0);
  core.add(coreLabel);

  // Raycaster for hover and drag events
  const raycaster = new THREE.Raycaster();
  window.raycaster = raycaster;
  const mouse = new THREE.Vector2();
  let hoveredMesh = null;
  let draggedMesh = null;
  let dragPlane = new THREE.Plane();
  let dragOffset = new THREE.Vector3();

  renderer.domElement.addEventListener('mousemove', e => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    if (draggedMesh) {
      raycaster.ray.intersectPlane(dragPlane, dragOffset);
      draggedMesh.position.copy(dragOffset);
      controls.autoRotate = false;
      return;
    }

    const intersects = raycaster.intersectObjects(meshes);
    if (intersects.length > 0) {
      document.body.style.cursor = 'pointer';
      controls.autoRotate = false;
      controls.enableRotate = false;
      const mesh = intersects[0].object;
      
      if (hoveredMesh !== mesh) {
        if (hoveredMesh) hoveredMesh.scale.setScalar(hoveredMesh.userData.baseScale);
        hoveredMesh = mesh;
        hoveredMesh.scale.setScalar(hoveredMesh.userData.baseScale * 1.35);
          if (window.AudioEngine && typeof window.AudioEngine.playHover === 'function') window.AudioEngine.playHover(); 
      }
      // Tooltip logic
      const { name, cat } = mesh.userData;
      tooltip.querySelector('.galaxy-tooltip-name').textContent = name;
      tooltip.querySelector('.galaxy-tooltip-cat').textContent = cat;
      const projs = PROJECTS[name] || [];
      tooltip.querySelector('.galaxy-tooltip-projects').innerHTML = projs.length
        ? projs.map(p => `<div class="galaxy-tooltip-project">${p}</div>`).join('')
        : '<div class="galaxy-tooltip-project" style="opacity:0.4">No linked projects yet</div>';
      
      let tx = e.clientX + 15, ty = e.clientY - 10;
      if (tx + 220 > window.innerWidth) tx = e.clientX - 230;
      if (ty + 130 > window.innerHeight) ty = e.clientY - 140;
      tooltip.style.left = tx + 'px'; tooltip.style.top = ty + 'px';
      tooltip.classList.add('visible');
    } else {
      document.body.style.cursor = 'grab';
      controls.enableRotate = true;
      if (hoveredMesh) {
        hoveredMesh.scale.setScalar(hoveredMesh.userData.baseScale);
        hoveredMesh = null;
      }
      tooltip.classList.remove('visible');
    }
  });

  renderer.domElement.addEventListener('mousedown', () => { 
    if (hoveredMesh) {
      draggedMesh = hoveredMesh;
      dragPlane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()), draggedMesh.position);
      
      // Shockwave logic
      const geo = new THREE.RingGeometry(0.1, 80, 32);
      const mat = new THREE.MeshBasicMaterial({ color: catColors[draggedMesh.userData.cat] || 0xffffff, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(geo, mat);
      ring.position.copy(draggedMesh.position);
      ring.lookAt(camera.position);
      group.add(ring);
      ripples.push({ mesh: ring, age: 0 });

    } else {
      document.body.style.cursor = 'grabbing';
    }
  });
  
  window.addEventListener('mouseup', () => { 
    draggedMesh = null;
    document.body.style.cursor = 'grab'; 
    controls.enableRotate = true;
    setTimeout(() => { if (!hoveredMesh && !draggedMesh) controls.autoRotate = true; }, 2000);
  });

  renderer.domElement.addEventListener('mouseleave', () => {
    draggedMesh = null;
    document.body.style.cursor = 'default';
    controls.enableRotate = true;
    tooltip.classList.remove('visible');
    if(hoveredMesh) { hoveredMesh.scale.setScalar(hoveredMesh.userData.baseScale); hoveredMesh = null; }
    controls.autoRotate = true;
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();

      // (Robot is updated in the main solar system render loop above)

    const t = Date.now() * 0.002;
    
    // Core pulsing effect
    core.scale.setScalar(1 + Math.sin(t) * 0.08);
    group.position.y = Math.sin(t * 0.5) * 15;
    group.rotation.y = Math.sin(t * 0.2) * 0.05;
    stars.rotation.y = t * 0.02; stars.rotation.x = t * 0.01;
    lineMat.opacity = 0.2 + Math.sin(t * 1.5) * 0.15;
    
    // Physics and Lines updates
    const posArr = lineGeo.attributes.position.array;
    let idx = 0;
    
    meshes.forEach(mesh => {
      if (mesh !== draggedMesh) {
        const force = new THREE.Vector3().subVectors(mesh.userData.basePos, mesh.position).multiplyScalar(0.04);
        force.sub(mesh.userData.velocity.clone().multiplyScalar(0.15)); // damp
        mesh.userData.velocity.add(force);
        mesh.position.add(mesh.userData.velocity);
      }
      mesh.userData.label.position.set(mesh.position.x, mesh.position.y - mesh.userData.baseScale/2 - 20, mesh.position.z);
    });

    linePairs.forEach(pair => {
      posArr[idx++] = pair[0].position.x; posArr[idx++] = pair[0].position.y; posArr[idx++] = pair[0].position.z;
      posArr[idx++] = pair[1].position.x; posArr[idx++] = pair[1].position.y; posArr[idx++] = pair[1].position.z;
    });
    lineGeo.attributes.position.needsUpdate = true;

    // Shockwaves
    for(let i=ripples.length-1; i>=0; i--) {
      let r = ripples[i];
      r.age += 0.03;
      r.mesh.scale.setScalar(1 + r.age * 4);
      r.mesh.material.opacity = Math.max(0, 0.8 - r.age*1.2);
      if(r.age > 0.8) { group.remove(r.mesh); ripples.splice(i, 1); }
    }
    
    composer.render();
  }

  function resize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    composer.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener('resize', resize, { passive: true });

  let started = false;
  const visObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      resize();
      // Cinematic Camera Intro
      const startT = Date.now();
      const intro = () => {
        const prog = Math.min((Date.now() - startT) / 1500, 1);
        const ease = 1 - Math.pow(1 - prog, 4); // ease out
        camera.position.z = 2500 - (2500 - 700) * ease;
        if (prog < 1) requestAnimationFrame(intro);
      };
      intro();
      animate();
      visObs.disconnect();
    }
  }, { threshold: 0.2 });
  visObs.observe(container);
}

// ── INIT ALL PREMIUM FEATURES ─────────────────────────────────────────────
(function() {
  function run() {
    initAIChat();
    initDesktopOS();

    initGalaxy();
    
    // Staggered Scroll Reveal
    const revealElements = document.querySelectorAll('.scroll-reveal');
    let revealQueue = [];
    let revealTimeout = null;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealQueue.push(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });

      if (revealQueue.length > 0 && !revealTimeout) {
        revealTimeout = setTimeout(() => {
          revealQueue.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
          revealQueue.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add('revealed');
            }, index * 120);
          });
          revealQueue = [];
          revealTimeout = null;
        }, 30);
      }
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
  }
  if (document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run, { once: true });
})();



// ── ELITE 3D FEATURES: AUDIO, BOOT, WARP ──────────────────────────────────
window.AudioEngine = {
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

document.body.addEventListener('click', () => window.AudioEngine.init(), { once: true });

  // (Robot click logic moved to hero scene)

document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => window.AudioEngine.playHover());
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
  
  if(typeof window.AudioEngine !== 'undefined' && window.AudioEngine.ctx) window.AudioEngine.playHover();
  
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
