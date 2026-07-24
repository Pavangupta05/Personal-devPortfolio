const fs = require('fs');

// ========================================================
// 1. FIX PROJECTS.HTML DOM STRUCTURE
// ========================================================
let html = fs.readFileSync('projects.html', 'utf8');

// Move overlay inside card-inner so they scale together
html = html.replace(/<div class="sticky-card-overlay"><\/div>\s*<div class="card-inner">/g, '<div class="card-inner">\n        <div class="sticky-card-overlay"></div>');
fs.writeFileSync('projects.html', html);
console.log('Moved overlay inside card-inner in HTML.');

// ========================================================
// 2. FIX SCRIPT.JS GSAP TRIGGER BUG
// ========================================================
// NEVER animate the trigger element! We must animate card-inner instead.
let js = fs.readFileSync('script.js', 'utf8');

const oldScrubBlock = `        if (i !== cards.length - 1) {
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
        }`;

const newScrubBlock = `        if (i !== cards.length - 1) {
          const cardInner = card.querySelector('.card-inner');
          
          if (cardInner) {
            gsap.to(cardInner, {
              scale: 0.94,
              scrollTrigger: {
                trigger: card, // trigger is the sticky wrapper (static size)
                start: "top top+=120",
                end: () => "+=" + card.offsetHeight, 
                scrub: true,
                invalidateOnRefresh: true 
              }
            });
          }

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
        }`;

js = js.replace(oldScrubBlock, newScrubBlock);
fs.writeFileSync('script.js', js);
console.log('Fixed GSAP trigger scaling bug in script.js.');

// ========================================================
// 3. FIX CSS will-change on sticky element
// ========================================================
let css = fs.readFileSync('style.css', 'utf8');
css = css.replace(/will-change:\s*transform,\s*opacity\s*!important;/g, '');
fs.writeFileSync('style.css', css);
console.log('Removed will-change from sticky elements in style.css to prevent Chromium rendering bugs.');
