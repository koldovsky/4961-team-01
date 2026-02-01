(function () {
  function scrollToHash() {
    if (location.hash) {
      var id = location.hash.slice(1);
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }

  document.addEventListener("htmx:afterSwap", function (e) {
    // small delay to allow DOM changes to settle
    setTimeout(scrollToHash, 50);
  });

  // in case content was swapped before listener attached or on full page load
  window.addEventListener("load", function () {
    setTimeout(scrollToHash, 50);
  });
})();
