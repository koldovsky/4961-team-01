function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const nextButton = document.querySelector('.carousel-arrow.next');
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const viewport = document.querySelector('.carousel-viewport');

    if (!track || !nextButton || !prevButton || !viewport) return;

    if (track.dataset.initialized === "true") return;
    track.dataset.initialized = "true";

    let cards = Array.from(track.children);
    if (!cards.length) return;

    const getGap = () => parseFloat(getComputedStyle(track).gap) || 0;

    const getCardWidth = () => cards[0].getBoundingClientRect().width;

    const getSlideWidth = () => getCardWidth() + getGap();

    const getVisibleCardsCount = () => {
        const slide = getSlideWidth();
        return Math.max(1, Math.floor(viewport.clientWidth / slide));
    };

    let visible = getVisibleCardsCount();

    // ---- CLONES FOR INFINITE LOOP ----
    const cloneHeadTail = () => {
        // remove old clones if re-init logic changes
        track.querySelectorAll('[data-clone="true"]').forEach(n => n.remove());

        cards = Array.from(track.children);

        visible = getVisibleCardsCount();
        const total = cards.length;

        // If not enough cards to loop nicely, just disable looping
        if (total <= visible) return { looping: false, startIndex: 0, totalReal: total };

        const headClones = cards.slice(0, visible).map(node => {
            const c = node.cloneNode(true);
            c.dataset.clone = "true";
            return c;
        });

        const tailClones = cards.slice(total - visible).map(node => {
            const c = node.cloneNode(true);
            c.dataset.clone = "true";
            return c;
        });

        // prepend tail clones, append head clones
        tailClones.forEach(c => track.insertBefore(c, track.firstChild));
        headClones.forEach(c => track.appendChild(c));

        // refresh list after DOM changes
        cards = Array.from(track.children);

        return { looping: true, startIndex: visible, totalReal: total };
    };

    let { looping, startIndex, totalReal } = cloneHeadTail();
    let currentIndex = startIndex;

    const setTransition = (on) => {
        track.style.transition = on ? 'transform 300ms ease' : 'none';
    };

    const updatePosition = () => {
        const slide = getSlideWidth();
        track.style.transform = `translateX(-${currentIndex * slide}px)`;
    };

    // initial position
    setTransition(false);
    updatePosition();

    const goNext = () => {
        if (!looping) {
            const maxIndex = Math.max(0, totalReal - getVisibleCardsCount());
            currentIndex = Math.min(currentIndex + 1, maxIndex);
            setTransition(true);
            updatePosition();
            return;
        }
        currentIndex++;
        setTransition(true);
        updatePosition();
    };

    const goPrev = () => {
        if (!looping) {
            currentIndex = Math.max(currentIndex - 1, 0);
            setTransition(true);
            updatePosition();
            return;
        }
        currentIndex--;
        setTransition(true);
        updatePosition();
    };

    nextButton.addEventListener('click', goNext);
    prevButton.addEventListener('click', goPrev);

    // After animation ends, if we're in clone zone, jump (without transition)
    track.addEventListener('transitionend', () => {
        if (!looping) return;

        const maxRealStart = startIndex + (totalReal - 1); // last real card index in the DOM
        const leftCloneZoneEnd = startIndex - 1;           // indices < startIndex are left clones
        const rightCloneZoneStart = startIndex + totalReal; // first right clone index

        if (currentIndex <= leftCloneZoneEnd) {
            // jumped too far left -> wrap to real end
            setTransition(false);
            currentIndex = startIndex + (totalReal - 1);
            updatePosition();
        } else if (currentIndex >= rightCloneZoneStart) {
            // too far right -> wrap to real start
            setTransition(false);
            currentIndex = startIndex;
            updatePosition();
        }
    });

    // Resize: rebuild clones and reset safely
    window.addEventListener('resize', () => {
        // recompute & rebuild
        ({ looping, startIndex, totalReal } = cloneHeadTail());
        currentIndex = startIndex;
        setTransition(false);
        updatePosition();
    });

    prevButton.style.opacity = '1';
    prevButton.style.pointerEvents = 'all';
    nextButton.style.opacity = '1';
    nextButton.style.pointerEvents = 'all';
}

document.body.addEventListener('htmx:afterSettle', initCarousel);
document.addEventListener('DOMContentLoaded', initCarousel);