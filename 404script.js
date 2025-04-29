var style = 0
var targetselect = document.getElementById("theme")

window.onload = function() {
  style = parseInt(getCookie("theme"));
    if(style === null || isNaN(style)) {
        let darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
        if (darkThemeMq.matches) {
            setCookie("theme", 0, 621)
            style = 0;
            changeTheme();
        } else {
            setCookie("theme", 1, 621)
            style = 1;
            changeTheme();
        }
    } else {
        changeTheme();
        
    } 
}

function updateTheme(themeid) {
  setCookie("theme", themeid, 621);
  changeTheme();
}

function changeTheme() {
  targetselect = document.getElementById("theme")
  style = parseInt(getCookie("theme"));
  targetselect.value = style
  if(style == 0) {
      document.getElementById("themesource").setAttribute("href", "./theme_dark.css")
  } else if (style == 1) {
      document.getElementById("themesource").setAttribute("href", "./theme_light.css")
  }
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
  }
  
  function getCookie(name) {
    const cookies = document.cookie.split(";"); // Split cookies into individual key-value pairs
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim(); // Remove leading/trailing spaces
        if (cookie.startsWith(name + "=")) {
            return parseFloat(cookie.substring(name.length + 1)); // Parse as a number
        }
    }
    return null; // Return null if the cookie is not found
  }