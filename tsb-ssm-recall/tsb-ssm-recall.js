
results = []
allarticles = []

function loadData(json){
    let recallsection = false;
    let ssmsection = false;
    let tsbsection = false;
    fetch(json).then((jsondata) => { return jsondata.json(); }).then((data) => {
        if(data.released != true) {
            alert("This vehicle has not been released yet!");
            return;
        }
        else{
            //reset everything when a vehicle that is released is selected*
            document.getElementById("recall").innerHTML = "";
            document.getElementById("recall").style.display = "none";
            document.getElementById("ssm").innerHTML = "";
            document.getElementById("ssm").style.display = "none";
            document.getElementById("tsb").innerHTML = "";
            document.getElementById("tsb").style.display = "none";
            if(data.data.length <= 0) {
                alert("This vehicle has no articles");
            }
            if(data.data.length > 0) {
                data.data.forEach(article => {
                    //normal details
                    let target = article.articletype //string
                    let releasedate = article.releasedate //string
                    let superseded = article.superseded //bool
                    let supersedingarticle = article.supersedingarticle //string
                    let removed = article.removed //bool
                    let articleid = article.articleid //string
                    let articlename = article.articlename //string
                    let affectedrangefrom = article.affectedrangefrom //string
                    let affectedrangeto = article.affectedrangeto //string
                    let articledescription = article.articledescription //string

                    //recall details
                    let recallnodrive = article.recallnodrive //bool
                    let recalladvancenotice = article.recalladvancenotice //bool
                    let recalladvancenoticedate = article.recalladvancenoticedate //string
                    let recallhold = article.recallhold //bool
                    let recallholddate = article.recallholddate //string
                    let recallaffectedcount = article.recallaffectedcount //number

                    //assemble the article
                    let newdiv = document.createElement("div"); 
                    //newdiv.classList.add("blogpost");
                    newdiv.classList.add("article");
                    datalist = target + " " + articleid + " " + articlename

                    splitter = document.createElement("hr");
                    splitter.style.cssText += "border: 3px solid #e5e5e5;";
                    splitter2 = document.createElement("hr");
                    splitter2.style.cssText += "border: 3px solid #e5e5e5;";

                    titletext = articleid + " - " + articlename
                    title = document.createElement("p");
                    title.classList.add("postitle");
                    title.innerHTML = titletext
                    newdiv.appendChild(title);
                    
                    details1text = "Released " + releasedate
                    details1 = document.createElement("p");
                    details1.classList.add("postdate");
                    details1.innerHTML = details1text;
                    newdiv.appendChild(details1);
                    
                    if(target == "recall") {
                        details2text = "Affected Vehicles: " + recallaffectedcount + ", built between " + affectedrangefrom + " - " + affectedrangeto
                        details2 = document.createElement("p");
                        details2.classList.add("postdate");
                        details2.innerHTML = details2text;
                        newdiv.appendChild(details2);
                    } else if (affectedrangefrom&&affectedrangeto != null) {
                        details2text = "Affected Vehicles: built between" + affectedrangefrom + " - " + affectedrangeto 
                        details2 = document.createElement("p");
                        details2.classList.add("postdate");
                        details2.innerHTML = details2text;
                        newdiv.appendChild(details2);
                    }
                    if(recallnodrive) {
                        nodrivetext = "DO NOT DRIVE AFFECTED VEHICLES!"
                        nodrive = document.createElement("p");
                        nodrive.classList.add("postitle");
                        nodrive.classList.add("errortext")
                        nodrive.innerHTML = nodrivetext;
                        newdiv.appendChild(nodrive);
                    }
                    if(recalladvancenotice) {
                        if(recalladvancenoticedate != null||undefined) {
                            advancenoticeeta = "ETA: " + recalladvancenoticedate
                        } else {
                            advancenoticeeta = "No ETA"
                        }
                        advancenoticetext = "Advance Notice Recall. " + advancenoticeeta
                        advancenotice = document.createElement("p");
                        advancenotice.classList.add("postdate");
                        advancenotice.classList.add("blue");
                        advancenotice.innerHTML = advancenoticetext;
                        newdiv.appendChild(advancenotice);
                    }
                    if(recallhold) {
                        if(recallholddate != null||undefined) {
                            holdeta = "resumption ETA: " + recallholddate
                        } else {
                            holdeta = "No ETA of resumption"
                        }
                        holdtext = "Recall on hold. " + holdeta
                        hold = document.createElement("p");
                        hold.classList.add("postdate");
                        hold.classList.add("blue");
                        hold.innerHTML = holdtext;
                        newdiv.appendChild(hold);
                    }
                    if(superseded) {
                        supersededtext = "Superseded by " + supersedingarticle
                        superseded = document.createElement("p");
                        superseded.classList.add("postdate");
                        superseded.innerHTML = supersededtext;
                        newdiv.appendChild(superseded);
                    }
                    descriptiontext = articledescription
                    description = document.createElement("p");
                    description.classList.add("postcontent");
                    description.innerHTML = descriptiontext;
                    if(removed) {
                        descriptioncrossout = document.createElement("s");
                        descriptioncrossout.appendChild(description);
                        newdiv.appendChild(descriptioncrossout);
                        if(superseded) {
                            reason = " due to being superseded"
                        } else {
                            reason = ""
                        }
                        removednoticetext = "Article was removed from Ford's systems" + reason
                        removednotice = document.createElement("p");
                        removednotice.classList.add("postcontent");
                        removednotice.innerHTML = removednoticetext
                        newdiv.appendChild(removednotice)
                    } else {
                        newdiv.appendChild(description)
                    }

                    linebreak = document.createElement("br");
                    if(target == "recall" && recallsection == false) {
                        recallsection = true
                        sectionname = document.createElement("p");
                        sectionname.classList.add("titletext");
                        sectionname.innerHTML = "Recalls"
                        document.getElementById(target).appendChild(linebreak);
                        document.getElementById(target).appendChild(sectionname);
                        document.getElementById(target).appendChild(splitter2);
                    } else if(target == "ssm" && ssmsection == false) {
                        ssmsection = true
                        sectionname = document.createElement("p");
                        sectionname.classList.add("titletext");
                        sectionname.innerHTML = "SSMs"
                        document.getElementById(target).appendChild(linebreak);
                        document.getElementById(target).appendChild(sectionname);
                        document.getElementById(target).appendChild(splitter2);
                    } else if(target == "tsb" && tsbsection == false) {
                        tsbsection = true
                        sectionname = document.createElement("p");
                        sectionname.classList.add("titletext");
                        sectionname.innerHTML = "TSBs"
                        document.getElementById(target).appendChild(linebreak);
                        document.getElementById(target).appendChild(sectionname);
                        document.getElementById(target).appendChild(splitter2);
                    }
                    //div done, add it to the parent div and ensure the parent div is set to be visible
                    document.getElementById(target).appendChild(newdiv);
                    document.getElementById(target).style.display = "block";
                    document.getElementById(target).appendChild(splitter);
                })
            }
        }
    })
}

function searcharticles() {
    allarticles += document.getElementsByClassName(document.getElementById("searchbox"))
}