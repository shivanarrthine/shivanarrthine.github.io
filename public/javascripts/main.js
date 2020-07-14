
let currentTheme;
const isDarkMode = window.matchMedia(`(prefers-color-scheme: dark)`).matches;
const isLightMode = window.matchMedia(`(prefers-color-scheme: light)`).matches;
const isNotSpecified = window.matchMedia(`(prefers-color-scheme: no-preference)`).matches;
const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified;


$(document).ready(function(){

    // init AOS
    AOS.init({
        once: true
    });

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


});

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

    // show copied message
    $("#copyEmailBtn").text("Email copied")
    $("#copyEmailBtn").addClass('active')
    setTimeout(function(){
        $("#copyEmailBtn").text("Copy email")
        $("#copyEmailBtn").removeClass('active')
    }, 2000)
}

// smooth scroll fallback
$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
});


// TODO: change to cleaner implementation of theme switching