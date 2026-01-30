// Define the Carousel Logic
function initCarousel() {
    // 1. SELECT ELEMENTS
    const track = document.querySelector('.carousel-track');
    const nextButton = document.querySelector('.carousel-arrow.next');
    const prevButton = document.querySelector('.carousel-arrow.prev');

    // 2. CHECK IF ELEMENTS EXIST
    if (!track || !nextButton || !prevButton) return;

    // 3. PREVENT DOUBLE INITIALIZATION
    if (track.dataset.initialized === "true") return;
    track.dataset.initialized = "true";

    // --- CAROUSEL LOGIC STARTS HERE ---

    const cards = Array.from(track.children);
    let currentIndex = 0;

    // Helper: Get dimensions dynamically
    const getSlideWidth = () => {
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        return cardWidth + gap;
    };

    const getVisibleCardsCount = () => {
        const viewportWidth = document.querySelector('.carousel-viewport').offsetWidth;
        const cardWidth = cards[0].getBoundingClientRect().width;
        return Math.round(viewportWidth / cardWidth);
    };

    const updateCarouselPosition = () => {
        const slideAmount = getSlideWidth();
        track.style.transform = `translateX(-${currentIndex * slideAmount}px)`;
    };

    // --- BUTTON LOGIC CHANGED FOR LOOPING ---

    // Next Button Click
    nextButton.addEventListener('click', () => {
        const visibleCards = getVisibleCardsCount();
        const maxIndex = cards.length - visibleCards;

        if (currentIndex < maxIndex) {
            // Normal behavior: Go to next slide
            currentIndex++;
        } else {
            // LOOP BEHAVIOR: If at the end, go back to the start (0)
            currentIndex = 0;
        }
        updateCarouselPosition();
    });

    // Prev Button Click
    prevButton.addEventListener('click', () => {
        const visibleCards = getVisibleCardsCount();
        const maxIndex = cards.length - visibleCards;

        if (currentIndex > 0) {
            // Normal behavior: Go to previous slide
            currentIndex--;
        } else {
            // LOOP BEHAVIOR: If at the start, go to the very end
            currentIndex = maxIndex;
        }
        updateCarouselPosition();
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        currentIndex = 0;
        updateCarouselPosition();
    });

    // Ensure buttons are fully visible (in case they were hidden before)
    prevButton.style.opacity = '1';
    prevButton.style.pointerEvents = 'all';
    nextButton.style.opacity = '1';
    nextButton.style.pointerEvents = 'all';
}

// 4. LISTEN FOR HTMX AND LOAD
document.body.addEventListener('htmx:afterSettle', initCarousel);
document.addEventListener('DOMContentLoaded', initCarousel);