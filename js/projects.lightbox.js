export function initLightbox() {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      init();
    }, 200);
  });

  // Також слухаємо htmx події
  document.body.addEventListener("htmx:afterSettle", function () {
    setTimeout(() => {
      init();
    }, 100);
  });

  function init() {
    // Перевіряємо чи лайтбокс вже ініціалізований
    if (window.lightboxInitialized) return;

    class Lightbox {
      constructor() {
        this.lightbox = document.getElementById("lightbox");
        if (!this.lightbox) {
          console.error("Lightbox element not found!");
          return;
        }

        this.lightboxImg = this.lightbox.querySelector(".lightbox__image");
        this.closeBtn = this.lightbox.querySelector(".lightbox__close");
        this.prevBtn = this.lightbox.querySelector(".lightbox__prev");
        this.nextBtn = this.lightbox.querySelector(".lightbox__next");

        this.images = [];
        this.currentIndex = 0;

        this.initLightbox();
      }

      initLightbox() {
        // Знаходимо всі зображення в галереях
        const galleryLinks = document.querySelectorAll("[data-lightbox]");

        console.log("Found gallery links:", galleryLinks.length);

        if (galleryLinks.length === 0) {
          console.warn("No gallery links found");
          return;
        }

        // Очищаємо попередні зображення
        this.images = [];

        galleryLinks.forEach((link, index) => {
          // Додаємо зображення в масив
          this.images.push({
            src: link.href,
            alt: link.querySelector("img")?.alt || "",
          });

          // Видаляємо старі слухачі
          const newLink = link.cloneNode(true);
          link.parentNode.replaceChild(newLink, link);

          // Додаємо новий слухач з правильним індексом
          newLink.addEventListener("click", (e) => {
            e.preventDefault();
            this.open(index);
            console.log("Opening image index:", index);
          });
        });

        console.log("Images loaded:", this.images);

        // Закриття лайтбоксу
        this.closeBtn.addEventListener("click", () => this.close());
        this.lightbox.addEventListener("click", (e) => {
          if (e.target === this.lightbox) {
            this.close();
          }
        });

        // Навігація
        this.prevBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.prev();
        });
        this.nextBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.next();
        });

        // Клавіатура
        document.addEventListener("keydown", (e) => {
          if (!this.lightbox.classList.contains("active")) return;

          if (e.key === "Escape") this.close();
          if (e.key === "ArrowLeft") this.prev();
          if (e.key === "ArrowRight") this.next();
        });

        window.lightboxInitialized = true;
      }

      open(index) {
        console.log(
          "Opening index:",
          index,
          "Total images:",
          this.images.length,
        );
        this.currentIndex = index;
        this.updateImage();
        this.lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
      }

      close() {
        this.lightbox.classList.remove("active");
        document.body.style.overflow = "";
      }

      next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
      }

      prev() {
        this.currentIndex =
          (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImage();
      }

      updateImage() {
        const image = this.images[this.currentIndex];
        console.log("Updating to image:", image.src);
        this.lightboxImg.src = image.src;
        this.lightboxImg.alt = image.alt;
      }
    }

    new Lightbox();
  }
}
