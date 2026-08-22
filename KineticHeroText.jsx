import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * KineticHeroText Component
 * 
 * Balanced S-Curve Wave Kinetic Hero Animation
 * 
 * Phrase: "FROM CONCEPT TO REALITY - I BUILD WHAT MATTERS."
 */
const KineticHeroText = ({ phrase = "FROM CONCEPT TO REALITY - I BUILD WHAT MATTERS." }) => {
  const sectionRef = useRef(null);
  const textRowRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const textRow = textRowRef.current;
    if (!section || !textRow) return;

    const frontLetters = Array.from(textRow.querySelectorAll('.kinetic-letter-front'));
    const shadowLetters = Array.from(textRow.querySelectorAll('.kinetic-letter-shadow'));

    const recalculateLetters = () => {
      const W = window.innerWidth;
      const rightEnterX = W * 1.20;       // > 120% width = opacity 0 (far right)
      const rightSettleX = W * 0.50;      // 50% width = settled center
      const leftExitSettleX = W * 0.30;   // 30% width = start exit
      const leftExitX = -W * 0.15;        // -15% width = opacity 0 (far left)

      frontLetters.forEach((frontEl, idx) => {
        const shadowEl = shadowLetters[idx];
        if (!frontEl) return;

        const rect = frontEl.getBoundingClientRect();
        const charCenter = rect.left + rect.width / 2;

        const dir = (idx % 2 === 0) ? -1 : 1;
        const rotDir = (idx % 3 === 0) ? 1 : -1;

        let letterOpacity = 1;
        let xOffset = 0;
        let yOffset = 0;
        let rotation = 0;
        let scale = 1;
        let grayVal = 255;
        let shadowOpacity = 1;

        if (charCenter > rightSettleX) {
          // ── RIGHT S-CURVE ENTRANCE ZONE ──
          let progress = (charCenter - rightSettleX) / (rightEnterX - rightSettleX);
          if (progress > 1) progress = 1;

          const easeProgress = Math.pow(progress, 1.8);
          letterOpacity = 1 - easeProgress;

          // Balanced S-Curve Wave Offsets
          xOffset = Math.sin(progress * Math.PI) * 18 * dir;
          yOffset = dir * 85 * easeProgress + Math.sin(progress * Math.PI * 1.5) * 18;

          // S-Curve Wave Rotation
          rotation = rotDir * (20 * easeProgress + Math.sin(progress * Math.PI) * 8 * dir);

          scale = 1 - easeProgress * 0.08;
          grayVal = Math.round(255 - easeProgress * (255 - 138));
          shadowOpacity = (1 - easeProgress) * 0.9;

        } else if (charCenter < leftExitSettleX) {
          // ── LEFT EXIT ZONE ──
          let exitProgress = (leftExitSettleX - charCenter) / (leftExitSettleX - leftExitX);
          if (exitProgress > 1) exitProgress = 1;

          const easeExit = Math.pow(exitProgress, 1.5);
          letterOpacity = 1 - easeExit;

          xOffset = -Math.sin(exitProgress * Math.PI) * 14 * dir;
          yOffset = -dir * 45 * easeExit;
          rotation = -rotDir * 14 * easeExit;
          scale = 1 - easeExit * 0.08;
          grayVal = Math.round(255 - easeExit * (255 - 120));
          shadowOpacity = (1 - easeExit) * 0.8;

        } else {
          // ── CENTER SETTLED ZONE (Solid White, Baseline x=0, y=0, rot=0) ──
          letterOpacity = 1;
          xOffset = 0;
          yOffset = 0;
          rotation = 0;
          scale = 1;
          grayVal = 255;
          shadowOpacity = 0.9;
        }

        const colorStr = `rgb(${grayVal}, ${grayVal}, ${grayVal})`;

        gsap.set(frontEl, {
          x: xOffset,
          y: yOffset,
          rotation: rotation,
          scale: scale,
          opacity: letterOpacity,
          color: colorStr,
          transformOrigin: 'center center',
          force3D: true
        });

        if (shadowEl) {
          gsap.set(shadowEl, {
            x: xOffset,
            y: yOffset,
            rotation: rotation,
            scale: scale,
            opacity: shadowOpacity,
            force3D: true
          });
        }
      });
    };

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1.5,
          start: 'top top',
          end: '+=400%',
          onUpdate: recalculateLetters,
          onRefresh: recalculateLetters
        }
      });

      timeline.to(textRow, {
        xPercent: -88,
        ease: 'none'
      });

      recalculateLetters();
    }, section);

    const handleResize = () => recalculateLetters();
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, [phrase]);

  const characters = phrase.split('');

  return (
    <section
      ref={sectionRef}
      id="kinetic-hero"
      style={{
        position: 'relative',
        width: '100%',
        background: 'transparent',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          ref={textRowRef}
          className="kinetic-text-row"
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap',
            fontFamily: "'Space Grotesk', 'Inter', sans-serif",
            fontSize: '11vw',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            paddingLeft: '50vw',
            userSelect: 'none',
            willChange: 'transform'
          }}
        >
          {characters.map((char, index) => {
            if (char === ' ') {
              return (
                <span
                  key={index}
                  className="kinetic-letter-wrapper kinetic-space-wrapper"
                  style={{ display: 'inline-block', width: '0.35em', flexShrink: 0 }}
                  aria-hidden="true"
                />
              );
            }
            return (
              <span
                key={index}
                className="kinetic-letter-wrapper"
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  flexShrink: 0,
                  margin: '0 0.015em'
                }}
              >
                {/* 1. Shadow copy layer behind offset 8px right, 12px down */}
                <span
                  className="kinetic-letter-shadow"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: 'translate(8px, 12px)',
                    color: '#000000',
                    zIndex: 1,
                    pointerEvents: 'none',
                    opacity: 1,
                    WebkitTextStroke: '1px rgba(255, 255, 255, 0.04)'
                  }}
                >
                  {char}
                </span>

                {/* 2. Front copy layer on top */}
                <span
                  className="kinetic-letter-front"
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    zIndex: 2,
                    transformOrigin: 'center center',
                    color: '#ffffff',
                    willChange: 'transform, opacity, color'
                  }}
                >
                  {char}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KineticHeroText;
