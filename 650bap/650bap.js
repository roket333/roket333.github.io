//ChatGPT helped a lot with this code, not so much in terms of writing it, but helping me debug and understand it, shoutout to the OpenAI team
//Note to other developers reading these comments, ALWAYS COMMENT YOUR CODE, it helps prevent confusion later, as i have found out first hand

//update these every 10ms
setInterval(repeat, 10)

//getOptions("./650bap/prices_darkhorse.json", "checkbox_container") //debug and testing purposes

//define some global variables
var boxes = document.querySelectorAll("input[type=\"checkbox\"]");
var radios = document.querySelectorAll("input[type=\"radio\"]");
var selectedthings = [];
var oldselectedthings = [];
var allthings = [];
var ready = false;
var finalcostsset = false;

function repeat() {
    if(ready == true) {
        boxlist();
        updateboxes();
        updatecosts();
        finalCosts();
    }
}

//setting up the listener function here because it's easier to edit
function clickfunc(boxid) {
    if(ready == true) {
        updateboxes();
        updatecosts(boxid);
        boxlist();
        finalCosts();
    }
}

//load all the options from the specified json file to the specified location div
function getOptions(json, locationdiv) {

    //set "ready" to false to stop execution of everything, then clear out the location div to make sure everything will work right
    ready = false;
    document.getElementById(locationdiv).innerHTML = "";
//get the json
    fetch(json).then((jsondata) => { return jsondata.json(); }).then((data) => { 
    //for each group of data, make it in a new div
    data.forEach(group => {
        let hackno = 0;
        let groupdiv = document.createElement("div"); //make the div that contains the group of options
        groupdiv.classList.add("bapgroup");
        groupdiv.setAttribute("id", group.group_id);
        one_choice = group.one_choice //does this group only allow one choice?
        groupdiv.setAttribute("one_choice", one_choice);
        group_name = group.group_name //name of the group of choices
        gname = document.createElement("p");
        gname.innerHTML = group_name
        gname.classList.add("bigtext");
        groupdiv.appendChild(gname)

        group.group_data.forEach(item => {
            let itemdiv = document.createElement("div"); //make the div that contains this specific item
            itemdiv.classList.add("bapitem");
            itemdiv.setAttribute("hackno", hackno); //stupid hack to make later stuff work in the right order, it's supremely stupid and i hate it
            itemdiv.setAttribute("id", item.id);
            let box = document.createElement("input");
            let label = document.createElement("label");
            //set some (actually a lot) of attributes that we may need so we don't have to keep re-reading the json over and over and over and over and over and over and over and over and over and over and over and over and over again
            if(item.default) {itemdiv.setAttribute("default", true)}
            if(item.incomp != undefined) {item.incomp = JSON.stringify(item.incomp);itemdiv.setAttribute("incomp", item.incomp)};
            if(item.requires != undefined) {item.requires = JSON.stringify(item.requires);itemdiv.setAttribute("requires", item.requires)};
            if(item.includes != undefined) {item.includes = JSON.stringify(item.includes);itemdiv.setAttribute("includes", item.includes)};
            if(item.option_code != undefined) {itemdiv.setAttribute("option_code", item.option_code)};
            if(item.inclstrict != undefined) {itemdiv.setAttribute("inclstrict", item.inclstrict)};
            if(item.cost_mod != undefined) {item.cost_mod = JSON.stringify(item.cost_mod);itemdiv.setAttribute("cost_mod", item.cost_mod)};
            if(item.hidden != undefined) {item.hidden = JSON.stringify(item.hidden);itemdiv.setAttribute("hidden", item.hidden)};
            if(item.show != undefined) {item.show = JSON.stringify(item.show);itemdiv.setAttribute("show", item.show)};
            if(item.foreverselected != undefined) {itemdiv.setAttribute("foreverselected", item.foreverselected)};
            if(group.group_id != undefined) {itemdiv.setAttribute("parentdiv", group.group_id)};
            hackno++;

            //if we only allow one choice, make it a "radio" button, and set the name to the group id so it can communicate with other radio buttons
            if(one_choice)
                box.setAttribute("type", "radio");
            else
                box.setAttribute("type", "checkbox");
            box.setAttribute("name", group.group_id);
            box.setAttribute("id", item.id + "box");
            box.setAttribute("defaultbox", item.default);
            itemdiv.setAttribute("addedby", "");
            box.addEventListener("change", function(boxid) {clickfunc(box.getAttribute("id"))}); //the function itself is actually above this whole code block, just so it's easier to add and remove things from
            label.appendChild(box);

            //if this is a default item, set it to be checked
            if(item.default) {
                box.setAttribute("checked", true);
            }

            //check the cost, is this a nocost item or one that references a base cost?
            if(!item.nocost) {
                if(item.cost_base != undefined) {
                    targetid = item.cost_base
                    group.group_data.forEach(searchitem => {
                        if(searchitem.id === targetid) {
                            newr_cost = searchitem.r_cost
                            newi_cost = searchitem.i_cost
                        }
                    })
                    item.i_cost = item.i_cost + newi_cost
                    item.r_cost = item.r_cost + newr_cost
                }
            }
            if(!item.nocost) {itemdiv.setAttribute("i_cost", item.i_cost);itemdiv.setAttribute("r_cost", item.r_cost);itemdiv.setAttribute("true_i_cost", item.i_cost);itemdiv.setAttribute("true_r_cost", item.r_cost);itemdiv.setAttribute("nocost", false)} else {itemdiv.setAttribute("nocost", true)};

            //set the label
            let costdiv = document.createElement("div");
            costdiv.classList.add("itemcosts");
            let iname = document.createTextNode(item.name);
            let costs = document.createTextNode("Invoice: $" + item.i_cost + " MSRP: $" + item.r_cost);
            label.appendChild(iname);
            if(!item.nocost) {
                costdiv.appendChild(costs);
            }
            label.appendChild(costdiv);
            itemdiv.appendChild(label);
            groupdiv.appendChild(itemdiv);
        })

        document.getElementById(locationdiv).append(groupdiv);
    })

    //display the costs and option codes
    let finalcostsdiv = document.getElementById("final_costs");
    finalcostsdiv.innerHTML = "";
    cname = document.createElement("p");
    cname.innerHTML = "Final Costs"
    cname.classList.add("bigtext");
    fclayer1 = document.createElement("p");
    fclayer1.setAttribute("id","fc1");
    fclayer2 = document.createElement("p");
    fclayer2.setAttribute("id","fc2");
    fclayer3 = document.createElement("p");
    fclayer3.setAttribute("id","fc3");
    fclayer4 = document.createElement("p");
    fclayer4.setAttribute("id","fc4");
    finalcostsdiv.append(cname,fclayer1,fclayer2,fclayer3,fclayer4);

    ready = true;
  })
}

  //get a list of all the boxes/radios currently checked
  function boxlist() {
    let boxes = document.querySelectorAll("input[type=\"checkbox\"]");
    let radios = document.querySelectorAll("input[type=\"radio\"]");

    selectedthings = [];
    allthings = [];

    boxes.forEach(input => {
        if(input.checked) {
            selectedthings.push(input.parentElement.parentElement.getAttribute("id"));
        }
        allthings.push(input);
    })

    radios.forEach(input => {
        if(input.checked) {
            selectedthings.push(input.parentElement.parentElement.getAttribute("id"));
        }
        allthings.push(input);
    })

    //if oldselectedthings has no length, just set it to selectedthings so we have something to build off of
    if(oldselectedthings.length === 0) {oldselectedthings = selectedthings;}

    //because for some reason the "changed" listener doesn't fire when a radio box is deselected, we have to do a workaround, and it's kinda hack-y. thankfully, we don't need the box id like originally thought, we can use the differences in the old and current selected items to get them
    let addedthings = selectedthings.filter(item => !oldselectedthings.includes(item));
    let removedthings = oldselectedthings.filter(item => !selectedthings.includes(item));
    if(addedthings.length > 0) {packagecheck(addedthings, true); updateboxes(); oldselectedthings = selectedthings};
    if(removedthings.length > 0) {packagecheck(removedthings, false); updateboxes(); oldselectedthings = selectedthings};
  }

  //when a checkbox is modified, see if it was added by another item, and if so uncheck that one too
  function packagecheck(removedidsarray, bool) {
    removedidsarray.forEach(boxid => {
        //console.log(boxid + " " + bool); //basically lists when something is added and removed, very helpful for debugging
        let realboxid = boxid + "box"
        selectpackages(realboxid);
        if(!bool) {removeitems(boxid)}
        let boxaddedby = document.getElementById(boxid).getAttribute("addedby");
        if (boxaddedby.length > 0 && removedidsarray.includes(boxaddedby) && !bool) {
            let strictinclude = document.getElementById(boxaddedby).getAttribute("inclstrict");
            if(strictinclude == "true") {
                let targetbox = document.getElementById(boxaddedby + "box");
                targetbox.checked = false;
                document.getElementById(boxid).setAttribute("addedby", "");
            }
        }
    })
}

//if an item is removed and the package that added it strictly includes it, remove that package
function removeitems(boxid) {
    selectedthings.forEach(thing => {
        if(document.getElementById(thing).getAttribute("inclstrict") == "true") {
            let checkerString = document.getElementById(thing).getAttribute("includes");
            let checkerArray = checkerString ? JSON.parse(checkerString) : [];
            let shouldDeselect = checkerArray.some(item => {
                return !item.some(entry => selectedthings.includes(entry));
            });
            if (shouldDeselect && selectedthings.includes(thing)) {
                let checkbox = document.getElementById(thing + "box");
                checkbox.checked = false;
                if(checkbox.getAttribute("addedby")){
                let addedBy = checkbox.getAttribute("addedby");
                if (addedBy.length > 0) {
                    removeitems(addedBy);
                }}
            }
        }
    })
}


  //updating whether or not a box/button can be used
  function updateboxes() {
    allthings.forEach(box => {

        //various validity checks
        let incompPass = true;
        let requiresPass = true;
        let incompString = box.parentElement.parentElement.getAttribute("incomp");
        let requiresString = box.parentElement.parentElement.getAttribute("requires");
        let incompArray = incompString ? JSON.parse(incompString) : []; // convert the incompString to an array of ids
        let requiresArray = requiresString ? JSON.parse(requiresString) : []; //convert the requiresString to an array of ids too

        //if it's a one choice group and there isn't a button selected already, select the first one you can
        let allgroupscoll = (document.getElementsByClassName("bapgroup"));
        let allgroups = [...allgroupscoll];
        let bapboxes = [];
        let bapboxid = [];
        allgroups.forEach(group => {
            if(group.getAttribute("one_choice") == "true"){
                bapboxes.push(group.querySelector(".bapitem").firstChild.firstChild.checked);
                bapboxid.push(group.querySelector(".bapitem").firstChild.firstChild.getAttribute("id"));
                if(bapboxes.includes("false")) {
                    for (let i = 0; i < bapboxes.length; i++) {
                        let bapbox = bapboxes[i];
                        if(!bapbox.checked && !bapbox.disabled) {
                            bapbox.checked = true;
                            break; //exit the loop once we find the first non-disabled radio button
                        }
                    }
                }
            }
        });

        //if a box that was checked is disabled, revert to the default value if it's a radio. if there's no options to choose, it'll just deselect all of them and have no option chosen
        let one_choice = box.parentElement.parentElement.parentElement.getAttribute("one_choice")
        if (box.disabled && box.checked) {
            box.checked = false;
            let parentdivvalue = box.parentElement.parentElement.getAttribute("parentdiv");
            let parentdiv = document.getElementById(parentdivvalue);
            let alldivs = [...parentdiv.getElementsByClassName("bapitem")];
            let hacknocheck = 0; //i've been trying to debug this for a day and i'm pretty sure now this isn't needed
            let defaultRadio = null;
            for (let i = 0; i < alldivs.length; i++) {
                let div = alldivs[i];
                if (div.firstChild.firstChild.disabled == false && div.getAttribute("hackno") == hacknocheck && one_choice == "true") {
                    defaultRadio = div.firstChild.firstChild;
                    break; //exit the loop once we find the first non-disabled radio button
                }
                hacknocheck++;
            }
            if (defaultRadio) {
                defaultRadio.checked = true;
            }
        }
    
        // check if the checkbox should be disabled based on the selected checkboxes
        if (incompArray.some(id => selectedthings.includes(id))) {
          incompPass = false;
        } else {
          incompPass = true;
        }

        //check if the selected checkboxes meet the required things to allow some items to be selected
        requiresPass = requiresArray.every(requiredArray => {
            return requiredArray.some(requiredItem => {
                //see if i missed something in the data and it's requiring an item that doesn't exist
                if(document.getElementById(requiredItem) == null){
                    console.log(requiredItem)
                }
                return document.getElementById(requiredItem + "box").checked;
            });
        });


        //final check, is this box disabled? the council will now decide your fate
        if(incompPass && requiresPass) {
            box.disabled = false;
        } else {
            box.disabled = true;
        }

        //change the look of the item's border depending on if it's selected or not selectable
        let usability = box.disabled;
        let used = box.checked;
        if(usability) {box.parentElement.parentElement.classList.add("notalloweditem")} else {window.requestAnimationFrame(() => {box.parentElement.parentElement.classList.remove("notalloweditem")})};
        if(used) {box.parentElement.parentElement.classList.add("selecteditem")} else {window.requestAnimationFrame(() => {box.parentElement.parentElement.classList.remove("selecteditem")})};

        //have this box be checked at all times if it's able to be
        let persist = box.parentElement.parentElement.getAttribute("foreverselected");
        if(persist && persist == "true" && !box.checked && !box.disabled){
            box.checked = true;
        }

        //this box is shy, if one of the items in the array is selected, we should hide it
        let showString = box.parentElement.parentElement.getAttribute("show");
        let showArray = showString ? JSON.parse(showString) : [];
        let hideString = box.parentElement.parentElement.getAttribute("hidden");
        let hideArray = hideString ? JSON.parse(hideString) : [];
        if ((hideArray.some(item => selectedthings.includes(item))) || (showString && !showArray.some(item => selectedthings.includes(item)))) {
            box.parentElement.parentElement.classList.add("hidden");
        } else {
            box.parentElement.parentElement.classList.remove("hidden");
        }

    });
}

  function selectpackages(boxid) {
    //if the user selects something that includes another thing, let's select that too, all the other things should catch if a package includes an incompatible item
    let originalBox = document.getElementById(boxid).parentElement.parentElement.getAttribute("id");
    let toSelectString = document.getElementById(boxid).parentElement.parentElement.getAttribute("includes");
    let toSelectArray = toSelectString ? JSON.parse(toSelectString) : [];
    if(toSelectArray.length > 0) {
        toSelectArray.forEach(require => {
            require.some(options => {
                let optbox = document.getElementById(options + "box");
                optbox.checked = true;
                document.getElementById(options).setAttribute("addedby", originalBox);
            })
        })
    }
  }

  //we're gonna update the cost of some things, mainly in the event of a cost mod due to another item being selected
  function updatecosts() {
    allthings.forEach(box => {
        let boxid = box.getAttribute("id");
        let boxiddiv = document.getElementById(boxid).parentElement.parentElement;
        let costString = boxiddiv.getAttribute("cost_mod");
        let costArray = costString ? JSON.parse(costString) : [];
        let boxidparent = boxiddiv.getAttribute("id");
        //if the cost mod array has a greater length than 0, there's something there to account for
        if(costArray.length > 0) {
            costArray.forEach(costtest => {
                modid = costtest.modid; newi_cost = costtest.i_cost; newr_cost = costtest.r_cost;
                oldi_cost = boxiddiv.getAttribute("i_cost"); oldr_cost = boxiddiv.getAttribute("r_cost");
                //if at least one of the cost mod things are true, change the costs
                let hascostmod = costArray.some(costitem => {
                    return selectedthings.some(selectedItem => {
                        return selectedItem === costitem.modid;
                    });
                });
                if(hascostmod) {
                    if(oldi_cost != newi_cost && oldr_cost != newr_cost) {
                        oldi_cost = newi_cost; oldr_cost = newr_cost;
                        if(oldi_cost == 0 && oldr_cost == 0) {
                            //the cost is 0, so we should just hide the cost lines all together
                            document.getElementById(boxidparent).querySelector(".itemcosts").innerHTML = "";
                            boxiddiv.setAttribute("true_i_cost", 0);boxiddiv.setAttribute("true_r_cost", 0);
                        } else {
                            document.getElementById(boxidparent).querySelector(".itemcosts").innerHTML = "Invoice: $" + oldi_cost + " MSRP: $" + oldr_cost;
                            boxiddiv.setAttribute("true_i_cost", oldi_cost);boxiddiv.setAttribute("true_r_cost", oldr_cost);
                        }
                    } 
                } else {
                    if(boxiddiv.getAttribute("i_cost") == 0 && boxiddiv.getAttribute("r_cost") == 0) {
                        document.getElementById(boxidparent).querySelector(".itemcosts").innerHTML = "";
                        boxiddiv.setAttribute("true_i_cost", 0);boxiddiv.setAttribute("true_r_cost", 0);
                    } else {
                        document.getElementById(boxidparent).querySelector(".itemcosts").innerHTML = "Invoice: $" + boxiddiv.getAttribute("i_cost") + " MSRP: $" + boxiddiv.getAttribute("r_cost");
                        boxiddiv.setAttribute("true_i_cost", boxiddiv.getAttribute("i_cost"));boxiddiv.setAttribute("true_r_cost", boxiddiv.getAttribute("r_cost"));
                    }
                }                    
            })
        }
    })
  }

  //let's see how much your wallet is gonna hurt
  function finalCosts() {
    if(ready){
    let finalicost = 0;
    let finalrcost = 0;
    let dad = 1595;
    let ordercodes = [];
    selectedthings.forEach(item => {
        let itemactual = document.getElementById(item)
            if(!isNaN(parseInt(itemactual.getAttribute("true_i_cost"))))
                finalicost += parseInt(itemactual.getAttribute("true_i_cost"));
            if(!isNaN(parseInt(itemactual.getAttribute("true_r_cost"))))
                finalrcost += parseInt(itemactual.getAttribute("true_r_cost"));
        ordercodes.unshift(itemactual.getAttribute("option_code"));
    })

    //convert the array of order codes to a string, with the separator being forward slash, then update all the "fc" items with the proper information
    ordercodes = ordercodes.filter(code => code.length > 0).join("/");
    document.getElementById("fc1").innerHTML = "Invoice: $" + finalicost + ", MSRP: $" + finalrcost
    document.getElementById("fc2").innerHTML = "Destination and Delivery cost: $" + dad
    document.getElementById("fc3").innerHTML = "Dealer Profit: $" + (finalrcost-finalicost) + ", Final Cost: $" + (finalrcost + dad)
    //fun fact, you can probably give this list of option codes to your salesperson and that will be your order
    //update, i've asked a few of my dealer's salespeople, and 3 out of 4 says you can
    document.getElementById("fc4").innerHTML = "Option Codes: " + ordercodes
    }}
  
  updateboxes();