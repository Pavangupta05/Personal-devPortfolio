
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
    
    // Disable WebGL 3D Solar System on mobile, use beautiful CSS 2D fallback instead
    if (isMobile) {
      document.body.classList.add('mobile-space-fallback');
      canvas.style.display = 'none';
      return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 6000);
    
    // Post-Processing (Bloom)
    let composer, bloomPass;
    if (window.THREE.EffectComposer && window.THREE.UnrealBloomPass) {
       const renderScene = new window.THREE.RenderPass(scene, camera);
       bloomPass = new window.THREE.UnrealBloomPass(new window.THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
       bloomPass.threshold = 0.85; // High threshold so only emissive/bright lights glow (not the planets)
       bloomPass.strength = 0.4; // Subtle, realistic bloom
       bloomPass.radius = 0.6;
       
       composer = new window.THREE.EffectComposer(renderer);
       composer.addPass(renderScene);
       composer.addPass(bloomPass);

      // CINEMATIC POST-PROCESSING
      const cinematicShader = {
        uniforms: {
          tDiffuse: { value: null },
          uTime: { value: 0 },
          uDistortion: { value: 0.003 } // Chromatic aberration strength
        },
        vertexShader: `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: `
          uniform sampler2D tDiffuse;
          uniform float uTime;
          uniform float uDistortion;
          varying vec2 vUv;
          
          float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }
          
          void main() {
            vec2 uv = vUv;
            vec2 d = uv - 0.5;
            float dist = length(d);
            
            // Chromatic Aberration
            vec2 offset = d * dist * uDistortion;
            float r = texture2D(tDiffuse, uv + offset).r;
            float g = texture2D(tDiffuse, uv).g;
            float b = texture2D(tDiffuse, uv - offset).b;
            
            // Film Grain
            float noise = (rand(uv + uTime) - 0.5) * 0.05;
            
            // Vignette
            float vignette = smoothstep(1.1, 0.4, dist);
            
            gl_FragColor = vec4(vec3(r, g, b) + noise, 1.0) * vignette;
          }
        `
      };
      window.cinematicPass = new window.THREE.ShaderPass(cinematicShader);
      composer.addPass(window.cinematicPass);
    }

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
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 1.2, vertexColors: true, transparent: true, opacity: 0.95, sizeAttenuation: true }));
    scene.add(stars);
    window.stars = stars;

    // ── LIGHTING ─────────────────────────────────────────────────────────────

    window.fadeToAction = function(name, duration) {
      const prevAction = window.robotActiveAction;
      const activeAction = window.robotActions[name];
      if (prevAction !== activeAction && activeAction) {
        if (prevAction) prevAction.fadeOut(duration);
        activeAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(duration).play();
        window.robotActiveAction = activeAction;
      }
    };



    // Slightly softer sunlight for realism
    scene.add(new THREE.PointLight(0xFFF5E4, isMobile ? 1.8 : 2.5, 2000, 1.1));
    scene.add(new THREE.AmbientLight(0x090918, 0.2));

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
      new THREE.SphereGeometry(22, isMobile ? 32 : 64, isMobile ? 32 : 64),
      new THREE.MeshStandardMaterial({ map: sunTex, emissive: new THREE.Color(0xff5500), emissiveIntensity: isMobile ? 1.4 : 1.8, emissiveMap: sunTex, roughness: 1 })
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

    const _hash = (x, y) => { let h = Math.sin(x*12.9898 + y*78.233)*43758.5453; return h - Math.floor(h); };
    const _noise = (x, y) => {
      const i = Math.floor(x), j = Math.floor(y);
      const f = x-i, g = y-j;
      const u = f*f*(3-2*f), v = g*g*(3-2*g);
      return _hash(i,j)*(1-u)*(1-v) + _hash(i+1,j)*u*(1-v) + _hash(i,j+1)*(1-u)*v + _hash(i+1,j+1)*u*v;
    };
    const _fbm = (x, y) => {
      let v = 0, a = 0.5, f = 1;
      for(let i=0; i<4; i++) { v += _noise(x*f, y*f)*a; a*=0.5; f*=2; }
      return v;
    };
    const makeBumpMap = (w, h, scale, isGasGiant) => {
      return makeProceduralTexture(w, h, (ctx, cw, ch) => {
        const imgData = ctx.createImageData(cw, ch);
        const data = imgData.data;
        for (let y = 0; y < ch; y++) {
          for (let x = 0; x < cw; x++) {
             let nx = x / scale, ny = y / scale;
             let val = isGasGiant ? _noise(nx * 0.2, ny * 3.0) : _fbm(nx, ny);
             let color = Math.floor(val * 255);
             const i = (y * cw + x) * 4;
             data[i] = data[i+1] = data[i+2] = color;
             data[i+3] = 255;
          }
        }
        ctx.putImageData(imgData, 0, 0);
      });
    };

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
      const isGasGiant = ['Jupiter', 'Saturn', 'Uranus', 'Neptune'].includes(def.name);
      const pTex = makeProceduralTexture(isMobile ? 256 : 512, isMobile ? 256 : 512, def.drawFn);
      const bumpTex = makeBumpMap(isMobile ? 256 : 512, isMobile ? 256 : 512, isGasGiant ? 30 : 15, isGasGiant);
      
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(def.radius, isMobile ? 32 : 64, isMobile ? 32 : 64),
        new THREE.MeshStandardMaterial({ 
          map: pTex, 
          bumpMap: bumpTex, 
          bumpScale: isGasGiant ? 0.05 : 0.8,
          roughness: isGasGiant ? 0.4 : 0.85, 
          metalness: isGasGiant ? 0.1 : 0.2
        })
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
          if (window.beamUpAstronaut) window.beamUpAstronaut();
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
    let smoothSp = 0;

    function render(time) {
      solId = requestAnimationFrame(render);
      if (time - lastT < FPS) return;
      const dt = Math.min((time - lastT) / 1000, 0.05);
      lastT = time;

      // Scroll progress — lerped smoothly so 3D camera travel stays silky smooth
      const maxS = document.documentElement.scrollHeight - window.innerHeight || 1;
      const targetSp = Math.min(Math.max(window.scrollY / maxS, 0), 1);
      smoothSp += (targetSp - smoothSp) * 0.12;
      const sp = smoothSp;

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
        
        // CINEMATIC CAMERA CHOREOGRAPHY
        // Dutch angle (bank and roll) based on scroll and mouse
        camera.rotation.z = Math.sin(sp * Math.PI * 4) * 0.05 - (mouseX * 0.02);
        
        // Update Space Dust
        if (window.spaceDust) {
            window.spaceDust.position.y += 0.5; // Drift upwards
            if (window.spaceDust.position.y > 1000) window.spaceDust.position.y = -1000;
            window.spaceDust.rotation.y += 0.001;
            window.spaceDust.rotation.x = Math.sin(time/2000) * 0.1;
        }
        
        // Update Cinematic Pass
        if (window.cinematicPass) {
            window.cinematicPass.uniforms.uTime.value = time * 0.001;
            window.cinematicPass.uniforms.uDistortion.value = 0.003 + (Math.sin(sp * Math.PI) * 0.005);
        }


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
      
      // Animate stars slowly
      if (window.stars) window.stars.rotation.y -= 0.0003 * dt * 60;
      
      if (typeof composer !== 'undefined' && composer) {
         composer.render();
      } else {
         renderer.render(scene, camera);
      }
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





// ── INIT ALL PREMIUM FEATURES ─────────────────────────────────────────────
(function() {
  function run() {
    initAIChat();
    initDesktopOS();
    
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



// ── ELITE 3D FEATURES: AUDIO (DISABLED) ──────────────────────────────────
window.AudioEngine = {
  ctx: null,
  humOsc: null,
  humGain: null,
  init() {},
  playHover() {}
};

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

// ========================================================
// PREMIUM MICRO-INTERACTIONS (Magnetic Buttons)
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
    const magneticElements = document.querySelectorAll('.btn, .social-icon-btn, .nav-links-pill a');
    
    magneticElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) - (rect.width / 2);
            const y = (e.clientY - rect.top) - (rect.height / 2);
            
            // Subtle pull
            gsap.to(el, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.4,
                ease: "power2.out"
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
});

// ========================================================
// PHASE 2: CINEMATIC CURSOR LOGIC
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
    const follower = document.querySelector('.cursor-follower');
    if (!follower) return;

    // Elements that trigger the hollow glow effect
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card, .social-icon-btn');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            follower.classList.remove('hovering');
        });
    });
});

// ========================================================
// FEATURE 3: PROJECT CATEGORY FILTERING LOGIC
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  const filterBtns = document.querySelectorAll('.project-filter-bar .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('filter-hidden');
        } else {
          card.classList.add('filter-hidden');
        }
      });
    });
  });
});

// ========================================================
// FEATURE 5: TIMELINE SCROLL GLOW OBSERVER
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (!timelineItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active-glow');
      } else {
        entry.target.classList.remove('active-glow');
      }
    });
  }, { threshold: 0.4 });

  timelineItems.forEach(item => observer.observe(item));
});

// ========================================================
// FEATURE 5: INTERACTIVE SKILL LEVEL TOOLTIPS
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  const tooltip = document.getElementById('skill-tooltip');
  if (!tooltip) return;

  const skillData = {
    'React.js': { level: 'Advanced (90%)', detail: 'Hooks, Context API, Redux Toolkit, Virtual DOM' },
    'React': { level: 'Advanced (90%)', detail: 'Hooks, Context API, Redux Toolkit, Virtual DOM' },
    'Node.js': { level: 'Advanced (85%)', detail: 'REST APIs, Event Loop, Express Middleware, Async' },
    'Express.js': { level: 'Advanced (85%)', detail: 'Route Controllers, JWT Auth, CORS, Multer' },
    'Mongo DB': { level: 'Intermediate (80%)', detail: 'Aggregations, Schemas, Indexing, Mongoose' },
    'MongoDB': { level: 'Intermediate (80%)', detail: 'Aggregations, Schemas, Indexing, Mongoose' },
    'JavaScript': { level: 'Expert (92%)', detail: 'ES6+, Async/Await, Closures, DOM Manipulation' },
    'JavaScript ES6+': { level: 'Expert (92%)', detail: 'ES6+, Async/Await, Closures, DOM Manipulation' },
    'TypeScript': { level: 'Intermediate (75%)', detail: 'Interfaces, Generics, Type Guards' },
    'HTML5 & CSS3': { level: 'Expert (95%)', detail: 'Flexbox, Grid, Glassmorphism, Animations' },
    'Tailwind CSS': { level: 'Advanced (88%)', detail: 'Utility-first layout, custom themes, dark mode' },
    'WebSockets': { level: 'Intermediate (78%)', detail: 'Socket.io real-time events, full-duplex streams' },
    'Python': { level: 'Proficient (70%)', detail: 'Automation scripts, AI API integrations' },
    'C++': { level: 'Proficient (65%)', detail: 'Data structures, OOP, algorithmic logic' },
    'VS Code': { level: 'Expert (95%)', detail: 'Workflow extensions, debugging, Git integration' },
    'Figma': { level: 'Proficient (70%)', detail: 'UI prototyping, component design, wireframing' },
    'Postman': { level: 'Advanced (85%)', detail: 'API endpoint testing, environment variables' },
    'Cursor': { level: 'Advanced (85%)', detail: 'AI-assisted rapid prototyping & refactoring' },
    'OpenWeather API': { level: 'Advanced (85%)', detail: 'Live forecast data, Geolocation updates' },
    'JWT + Google OAuth': { level: 'Advanced (85%)', detail: 'Secure token storage, OAuth2 authentication' }
  };

  const skillCards = document.querySelectorAll('.skill-card, .badge');

  skillCards.forEach(card => {
    const titleEl = card.querySelector('h3') || card;
    const name = titleEl ? titleEl.textContent.trim() : '';

    card.addEventListener('mouseenter', (e) => {
      const data = skillData[name] || { 
        level: 'Proficient (80%)', 
        detail: 'Modern web development & production usage' 
      };

      tooltip.innerHTML = `
        <div class="skill-tooltip-header">⚡ ${name} — ${data.level}</div>
        <div class="skill-tooltip-detail">${data.detail}</div>
      `;
      tooltip.classList.add('visible');
    });

    card.addEventListener('mousemove', (e) => {
      tooltip.style.left = e.clientX + 'px';
      tooltip.style.top = e.clientY + 'px';
    });

    card.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });
});

// ========================================================
// FEATURE 3: ADVANCED FLUID GLASS REFRACTION MOUSE TRACKER
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  const glassCards = document.querySelectorAll('.project-card, .skill-card, .timeline-content');
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
});

// ========================================================
// FEATURE 4: CINEMATIC DEPTH-OF-FIELD FOCUS OBSERVER
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener('scroll', () => {
    const maxS = document.documentElement.scrollHeight - window.innerHeight || 1;
    const sp = window.scrollY / maxS;
    
    // Smooth depth-of-field blur when deep inside reading projects/experience
    if (sp > 0.4 && sp < 0.85) {
      document.body.classList.add('dof-blur-distant');
    } else {
      document.body.classList.remove('dof-blur-distant');
    }
  }, { passive: true });
});
// ========================================================
// FEATURE: AI VOICE ASSISTANT & CHATBOT
// ========================================================
(function initAIAssistantModule() {
  const toggleBtn = document.getElementById('ai-chat-toggle');
  const chatWindow = document.getElementById('ai-chat-window');
  const closeBtn = document.getElementById('ai-chat-close');
  const msgContainer = document.getElementById('ai-chat-messages');
  const inputEl = document.getElementById('ai-chat-input');
  const sendBtn = document.getElementById('ai-send-btn');
  const micBtn = document.getElementById('ai-mic-btn');

  if (!toggleBtn || !chatWindow) return;

  // AI Brain / NLP Responses
  const responses = {
    greetings: ["Hello!", "Hi there! I'm Pavan's AI Assistant.", "Hey! How can I help you explore Pavan's portfolio?"],
    skills: ["Pavan is highly skilled in React.js, Node.js, Express, MongoDB, Python, and C++. Shall I scroll down to the skills section?"],
    projects: ["Pavan has built incredible platforms like StarNote AI, TalkNow Chat, and Civic Eye. Want me to take you there?"],
    contact: ["You can reach Pavan at vinodguptamertiya05@gmail.com, or check his LinkedIn/GitHub in the contact section!"],
    experience: ["Pavan has worked as a Web Developer Intern at Internshala, building modern UIs and optimizing backend services."],
    default: ["I'm a simple AI! You can ask me about Pavan's skills, projects, contact info, or experience."]
  };

  function matchIntent(text) {
    const lower = text.toLowerCase();
    if (lower.includes('skill') || lower.includes('stack') || lower.includes('tech')) return 'skills';
    if (lower.includes('project') || lower.includes('work') || lower.includes('portfolio')) return 'projects';
    if (lower.includes('contact') || lower.includes('email') || lower.includes('reach')) return 'contact';
    if (lower.includes('experience') || lower.includes('intern') || lower.includes('work')) return 'experience';
    if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) return 'greetings';
    return 'default';
  }

  function appendMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-message ${isUser ? 'user' : 'bot'}`;
    
    if (isUser) {
      msgDiv.innerHTML = `<div class="msg-bubble">${text}</div>`;
    } else {
      msgDiv.innerHTML = `
        <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="msg-bubble">${text}</div>
      `;
    }
    msgContainer.appendChild(msgDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function handleUserMessage(text) {
    if (!text.trim()) return;
    appendMessage(text, true);
    inputEl.value = '';

    // Show typing effect
    setTimeout(() => {
      const intent = matchIntent(text);
      const possibleReplies = responses[intent];
      const reply = possibleReplies[Math.floor(Math.random() * possibleReplies.length)];
      appendMessage(reply, false);

      // Scroll logic
      if (intent === 'skills') document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
      if (intent === 'projects') document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      if (intent === 'contact') document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  }

  // Event Listeners
  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) inputEl.focus();
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
  });

  sendBtn.addEventListener('click', () => {
    handleUserMessage(inputEl.value);
  });

  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserMessage(inputEl.value);
  });

  // Web Speech API for Voice Input
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = function() {
      micBtn.classList.add('recording');
      inputEl.placeholder = "Listening...";
    };

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      inputEl.value = transcript;
      handleUserMessage(transcript);
    };

    recognition.onerror = function(event) {
      console.error("Speech recognition error", event.error);
      micBtn.classList.remove('recording');
      inputEl.placeholder = "Ask anything...";
    };

    recognition.onend = function() {
      micBtn.classList.remove('recording');
      inputEl.placeholder = "Ask anything...";
    };

    micBtn.addEventListener('click', () => {
      if (micBtn.classList.contains('recording')) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
  } else {
    // Hide mic button if not supported
    if (micBtn) micBtn.style.display = 'none';
  }

  // Mobile Scroll Hide/Show Logic
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 768) {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        toggleBtn.classList.add('mobile-hide');
        chatWindow.classList.add('mobile-hide');
      } else {
        // Scrolling up
        toggleBtn.classList.remove('mobile-hide');
        chatWindow.classList.remove('mobile-hide');
      }
      lastScrollY = currentScrollY;
    }
  });
})();

