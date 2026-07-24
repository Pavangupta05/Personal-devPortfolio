const fs = require('fs');

// ========================================================
// 1. UPDATE CSS (height: 115%)
// ========================================================
let css = fs.readFileSync('style.css', 'utf8');

const oldImgCss = `.browser-mockup img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}`;
const newImgCss = `.browser-mockup img {
  width: 100%;
  height: 115%; /* Allow room for parallax drift without empty edges */
  object-fit: cover;
  display: block;
  transform-origin: center;
}`;

css = css.replace(oldImgCss, newImgCss);
fs.writeFileSync('style.css', css);
console.log('Updated CSS for parallax image height.');


// ========================================================
// 2. UPDATE GSAP IN SCRIPT.JS
// ========================================================
let js = fs.readFileSync('script.js', 'utf8');

// The block to replace inside matchMedia "(min-width: 768px)"
const oldGSAPBlock = `      cards.forEach((card, i) => {
        // Enforce DOM z-index so lower cards sit on top of earlier cards
        card.style.zIndex = i + 1;

        // Skip the very last card because there is no "next card" to cover it!
        if (i === cards.length - 1) return;

        // The overlay div inside the card used for dimming
        const overlay = card.querySelector('.sticky-card-overlay');

        // We want the current card to dim/scale exactly as the NEXT card slides over it.
        // The trigger is the current card hitting its sticky top (120px).
        // The scrub ends when the current card has scrolled up by an amount equal to its own height.
        gsap.to(card, {
          scale: 0.94,
          scrollTrigger: {
            trigger: card,
            start: "top top+=120",
            end: () => "+=" + card.offsetHeight, // The distance it takes for the next card to fully cover it
            scrub: true,
            invalidateOnRefresh: true // Re-calc height on resize
          }
        });

        if (overlay) {
          gsap.to(overlay, {
            opacity: 0.7,
            scrollTrigger: {
              trigger: card,
              start: "top top+=120",
              end: () => "+=" + card.offsetHeight,
              scrub: true,
              invalidateOnRefresh: true
            }
          });
        }
      });`;

const newGSAPBlock = `      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      cards.forEach((card, i) => {
        // Enforce DOM z-index so lower cards sit on top of earlier cards
        card.style.zIndex = i + 1;

        // DOM Elements
        const overlay = card.querySelector('.sticky-card-overlay');
        const cardLeft = card.querySelector('.card-left');
        const img = card.querySelector('.browser-mockup img');
        const dots = card.querySelectorAll('.browser-header .dot');
        const mockupContainer = card.querySelector('.browser-mockup');

        // ==========================================
        // 1. ENTRY & PARALLAX ANIMATIONS (All Cards)
        // ==========================================
        if (!prefersReducedMotion && img && cardLeft) {
          
          // Set initial will-change for performance
          gsap.set(img, { willChange: "transform, clip-path", clipPath: "inset(100% 0 0 0)", scale: 1.08 });
          gsap.set(dots, { scale: 0, opacity: 0 });
          gsap.set(cardLeft, { opacity: 0, y: 30 });

          // Create the Entry Timeline
          const entryTl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top top+=130", // Triggers just as it pins
              toggleActions: "play none none reverse"
            },
            onComplete: () => {
              // Clean up GPU flags after entry
              gsap.set(img, { willChange: "auto" });

              // Create Parallax Scrub ScrollTrigger ONLY after entry finishes
              gsap.fromTo(img, 
                { yPercent: -5 },
                {
                  yPercent: 5,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top top+=120",
                    end: () => "+=" + (card.offsetHeight * 1.5),
                    scrub: true
                  }
                }
              );
            }
          });

          // Left Column Entry
          entryTl.to(cardLeft, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0);
          
          // Mockup Dots Boot-up
          if (dots.length) {
            entryTl.to(dots, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: "back.out(1.5)" }, 0.15);
          }
          
          // Image Reveal & Settle
          entryTl.to(img, {
            clipPath: "inset(0% 0 0 0)",
            scale: 1,
            duration: 0.9,
            ease: "power3.out"
          }, 0.2);

          // Hover Micro-interaction
          if (mockupContainer) {
            mockupContainer.addEventListener('mouseenter', () => {
              gsap.to(img, { scale: 1.03, duration: 0.4, ease: "power2.out", overwrite: "auto" });
            });
            mockupContainer.addEventListener('mouseleave', () => {
              gsap.to(img, { scale: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
            });
          }

        } else if (img && cardLeft) {
          // Reduced Motion Fallback
          gsap.set(img, { clipPath: "inset(0% 0 0 0)", scale: 1, opacity: 0 });
          gsap.to([cardLeft, img], {
            opacity: 1,
            duration: 0.5,
            scrollTrigger: { trigger: card, start: "top top+=130", toggleActions: "play none none reverse" }
          });
        }


        // ==========================================
        // 2. DIMMING STACK ANIMATION (Skipped for last card)
        // ==========================================
        if (i !== cards.length - 1) {
          gsap.to(card, {
            scale: 0.94,
            scrollTrigger: {
              trigger: card,
              start: "top top+=120",
              end: () => "+=" + card.offsetHeight, 
              scrub: true,
              invalidateOnRefresh: true 
            }
          });

          if (overlay) {
            gsap.to(overlay, {
              opacity: 0.7,
              scrollTrigger: {
                trigger: card,
                start: "top top+=120",
                end: () => "+=" + card.offsetHeight,
                scrub: true,
                invalidateOnRefresh: true
              }
            });
          }
        }
      });`;

// Execute string replacement using regex or split to avoid exact whitespace mismatch
js = js.replace(oldGSAPBlock, newGSAPBlock);
fs.writeFileSync('script.js', js);
console.log('Updated GSAP animations in script.js');
