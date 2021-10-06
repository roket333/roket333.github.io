window.onload = function() {
  splashes();
}

function splashes() {
  fetch('splashes.json').then((response) => { return response.json(); }).then((data) => {
    var random = Math.floor(Math.random() * (data.length));
    document.getElementById('splash').innerHTML = data[random];
    //get the json, then with the data, make a random number up to it's length, then set the HTML element with the id "splash" as a random line from the json data
  });
}