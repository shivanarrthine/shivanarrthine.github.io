(function () {
    const hasObserver = "IntersectionObserver" in window;

    function onceInView(elements, threshold, callback) {
        if (!hasObserver) {
            elements.forEach(callback);
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);
                callback(entry.target);
            });
        }, { threshold });
        elements.forEach((el) => observer.observe(el));
    }

    function initCarousel(carousel) {
        const track = carousel.querySelector(".work__track");
        const arrows = carousel.querySelector(".work__arrows");
        const prev = carousel.querySelector("[data-carousel-prev]");
        const next = carousel.querySelector("[data-carousel-next]");

        function stepSize() {
            const card = track.querySelector(".work__card");
            const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
            return card ? card.offsetWidth + gap : track.clientWidth;
        }

        function sync() {
            const max = track.scrollWidth - track.clientWidth;
            arrows.hidden = max <= 1;
            prev.disabled = track.scrollLeft <= 1;
            next.disabled = track.scrollLeft >= max - 1;
        }

        prev.addEventListener("click", () => track.scrollBy({ left: -stepSize(), behavior: "smooth" }));
        next.addEventListener("click", () => track.scrollBy({ left: stepSize(), behavior: "smooth" }));
        track.addEventListener("scroll", sync, { passive: true });
        window.addEventListener("resize", sync);
        if (typeof ResizeObserver !== "undefined") new ResizeObserver(sync).observe(track);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
        sync();
    }

    function reserveHeight(list) {
        const items = Array.from(list.children);
        items.forEach((item) => { item.style.display = "grid"; item.style.animation = "none"; });
        list.style.minHeight = list.offsetHeight + "px";
        items.forEach((item) => { item.style.display = ""; item.style.animation = ""; });
    }

    function startChat(section) {
        const list = section.querySelector(".work__chatList");
        reserveHeight(list);
        window.createChat(section, {
            onPause: () => setTimeout(() => { list.style.minHeight = ""; }, 700)
        }).start();
    }

    document.querySelectorAll("[data-carousel]").forEach(initCarousel);
    onceInView(document.querySelectorAll("[data-reveal]"), 0.15, (el) => el.classList.add("is-revealed"));
    if (window.createChat) onceInView(document.querySelectorAll("[data-chat]"), 0.4, startChat);
})();
