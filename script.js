// Initialize Vercel Speed Insights
import('@vercel/speed-insights').then(module => {
  module.injectSpeedInsights();
}).catch(err => console.error('Failed to load Speed Insights:', err));

window.addEventListener("DOMContentLoaded", () => {
  // Force dark mode
  document.body.classList.add("dark-mode");
  document.body.style.overflow = "auto";

  // ============ PROJECT FILTERING ============
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === "all") {
          card.style.display = "flex";
          card.classList.remove("hidden");
        } else {
          const tags = card.dataset.projectTags || "";
          if (tags.includes(filter)) {
            card.style.display = "flex";
            card.classList.remove("hidden");
          } else {
            card.style.display = "none";
            card.classList.add("hidden");
          }
        }
      });
    });
  });

  // ============ FORM VALIDATION ============
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const messageInput = document.getElementById("messageInput");
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");

    const validateName = () => {
      const value = nameInput.value.trim();
      if (value.length < 2) {
        nameError.textContent = "Name must be at least 2 characters";
        nameInput.classList.add("error");
        return false;
      }
      nameError.textContent = "";
      nameInput.classList.remove("error");
      return true;
    };

    const validateEmail = () => {
      const value = emailInput.value.trim();
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailRegex.test(value)) {
        emailError.textContent = "Please enter a valid email";
        emailInput.classList.add("error");
        return false;
      }
      emailError.textContent = "";
      emailInput.classList.remove("error");
      return true;
    };

    const validateMessage = () => {
      const value = messageInput.value.trim();
      if (value.length < 10) {
        messageError.textContent = "Message must be at least 10 characters";
        messageInput.classList.add("error");
        return false;
      }
      messageError.textContent = "";
      messageInput.classList.remove("error");
      return true;
    };

    nameInput.addEventListener("blur", validateName);
    emailInput.addEventListener("blur", validateEmail);
    messageInput.addEventListener("blur", validateMessage);

    contactForm.addEventListener("submit", (e) => {
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        e.preventDefault();
      }
    });
  }

  // ============ ScrollReveal for Testimonials ============
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

    sr.reveal(".skill-card, .project-card, .education-card, .experience-card, .certificate-card, .hobby-card, .testimonial-card", {
      origin: "bottom",
      interval: 150,
      scale: 0.85,
      rotate: { x: 10, y: 0, z: 0 },
      distance: "100px"
    });

    sr.reveal(".contact-form", { origin: "bottom", scale: 0.9 });
  }

  // ============ HAMBURGER MENU ============
  const burger = document.getElementById("hamburger");
  const nav = document.querySelector(".navbar nav");

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
        burger.classList.remove("open");
      })
    );
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

    const bgTexts = document.querySelectorAll(".bg-scroll-text");

    function animate() {
      // 1. Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 2. Update/Draw Particles
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();

      // 3. Parallax Background Text
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
