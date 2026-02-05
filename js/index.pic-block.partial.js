// Pic-block interactions: fixed parallax + lightbox + fallback text
(function () {
  function attachInteractions(block) {
    if (!block || block.__picblock_inited) return;
    block.__picblock_inited = true;

    const img = block.querySelector('.pic-block__image');
    const wrapper = block.querySelector('.pic-block__image-wrapper');
    const content = block.querySelector('.pic-block__content');
    if (!wrapper) return;

    // Show fallback text if image fails to load
    function showFallback() {
      if (content) {
        content.classList.add('pic-block__content--fallback');
      }
    }

    // Fallback for if image element exists
    if (img) {
      img.addEventListener('error', showFallback);
    }

    // Simple lightbox for clicking on the wrapper
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

    if (wrapper) {
      wrapper.addEventListener('click', () => openOverlay('../img/pic1.png', 'Kitchen interior'));
    }
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
