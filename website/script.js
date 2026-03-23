/* ========================================
   STAY CAYMAN — JavaScript
   ======================================== */

// ---------- NAVBAR SCROLL EFFECT ----------
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---------- MOBILE MENU ----------
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('active', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ---------- SCROLL REVEAL ----------
const revealElements = () => {
  // Auto-tag sections for reveal
  const selectors = [
    '.intro',
    '.section-header',
    '.featured-hotel',
    '.hotel-card',
    '.experience-card',
    '.neighborhood-card',
    '.testimonial',
    '.newsletter-section .newsletter-title',
    '.parallax-content'
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
    });
  });
};

const handleReveal = () => {
  const reveals = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;

  reveals.forEach((el, i) => {
    const top = el.getBoundingClientRect().top;
    const revealPoint = 100;

    if (top < windowHeight - revealPoint) {
      // Stagger animation for grid items
      const delay = el.closest('.hotel-grid, .experience-grid, .neighborhood-grid')
        ? (Array.from(el.parentElement.children).indexOf(el) % 3) * 100
        : 0;

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);
    }
  });
};

// Initialize
revealElements();
window.addEventListener('scroll', handleReveal);
window.addEventListener('load', handleReveal);

// ---------- PARALLAX EFFECT ----------
const parallaxImg = document.querySelector('.parallax-img');

if (parallaxImg) {
  window.addEventListener('scroll', () => {
    const section = parallaxImg.closest('.parallax-section');
    const rect = section.getBoundingClientRect();
    const speed = 0.3;

    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const yPos = rect.top * speed;
      parallaxImg.style.transform = `translateY(${yPos}px)`;
    }
  });
}

// ---------- SMOOTH ANCHOR SCROLLING ----------
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

// ---------- SET MIN DATE ON SEARCH INPUTS ----------
const dateInputs = document.querySelectorAll('.search-field input[type="date"]');
const today = new Date().toISOString().split('T')[0];
dateInputs.forEach(input => {
  input.setAttribute('min', today);
});
