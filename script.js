/* ═══════════════════════════════════════════════════════════════════
   AI ENGINEER PORTFOLIO — SCRIPT.JS
   Particles | Typewriter | Scroll Reveal | Project Filter | Stats Counter
═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────── PRELOADER ─── */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => { preloader.style.display = 'none'; }, 700);
    }, 2200);
  });

  /* ─────────────────────────────────────────────── NAVBAR ─── */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Active nav link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const sTop = section.getBoundingClientRect().top;
      if (sTop <= 120) current = section.id;
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }
  window.addEventListener('scroll', updateActiveNav);

  /* ─────────────────────────────────────────────── SCROLL-TO-TOP ─── */
  const scrollTopBtn = document.getElementById('scrollTop');
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ─────────────────────────────────────────────── PARTICLE CANVAS ─── */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  let W, H;

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = document.getElementById('home').offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '0, 212, 255' : '124, 58, 237';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((W * H) / 8000);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }
  initParticles();

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // Mouse repel effect
  let mouse = { x: null, y: null };
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          p.vx += dx / dist * 0.3;
          p.vy += dy / dist * 0.3;
        }
      }
      const maxSpeed = 1.2;
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxSpeed) { p.vx = (p.vx / speed) * maxSpeed; p.vy = (p.vy / speed) * maxSpeed; }
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.update();
      p.draw();
    });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ─────────────────────────────────────────────── TYPEWRITER ─── */
  const phrases = [
    'Machine Learning Models',
    'Full Stack Applications',
    'Predictive Analytics',
    'AI Chatbots',
    'Data-Driven Solutions',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typewriterEl = document.getElementById('typewriter');

  function typeWrite() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      typewriterEl.textContent = current.slice(0, --charIndex);
    } else {
      typewriterEl.textContent = current.slice(0, ++charIndex);
    }
    let speed = isDeleting ? 40 : 75;
    if (!isDeleting && charIndex === current.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400;
    }
    setTimeout(typeWrite, speed);
  }
  setTimeout(typeWrite, 2800);

  /* ─────────────────────────────────────────────── SCROLL REVEAL ─── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ─────────────────────────────────────────────── SKILL BARS ─── */
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach((fill, index) => {
          setTimeout(() => {
            fill.style.width = fill.dataset.width + '%';
          }, 200 + (index * 150));
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const skillsContainer = document.querySelector('.skills-categories');
  if (skillsContainer) skillObserver.observe(skillsContainer);

  /* ─────────────────────────────────────────────── STAT COUNTER ─── */
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-number').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target));
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  /* ─────────────────────────────────────────────── PROJECT FILTER ─── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
        if (show) {
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        }
      });
    });
  });

  // Add CSS animation for filter
  const style = document.createElement('style');
  style.textContent = `@keyframes fadeInCard { from { opacity: 0; transform: scale(0.97) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }`;
  document.head.appendChild(style);

  /* ─────────────────────────────────────────────── CONTACT FORM ─── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
      // Simulate async send
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        submitBtn.disabled = false;
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 1800);
    });
  }

  /* ─────────────────────────────────────────────── SMOOTH ANCHOR ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─────────────────────────────────────────────── HERO PARALLAX ─── */
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroText = document.querySelector('.hero-text');
    const heroImg = document.querySelector('.hero-image-container');
    if (scrollY < window.innerHeight) {
      const factor = scrollY * 0.12;
      const opacity = 1 - scrollY / 650;
      if (heroText) { heroText.style.transform = `translateY(${factor}px)`; heroText.style.opacity = opacity; }
      if (heroImg) { heroImg.style.transform = `translateY(${factor * 0.6}px)`; }
    }
  });

  /* ─────────────────────────────────────────────── CARD TILT EFFECT ─── */
  document.querySelectorAll('.project-card, .research-card, .cert-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });

  /* ─────────────────────────────────────────────── HERO PHOTO GLOW ─── */
  const heroPhoto = document.getElementById('heroPhoto');
  if (heroPhoto) {
    heroPhoto.addEventListener('load', () => {
      heroPhoto.style.opacity = '1';
    });
    if (heroPhoto.complete) heroPhoto.style.opacity = '1';
  }

  console.log('%c[AI Engineer Portfolio] Loaded successfully ✓', 'color: #00d4ff; font-family: monospace; font-size: 12px;');

  /* ═══════════════════════════════════════════════ AI CHATBOT LOGIC ═══ */
  const chatToggleBtn = document.getElementById('chatToggleBtn');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatWindow = document.getElementById('chatWindow');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');

  if (chatToggleBtn && chatWindow) {
    chatToggleBtn.addEventListener('click', () => chatWindow.classList.add('active'));
    chatCloseBtn.addEventListener('click', () => chatWindow.classList.remove('active'));
  }

  const GEMINI_API_KEY = "YOUR GEMINI API KEY HERE"; // Replace with your
  
  const systemPrompt = `You are an AI assistant for Maneesha Sathsara's portfolio website. Answer questions based on his CV and portfolio data. If asked a general knowledge question, answer it. If asked a highly personal question about Maneesha that is not in the context, reply EXACTLY with: "I'm sorry, database eke answer eka denna amaruyi, e nisa eyawa contact karagena wisthara danaganna."

Context:
Name: Maneesha Sathsara
Role: AI Engineer & Full Stack Developer
Location: Sri Lanka
Contact: maneeshasathsaradev@gmail.com, +94 775691683, LinkedIn/X: @maneeshasmdev
Skills: Python, Java, C, JavaScript (ES6+), TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, NLP, React.js, Node.js.
Education: BSc Physical Science (Computer Science & Statistics) at University of Kelaniya (2024-2027), Bachelor of Information Technology at UCSC (2024-2027).
Experience: ML Intern at Indolike, AI Intern at CodeAlpha, Data Annotation Specialist at Thakral One.
Projects: Housing Price Prediction, AI Chatbot, Language Translation Tool, Credit Scoring Model.
Certifications: DP Education Full Stack, Microsoft AI Concepts.
Leadership: Leo Club Fundraising Coordinator, SCSSA Executive Member.
Research: Ongoing AI Research (Aug 2026 - Present) focusing on advanced Data Structures and Algorithmic Foundations.

Answer in a friendly, professional manner. Keep answers concise (1-3 sentences) suitable for a chat widget. Respond in the same language the user asks (English, Sinhala, or Singlish).`;

  async function fetchGeminiResponse(userMessage) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [{
            parts: [{ text: userMessage }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          }
        })
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error(error);
      return "I'm sorry, I'm having trouble connecting to my AI brain right now. Please try again later or email Maneesha directly!";
    }
  }

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    msgDiv.innerHTML = `
      <div class="msg-content">${text}</div>
      <span class="msg-time">${time}</span>
    `;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'chat-message bot typing-msg';
    indicator.innerHTML = `
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    `;
    chatBody.appendChild(indicator);
    chatBody.scrollTop = chatBody.scrollHeight;
    return indicator;
  }

  if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const inputVal = chatInput.value.trim();
      if (!inputVal) return;
      
      appendMessage('user', inputVal);
      chatInput.value = '';
      
      const indicator = showTypingIndicator();
      
      const responseText = await fetchGeminiResponse(inputVal);
      
      indicator.remove();
      appendMessage('bot', responseText);
    });
  }

});
