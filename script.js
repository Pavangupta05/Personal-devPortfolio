// ─────────────────────────────────────────────────────────────────────────────
//  PERFORMANCE-OPTIMISED SCRIPT
//  Key changes vs. original:
//  • Single merged, passive, rAF-throttled scroll handler
//  • Cached getBoundingClientRect (not recalculated on every mousemove)
//  • drawLines() skipped on mobile entirely
//  • One ScrollReveal init block (duplicate removed)
//  • All event listeners marked passive where possible
// ─────────────────────────────────────────────────────────────────────────────

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

  // ── PARTICLE CANVAS ─────────────────────────────────────────────────────────
  const canvas = document.getElementById("bg-canvas");
  if (canvas) {
    const isMobile = window.innerWidth < 768;
    // alpha:false = skip alpha-compositing pass → faster rendering
    const ctx = canvas.getContext("2d", { alpha: false });
    const particleCount = isMobile ? 20 : 50;
    const connectionDistance = 120;
    const connDistSq = connectionDistance * connectionDistance;
    const mouseRadius = 120;
    const mouseRadSq  = mouseRadius * mouseRadius;

    let particles = [];
    let mouse = { x: null, y: null };
    let scrollYOffset = 0;
    let animationId = null;
    let frameCount = 0;

    // Throttled mouse (~30 fps cap)
    let mouseTick = false;
    window.addEventListener("mousemove", e => {
      if (mouseTick) return;
      mouseTick = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setTimeout(() => { mouseTick = false; }, 32);
    }, { passive: true });
    window.addEventListener("mouseout", () => { mouse.x = null; mouse.y = null; }, { passive: true });

    // Pause when tab hidden
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { if (animationId) cancelAnimationFrame(animationId); }
      else animate();
    });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x    = Math.random() * canvas.width;
        this.y    = Math.random() * canvas.height;
        this.vx   = (Math.random() - 0.5) * 0.3;
        this.vy   = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.8;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        const pY = scrollYOffset * 0.08;
        const cy = this.y + pY;
        if (cy < 0) this.y += canvas.height;
        if (cy > canvas.height) this.y -= canvas.height;
        if (mouse.x != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - cy;
          const dSq = dx * dx + dy * dy;
          if (dSq < mouseRadSq) {
            const d = Math.sqrt(dSq);
            const f = (mouseRadius - d) / mouseRadius;
            this.x -= (dx / d) * f * 1.2;
            this.y -= (dy / d) * f * 1.2;
          }
        }
      }
      draw(pY) {
        ctx.beginPath();
        ctx.arc(this.x, this.y + pY, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: particleCount }, () => new Particle());
    }

    // O(n²) line drawing — skipped entirely on mobile
    function drawLines(pY) {
      if (isMobile) return;
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx  = particles[i].x - particles[j].x;
          const dy  = particles[i].y - particles[j].y;
          const dSq = dx * dx + dy * dy;
          if (dSq < connDistSq) {
            const opacity = (1 - Math.sqrt(dSq) / connectionDistance) * 0.12;
            ctx.strokeStyle = `rgba(0,191,255,${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y + pY);
            ctx.lineTo(particles[j].x, particles[j].y + pY);
            ctx.stroke();
          }
        }
      }
    }

    let lastTime = 0;
    const fpsInterval = isMobile ? 1000 / 30 : 0;

    function animate(time) {
      animationId = requestAnimationFrame(animate);
      if (fpsInterval > 0) {
        const elapsed = time - lastTime;
        if (elapsed < fpsInterval) return;
        lastTime = time - (elapsed % fpsInterval);
      }
      frameCount++;
      const pY = scrollYOffset * 0.08;
      // Must fill bg each frame because alpha:false skips transparent clear
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0,191,255,0.3)";
      particles.forEach(p => { p.update(); p.draw(pY); });
      if (frameCount % 2 === 0) drawLines(pY); // lines every other frame
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 200);
    }, { passive: true });
    init();
    animate();

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
    r.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:6px;height:6px;border-radius:50%;transform:translate(-50%,-50%) scale(0);background:rgba(10,132,255,.35);border:1.5px solid rgba(255,255,255,.55);pointer-events:none;z-index:99997;animation:liquidRipple 0.7s cubic-bezier(.23,1,.32,1) forwards`;
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

// ── FEATURE 3: LIVE DEV DASHBOARD ─────────────────────────────────────────
function initDashboard() {
  const section = document.getElementById('dashboard');
  if (!section) return;

  const sparks = {
    sockets: { id: 'spark-sockets', data: [], color: '#0A84FF', max: 110 },
    queries: { id: 'spark-queries', data: [], color: '#32D74B', max: 200 },
    tokens:  { id: 'spark-tokens',  data: [], color: '#BF5AF2', max: 1000 },
    uptime:  { id: 'spark-uptime',  data: [], color: '#FF9F0A', max: 100  },
  };

  Object.values(sparks).forEach(s => {
    for (let i = 0; i < 30; i++) s.data.push(s.max * (0.25 + Math.random() * 0.45));
  });

  const mainData = {
    starnote: Array.from({length:30}, () => 20 + Math.random() * 45),
    talknow:  Array.from({length:30}, () => 10 + Math.random() * 30),
  };

  function drawSparkline(cfg) {
    const canvas = document.getElementById(cfg.id);
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (!rect.width) return;
    canvas.width = rect.width; canvas.height = 48;
    const ctx = canvas.getContext('2d');
    const { data, color, max } = cfg;
    const W = rect.width, H = 48;
    const stepX = W / (data.length - 1);
    const pts = data.map((v, i) => ({ x: i * stepX, y: H - Math.max(2, (v / max) * (H - 4)) }));
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, color + '45'); grad.addColorStop(1, color + '00');
    ctx.beginPath(); ctx.moveTo(pts[0].x, H);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length-1].x, H); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
  }

  function drawMainChart() {
    const canvas = document.getElementById('mainDashChart');
    if (!canvas) return;
    const W = (canvas.parentElement.clientWidth - 44) || 600;
    canvas.width = W; canvas.height = 150;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, 150);
    const drawLine = (data, color) => {
      const max = 100, stepX = W / (data.length - 1);
      const pts = data.map((v, i) => ({ x: i * stepX, y: 150 - (v / max) * 130 - 10 }));
      const grad = ctx.createLinearGradient(0, 0, 0, 150);
      grad.addColorStop(0, color + '30'); grad.addColorStop(1, color + '00');
      ctx.beginPath(); ctx.moveTo(pts[0].x, 150);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(pts[pts.length-1].x, 150); ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const cpx = (pts[i-1].x + pts[i].x) / 2;
        ctx.bezierCurveTo(cpx, pts[i-1].y, cpx, pts[i].y, pts[i].x, pts[i].y);
      }
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
    };
    drawLine(mainData.starnote, '#0A84FF');
    drawLine(mainData.talknow, '#32D74B');
  }

  const LOG_NORMAL = ['GET /api/notes 200 11ms','POST /api/auth/login 200 7ms','WebSocket connection established','MongoDB query: users.find() 3ms','AI response cached successfully','GET /api/chat 200 5ms','Socket.io heartbeat OK','Gemini API: 320 tokens used','JWT verified successfully'];
  const LOG_STRESS = ['⚠ CPU spike: 91%','⚠ Memory pressure: 1.7GB/2GB','ERROR: Connection pool exhausted!','🔴 Response time: 2200ms','Socket.io: 840 concurrent users','⚠ Rate limit approaching','MongoDB: slow query 820ms','🔴 ERROR: AI API timeout'];

  let stressMode = false, dashInterval = null, tickCount = 0;

  function getTime() {
    return new Date().toLocaleTimeString('en-US', { hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit' });
  }

  function pushLog(feedId, level, msg) {
    const feed = document.getElementById(feedId);
    if (!feed) return;
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-time">${getTime()}</span><span class="log-level ${level}">[${level.toUpperCase()}]</span><span class="log-msg">${msg}</span>`;
    feed.appendChild(entry);
    while (feed.children.length > 22) feed.removeChild(feed.firstChild);
    feed.scrollTop = feed.scrollHeight;
  }

  function dashTick() {
    tickCount++;
    const stress = stressMode;
    const rand = (lo, hi) => lo + Math.random() * (hi - lo);
    sparks.sockets.data.push(stress ? rand(55,110) : rand(8,55));   sparks.sockets.data.shift();
    sparks.queries.data.push(stress ? rand(120,200) : rand(20,90)); sparks.queries.data.shift();
    sparks.tokens.data.push(stress ? rand(600,980) : rand(80,500)); sparks.tokens.data.shift();
    sparks.uptime.data.push(stress ? rand(91,97) : rand(99.7,100)); sparks.uptime.data.shift();
    mainData.starnote.push(stress ? rand(65,95) : rand(15,55)); mainData.starnote.shift();
    mainData.talknow.push(stress ? rand(50,85) : rand(10,40));  mainData.talknow.shift();

    const last = key => Math.round(sparks[key].data[sparks[key].data.length-1]);
    const sEl = document.getElementById('metric-sockets'), qEl = document.getElementById('metric-queries');
    const tEl = document.getElementById('metric-tokens'),  uEl = document.getElementById('metric-uptime');
    if (sEl) sEl.textContent = last('sockets');
    if (qEl) qEl.textContent = last('queries');
    if (tEl) tEl.textContent = last('tokens');
    if (uEl) uEl.textContent = stress ? '97.1%' : '99.9%';

    Object.values(sparks).forEach(s => drawSparkline(s));
    if (tickCount % 2 === 0) drawMainChart();

    if (tickCount % 3 === 0) {
      const pool = stress ? LOG_STRESS : LOG_NORMAL;
      const lvl  = stress ? (Math.random()>0.4 ? 'warn' : 'err') : (Math.random()>0.25 ? 'ok' : 'info');
      pushLog('log-starnote', lvl, pool[Math.floor(Math.random()*pool.length)]);
    }
    if (tickCount % 4 === 0) {
      const pool = stress ? LOG_STRESS : LOG_NORMAL;
      pushLog('log-talknow', stress ? (Math.random()>0.5?'warn':'err') : 'ok', pool[Math.floor(Math.random()*pool.length)]);
    }
  }

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      if (!dashInterval) {
        pushLog('log-starnote','ok','Server started on port 5000');
        pushLog('log-starnote','info','Connected to MongoDB Atlas');
        pushLog('log-starnote','ok','Gemini API client initialized');
        pushLog('log-talknow','ok','Socket.io server started');
        pushLog('log-talknow','info','JWT middleware attached');
        pushLog('log-talknow','ok','Google OAuth configured');
        dashInterval = setInterval(dashTick, 500);
      }
    } else {
      if (dashInterval) { clearInterval(dashInterval); dashInterval = null; }
    }
  }, { threshold: 0.15 });

  observer.observe(section);

  const stressBtn = document.getElementById('stress-test-btn');
  if (stressBtn) {
    stressBtn.addEventListener('click', () => {
      if (stressMode) return;
      stressMode = true; stressBtn.disabled = true;
      stressBtn.textContent = '⚡ Stress Test Active... (8s)';
      pushLog('log-starnote','warn','🚨 STRESS TEST INITIATED — load spike!');
      pushLog('log-talknow','warn','🚨 STRESS TEST INITIATED — load spike!');
      setTimeout(() => {
        stressMode = false; stressBtn.disabled = false;
        stressBtn.innerHTML = '⚡ Stress Test <span style="font-size:0.75rem;opacity:0.6">(Simulate Load Spike)</span>';
        pushLog('log-starnote','ok','✓ Stress test ended. System recovering.');
        pushLog('log-talknow','ok','✓ Stress test ended. System recovering.');
      }, 8000);
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
    initDashboard();
    initGalaxy();
  }
  if (document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run, { once: true });
})();
