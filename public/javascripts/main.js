
let currentTheme;


$(document).ready(function(){

    // init AOS
    AOS.init({
        once: true
    });

    // detect current theme
    let currentTheme = userThemePreference();

    if(currentTheme === "dark"){
        // change toggle to dark and change theme
        $("#themeSwitcher").attr("checked", false)
        switchToDarkTheme()
    }

    // detect toggle interaction
    $("#themeSwitcher").on('change', toggleTheme)

});

function userThemePreference(){
    // detect if there is an existing theme selection
    const localStorageTheme = localStorage.getItem("currentTheme");
    let theme = undefined;


    if(localStorageTheme === "light"){
        theme = "light";
    } else if (localStorageTheme === "dark"){
        theme = "dark";
    }

    // detect system theme preference
    if (window.matchMedia(`(prefers-color-scheme: dark)`).matches){
        // prefers dark mode if no locally stored preference
        theme = localStorageTheme ? localStorageTheme : "dark";   
    } else if (window.matchMedia(`(prefers-color-scheme: light)`).matches){
        // prefers light mode if no locally stored preference
        theme = localStorageTheme ? localStorageTheme : "light"
    } else if (window.matchMedia(`(prefers-color-scheme: no-preference)`).matches){
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
    // save theme
    saveCurrentTheme("dark");
}

function switchToLightTheme(){
    // change color variables
    $('html').addClass('light');
    $('html').removeClass('dark')
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