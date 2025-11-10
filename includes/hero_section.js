// Hero slider - autoplay, infinite, responsive
(function initHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    const track = document.querySelector('.hero-slides');
    const slideEls = Array.from(document.querySelectorAll('.hero-slide'));
    if (!slider || !track || slideEls.length === 0) return;

    // Clone for seamless loop
    const firstClone = slideEls[0].cloneNode(true);
    const lastClone = slideEls[slideEls.length - 1].cloneNode(true);
    track.insertBefore(lastClone, track.firstChild);
    track.appendChild(firstClone);


    let index = 1; // because of the leading clone
    let isTransitioning = false;
    let autoTimer = null;
    const slideCount = slideEls.length;
    const DURATION_MS = 600;
    const AUTOPLAY_MS = 5000;

    function setTranslate() {
        track.style.transform = `translateX(-${index * 100}%)`;
    }
    function getActiveImage() {
        const active = track.children[index];
        if (!active) return null;
        return active.querySelector('img');
    }
    function updateSliderHeight() {
        const img = getActiveImage();
        if (!img) return;
        const apply = () => {
            const width = slider.clientWidth || img.clientWidth || window.innerWidth;
            const ratio = (img.naturalHeight && img.naturalWidth)
              ? img.naturalHeight / img.naturalWidth
              : (img.clientHeight / Math.max(1, img.clientWidth));
            const h = Math.max(1, Math.round(width * ratio));
            slider.style.setProperty('--hero-h', `${h}px`);
        };
        if (img.complete && img.naturalWidth) apply();
        else img.addEventListener('load', apply, { once: true });
    }
    function next() {
        if (isTransitioning) return;
        index += 1;
        slide();
    }
    function prev() {
        if (isTransitioning) return;
        index -= 1;
        slide();
    }
    function slide() {
        isTransitioning = true;
        track.style.transition = `transform ${DURATION_MS}ms ease`;
        setTranslate();
    }
    function resetWithoutTransition() {
        track.style.transition = 'none';
        setTranslate();
        // Force reflow to apply "none", then restore transition
        // eslint-disable-next-line no-unused-expressions
        track.offsetHeight;
        track.style.transition = `transform ${DURATION_MS}ms ease`;
    }

    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (index === 0) {
            index = slideCount;
            resetWithoutTransition();
        } else if (index === slideCount + 1) {
            index = 1;
            resetWithoutTransition();
        }
        // update height for the new active slide
        updateSliderHeight();
    });

    // Autoplay
    function startAuto() {
        stopAuto();
        autoTimer = setInterval(next, AUTOPLAY_MS);
    }
    function stopAuto() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopAuto();
        else startAuto();
    });

    // Touch swipe
    let touchStartX = 0;
    let touchMoveX = 0;
    let isTouching = false;
    const SWIPE_THRESHOLD = 40;
    slider.addEventListener('touchstart', (e) => {
        stopAuto();
        isTouching = true;
        touchStartX = e.touches[0].clientX;
        touchMoveX = touchStartX;
    }, { passive: true });
    slider.addEventListener('touchmove', (e) => {
        if (!isTouching) return;
        touchMoveX = e.touches[0].clientX;
    }, { passive: true });
    slider.addEventListener('touchend', () => {
        if (!isTouching) return;
        const delta = touchMoveX - touchStartX;
        if (Math.abs(delta) > SWIPE_THRESHOLD) {
            delta < 0 ? next() : prev();
        }
        isTouching = false;
        startAuto();
    });

    // Initialize position
    requestAnimationFrame(() => {
        index = 1;
        resetWithoutTransition();
        updateSliderHeight();
        startAuto();
    });

    // Update height on resize (debounced)
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateSliderHeight, 100);
    });
})(); 

