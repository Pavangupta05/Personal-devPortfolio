// GIANT AWWWARDS DIFFERENCE CIRCLE LENS (220px SUPER-SIZE OVER NAME)
document.addEventListener("DOMContentLoaded", () => {
  // Clean up any existing cursor elements
  document.querySelectorAll('.cursor, .cursor-follower, #magic-cursor, .magic-trail-dot, .cuberto-cursor, .smooth-cursor-dot, .smooth-cursor-ring, .mc-ring').forEach(el => el.remove());

  // Hide native browser cursor across interactive elements
  const style = document.createElement('style');
  style.textContent = `
    @media (pointer: fine) {
      html, body, a, button, input, textarea, select, .project-card, .skill-card, .nav-links-pill a, .social-icon-btn, .theme-toggle, .typing-title, .typing-text, .typing-hero, .section-title, h1, h2, h3, .stat-card, .experience-card, .browser-mockup {
        cursor: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  const NUM_DOTS = 15;
  const SPACING = 2;
  const dots = [];

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const history = Array(NUM_DOTS * SPACING).fill(null).map(() => ({ x: mouse.x, y: mouse.y }));

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  for (let i = 0; i < NUM_DOTS; i++) {
    const dot = document.createElement('div');
    dot.className = 'magic-trail-dot';
    
    if (i === 0) {
      // HEAD DOT (Natively 400px so scaling to 0.55 creates a colossal 220px difference lens)
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
        transform: 'translate(-50%, -50%) scale(0.045)',
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
        transform: 'translate(-50%, -50%)',
        willChange: 'transform'
      });
    }
    document.body.appendChild(dot);
    dots.push(dot);
  }

  function animate() {
    history.unshift({ x: mouse.x, y: mouse.y });
    history.pop();

    dots.forEach((dot, index) => {
      const historyIndex = index * SPACING;
      const point = history[historyIndex] || mouse;
      
      if (index === 0) {
        const currentTransform = dot.style.transform || '';
        const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
        const currentScale = scaleMatch ? scaleMatch[1] : '0.045';
        dot.style.transform = `translate(${point.x - 200}px, ${point.y - 200}px) scale(${currentScale})`;
      } else {
        const size = 16 - (index * (13 / (NUM_DOTS - 1)));
        dot.style.transform = `translate(${point.x - (size / 2)}px, ${point.y - (size / 2)}px)`;
      }
    });

    requestAnimationFrame(animate);
  }
  animate();

  // HIGH-IMPACT MULTI-ELEMENT DIFFERENCE CIRCLE LENS
  function initHoverListeners() {
    // 1. COLOSSAL LENS (220px - scale 0.55) WITH ELASTIC SPRING POP ON NAME
    document.querySelectorAll('.typing-title, .typing-text, .typing-hero, .hero-greeting').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (window.gsap) gsap.to(dots[0], { scale: 0.55, duration: 0.4, ease: 'back.out(2)' });
      });
      el.addEventListener('mouseleave', () => {
        if (window.gsap) gsap.to(dots[0], { scale: 0.045, duration: 0.35, ease: 'power3.out' });
      });
    });

    // 2. LARGE LENS (130px - scale 0.325) for Section Titles, H1, H2, H3
    document.querySelectorAll('h1, h2, h3, .section-title, .coming-soon-text').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (window.gsap) gsap.to(dots[0], { scale: 0.325, duration: 0.35, ease: 'back.out(1.5)' });
      });
      el.addEventListener('mouseleave', () => {
        if (window.gsap) gsap.to(dots[0], { scale: 0.045, duration: 0.3, ease: 'power3.out' });
      });
    });

    // 3. MEDIUM-LARGE LENS (115px - scale 0.29) for Project Cards, Browser Mockups, Terminal Cards & Experience Cards
    document.querySelectorAll('.project-card, .browser-mockup, .stack-project-card, .experience-card, .github-activity-card, .mac-terminal-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (window.gsap) gsap.to(dots[0], { scale: 0.29, duration: 0.35, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        if (window.gsap) gsap.to(dots[0], { scale: 0.045, duration: 0.3, ease: 'power3.out' });
      });
    });

    // 4. MEDIUM LENS (100px - scale 0.25) for Skill Cards & Stat Numbers
    document.querySelectorAll('.skill-card, .stat-card, .stat-number, .available-badge').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (window.gsap) gsap.to(dots[0], { scale: 0.25, duration: 0.3, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        if (window.gsap) gsap.to(dots[0], { scale: 0.045, duration: 0.3, ease: 'power3.out' });
      });
    });

    // 5. STANDARD BUTTON & LINK LENS (90px - scale 0.225) for Buttons, Nav Links & Social Icons
    document.querySelectorAll('a, button, .btn, .nav-links-pill a, .social-icon-btn, .theme-toggle').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (window.gsap) gsap.to(dots[0], { scale: 0.225, duration: 0.25, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        if (window.gsap) gsap.to(dots[0], { scale: 0.045, duration: 0.25, ease: 'power3.out' });
      });
    });
  }

  initHoverListeners();

  // Re-bind listeners when dynamic content renders
  setTimeout(initHoverListeners, 1000);
});
