// Pic-block interactions: parallax scroll + simple lightbox + fallback text
(function () {
  function attachInteractions(block) {
    if (!block || block.__picblock_inited) return;
    block.__picblock_inited = true;

    const img = block.querySelector('.pic-block__image');
    const content = block.querySelector('.pic-block__content');
    if (!img) return;

    // Show fallback text if image fails to load
    function showFallback() {
      if (content) {
        content.classList.add('pic-block__content--fallback');
      }
    }

    function hideFallback() {
      if (content) {
        content.classList.remove('pic-block__content--fallback');
      }
    }

    img.addEventListener('error', showFallback);
    img.addEventListener('load', hideFallback);

    // If image is already loaded or cached
    if (img.complete) {
      hideFallback();
    }

    // Parallax scroll effect - stronger parallax for better effect
    function updateParallax() {
      const rect = img.getBoundingClientRect();
      const scrolled = window.scrollY || window.pageYOffset;
      const elementTop = scrolled + rect.top;
      const parallaxOffset = (scrolled - (elementTop - window.innerHeight)) * 0.1;
      img.style.transform = `translateY(${parallaxOffset}px)`;
    }

    window.addEventListener('scroll', updateParallax);
    updateParallax();

    // Simple lightbox for the image
    function openOverlay(src, alt) {
      const overlay = document.createElement('div');
      overlay.className = 'pic-block__overlay';
      overlay.tabIndex = -1;

      const large = document.createElement('img');
      large.src = src;
      large.alt = alt || '';

      overlay.appendChild(large);

      overlay.addEventListener('click', () => {
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
      });

      function escHandler(e) {
        if (e.key === 'Escape') {
          if (document.body.contains(overlay)) document.body.removeChild(overlay);
          document.removeEventListener('keydown', escHandler);
        }
      }

      document.addEventListener('keydown', escHandler);
      document.body.appendChild(overlay);
    }

    img.addEventListener('click', () => openOverlay(img.src, img.alt));
  }

  function initAll() {
    document.querySelectorAll('.pic-block').forEach(attachInteractions);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // If htmx is used to load partials, initialize after swap
  if (window.htmx && typeof window.htmx.on === 'function') {
    window.htmx.on('htmx:afterSwap', (evt) => {
      const target = evt.detail && evt.detail.target;
      if (!target) return;
      if (target.classList && target.classList.contains('pic-block')) {
        attachInteractions(target);
      } else if (target.querySelector && target.querySelector('.pic-block')) {
        target.querySelectorAll('.pic-block').forEach(attachInteractions);
      }
    });
  } else {
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.classList && node.classList.contains('pic-block')) attachInteractions(node);
          else if (node.querySelector && node.querySelector('.pic-block')) node.querySelectorAll('.pic-block').forEach(attachInteractions);
        }
      }
    });
    mo.observe(document.documentElement || document.body, {childList: true, subtree: true});
  }
})();
