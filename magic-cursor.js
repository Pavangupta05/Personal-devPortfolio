// GIANT AWWWARDS DIFFERENCE CIRCLE LENS - OPTIMIZED HIGH PERFORMANCE
document.addEventListener("DOMContentLoaded", () => {
  // Clean up any existing cursor elements
  document.querySelectorAll('.cursor, .cursor-follower, #magic-cursor, .magic-trail-dot, .cuberto-cursor, .smooth-cursor-dot, .smooth-cursor-ring, .mc-ring').forEach(el => el.remove());

  // Check if touch device / mobile
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 768);
  if (isTouch) return; // Custom desktop cursor omitted on mobile touchscreens for 60fps performance

  // Hide native browser cursor on fine pointers
  const style = document.createElement('style');
  style.textContent = `
    @media (pointer: fine) {
      html, body, a, button, input, textarea, select, .project-card, .skill-card, .nav-links-pill a, .social-icon-btn, .theme-toggle, .typing-title, .typing-text, .typing-hero, .section-title, h1, h2, h3, .stat-card, .experience-card, .browser-mockup {
        cursor: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  const NUM_DOTS = 12;
  const SPACING = 2;
  const dots = [];

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const history = Array(NUM_DOTS * SPACING).fill(null).map(() => ({ x: mouse.x, y: mouse.y }));
  let headScale = 0.045;

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  for (let i = 0; i < NUM_DOTS; i++) {
    const dot = document.createElement('div');
    dot.className = 'magic-trail-dot';
    
    if (i === 0) {
      Object.assign(dot.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '400px',
        height: '400px',
        backgroundColor: 'white',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: '2147483647',
        mixBlendMode: 'difference',
        opacity: '0.95',
        transform: `translate3d(${mouse.x - 200}px, ${mouse.y - 200}px, 0px) scale(${headScale})`,
        willChange: 'transform'
      });
    } else {
      const size = 16 - (i * (13 / (NUM_DOTS - 1)));
      const opacity = 0.9 - (i * (0.8 / (NUM_DOTS - 1)));
      Object.assign(dot.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: 'white',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: (2147483646 - i).toString(),
        mixBlendMode: 'difference',
        opacity: opacity.toString(),
        transform: `translate3d(${mouse.x - size / 2}px, ${mouse.y - size / 2}px, 0px)`,
        willChange: 'transform'
      });
    }
    document.body.appendChild(dot);
    dots.push(dot);
  }

  function setScale(s, duration = 0.3, ease = 'power2.out') {
    headScale = s;
    if (window.gsap && dots[0]) {
      gsap.to(dots[0], {
        scale: s,
        duration: duration,
        ease: ease,
        overwrite: 'auto'
      });
    }
  }

  function animate() {
    history.unshift({ x: mouse.x, y: mouse.y });
    history.pop();

    for (let index = 0; index < dots.length; index++) {
      const dot = dots[index];
      const point = history[index * SPACING] || mouse;
      
      if (index === 0) {
        const currentScale = dots[0]._gsap ? (dots[0]._gsap.scaleX || headScale) : headScale;
        dot.style.transform = `translate3d(${point.x - 200}px, ${point.y - 200}px, 0px) scale(${currentScale})`;
      } else {
        const size = 16 - (index * (13 / (NUM_DOTS - 1)));
        dot.style.transform = `translate3d(${point.x - (size / 2)}px, ${point.y - (size / 2)}px, 0px)`;
      }
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  function initHoverListeners() {
    document.querySelectorAll('.typing-title, .typing-text, .typing-hero, .hero-greeting').forEach(el => {
      el.addEventListener('mouseenter', () => setScale(0.55, 0.4, 'back.out(2)'), { passive: true });
      el.addEventListener('mouseleave', () => setScale(0.045, 0.35, 'power3.out'), { passive: true });
    });

    document.querySelectorAll('h1, h2, h3, .section-title, .coming-soon-text').forEach(el => {
      el.addEventListener('mouseenter', () => setScale(0.325, 0.35, 'back.out(1.5)'), { passive: true });
      el.addEventListener('mouseleave', () => setScale(0.045, 0.3, 'power3.out'), { passive: true });
    });

    document.querySelectorAll('.project-card, .browser-mockup, .stack-project-card, .experience-card, .github-activity-card, .mac-terminal-card').forEach(el => {
      el.addEventListener('mouseenter', () => setScale(0.29, 0.35, 'power2.out'), { passive: true });
      el.addEventListener('mouseleave', () => setScale(0.045, 0.3, 'power3.out'), { passive: true });
    });

    document.querySelectorAll('.skill-card, .stat-card, .stat-number, .available-badge').forEach(el => {
      el.addEventListener('mouseenter', () => setScale(0.25, 0.3, 'power2.out'), { passive: true });
      el.addEventListener('mouseleave', () => setScale(0.045, 0.3, 'power3.out'), { passive: true });
    });

    document.querySelectorAll('a, button, .btn, .nav-links-pill a, .social-icon-btn, .theme-toggle').forEach(el => {
      el.addEventListener('mouseenter', () => setScale(0.225, 0.25, 'power2.out'), { passive: true });
      el.addEventListener('mouseleave', () => setScale(0.045, 0.25, 'power3.out'), { passive: true });
    });
  }

  initHoverListeners();
  setTimeout(initHoverListeners, 1000);
});
