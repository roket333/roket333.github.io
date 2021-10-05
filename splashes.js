window.onload = function() {
    splashes();
}

function splashes() {
    fetch('splashes.json')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    var random = Math.floor(Math.random() * (data.length));
    document.getElementById('splash').innerHTML = data[random];
  });
}