var style = 0;
var targetselect = document.getElementById("theme");
var firstload = false;

window.onload = function() {
  determineValidity();
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
      const cssPath = window.location.origin + "/theme_dark.css";
      document.getElementById("themesource").setAttribute("href", cssPath);
  } else if (style == 1) {
      const cssPath = window.location.origin + "/theme_light.css";
      document.getElementById("themesource").setAttribute("href", cssPath);
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

  function generateLabels(sliderId, labels, endoffset = 12.5, leftoffset = 0) {
    //get and define the parts we need, then empty them
    const slider = document.getElementById(sliderId);
    const labelContainer = document.getElementById(sliderId + "-labels");
    labelContainer.innerHTML = ""; //make the html blank just in case we are doing this multiple times to a slider for some reason

    const minvalue  = slider.min; //minimum value of the slider
    const maxvalue  = slider.max; //maximum value of the slider
    const sliderstep = slider.step || 1; //the step size of the slider, defaults to 1 if none is found
    const positioncount = Math.floor((maxvalue - minvalue) / sliderstep) + 1; //find how many labels there will be
    const gapcount = Math.max(1, positioncount - 1); //find out how many gaps there will be, but never return less than 1 to prevent dividing by 0 issues later

    //for each item in the array of labels, run through and make them into actual labels
    for (let i = 0; i < positioncount; i++) {
        const span = document.createElement("span");
        const frac = i / gapcount;
    
        //calculate the spacing of each label, then put it on the labels
        span.style.left = `calc(${endoffset}px + (100% - ${endoffset * 2}px) * ${frac} + ${leftoffset}px)`;
        span.textContent = labels && labels[i] ? labels[i] : (min + i * sliderstep);
        
        //finally, append the label span to the label container
        labelContainer.appendChild(span);
    }
  }

  function determineValidity() {
    //first get all the parts' elements
    const breastsize = document.getElementById("breastsize");
    const nipples = document.getElementById("nipples");
    const penis = document.getElementById("penis");
    const interface = document.getElementById("interface");
    const knot = document.getElementById("knot");
    const barbs = document.getElementById("barbs");
    const medialring = document.getElementById("medialring");
    const foreskin = document.getElementById("foreskin");
    const balls = document.getElementById("balls");
    const flaccid = document.getElementById("flaccid");
    const vulva = document.getElementById("vulva");
    const labia = document.getElementById("labia");

    const penistype = penis.value;
    const crotchtype = interface.value;

    if(breastsize.value == 0) {
      nipples.disabled = true;
      nipples.checked = false;
    } else {
      nipples.disabled = false;
    }

    if(penistype == 0) { //no penis? disable everything penis related and set dropdowns to -1
      interface.disabled = true;
      interface.value = -1
      knot.disabled = true;
      knot.checked = false;
      barbs.disabled = true;
      barbs.checked = false;
      medialring.disabled = true;
      medialring.checked = false;
      foreskin.disabled = true;
      foreskin.checked = false;
      balls.disabled = true;
      balls.value = -1
      flaccid.disabled = true;
      flaccid.checked = false;
    }
    else if(penistype == 1 || penistype == 3 || penistype == 4) { //humanoid, feline, and equine penis
      if(crotchtype == -1) {
        interface.value = 0;
      }
      interface.disabled = false;
      interface.options[1].disabled = false;

      knot.disabled = false;

      barbs.disabled = false;
      medialring.disabled = false;
      balls.disabled = false;

      if(balls.value == -1) {
        balls.value = 1
      }

      foreskin.disabled = false;
    }
    else if(penistype == 2) { //canine penis
      if(crotchtype == 0 || crotchtype == -1) { //deselect the direct inteface and disable it
        interface.value = 2;
      }
      interface.disabled = false;
      interface.options[1].disabled = true;

      knot.checked = true;
      knot.disabled = true;

      barbs.disabled = false;
      medialring.disabled = false;
      balls.disabled = false;

      if(balls.value == -1) {
        balls.value = 1
      }

      foreskin.checked = false;
      foreskin.disabled = true;
    }
    else if(penistype == 5) { //tapering penis
      if(crotchtype == -1) {
        interface.value = 2;
      }
      interface.disabled = false;
      interface.options[1].disabled = false;

      knot.disabled = false;

      barbs.disabled = false;
      medialring.disabled = false;
      balls.disabled = false;

      if(balls.value == -1) {
        balls.value = 1
      }

      foreskin.checked = false;
      foreskin.disabled = true;
    }
    else {penistype = 0}

    if(interface.value != 0) {
      flaccid.checked = false;
      flaccid.disabled = true;
    } else {
      flaccid.disabled = false;
    }

    if(vulva.checked) {
      labia.disabled = false;
    } else {
      labia.disabled = true;
      labia.checked = false;
    }
  }