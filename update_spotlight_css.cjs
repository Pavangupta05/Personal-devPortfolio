const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const spotlightCSS = `
/* ==========================================================
   SPOTLIGHT REVEAL EFFECT (ABOUT PAGE)
   ========================================================== */
.profile-photo-wrap {
  position: relative;
  width: 100%;
  max-width: 450px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  cursor: crosshair;
  aspect-ratio: 1 / 1.1; /* Optional: maintains a nice portrait ratio if images differ */
}

.photo-base, .photo-reveal {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.photo-reveal {
  position: absolute;
  top: 0;
  left: 0;
  clip-path: circle(0px at 50% 50%);
  pointer-events: none; /* Let mouse events pass to wrap */
  z-index: 2;
}

.spotlight-ring {
  position: absolute;
  top: 0; left: 0;
  width: 0px; height: 0px;
  border-radius: 50%;
  border: 2px solid rgba(0, 230, 255, 0.8);
  box-shadow: 0 0 20px rgba(0, 230, 255, 0.5), inset 0 0 15px rgba(0, 230, 255, 0.3);
  pointer-events: none;
  z-index: 3;
  opacity: 0; /* Hidden by default */
  transform: translate(-50%, -50%); /* Centers the ring on the X/Y coords */
}
`;

if (!css.includes('.profile-photo-wrap')) {
  fs.appendFileSync('style.css', '\n' + spotlightCSS);
  console.log('Appended spotlight CSS to style.css.');
}
