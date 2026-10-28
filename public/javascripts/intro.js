(function () {
    const chat = document.getElementById("introChat");
    if (!chat || !window.createChat) return;

    const list = chat.querySelector(".intro__messages");
    const desktopMq = window.matchMedia("(min-width: 768px)");

    function isDesktop() {
        return desktopMq.matches;
    }

    function chatCanScroll() {
        return chat.classList.contains("intro__chat--continued")
            || chat.classList.contains("intro__chat--done");
    }

    function scrollChatToLatest() {
        if (!chatCanScroll()) return;
        chat.scrollTop = chat.scrollHeight;
    }

    function unlockChatForContinuation() {
        chat.classList.add("intro__chat--continued");
        requestAnimationFrame(scrollChatToLatest);
    }

    if (typeof ResizeObserver !== "undefined") {
        new ResizeObserver(() => {
            if (!chat.classList.contains("intro__chat--done")) {
                if (!isDesktop()) chat.scrollTop = chat.scrollHeight;
                return;
            }
            scrollChatToLatest();
        }).observe(list);
    }

    window.createChat(chat, {
        onResume: unlockChatForContinuation,
        onPause: () => {
            chat.classList.add("intro__chat--done");
        }
    }).start(600);
})();
