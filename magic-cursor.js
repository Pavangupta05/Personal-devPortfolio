// MAGIC CURSOR TRAIL INTERACTION LAYER

window.addEventListener('DOMContentLoaded', () => {
  // 1. HIDE NATIVE CURSOR & BAIL ON TOUCH / REDUCED MOTION
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!isFinePointer || prefersReducedMotion) return;

  // Remove any old cursors
  document.querySelectorAll('.cursor, .cursor-follower, #magic-cursor, .magic-trail-dot').forEach(el => el.remove());

  // 2. TRAIL DOTS SETUP
  const NUM_DOTS = 15; 
  const SPACING = 2;   
  const dots = [];

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const history = Array(NUM_DOTS * SPACING).fill({ x: mouse.x, y: mouse.y });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  for (let i = 0; i < NUM_DOTS; i++) {
    const dot = document.createElement('div');
    dot.className = 'magic-trail-dot';
    
    const size = 16 - (i * (13 / (NUM_DOTS - 1))); 
    const opacity = 0.9 - (i * (0.8 / (NUM_DOTS - 1))); 
    
    if (i === 0) {
      // HEAD DOT: Natively massive (400px) so scaling it up remains razor-sharp and avoids browser pixelation.
      Object.assign(dot.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '400px',
        height: '400px',
        backgroundColor: 'white',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: '99999',
        mixBlendMode: 'difference',
        opacity: opacity,
        willChange: 'transform'
      });
      document.body.appendChild(dot);
      dots.push(dot);
      
      // Default state: scale down to 16px (16 / 400 = 0.04)
      gsap.set(dot, { xPercent: -50, yPercent: -50, scale: 0.04 });
    } else {
      // TAIL DOTS: Natively small
      Object.assign(dot.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: 'white',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: '99998',
        mixBlendMode: 'difference',
        opacity: opacity,
        willChange: 'transform'
      });
      document.body.appendChild(dot);
      dots.push(dot);
      gsap.set(dot, { xPercent: -50, yPercent: -50 });
    }
  }

  const style = document.createElement('style');
  style.textContent = `
    @media (pointer: fine) {
      html, body, a, button, input, textarea, select, .project-card, .skill-card, .nav-links-pill a, .social-icon-btn, .theme-toggle, .typing-title {
        cursor: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  // 3. CONTINUOUS HISTORY BUFFER PHYSICS
  gsap.ticker.add(() => {
    const head = history[0];
    
    const newX = head.x + (mouse.x - head.x) * 0.45;
    const newY = head.y + (mouse.y - head.y) * 0.45;
    
    history.unshift({ x: newX, y: newY });
    history.pop();

    for (let i = 0; i < NUM_DOTS; i++) {
      const p = history[i * SPACING];
      gsap.set(dots[i], { x: p.x, y: p.y });
    }
  });

  // 4. DYNAMIC HOVER STATE
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .project-card, .skill-card, .social-icon-btn, .theme-toggle');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      // Exclude the hero title from generic hover rules
      if (e.target.closest('.typing-title')) return;

      const computedStyle = window.getComputedStyle(e.target);
      const fontSize = parseFloat(computedStyle.fontSize);
      
      let dynamicScale = 2.2; 
      
      if (!isNaN(fontSize) && fontSize > 0) {
        dynamicScale = Math.max(1.5, Math.min(5, (fontSize / 12) + 0.5));
      }
      
      

      // Base scale of head dot is 0.04
      gsap.to(dots[0], { scale: 0.04 * dynamicScale, duration: 0.3, ease: 'power2.out' });
    });
    
    el.addEventListener('mouseleave', (e) => {
      if (e.target.closest('.typing-title')) return;
      // Return to base 16px size
      gsap.to(dots[0], { scale: 0.04, duration: 0.3, ease: 'power2.out' });
    });
  });

  // 5. HERO TITLE SPOTLIGHT REVEAL EFFECT
  const heroTitle = document.querySelector('.typing-title');
  if (heroTitle) {
    heroTitle.addEventListener('mouseenter', () => {
      // Scale up to full native 400px size for a perfectly crisp circle
      gsap.to(dots[0], { scale: 1, duration: 0.4, ease: 'power3.out' });
      
      for (let i = 1; i < NUM_DOTS; i++) {
        gsap.to(dots[i], { opacity: 0, duration: 0.2, ease: 'power1.out' });
      }
    });

    heroTitle.addEventListener('mouseleave', () => {
      // Shrink back to 16px
      gsap.to(dots[0], { scale: 0.04, duration: 0.4, ease: 'power3.out' });
      
      for (let i = 1; i < NUM_DOTS; i++) {
        const originalOpacity = 0.9 - (i * (0.8 / (NUM_DOTS - 1)));
        gsap.to(dots[i], { opacity: originalOpacity, duration: 0.4, ease: 'power1.out' });
      }
    });
  }
});
