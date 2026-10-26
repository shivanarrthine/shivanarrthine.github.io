
let currentTheme;
const isDarkMode = window.matchMedia(`(prefers-color-scheme: dark)`).matches;
const isLightMode = window.matchMedia(`(prefers-color-scheme: light)`).matches;
const isNotSpecified = window.matchMedia(`(prefers-color-scheme: no-preference)`).matches;
const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified;

let isSmoothScrollSupported = 'scrollBehavior' in document.documentElement.style;


$(document).ready(function(){

    if (typeof AOS !== "undefined") {
        AOS.init({
            once: true
        });
    }

    // detect current theme
    let currentTheme = userThemePreference();

    // change theme if current theme exists
    if(currentTheme === "light"){
        switchToLightTheme()
    } else if(currentTheme === "dark"){
        switchToDarkTheme()
    }

    // detect toggle interaction
    $("#themeSwitcher").on('change', toggleTheme)

    // detect any changes in system preferences
    window.matchMedia("(prefers-color-scheme: dark)").addListener(e => e.matches && switchToDarkTheme())
    window.matchMedia("(prefers-color-scheme: light)").addListener(e => e.matches && switchToLightTheme())

    initHomeCarousels();

});

function initHomeCarousels() {
    document.querySelectorAll(".home .workScroll").forEach(setupHomeCarousel);
}

function setupHomeCarousel(carousel) {
    const fadeHost = carousel.closest(".home__carouselFade");
    const cards = () => Array.from(carousel.querySelectorAll(".workCard"));

    function cardsContentWidth() {
        const items = cards();
        if (!items.length) return 0;
        const gap = parseFloat(getComputedStyle(carousel).columnGap || getComputedStyle(carousel).gap) || 0;
        return items.reduce((total, card, index) => {
            return total + card.getBoundingClientRect().width + (index < items.length - 1 ? gap : 0);
        }, 0);
    }

    const mobileStackQuery = window.matchMedia("(max-width: 768px)");

    function syncScrollLock() {
        const useMobileStack = mobileStackQuery.matches;
        const overflows = !useMobileStack && cardsContentWidth() > carousel.clientWidth + 1;
        carousel.classList.toggle("workScroll--locked", !overflows || useMobileStack);
        if (fadeHost) {
            fadeHost.classList.toggle("home__carouselFade--scrollable", overflows);
        }
        if (!overflows) {
            carousel.scrollLeft = 0;
        }
    }

    function nearestCardIndex() {
        const items = cards();
        if (!items.length) return 0;
        const scrollLeft = carousel.scrollLeft;
        let closest = 0;
        let minDistance = Infinity;
        items.forEach((card, index) => {
            const distance = Math.abs(card.offsetLeft - scrollLeft);
            if (distance < minDistance) {
                minDistance = distance;
                closest = index;
            }
        });
        return closest;
    }

    function scrollToCard(index) {
        const items = cards();
        if (!items.length) return;
        const clamped = Math.max(0, Math.min(items.length - 1, index));
        carousel.scrollTo({
            left: items[clamped].offsetLeft,
            behavior: "smooth"
        });
    }

    carousel.addEventListener("scroll", () => {
        if (carousel.classList.contains("workScroll--locked")) {
            carousel.scrollLeft = 0;
        }
    });

    carousel.addEventListener("wheel", (event) => {
        if (carousel.classList.contains("workScroll--locked")) return;
        if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
        event.preventDefault();
        const direction = event.deltaY > 0 ? 1 : -1;
        scrollToCard(nearestCardIndex() + direction);
    }, { passive: false });

    carousel.addEventListener("keydown", (event) => {
        if (carousel.classList.contains("workScroll--locked")) return;
        if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollToCard(nearestCardIndex() + 1);
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollToCard(nearestCardIndex() - 1);
        }
    });

    syncScrollLock();
    if (typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(syncScrollLock);
        observer.observe(carousel);
        cards().forEach((card) => observer.observe(card));
    }
    window.addEventListener("resize", syncScrollLock);
    if (mobileStackQuery.addEventListener) {
        mobileStackQuery.addEventListener("change", syncScrollLock);
    } else if (mobileStackQuery.addListener) {
        mobileStackQuery.addListener(syncScrollLock);
    }
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(syncScrollLock);
    }
}

function userThemePreference(){
    let theme = undefined;

    // detect if there is an existing theme selection
    const localStorageTheme = localStorage.getItem("currentTheme");
    
    if(localStorageTheme === "light"){
        theme = "light";
    } else if (localStorageTheme === "dark"){
        theme = "dark";
    }

    // detect system theme preference
    if (isDarkMode){
        // prefers dark mode if no locally stored preference
        theme = localStorageTheme ? localStorageTheme : "dark";   
    } else if (isLightMode){
        // prefers light mode if no locally stored preference
        theme = localStorageTheme ? localStorageTheme : "light"
    } else if (isNotSpecified || hasNoSupport){
        // default to light mode if no locally stored preference
        theme = localStorageTheme ? localStorageTheme : "light"
    }

    return theme;
}

// Theme switching
function toggleTheme(){
    // detect if there is an existing session, pull currrent theme
    currentTheme = localStorage.getItem("currentTheme");
    if(!currentTheme){
        // default to dark
        currentTheme = "light";
    }
    
    if(currentTheme === "light"){
        switchToDarkTheme()
    } else if (currentTheme === "dark"){
        switchToLightTheme()
    }
}

function switchToDarkTheme(){
    // change color variables
    $('html').addClass('dark');
    $('html').removeClass('light');
    // ensure toggle is checked
    $("#themeSwitcher").attr("checked", false)
    // save theme
    saveCurrentTheme("dark");
}

function switchToLightTheme(){
    // change color variables
    $('html').addClass('light');
    $('html').removeClass('dark')
    // ensure toggle is checked
    $("#themeSwitcher").attr("checked", true)
    // save theme
    saveCurrentTheme("light");
}

function saveCurrentTheme(theme){
    localStorage.setItem("currentTheme", theme);
}

// email copy functionality
function copyEmail(){
    // get email from hidden input
    let input = document.getElementById("email")
    let value = input.select();
    
    // copy to clipboard
    document.execCommand('copy');

    // show toast message
    $("#toastEmailCopied").addClass('show')
    setTimeout(function(){
        $("#toastEmailCopied").removeClass('show')
    }, 3000)

}

// smooth scroll fallback
$(document).on('click', 'a[href^="#"]', function (event) {

    // to avoid conflict with chrome's smoothscroll support
    if(!isSmoothScrollSupported){
            event.preventDefault();
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 500);
    }
});

// TODO: change to cleaner implementation of theme switching