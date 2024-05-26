window.onload = function() {
  splashes();
  document.getElementById("default").click();
  loadblogposts();
  loaddevblogposts();

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

function splashes(override) {
  fetch("./splashes.json").then((splashes) => { return splashes.json(); }).then((data) => {
    var random = Math.floor(Math.random() * (data.length + 1));
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    var tp = Math.floor(Math.random() * 5)
    if(override && !override.isNaN) {
      var random = override
    }
    //var random = 944;
    //var random = Math.floor((Math.random() * 3)+ 920)
    //console.log(random)
    //get the json, then with the data, make a random number up to it's length, then set the HTML element with the id "splash" as a random line from the json data
    document.getElementById("splashbg").classList.remove("patbg");
    document.getElementById("splash").classList.remove("pattext");
    document.getElementById("splashbg").classList.remove("fsfbg");
    document.getElementById("splash").classList.remove("fsftext");
    document.getElementById("splashbg").classList.remove("fsfps3bg");
    document.getElementById("splash").classList.remove("fsfps3text");
    document.getElementById("splash").classList.remove("bombplanted");
    //remove the Peace and Tranquility and Free Speech Flag stuff when getting a new splash
    //console.log("Day: " + day + ", Month: " + month);
    //console.log(tp);
    if (random == (data.length)) { //random ended up being the length of the splash list + 1, let's show this special splash showing how many there are
      document.getElementById("splash").innerHTML = "Featuring " + (data.length + 1) + " splashes!"
      //this was a total pain to get working right
    } 
    else if (day == 5 && month == 9 && tp == 1) { //liar's day?
      document.getElementById("splash").innerHTML = data[796];
    } 
    else if ((random == 800 || tp == 1) && day == 8 && month == 8) { //vore day splash which we should show if it's 8/8
      document.getElementById("splash").innerHTML = data[800];
    } 
    else if ((random == 801 || tp == 1) && day == 31 && month == 3) { //trans day of visibility splash which should be shown on March 31st
      document.getElementById("splash").innerHTML = data[801]
    }
    else if (random == 357) { //add an error to console if the splash is the one that says "no errors in console"
      console.error("nope, there's an error now!");
      document.getElementById("splash").innerHTML = data[random];
    } 
    else if (random == 417) { //it's time for Peace and Tranquility mode
      document.getElementById("splashbg").classList.add("patbg");
      document.getElementById("splash").classList.add("pattext");
      console.log("No one is around to help");
      console.log("Life is hard, life is stressful");
      console.log("I need peace and tranquility");
      console.log("I don't have to prove myself to anyone");
      document.getElementById("splash").innerHTML = data[random];
    } 
    else if (random == 921) { //free speech flag time baybeee
      document.getElementById("splashbg").classList.add("fsfbg");
      document.getElementById("splash").classList.add("fsftext");
      document.getElementById("splash").innerHTML = data[random];
    }
    else if (random == 922) { //free speech flag time baybeee
      document.getElementById("splashbg").classList.add("fsfps3bg");
      document.getElementById("splash").classList.add("fsfps3text");
      document.getElementById("splash").innerHTML = data[random];
    }
    else if (random == 937) {
      document.getElementById("splash").classList.add("bombplanted");
      document.getElementById("splash").innerHTML = data[random];
    }
    else if (random != 313) { document.getElementById("splash").innerHTML = data[random]; } else splashes(); //if "random" does not point to the splash that is not supposed to appear, work normally. note: this HAS to be last in order for things to work right
  });
}

function lowerVolume() {
  var patmusic = document.getElementById("patmusic");
  patmusic.volume = 0.3;
}

function loadblogposts() {
  var postDateString;
  fetch("./blog/posts.json")
  .then((posts) => { return posts.json(); })
  .then((data) => {
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
        postPinned = post.pinned; //is the post pinned to the top?
        //for each post, get the title, date, weather or not it's been edited, edit date, and content

        if (postTitle != undefined && postDate != undefined && postEdited != undefined && postContent != undefined) {

          let postdiv = document.createElement("div");
          if (postPinned) {
            postdiv.classList.add("pinnedblogpost");
          } else {
            postdiv.classList.add("blogpost");
          }
          //make the actual post div and add the class "blogpost" to it unless it's pinned, then add "pinnedblogpost" so it can be colored

          if (postEdited) {
            postDateString = "Posted on " + postDate + ", edited on " + postEditDate
          } else {
            postDateString = "Posted on " + postDate
          }
          //get the post date ready, if it's been editied add that too

          //if the post is pinned, add the text for it
          if (postPinned) {
            pinned = document.createElement("p");
            pinned.classList.add("postdate");
            pinned.innerHTML = "Pinned Post";
          }
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

          //add the pinned text
          if (postPinned) {
            postdiv.appendChild(pinned); 
          }
          postdiv.appendChild(title);
          postdiv.appendChild(date);
          postdiv.appendChild(splitter);
          postdiv.appendChild(content);
          //add all the text we just made to the div

          if (postPinned) {
            document.getElementById("pinnedposts").prepend(postdiv); 
          } else {
            document.getElementById("blogposts").prepend(postdiv);
          }
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

function vincheck() {
  var vintext = document.getElementById("vininput").value.toUpperCase();
  var vinvalue = 0;
  var checkchar = "";
  var resultvin = "";
  var badvin = false;
  if(vintext.length < 17) badvin = true;
  for(let i in vintext) {
    let multiplier = 1;
    if(i != 8) {
      //what's the multiplier?
      if(i == 0 || i == 10) multiplier = 8
      else if (i == 1 || i == 11) multiplier = 7
      else if (i == 2 || i == 12) multiplier = 6
      else if (i == 3 || i == 13) multiplier = 5
      else if (i == 4 || i == 14) multiplier = 4
      else if (i == 5 || i == 15) multiplier = 3
      else if (i == 6 || i == 16) multiplier = 2
      else if (i == 7) multiplier = 10
      else if (i == 9) multiplier = 9
      //check the letters
      if(vintext[i] == "A" || vintext[i] == "J") vinvalue += 1 * multiplier
      else if(vintext[i] == "B" || vintext[i] == "K" || vintext[i] == "S") vinvalue += 2 * multiplier
      else if(vintext[i] == "C" || vintext[i] == "L" || vintext[i] == "T") vinvalue += 3 * multiplier
      else if(vintext[i] == "D" || vintext[i] == "M" || vintext[i] == "U") vinvalue += 4 * multiplier
      else if(vintext[i] == "E" || vintext[i] == "N" || vintext[i] == "V") vinvalue += 5 * multiplier
      else if(vintext[i] == "F" || vintext[i] == "W") vinvalue += 6 * multiplier
      else if(vintext[i] == "G" || vintext[i] == "P" || vintext[i] == "X") vinvalue += 7 * multiplier
      else if(vintext[i] == "H" || vintext[i] == "Y") vinvalue += 8 * multiplier
      else if(vintext[i] == "R" || vintext[i] == "Z") vinvalue += 9 * multiplier
      else if(!isNaN(vintext[i]))vinvalue += vintext[i] * multiplier
      else badvin = true;
    }
  }
  checkchar = vinvalue % 11
  if(checkchar == 10) checkchar = "X"
  for(let i in vintext) {
    if(i != 8) resultvin += vintext[i]
    else resultvin += checkchar
  }
  if(badvin) {
    document.getElementById("vinresult").innerHTML = "Invalid VIN"
  }
  else if(resultvin === vintext) {
    document.getElementById("vinresult").innerHTML = "VIN is correct!"
  }
  else if(resultvin != vintext) {
    document.getElementById("vinresult").innerHTML = "Check bit invalid, corrected VIN<br>" + resultvin;
  }
}

function fppconvert() {
  var startvalue = document.getElementById("fordpasspoints").value;
  var resultvalue = 0;
  var badvalue = false;
  if(isNaN(startvalue)) {badvalue = true;}
  if(!badvalue) {
    resultvalue = (startvalue / 200);
  }
  if(badvalue) {
    document.getElementById("fordpassdollars").innerHTML = "Not a number"
  }
  else if(!badvalue) {
    document.getElementById("fordpassdollars").innerHTML = "Value: $" + resultvalue
  }
}

function loaddevblogposts() {
  var postDateString;
  fetch("./devblog/posts.json")
  .then((posts) => { return posts.json(); })
  .then((data) => {
    //get the json of blog posts

    if (data.length == 0) {
      let postdiv = document.createElement("div");
      postdiv.classList.add("blogpost");
      weird = document.createElement("p");
      weird.classList.add("maintext");
      weird.innerHTML = "This is weird and shouldn't be happening<br>There's either no blog posts or something has gone wrong"
      postdiv.appendChild(weird);
      document.getElementById("blogdevposts").appendChild(postdiv);
      //so, somehow something weird happened and posts aren't working, so let's display this message in that case
    } else {
      data.forEach(post => {

        postTitle = post.title; //title
        postDate = post.date; //date it was posted
        postEdited = post.edited; //was it edited?
        postEditDate = post.edited_date; //date it was edited
        postContent = post.content; //actual content of the post
        postPinned = post.pinned; //is the post pinned to the top?
        //for each post, get the title, date, weather or not it's been edited, edit date, and content

        if (postTitle != undefined && postDate != undefined && postEdited != undefined && postContent != undefined) {

          let postdiv = document.createElement("div");
          if (postPinned) {
            postdiv.classList.add("pinnedblogpost");
          } else {
            postdiv.classList.add("blogpost");
          }
          //make the actual post div and add the class "blogpost" to it unless it's pinned, then add "pinnedblogpost" so it can be colored

          if (postEdited) {
            postDateString = "Posted on " + postDate + ", edited on " + postEditDate
          } else {
            postDateString = "Posted on " + postDate
          }
          //get the post date ready, if it's been editied add that too

          //if the post is pinned, add the text for it
          if (postPinned) {
            pinned = document.createElement("p");
            pinned.classList.add("postdate");
            pinned.innerHTML = "Pinned Post";
          }
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

          //add the pinned text
          if (postPinned) {
            postdiv.appendChild(pinned); 
          }
          postdiv.appendChild(title);
          postdiv.appendChild(date);
          postdiv.appendChild(splitter);
          postdiv.appendChild(content);
          //add all the text we just made to the div

          if (postPinned) {
            document.getElementById("pinneddevposts").prepend(postdiv); 
          } else {
            document.getElementById("blogdevposts").prepend(postdiv);
          }
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