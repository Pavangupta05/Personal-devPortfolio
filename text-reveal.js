function initReveal() {
  if (!window.gsap || !window.ScrollTrigger) {
    console.warn("GSAP not ready for text reveal.");
    return;
  }

  const revealElements = gsap.utils.toArray('.text-reveal');

  // We will batch them so they stagger nicely when appearing together!
  ScrollTrigger.batch(revealElements, {
    start: 'top 90%',
    onEnter: (batch) => {
      batch.forEach((el, index) => {
        if (el.dataset.revealInit) return; // Prevent double trigger
        el.dataset.revealInit = "true";

        const originalHTML = el.innerHTML;
        el.innerHTML = '';
        
        const wrapper = document.createElement('span');
        wrapper.className = 'text-reveal-wrapper';
        wrapper.style.display = 'inline-block';
        wrapper.style.overflow = 'hidden';
        wrapper.style.verticalAlign = 'bottom';
        wrapper.style.width = '100%'; // Ensure block-level texts like <p> don't collapse horizontally
        
        const inner = document.createElement('span');
        inner.className = 'text-reveal-inner';
        inner.style.display = 'inline-block';
        inner.style.transformOrigin = 'left top';
        inner.innerHTML = originalHTML;
        inner.style.width = '100%';
        
        wrapper.appendChild(inner);
        el.appendChild(wrapper);
        
        // Reveal parent
        el.style.opacity = '1';
        el.style.visibility = 'visible';

        // Add a slight delay based on the index in the batch so they stagger beautifully!
        gsap.fromTo(inner,
          { 
            y: '120%', 
            rotation: 3, 
            opacity: 0 
          },
          {
            y: '0%',
            rotation: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            delay: index * 0.15 + 0.1, // Stagger them
            overwrite: "auto"
          }
        );
      });
    }
  });
}

// Ensure execution
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initReveal, 50); // slight timeout to ensure fonts/layout are ready
} else {
  document.addEventListener("DOMContentLoaded", () => setTimeout(initReveal, 50));
}
