window.onload = function() {
  splashes();
  document.getElementById("default").click();
  loadblogposts();

  //hide the loading screen and show the actual site
  document.getElementById("site").style.display = "block";
  document.getElementById("loading").style.display = "none";
}

function myFunction() {
  var x = document.getElementById("navbar");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

function openTab(event, tab) {
  var i,tabcont,tablinks

  //hide everything with the class "tabcontent"
  tabcont = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcont.length; i++) {
    tabcont[i].style.display = "none";
  }

  //get all elements with the class "tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  //show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tab).style.display = "block";
  event.currentTarget.className += " active";
}

function newsplash() {
  //when the new splash button is pressed, remove any "spinning" that might be on it, ask for a new splash, then make it speen
  document.getElementById("refreshbutton").classList.remove("spinning");
  splashes();
  document.getElementById("refreshbutton").classList.add("spinning");
  //now wait 250ms for the animation to finish and remove "spinning" so it can spin again when next clicked
  setTimeout(function undospin() {
    document.getElementById("refreshbutton").classList.remove("spinning");
  },250);
}

function splashes() {
  fetch("./splashes.json").then((splashes) => { return splashes.json(); }).then((data) => {
    var random = Math.floor(Math.random() * (data.length + 1));
    //var random = 417;
    //get the json, then with the data, make a random number up to it's length, then set the HTML element with the id "splash" as a random line from the json data
    document.getElementById("splashbg").classList.remove("patbg");
    document.getElementById("splash").classList.remove("pattext");
    //remove the Peace and Tranquility stuff when getting a new splash
    if (random == (data.length)) {
      document.getElementById("splash").innerHTML = "Featuring " + (data.length + 1) + " splashes!"
      //this was a total pain to get working right
    } else if (random == 357) {
      console.error("nope, there's an error now!");
      document.getElementById("splash").innerHTML = data[random];
      //add an error if the splash is "no errors in console"
    } else if (random == 417) {
      document.getElementById("splashbg").classList.add("patbg");
      document.getElementById("splash").classList.add("pattext");
      console.log("No one is around to help");
      console.log("Life is hard, life is stressful");
      console.log("I need peace and tranquility");
      console.log("I don't have to prove myself to anyone");
      document.getElementById("splash").innerHTML = data[random];
      //activate Peace and Tranquility background and text
    } else if (random != 313) {
      document.getElementById("splash").innerHTML = data[random];
    } else splashes();
    //special cases for splashes
  });
}

function lowerVolume() {
  var patmusic = document.getElementById("patmusic");
  patmusic.volume = 0.3;
}

function loadblogposts() {
  var postDateString;
  fetch("./blog/posts.json").then((posts) => { return posts.json(); }).then((data) => {
    //get the json of blog posts

    if (data.length == 0) {
      let postdiv = document.createElement("div");
      postdiv.classList.add("blogpost");
      weird = document.createElement("p");
      weird.classList.add("maintext");
      weird.innerHTML = "This is weird and shouldn't be happening<br>There's either no blog posts or something has gone wrong"
      postdiv.appendChild(weird);
      document.getElementById("blogposts").appendChild(postdiv);
      //so, somehow something weird happened and posts aren't working, so let's display this message in that case
    } else {
      data.forEach(post => {

        postTitle = post.title; //title
        postDate = post.date; //date it was posted
        postEdited = post.edited; //was it edited?
        postEditDate = post.edited_date; //date it was edited
        postContent = post.content; //actual content of the post
        //for each post, get the title, date, weather or not it's been edited, edit date, and content

        if (postTitle != undefined && postDate != undefined && postEdited != undefined && postContent != undefined) {

          let postdiv = document.createElement("div");
          postdiv.classList.add("blogpost");
          //make the actual post div and add the class "blogpost" to it

          if (postEdited) {
            postDateString = "Posted on " + postDate + ", edited on " + postEditDate
          } else {
            postDateString = "Posted on " + postDate
          }
          //get the post date ready, if it's been editied add that too

          title = document.createElement("p");
          title.classList.add("postitle");
          title.innerHTML = postTitle;
          date = document.createElement("p");
          date.classList.add("postdate");
          date.innerHTML = postDateString;
          splitter = document.createElement("hr");
          splitter.style.cssText += "border: 3px solid #e5e5e5;";
          content = document.createElement("p");
          content.classList.add("postcontent");
          content.innerHTML = postContent;
          //create all the text and assign it

          postdiv.appendChild(title);
          postdiv.appendChild(date);
          postdiv.appendChild(splitter);
          postdiv.appendChild(content);
          //add all the text we just made to the div

          document.getElementById("blogposts").prepend(postdiv);
          //using prepend instead of append allows me to build posts.json in a way that makes sense
          //add the post to the top of the div where they will all live happily ever after the end :)
        } else {
          console.error("There was a problem with one of the posts, so it is not displayed");
          //some vital part of the blog post was not filled out, so instead of showing a broken post, let's just not show it and print this error to console
        }
      });
    }
  });
}