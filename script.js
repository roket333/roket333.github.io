window.onload = function() {
  splashes();
  document.getElementById("default").click();
  loadblogposts();
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

function splashes() {
  fetch("./splashes.json").then((splashes) => { return splashes.json(); }).then((data) => {
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

function loadblogposts() {
  var postDateString;
  fetch("./blog/posts.json").then((posts) => { return posts.json(); }).then((data) => {
    //get the json of blog posts

    if (data.length == 0) {
      let postdiv = document.createElement("div");
      postdiv.classList.add("blogpost");
      //make the actual post div and add the class "blogpost" to it
      weird = document.createElement("p");
      weird.classList.add("maintext");
      weird.innerHTML = "This is weird and shouldn't be happening<br>There's either no blog posts or something has gone wrong"
      postdiv.appendChild(weird);
      document.getElementById("blogposts").appendChild(postdiv);
      //so, somehow something weird happened and posts aren't working, so let's display this message in that case
    } else {
      data.forEach(post => {
        let postdiv = document.createElement("div");
        postdiv.classList.add("blogpost");
        //make the actual post div and add the class "blogpost" to it

        postTitle = post.title; //title
        postDate = post.date; //date it was posted
        postEdited = post.edited; //was it edited?
        postEditDate = post.edited_date; //date it was edited
        postContent = post.content; //actual content of the post
        //for each post, get the title, date, weather or not it's been edited, edit date, and content

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
        splitter.style.cssText += "border: 3px solid #e5e5e5;max-width:95%";
        content = document.createElement("p");
        content.classList.add("postcontent");
        content.innerHTML = postContent;
        //create all the text and assign it

        postdiv.appendChild(title);
        postdiv.appendChild(date);
        postdiv.appendChild(splitter);
        postdiv.appendChild(content);
        //add all the text we just made to the div

        document.getElementById("blogposts").appendChild(postdiv);
        //add the post to div where they will all live happily ever after the end :)
      });
    }
  });
}