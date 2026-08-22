document.querySelectorAll('.gallery-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    const modal = document.getElementById('modal-' + category);
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('modal-open');
  });
});

function closeGalleryModals() {
  document.querySelectorAll('.gallery-modal.open').forEach(modal => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  });
  document.documentElement.classList.remove('modal-open');
}

document.querySelectorAll('[data-close]').forEach(el => {
  el.addEventListener('click', closeGalleryModals);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeGalleryModals();
});
