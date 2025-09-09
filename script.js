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
    
  splashes();
  //document.getElementById("default").click();
  loadblogposts();
  showVersion();

  //hide the loading screen and show the actual site
  document.getElementById("site").style.display = "block";
  document.getElementById("loading").style.display = "none";
}

function showVersion() {
  fetch("./version.json")
    .then(res => res.json())
    .then(data => {
      const majorversion = data.version_major;
      const minorversion = data.version_minor;
      const versionEl = document.getElementById("version");
      versionEl.innerHTML = "V" + majorversion + " revision " + minorversion;
    })
    .catch(err => console.error("Could not load version.json:", err));
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

function myFunction() {
  var x = document.getElementById("navbar");
  if (x.className === "topnav") {
      x.className += " responsive";
  } else {
      x.className = "topnav";
  }
}

function handleHashChange() {
  var hash = window.location.hash.substring(1); // Remove the '#' from the hash
  if (hash) {
      // Ensure the hash corresponds to a valid tab
      var tabContent = document.getElementById(hash);
      if (tabContent && tabContent.classList.contains("tabcontent")) {
          openTab(null, hash); // Open the tab without triggering a click event
      } else {
          console.warn(`Hash "${hash}" does not correspond to a valid tab.`);
      }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Check if there's a hash in the URL
  let initialHash = window.location.hash.substring(1);

  if (initialHash) {
      // If there is a hash, handle it like normal
      handleHashChange();
  } else {
      // No hash? Default to "home"
      document.getElementById("default").click();
  }
});


// Handle hash changes when the user navigates
window.addEventListener("hashchange", () => {
  const hash = window.location.hash.substring(1); // Remove the '#' from the hash
  const tabContent = document.getElementById(hash);

  if (tabContent && tabContent.classList.contains("tabcontent")) {
      openTab(null, hash); // Open the tab corresponding to the hash
  } else {
      console.warn(`Hash "${hash}" does not match a valid tab.`);
  }
});

function openTab(event, tab) {
  let i, tabContents, tablinks;

  // Get all tab contents
  tabContents = document.getElementsByClassName("tabcontent");

  // Ensure the tab exists and has the correct class
  const tabContent = document.getElementById(tab);
  if (!tabContent || !tabContent.classList.contains("tabcontent")) {
      console.warn(`Tab "${tab}" is not valid.`);
      return; // Exit if the tab is invalid
  }

  // Hide all tab contents
  for (i = 0; i < tabContents.length; i++) {
      tabContents[i].style.display = "none";
  }

  // Show the current tab content
  tabContent.style.display = "block";

  // Update active states for visible buttons
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  if (event && event.currentTarget) {
      event.currentTarget.className += " active";
  }

  // Update the URL hash without causing a page scroll
  history.replaceState(null, null, `#${tab}`);
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

    // Retrieve existing cookies
    let random = getCookie("random");
    let oldrandom1 = getCookie("oldrandom1");
    let oldrandom2 = getCookie("oldrandom2");

    // Shift the values correctly
    setCookie("oldrandom2", oldrandom1, 7); // Move oldrandom1 to oldrandom2
    setCookie("oldrandom1", random, 7);    // Move random to oldrandom1

    // Generate a new random number
    random = Math.floor(Math.random() * (data.length + 1));
    //random = 621
    setCookie("random", random, 7); // Store the new random number

    random = getCookie("random");
    oldrandom1 = getCookie("oldrandom1");
    oldrandom2 = getCookie("oldrandom2");

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    var tp = Math.floor(Math.random() * 5)
    let overridden = false;
    //var p6gr = Math.floor(Math.random() * 10)
    if(override && !override.isNaN) {
      random = override
      overridden = true
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
    document.getElementById("splashbg").classList.remove("idiot_l");
    document.getElementById("splashbg").classList.remove("idiot_r");
    document.getElementById("splash").classList.remove("shadow");
    //remove the Peace and Tranquility and Free Speech Flag stuff when getting a new splash
    //console.log("Day: " + day + ", Month: " + month);
    //console.log(tp);

    //if the criteria matches, we should end the function at that if statement, hence why this is an else-if chain
    if (random == (data.length)) { //random ended up being the length of the splash list + 1, let's show this special splash showing how many there are
      document.getElementById("splash").innerHTML = "Featuring " + (data.length + 1) + " splashes!"
      //this was a total pain to get working right
    } 
    else if (random == oldrandom1 && oldrandom1 == oldrandom2) { //lots of work involving cookies just to make the "oh baby a triple" splash work
      document.getElementById("splash").innerHTML = data[1240];
    }
    else if (overridden == false && ((random == 800 && !(day == 8 && month == 8))|| (random == 801 && !(day == 31 && month == 3)) || /*(random == 1435 && !(day == 25 && month == 6)) ||*/ (random == 1412 && !(month == 6))|| (random == 1481 && !(day == 30 && month == 2 && year == 1712))|| (random == 1482 && !(day == 30 && month == 2 && year == 1951)))) { //prevent the special date-specific splashes from being randomly picked not on the special days
      splashes();
    }
    else if (tp == 1 && day == 5 && month == 9) { //liar's day?
      document.getElementById("splash").innerHTML = data[796];
    } 
    else if (tp == 1 && day == 8 && month == 8) { //vore day splash which we should show if it's 8/8 - SPECIAL
      document.getElementById("splash").innerHTML = data[800];
    } 
    else if (tp == 1 && day == 31 && month == 3) { //trans day of visibility splash which should be shown on March 31st - SPECIAL
      document.getElementById("splash").innerHTML = data[801]
    }
    else if (tp == 1 && day == 25 && month == 6) { //deport back to Norway
      document.getElementById("splash").innerHTML = data[1435]
    }
    /*else if(random == 1411 || (p6gr == 1 && month == 6)) { //project6gr splash
      document.getElementById("splash").innerHTML = data[1411]
    }*/
    else if (tp == 1 && month == 6) { //pride month! - SPECIAL
      document.getElementById("splash").innerHTML = data[1412]
    }
    else if (tp == 1 && month == 2 && day == 30 && year == 1712) { //february 30th?!
      document.getElementById("splash").innerHTML = data[1481]
    }
    else if (tp == 1 && month == 2 && day == 30 && year == 1951) { //it's the end of the world
      document.getElementById("splash").innerHTML = data[1482]
    }
    else if (tp == 1 && month == 8 && day == 18) {
      document.getElementById("splash").innerHTML = data[1487]
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
    else if (random == 674) { //rotated idiot time. also, yes i know the splash box gets overlaid over everything when it's rotated. i really don't care and actually think it adds to the comedic value
      randomidiot = Math.round(Math.random());
      if(randomidiot == 0) {document.getElementById("splashbg").classList.add("idiot_l");} //which way is the idiot getting rotated?
      else {document.getElementById("splashbg").classList.add("idiot_r");}
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
    else if (random == 937) { //rush b
      document.getElementById("splash").classList.add("bombplanted");
      document.getElementById("splash").innerHTML = data[random];
    }
    else if (random == 1478) { //add an error to console if the splash is the one that says "no errors in console"
      console.error("nope, there's an error now!");
      document.getElementById("splash").innerHTML = data[random];
    } 
    //this splash is not one that gets some special effects, and this line is the default behavior
    else if (random != 313) { document.getElementById("splash").innerHTML = data[random]; } else splashes(); //check if "random" is not 313. if that passes, just display the text as normal. if it fails, "random" is 313 and we have to re-roll
  });
}

function lowerVolume() {
  var patmusic = document.getElementById("patmusic");
  patmusic.volume = 0.3;
}

//just for clarification, i made the original "loadblogposts", but ChatGPT helped me upgrade it to use my new cdn. no more full site updates just to publish a new blog post!
//for those worried about me using AI for code, just know that i don't enjoy having it hand-hold development, either, but it's teaching me stuff, and i'm learning new stuff from it which i may use on my own in the future
//i will never fully rely on AI to make everything for me, because that's boring and unethical
//this is a big thing for me to learn, because of the upcoming ambrosia shared universe! it's gonna be a huge wiki-like thing, which i really can't do correctly through GitHub Pages, so i decided i needed to do a cdn. i then figured that since i already want to do a cdn, i might as well do the blog that way since it'll benefit too
function loadblogposts() {
  const MAP_URL = "https://cdn.roketgamer.dev/blog_personal/posts_map.json";
  const COOKIE_NAME = "blog_posts_ts";
  const THROTTLE_SECONDS = 30 * 60; // 30 minutes
  const LS_TS_KEY = "blog_posts_cache_ts";
  const LS_DATA_KEY = "blog_posts_cache_data";
  let postDateString;

  //this is all my original function. since this is now a lot more complex, it's now a helper function
  function renderPosts(posts) {
    if (!Array.isArray(posts) || posts.length === 0) {
      let postdiv = document.createElement("div");
      postdiv.classList.add("blogpost");
      let weird = document.createElement("p");
      weird.classList.add("maintext");
      weird.innerHTML = "This is weird and shouldn't be happening<br>There's either no blog posts or something has gone wrong";
      postdiv.appendChild(weird);
      document.getElementById("blogposts").appendChild(postdiv);
      return;
    }

    posts.forEach(post => {
      if (!post) return;

      let postTitle = post.title;
      let postDate = post.date;
      let postEdited = post.edited;
      let postEditDate = post.edited_date; 
      let postContent = post.content;
      let postPinned = post.pinned;

      if (postTitle != undefined && postDate != undefined && postEdited != undefined && postContent != undefined) {
        let postdiv = document.createElement("div");
        postdiv.classList.add("shadow");
        if (postPinned) {
          postdiv.classList.add("pinnedblogpost");
        } else {
          postdiv.classList.add("blogpost");
        }

        if (postEdited) {
          postDateString = "Posted on " + postDate + ", edited on " + postEditDate;
        } else {
          postDateString = "Posted on " + postDate;
        }

        if (postPinned) {
          let pinned = document.createElement("p");
          pinned.classList.add("postdate");
          pinned.innerHTML = "Pinned Post";
          postdiv.appendChild(pinned);
        }

        let title = document.createElement("p");
        title.classList.add("postitle");
        title.innerHTML = postTitle;

        let date = document.createElement("p");
        date.classList.add("postdate");
        date.innerHTML = postDateString;

        let splitter = document.createElement("hr");
        splitter.classList.add("mainhr");

        let content = document.createElement("p");
        content.classList.add("postcontent");
        content.innerHTML = postContent;

        postdiv.appendChild(title);
        postdiv.appendChild(date);
        postdiv.appendChild(splitter);
        postdiv.appendChild(content);

        if (postPinned) {
          document.getElementById("pinnedposts").prepend(postdiv);
        } else {
          document.getElementById("blogposts").prepend(postdiv);
        }
      } else {
        console.error("There was a problem with one of the posts, so it is not displayed");
      }
    });
  }

  //let's try to get the posts from the cache if we are being throttled from fetching the posts from the cdn
  function tryRenderFromCache() {
    try {
      const cached = localStorage.getItem(LS_DATA_KEY);
      if (!cached) return false;
      const posts = JSON.parse(cached);
      renderPosts(posts);
      return true;
    } catch (e) {
      return false;
    }
  }

  //this is how we ensure someone who has already fetched the posts doesn't keep sending requests. stuff all the posts in local storage. it's all text, so it's not much taken space
  function saveCache(ts, posts) {
    try {
      localStorage.setItem(LS_TS_KEY, String(ts));
      localStorage.setItem(LS_DATA_KEY, JSON.stringify(posts));
    } catch (e) {
    }
  }

  //finally, let's get the map of all the posts
  fetch(MAP_URL)
    .then(r => r.json())
    .then(async (arr) => {
      if (!Array.isArray(arr) || arr.length < 1) { //if our retrieved array is not an array or the length is less than 1, then let's throw an error in console
        console.error("posts_map.json malformed");
        // last resort: try cache
        if (!tryRenderFromCache()) {
          renderPosts([]); //this forces the message where the blog posts had something wrong
        }
        return;
      }

      const mapTs = parseInt(arr[0], 10) || 0; //unix timestamp
      const lastTs = getCookie(COOKIE_NAME);  //the last timestamp that the data was accessed, if ever

      const withinWindow = (lastTs !== null) && ((mapTs - lastTs) < THROTTLE_SECONDS); //if there is no last timestamp or it's been more than 30 minutes, go ahead and access the map and get all the posts from the cdn again

      if (withinWindow) {
        // Don’t re-fetch from CDN; render from local cache if possible.
        if (tryRenderFromCache()) return;

        // If no cache exists yet, do a one-time fetch anyway so page still works.
        // (We do NOT update the cookie here; cookie stays as-is.)
        console.debug("No local cache; performing one-time fetch despite throttle.");
      } else {
        // Update cookie to current map timestamp (e.g., keep for 7 days)
        setCookie(COOKIE_NAME, mapTs, 1);
      }

      const keys = arr.slice(1);
      if (keys.length === 0) {
        renderPosts([]);
        return;
      }

      // Fetch all post JSONs in parallel (cache at browser/edge will soften load)
      const posts = await Promise.all(
        keys.map(k => fetch(`https://cdn.roketgamer.dev/${k}`, { cache: "force-cache" })
          .then(r => r.ok ? r.json() : null)
          .catch(() => null))
      );

      const validPosts = posts.filter(Boolean);
      // Save for future refreshes during the 30-min window
      saveCache(mapTs, validPosts);

      // Render to DOM
      renderPosts(validPosts);
    })
    .catch(err => {
      console.error("Failed to load posts map:", err);
      // Fallback to cached render if network failed
      if (!tryRenderFromCache()) {
        renderPosts([]);
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

function playYippee() {
  const audio = new Audio('./assets/audio/yippee.mp3');
  audio.play();
}

function splashdebug() {
  var splashtoget = document.getElementById("splashdebuginput").value;
  splashes(splashtoget);
}