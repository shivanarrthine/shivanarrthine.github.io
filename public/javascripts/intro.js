(function () {
    const chat = document.getElementById("introChat");
    if (!chat || !window.createChat) return;

    const list = chat.querySelector(".intro__messages");
    const chatMain = chat.querySelector(".intro__chatMain");
    const desktopMq = window.matchMedia("(min-width: 768px)");
    let footerRevealLock = false;

    function isDesktop() {
        return desktopMq.matches;
    }

    function chatCanScroll() {
        return chat.classList.contains("intro__chat--continued")
            || chat.classList.contains("intro__chat--done");
    }

    function preserveListPosition(update) {
        const topBefore = list.getBoundingClientRect().top;
        update();
        const topAfter = list.getBoundingClientRect().top;
        if (topAfter !== topBefore) {
            chat.scrollTop += topAfter - topBefore;
        }
    }

    function scrollChatToLatest() {
        if (!chatCanScroll()) return;
        chat.scrollTop = chat.scrollHeight;
    }

    function lockChatMainHeight() {
        if (isDesktop() || !chatMain) return;
        chatMain.style.minHeight = chatMain.offsetHeight + "px";
        chatMain.classList.add("intro__chatMain--locked");
    }

    function unlockChatForContinuation() {
        if (chatMain) {
            chatMain.style.minHeight = "";
            chatMain.classList.remove("intro__chatMain--locked");
        }
        chat.classList.add("intro__chat--continued");
        requestAnimationFrame(scrollChatToLatest);
    }

    if (typeof ResizeObserver !== "undefined") {
        new ResizeObserver(() => {
            if (footerRevealLock) return;
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
            footerRevealLock = true;
            lockChatMainHeight();

            preserveListPosition(() => {
                chat.classList.add("intro__chat--done");
            });

            requestAnimationFrame(() => {
                preserveListPosition(() => {});
                scrollChatToLatest();
                footerRevealLock = false;
            });
        }
    }).start(600);
})();
