/* =============================================
   SCRIPT.JS — SHASHANK K S PORTFOLIO
   ============================================= */

"use strict";

// ── 1. CUSTOM CURSOR ───────────────────────────
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animateFollower() {
  fx += (mx - fx) * 0.1;
  fy += (my - fy) * 0.1;
  cursorFollower.style.left = fx + 'px';
  cursorFollower.style.top  = fy + 'px';
  requestAnimationFrame(animateFollower);
})();


// ── 2. PARTICLE CANVAS ─────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLORS = ['rgba(100,210,255,', 'rgba(167,139,250,', 'rgba(244,114,182,'];

class Particle {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x    = Math.random() * W;
    this.y    = init ? Math.random() * H : H + 10;
    this.size = Math.random() * 2.5 + 0.5;
    this.vx   = (Math.random() - 0.5) * 0.4;
    this.vy   = -(Math.random() * 0.6 + 0.2);
    this.alpha = Math.random() * 0.6 + 0.2;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.life  = 0;
    this.maxLife = Math.random() * 300 + 200;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife || this.y < -10) this.reset();
  }
  draw() {
    const progress = this.life / this.maxLife;
    const a = this.alpha * (1 - Math.pow(progress - 0.5, 2) * 4);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color + Math.max(0, a) + ')';
    ctx.fill();
  }
}

for (let i = 0; i < 90; i++) particles.push(new Particle());

// Mouse influence
let mxp = -1000, myp = -1000;
document.addEventListener('mousemove', e => { mxp = e.clientX; myp = e.clientY; });

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    const dx = p.x - mxp, dy = p.y - myp;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      p.vx += dx / dist * 0.04;
      p.vy += dy / dist * 0.04;
    }
    p.update(); p.draw();
  });
  // draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(100,210,255,${0.08 * (1 - d / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();


// ── 3. NAVBAR SCROLL ───────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Active link
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
});


// ── 4. HAMBURGER MENU ──────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});
navLinks.forEach(l => l.addEventListener('click', () => navLinksEl.classList.remove('open')));


// ── 5. TYPED TEXT ──────────────────────────────
const roles = [
  'Student Developer 🎓',
  'Python Programmer 🐍',
  'Web Enthusiast 🌐',
  'Problem Solver 🧩',
  'Tech Explorer 🚀',
  'CSE Engineer 💻',
];
let rIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function typeLoop() {
  const current = roles[rIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++cIdx);
    if (cIdx === current.length) {
      deleting = true;
      return setTimeout(typeLoop, 1800);
    }
  } else {
    typedEl.textContent = current.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      rIdx = (rIdx + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 50 : 90);
}
typeLoop();


// ── 6. SCROLL REVEAL ───────────────────────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));


// ── 7. SKILL BAR ANIMATION ─────────────────────
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.style.width = el.dataset.width;
      skillObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

skillFills.forEach(el => skillObserver.observe(el));


// ── 8. COUNT-UP ANIMATION ──────────────────────
const statNums = document.querySelectorAll('.stat-num');

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const target = +el.dataset.count;
      let current  = 0;
      const step   = Math.ceil(target / 40);
      const timer  = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + '+';
        if (current >= target) clearInterval(timer);
      }, 40);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => countObserver.observe(el));


// ── 9. CONTACT FORM ────────────────────────────
const form       = document.getElementById('contactForm');
const sendBtn    = document.getElementById('sendBtn');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<span>Sending…</span>';

  setTimeout(() => {
    form.reset();
    sendBtn.disabled = false;
    sendBtn.innerHTML = '<span>Send Message</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 4000);
  }, 1200);
});


// ── 10. SMOOTH SECTION TRANSITIONS ─────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── 11. TILT EFFECT ON PROJECT CARDS ───────────
document.querySelectorAll('.project-card, .skill-card, .cert-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// ── 12. GLOWING BLOB FOLLOW EFFECT ─────────────
const blob = document.createElement('div');
blob.style.cssText = `
  position:fixed; pointer-events:none; z-index:0;
  width:500px; height:500px; border-radius:50%;
  background: radial-gradient(circle, rgba(100,210,255,0.04), transparent 70%);
  transform: translate(-50%,-50%);
  transition: left 0.8s ease, top 0.8s ease;
`;
document.body.appendChild(blob);

let lastBlobUpdate = 0;
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastBlobUpdate > 50) {
    blob.style.left = e.clientX + 'px';
    blob.style.top  = e.clientY + 'px';
    lastBlobUpdate = now;
  }
});


// ── 13. PAGE LOAD ANIMATION ────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 100);
});
