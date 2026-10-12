/* it4ch1 decor: reading progress bar on post pages only */
(function () {
  'use strict';

  // Chirpy 6.x only renders .post-tail-wrapper on post pages
  if (!document.querySelector('.post-tail-wrapper')) return;

  var content = document.querySelector('article .content') || document.querySelector('.content');
  if (!content) return;

  var bar = document.createElement('div');
  bar.id = 'it-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  var ticking = false;

  function update() {
    ticking = false;
    var rect = content.getBoundingClientRect();
    var end = rect.bottom + window.scrollY - window.innerHeight; // bar is full when the post text ends
    var start = rect.top + window.scrollY - 80;
    var progress = end <= start ? 1 : (window.scrollY - start) / (end - start);
    progress = Math.min(1, Math.max(0, progress));
    bar.style.transform = 'scaleX(' + progress + ')';
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', update); // images change the page height
  update();
})();
