// Initialize Vercel Speed Insights
import('@vercel/speed-insights').then(module => {
  module.injectSpeedInsights();
}).catch(err => console.error('Failed to load Speed Insights:', err));

window.addEventListener("DOMContentLoaded", () => {
  // Force dark mode
  document.body.classList.add("dark-mode");
  document.body.style.overflow = "auto";

  // ---------------- Hamburger Menu ----------------
  const burger = document.getElementById("hamburger");
  const nav = document.getElementById("primary-nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("show");
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      burger.classList.toggle("open", isOpen);
    });

    // Close menu on link click
    nav.querySelectorAll("a").forEach(a => 
      a.addEventListener("click", () => {
        nav.classList.remove("show");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  }

  // ---------------- ScrollReveal (Advanced) ----------------
  if (typeof ScrollReveal !== "undefined") {
    const sr = ScrollReveal({
      reset: false,
      distance: "80px",
      duration: 1200,
      delay: 100,
      easing: "cubic-bezier(0.5, 0, 0, 1)",
      viewFactor: 0.2
    });

    sr.reveal(".section-title", { origin: "top", scale: 0.9, opacity: 0 });
    
    sr.reveal(".about-img", { origin: "left", rotate: { y: 20 }, scale: 0.8 });
    sr.reveal(".about-text", { origin: "right", distance: "40px" });

    sr.reveal(".skill-card, .project-card, .education-card, .experience-card, .certificate-card, .hobby-card", {
      origin: "bottom",
      interval: 150,
      scale: 0.85,
      rotate: { x: 10, y: 0, z: 0 },
      distance: "100px"
    });

    sr.reveal(".contact-form", { origin: "bottom", scale: 0.9 });
  }

  // ---------------- Scroll to Top ----------------
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      scrollTopBtn.style.display = window.scrollY > 400 ? "block" : "none";
    });

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---------------- Input Focus ----------------
  const inputs = document.querySelectorAll(".contact-form input, .contact-form textarea");
  inputs.forEach(input => {
    input.addEventListener("focus", () => input.classList.add("focused"));
    input.addEventListener("blur", () => input.classList.remove("focused"));
  });

  // ---------------- Typewriter Effect ----------------
  const typingTarget = document.getElementById("typingText");
  if (typingTarget) {
    const phrases = ["Hi, I’m Pavan Kumar Gupta", "MERN Stack Developer"];
    const typingSpeedMs = 70;
    const erasingSpeedMs = 45;
    const holdOnTypedMs = 900;
    const holdBeforeStartMs = 500;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        typingTarget.textContent = currentPhrase.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          setTimeout(typeLoop, holdOnTypedMs);
          return;
        }
        setTimeout(typeLoop, typingSpeedMs);
      } else {
        typingTarget.textContent = currentPhrase.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typeLoop, holdBeforeStartMs);
          return;
        }
        setTimeout(typeLoop, erasingSpeedMs);
      }
    }

    setTimeout(typeLoop, 400);
  }
  // ---------------- Adaptive Footer Year ----------------
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ---------------- PARTICLE BACKGROUND (Optimized) ----------------
  const canvas = document.getElementById("bg-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const connectionDistance = 140;
    const mouseRadius = 140;

    let mouse = { x: null, y: null };
    let scrollYOffset = 0;

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener("mouseout", () => {
      mouse.x = null;
      mouse.y = null;
    });

    const progressBar = document.getElementById("scroll-progress");
    window.addEventListener("scroll", () => {
      scrollYOffset = window.scrollY;
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      if (progressBar) progressBar.style.width = scrolled + "%";
    });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        const parallaxY = scrollYOffset * 0.08;
        let currentY = this.y + parallaxY;
        if (currentY < 0) this.y += canvas.height;
        if (currentY > canvas.height) this.y -= canvas.height;
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - (this.y + parallaxY);
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouseRadius) {
            let force = (mouseRadius - distance) / mouseRadius;
            this.x -= (dx / distance) * force * 1.5;
            this.y -= (dy / distance) * force * 1.5;
          }
        }
      }
      draw() {
        const parallaxY = scrollYOffset * 0.08;
        ctx.fillStyle = "rgba(0, 191, 255, 0.35)";
        ctx.beginPath();
        ctx.arc(this.x, this.y + parallaxY, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    }

    function drawLines() {
      const pY = scrollYOffset * 0.08;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < connectionDistance) {
            let opacity = (1 - distance / connectionDistance) * 0.15;
            ctx.strokeStyle = `rgba(0, 191, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y + pY);
            ctx.lineTo(particles[j].x, particles[j].y + pY);
            ctx.stroke();
          }
        }
      }
    }

    // ---------------- LERP INTERACTION ENGINE ----------------
    const allCards = document.querySelectorAll(".skill-card, .project-card, .education-card, .experience-card, .certificate-card, .hobby-card");
    const magneticElements = document.querySelectorAll(".btn-primary, .btn-hire, .social-icons a, .scrollTopBtn");
    
    // Store states
    const tiltStates = Array.from(allCards).map(() => ({ currX: 0, currY: 0, targX: 0, targY: 0, active: false }));
    const magStates = Array.from(magneticElements).map(() => ({ currX: 0, currY: 0, targX: 0, targY: 0, active: false }));

    allCards.forEach((card, i) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        tiltStates[i].targX = (centerY - (e.clientY - rect.top)) / 8;
        tiltStates[i].targY = ((e.clientX - rect.left) - centerX) / 8;
        tiltStates[i].active = true;
      });
      card.addEventListener("mouseleave", () => {
        tiltStates[i].targX = 0;
        tiltStates[i].targY = 0;
        tiltStates[i].active = false;
      });
    });

    magneticElements.forEach((el, i) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        magStates[i].targX = (e.clientX - rect.left - rect.width / 2) * 0.35;
        magStates[i].targY = (e.clientY - rect.top - rect.height / 2) * 0.35;
      });
      el.addEventListener("mouseleave", () => {
        magStates[i].targX = 0;
        magStates[i].targY = 0;
      });
    });

    const bgTexts = document.querySelectorAll(".bg-scroll-text");

    function animate() {
      // 1. Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 2. Update/Draw Particles
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();

      // 3. Smooth Lerp Interactivity (60fps)
      const lerpFactor = 0.12; 

      allCards.forEach((card, i) => {
        const s = tiltStates[i];
        s.currX += (s.targX - s.currX) * lerpFactor;
        s.currY += (s.targY - s.currY) * lerpFactor;
        if (Math.abs(s.targX - s.currX) > 0.01 || Math.abs(s.targY - s.currY) > 0.01) {
          card.style.transform = `perspective(1000px) rotateX(${s.currX}deg) rotateY(${s.currY}deg) ${s.active ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)'}`;
        }
      });

      magneticElements.forEach((el, i) => {
        const s = magStates[i];
        s.currX += (s.targX - s.currX) * lerpFactor;
        s.currY += (s.targY - s.currY) * lerpFactor;
        if (Math.abs(s.targX - s.currX) > 0.01 || Math.abs(s.targY - s.currY) > 0.01) {
          el.style.transform = `translate(${s.currX}px, ${s.currY}px)`;
        }
      });

      // 4. Parallax Background Text
      bgTexts.forEach((text, index) => {
        const speed = (index + 1) * 0.12;
        const currentTransform = text.style.transform.includes('rotate') ? 'rotate(90deg)' : '';
        text.style.transform = `translateY(${scrollYOffset * speed}px) ${currentTransform}`;
      });

      requestAnimationFrame(animate);
    }

    window.addEventListener("resize", init);
    init();
    animate();

    // ---------------- Contact Success Handler ----------------
    const contactForm = document.querySelector(".contact-form");
    const successModal = document.getElementById("contact-success");
    if (contactForm && successModal) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector("button");
        const originalText = btn.textContent;
        btn.textContent = "Sending...";
        btn.disabled = true;
        setTimeout(() => {
          successModal.classList.add("active");
          contactForm.reset();
          btn.textContent = originalText;
          btn.disabled = false;
        }, 1500);
      });
    }
  }
});
