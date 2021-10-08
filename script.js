window.onload = function() {
  splashes();
  document.getElementById("default").click();
}

function openTab(event, tab) {
  var i,tabcont,tablinks

  //hide everything with the class "tabcontent"
  tabcont = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcont.length; i++) {
    tabcont[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tab).style.display = "block";
  event.currentTarget.className += " active";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function rotation(event) {
  event.currentTarget.className += " spinning";
  sleep(5000).then(() => { event.currentTarget.className.replace(" spinning", "") });
}

function splashes() {
  fetch('splashes.json').then((response) => { return response.json(); }).then((data) => {
    var random = Math.floor(Math.random() * (data.length));
    //get the json, then with the data, make a random number up to it's length, then set the HTML element with the id "splash" as a random line from the json data
    if (random == 357) {
      console.error("nope, there's an error now!");
      document.getElementById('splash').innerHTML = data[random];
    } else if (random != 313) {
      document.getElementById('splash').innerHTML = data[random];
    } else splashes();
    //if the splash is the one that shouldn't appear, try again
    //document.getElementById('splash').innerHTML = data[313]; //debug the non-appearing splash
  });
}