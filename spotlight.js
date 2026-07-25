document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const wrap = document.getElementById('spotlightWrap');
  if (!wrap) return;

  const revealImg = wrap.querySelector('.photo-reveal');
  if (!revealImg) return;

  const state = {
    x: wrap.offsetWidth / 2,
    y: wrap.offsetHeight / 2
  };

  const useGsap = typeof gsap !== 'undefined';
  let xTo, yTo;

  if (useGsap) {
    xTo = gsap.quickTo(state, "x", { duration: 0.18, ease: "power2.out" });
    yTo = gsap.quickTo(state, "y", { duration: 0.18, ease: "power2.out" });
  }

  function renderMask() {
    const x = state.x;
    const y = state.y;
    const size = Math.min(wrap.offsetWidth, wrap.offsetHeight) || 450;
    const maskRadius = Math.max(180, Math.floor(size * 0.48));

    // Solid opaque core (#000 0% to 75%) to completely replace base photo under cursor (zero dual-image ghosting)
    const maskVal = `radial-gradient(circle ${maskRadius}px at ${x}px ${y}px, #000 0%, #000 75%, rgba(0,0,0,0) 100%)`;

    revealImg.style.webkitMaskImage = maskVal;
    revealImg.style.maskImage = maskVal;
  }
  
  if (useGsap) {
    gsap.ticker.add(renderMask);
  } else {
    const loop = () => {
      renderMask();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  const updatePos = (clientX, clientY) => {
    const rect = wrap.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    
    if (useGsap && xTo && yTo) {
      xTo(mouseX);
      yTo(mouseY);
    } else {
      state.x = mouseX;
      state.y = mouseY;
    }
  };

  wrap.addEventListener("mousemove", (e) => {
    updatePos(e.clientX, e.clientY);
  });

  wrap.addEventListener("mouseenter", (e) => {
    updatePos(e.clientX, e.clientY);
    revealImg.style.opacity = "1";
  });

  wrap.addEventListener("mouseleave", () => {
    revealImg.style.opacity = "0";
  });

  wrap.addEventListener("touchstart", (e) => {
    if (e.touches.length > 0) {
      updatePos(e.touches[0].clientX, e.touches[0].clientY);
      revealImg.style.opacity = "1";
    }
  }, { passive: true });

  wrap.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      updatePos(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  wrap.addEventListener("touchend", () => {
    revealImg.style.opacity = "0";
  });
});
