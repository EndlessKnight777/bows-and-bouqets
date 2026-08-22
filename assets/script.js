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
  const closeMenu = () => {
    navLower.style.display = 'none';
    toggle.setAttribute('aria-expanded', 'false');
  };
  const openMenu = () => {
    navLower.style.display = 'flex';
    navLower.style.flexDirection = 'column';
    navLower.style.textAlign = 'center';
    navLower.style.width = '100%';
    navLower.style.gap = '4px';
    toggle.setAttribute('aria-expanded', 'true');
  };
  toggle.addEventListener('click', () => {
    const isOpen = navLower.style.display === 'flex';
    isOpen ? closeMenu() : openMenu();
  });
  navLower.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

// Image-ready placeholders: fall back to the icon if the real photo isn't there yet
document.querySelectorAll('.ph-slot img').forEach(img => {
  img.addEventListener('error', () => {
    img.closest('.ph-slot').classList.add('img-missing');
  });
});

// Bloom-in reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
