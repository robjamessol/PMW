/* ========================================
   STAY CAYMAN — Global JavaScript
   ======================================== */

// ---------- NAVBAR SCROLL EFFECT ----------
const navbar = document.getElementById('navbar');

if (navbar) {
  // Check if page has a hero — if not, start scrolled
  const hasHero = document.querySelector('.hero');
  if (!hasHero) {
    navbar.classList.add('scrolled');
  }

  window.addEventListener('scroll', () => {
    if (hasHero) {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    }
  }, { passive: true });
}

// ---------- MOBILE MENU ----------
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('active', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    // Animate hamburger to X
    const spans = menuBtn.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ---------- USER DROPDOWN ----------
const userMenuBtn = document.getElementById('userMenuBtn');
const userDropdown = document.getElementById('userDropdown');

if (userMenuBtn && userDropdown) {
  userMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('active');
  });
  document.addEventListener('click', (e) => {
    if (!userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
      userDropdown.classList.remove('active');
    }
  });
}

// ---------- SCROLL REVEAL ----------
const revealElements = () => {
  const selectors = [
    '.intro',
    '.section-header',
    '.section-header-center',
    '.featured-hotel',
    '.hotel-card',
    '.experience-card',
    '.neighborhood-card',
    '.category-card',
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

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    const revealPoint = 80;

    if (top < windowHeight - revealPoint) {
      const parent = el.closest('.hotel-grid, .experience-grid, .neighborhood-grid, .categories-grid');
      const delay = parent
        ? (Array.from(parent.children).indexOf(el) % 4) * 80
        : 0;

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);
    }
  });
};

revealElements();
window.addEventListener('scroll', handleReveal, { passive: true });
window.addEventListener('load', handleReveal);

// ---------- PARALLAX EFFECT ----------
const parallaxImg = document.querySelector('.parallax-img');

if (parallaxImg) {
  window.addEventListener('scroll', () => {
    const section = parallaxImg.closest('.parallax-section');
    const rect = section.getBoundingClientRect();
    const speed = 0.25;

    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const yPos = rect.top * speed;
      parallaxImg.style.transform = `translateY(${yPos}px)`;
    }
  }, { passive: true });
}

// ---------- SMOOTH ANCHOR SCROLLING ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80; // Account for fixed navbar
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---------- SET MIN DATE ON DATE INPUTS ----------
const setMinDates = () => {
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(input => {
    if (!input.getAttribute('min')) {
      input.setAttribute('min', today);
    }
  });
};
setMinDates();
