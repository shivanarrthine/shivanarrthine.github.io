
var currentTheme;
var lightThemePath = "/public/css/light.css";
var darkThemePath = "/public/css/dark.css";


$(document).ready(function(){

    // init AOS
    AOS.init({
        once: true
    });

    // detect if there is an existing theme selection
    currentTheme = localStorage.getItem("currentTheme");

    console.log("Current theme is " +currentTheme);

    if(currentTheme === "dark"){
        // change toggle to dark and change theme
        $("#themeSwitcher").attr("checked", false)
        switchToDarkTheme()
    }

    // detect toggle interaction
    $("#themeSwitcher").on('change', toggleTheme)

});

// Theme switching
function toggleTheme(){
    // detect if there is an existing session, pull currrent theme
    currentTheme = localStorage.getItem("currentTheme");
    if(!currentTheme){
        // default to dark
        currentTheme = "light";
        console.log("defaulted to light")
    }
    
    if(currentTheme === "light"){
        switchToDarkTheme()
    } else if (currentTheme === "dark"){
        switchToLightTheme()
    }
}

function switchToDarkTheme(){
    loadThemeFile(lightThemePath, darkThemePath);
    saveCurrentTheme("dark");

    console.log("switched to dark theme")
}

function switchToLightTheme(){
    loadThemeFile(darkThemePath, lightThemePath);
    saveCurrentTheme("light");
    console.log("Switced to light theme")
}

function loadThemeFile(oldPath, newPath){
    $("link[href='" + oldPath + "']").attr('href',newPath);
}

function saveCurrentTheme(theme){
    localStorage.setItem("currentTheme", theme);
}

// email copy functionality
function copyEmail(){
    // get email from hidden input
    var input = document.getElementById("email")
    var value = input.select();
    
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