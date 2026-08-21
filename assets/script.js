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

// Hero bouquet: auto-rotate loop + drag to rotate (only runs on pages that have it)
const heroBouquet = document.getElementById('heroBouquet');
if (heroBouquet) {
  let rotY = 18, rotX = 8;
  let isDragging = false, lastX = 0, lastY = 0;

  function applyRot() {
    heroBouquet.style.setProperty('--rotY', rotY.toFixed(2) + 'deg');
    heroBouquet.style.setProperty('--rotX', rotX.toFixed(2) + 'deg');
  }

  function tick() {
    if (!isDragging) { rotY += 0.12; }
    applyRot();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  function dragStart(x, y) {
    isDragging = true; lastX = x; lastY = y;
    heroBouquet.style.cursor = 'grabbing';
  }
  function dragMove(x, y) {
    if (!isDragging) return;
    rotY += (x - lastX) * 0.4;
    rotX -= (y - lastY) * 0.3;
    rotX = Math.max(-35, Math.min(35, rotX));
    lastX = x; lastY = y;
  }
  function dragEnd() {
    isDragging = false;
    heroBouquet.style.cursor = 'grab';
  }

  heroBouquet.addEventListener('pointerdown', e => { dragStart(e.clientX, e.clientY); heroBouquet.setPointerCapture(e.pointerId); });
  heroBouquet.addEventListener('pointermove', e => dragMove(e.clientX, e.clientY));
  heroBouquet.addEventListener('pointerup', dragEnd);
  heroBouquet.addEventListener('pointercancel', dragEnd);
}
