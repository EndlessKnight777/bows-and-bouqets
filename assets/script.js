// Custom cursor: a flower bud that blooms on click (mouse and trackpad only)
if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.id = 'cursor-flower';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = `<svg viewBox="0 0 40 40"><g transform="translate(20,24)">
    <g transform="rotate(0)"><path class="cursor-petal" d="M0,0 C-4,-6 -4,-13 0,-19 C4,-13 4,-6 0,0 Z"/></g>
    <g transform="rotate(60)"><path class="cursor-petal" d="M0,0 C-4,-6 -4,-13 0,-19 C4,-13 4,-6 0,0 Z"/></g>
    <g transform="rotate(120)"><path class="cursor-petal" d="M0,0 C-4,-6 -4,-13 0,-19 C4,-13 4,-6 0,0 Z"/></g>
    <g transform="rotate(180)"><path class="cursor-petal" d="M0,0 C-4,-6 -4,-13 0,-19 C4,-13 4,-6 0,0 Z"/></g>
    <g transform="rotate(240)"><path class="cursor-petal" d="M0,0 C-4,-6 -4,-13 0,-19 C4,-13 4,-6 0,0 Z"/></g>
    <g transform="rotate(300)"><path class="cursor-petal" d="M0,0 C-4,-6 -4,-13 0,-19 C4,-13 4,-6 0,0 Z"/></g>
    <circle class="cursor-center" r="2.2"/>
  </g></svg>`;
  document.body.appendChild(cursor);
  document.body.classList.add('custom-cursor-active');

  window.addEventListener('mousemove', e => {
    cursor.classList.add('active');
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });

  document.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  document.addEventListener('mouseenter', () => cursor.classList.add('active'));

  document.addEventListener('click', () => {
    cursor.classList.remove('blooming');
    void cursor.offsetWidth; // restart the animation even on rapid clicks
    cursor.classList.add('blooming');
  });
}

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
