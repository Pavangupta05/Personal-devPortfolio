document.addEventListener("DOMContentLoaded", () => {
  // 1. Accessibility & Device Check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = !window.matchMedia('(pointer: fine)').matches;

  if (prefersReducedMotion || isTouchDevice) {
    // Graceful fallback for touch/reduced motion: Just show base photo, don't init effect.
    return;
  }

  const wrap = document.getElementById('spotlightWrap');
  if (!wrap) return;

  const revealImg = wrap.querySelector('.photo-reveal');
  const ring = wrap.querySelector('.spotlight-ring');
  
  if (!revealImg || !ring) return;

  // 2. State object to interpolate values via GSAP
  const state = {
    x: wrap.offsetWidth / 2, // Start center
    y: wrap.offsetHeight / 2,
    radius: 0
  };

  const MAX_RADIUS = 140;

  // 3. QuickTo setup for buttery smooth cursor tracking
  const xTo = gsap.quickTo(state, "x", { duration: 0.4, ease: "power3" });
  const yTo = gsap.quickTo(state, "y", { duration: 0.4, ease: "power3" });

  // 4. Update function tied to GSAP ticker
  function renderMask() {
    revealImg.style.clipPath = \`circle(\${state.radius}px at \${state.x}px \${state.y}px)\`;
    
    // Update Ring to match
    ring.style.left = \`\${state.x}px\`;
    ring.style.top = \`\${state.y}px\`;
    ring.style.width = \`\${state.radius * 2}px\`;
    ring.style.height = \`\${state.radius * 2}px\`;
  }
  
  gsap.ticker.add(renderMask);

  // 5. Event Listeners
  wrap.addEventListener("mousemove", (e) => {
    const rect = wrap.getBoundingClientRect();
    // Get mouse pos relative to the container
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    xTo(mouseX);
    yTo(mouseY);
  });

  wrap.addEventListener("mouseenter", () => {
    // Optimize rendering during active hover
    revealImg.style.willChange = "clip-path";
    
    // Animate radius up
    gsap.to(state, {
      radius: MAX_RADIUS,
      duration: 0.4,
      ease: "power2.out"
    });
    
    // Fade in ring
    gsap.to(ring, {
      opacity: 1,
      duration: 0.3
    });
  });

  wrap.addEventListener("mouseleave", () => {
    // Animate radius down
    gsap.to(state, {
      radius: 0,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => {
        revealImg.style.willChange = "auto";
      }
    });

    // Fade out ring
    gsap.to(ring, {
      opacity: 0,
      duration: 0.3
    });
  });
});
