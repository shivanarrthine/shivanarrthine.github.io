window.createChat = function (root, options) {
    const onPause = (options && options.onPause) || function () {};
    const onResume = (options && options.onResume) || function () {};
    const DEFAULT_DELAY = 1200;
    const LEAVE_DURATION = 950;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(root.querySelectorAll(".intro__msg"));
    let index = 0;
    let paused = false;
    let released = false;

    function updateFades() {
        const texts = items.filter((item) => item.classList.contains("is-visible") && item.querySelector("p"));
        texts.forEach((item, i) => {
            const fromNewest = texts.length - 1 - i;
            item.classList.toggle("is-recent", fromNewest === 1);
            item.classList.toggle("is-old", fromNewest > 1);
        });
    }

    function step() {
        const item = items[index];
        if (!item || (item.hasAttribute("data-await") && !released)) {
            paused = true;
            onPause();
            return;
        }
        released = false;
        item.classList.add("is-visible");
        updateFades();
        index++;

        const nextItem = items[index];
        const delay = nextItem ? Number(nextItem.dataset.delay) || DEFAULT_DELAY : 0;
        if (reduceMotion) step();
        else setTimeout(step, delay);
    }

    function resume() {
        released = true;
        onResume();
        if (paused) {
            paused = false;
            step();
        }
    }

    function leave(button) {
        button.disabled = true;
        button.style.height = button.offsetHeight + "px";
        void button.offsetHeight;
        button.classList.add("is-leaving");
        setTimeout(() => { button.hidden = true; }, reduceMotion ? 0 : LEAVE_DURATION);
        resume();
    }

    root.addEventListener("click", (event) => {
        const button = event.target.closest("[data-chat-next]");
        if (button && !button.disabled) leave(button);
    });

    return {
        start(delay) {
            if (reduceMotion || !delay) step();
            else setTimeout(step, delay);
        }
    };
};
