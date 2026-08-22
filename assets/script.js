// Loading screen
document.documentElement.classList.add('is-loading');
const loader = document.getElementById('loader');
if (loader) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loader-hide');
      document.documentElement.classList.remove('is-loading');
      setTimeout(() => loader.remove(), 900);
    }, 1300);
  });
} else {
  document.documentElement.classList.remove('is-loading');
}

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLower = document.querySelector('.nav-lower');
if (toggle && navLower) {
  toggle.addEventListener('click', () => {
    const isOpen = navLower.style.display === 'flex';
    navLower.style.display = isOpen ? 'none' : 'flex';
    navLower.style.flexDirection = 'column';
    navLower.style.textAlign = 'center';
    navLower.style.gap = '14px';
  });
}

// Bloom-in reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
