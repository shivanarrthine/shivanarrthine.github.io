(function () {
    const chat = document.getElementById("introChat");
    if (!chat || !window.createChat) return;

    const list = chat.querySelector(".intro__messages");

    if (typeof ResizeObserver !== "undefined") {
        new ResizeObserver(() => { chat.scrollTop = chat.scrollHeight; }).observe(list);
    }

    window.createChat(chat, {
        onPause: () => chat.classList.add("intro__chat--done")
    }).start(600);
})();
