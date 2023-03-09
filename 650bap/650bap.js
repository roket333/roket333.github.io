//ChatGPT helped a lot with this code, not so much in terms of writing it, but helping me debug and understand it, shoutout to the OpenAI team

setInterval(boxlist, 10);
setInterval(updateboxes, 10);
setInterval(updatecosts, 10);
setInterval(finalCosts, 10);
getOptions("./650bap/prices_ecoboost.json", "checkbox_container") //debug and testing purposes

var boxes = document.querySelectorAll("input[type=\"checkbox\"]");
var radios = document.querySelectorAll("input[type=\"radio\"]");
var selectedthings = [];
var oldselectedthings = [];
var allthings = [];
var ready = false;

function clickfunc(boxid) {
    updateboxes();
    selectpackages(boxid);
    updatecosts(boxid);
    finalCosts();
}

//load all the options from the specified json file to the specified location div
function getOptions(json, locationdiv) {
//get the json
fetch(json)
  .then((jsondata) => { return jsondata.json(); })
  .then((data) => { 
    //for each group of data, make it in a new div
    data.forEach(group => {
        let hackno = 0;
        let groupdiv = document.createElement("div"); //make the div that contains the group of options
        groupdiv.classList.add("bapgroup");
        groupdiv.setAttribute("id", group.group_id);
        group_name = group.group_name //name of the group of choices
        gname = document.createElement("p");
        gname.innerHTML = group_name
        gname.classList.add("bigtext");
        groupdiv.appendChild(gname)
        one_choice = group.one_choice //does this group only allow one choice?

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
            if(group.group_id != undefined) {itemdiv.setAttribute("parentdiv", group.group_id)};
            hackno = hackno + 1;

            //if we only allow one choice, make it a "radio" button, and set the name to the group id so it can communicate with other radio buttons
            if(one_choice)
                box.setAttribute("type", "radio");
            else
                box.setAttribute("type", "checkbox");
            box.setAttribute("name", group.group_id);
            box.setAttribute("id", item.id + "box");
            box.setAttribute("defaultbox", item.default);
            itemdiv.setAttribute("addedby", "");
            box.addEventListener("change", function(boxid) {clickfunc(box.getAttribute("id"))});
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

    if(oldselectedthings.length === 0) {oldselectedthings = selectedthings;}

    //because for some reason the "changed" listener doesn't fire when a radio box is deselected, we have to do a workaround, and it's kinda hack-y. thankfully, we don't need the box id like originally thought, we can use the differences in the old and current selected items to get them
    //the "added" stuff is unused, maybe i'll use it later but for now i'm just using the "removed" for the above reason
    let addedthings = selectedthings.filter(item => !oldselectedthings.includes(item));
    let removedthings = oldselectedthings.filter(item => !selectedthings.includes(item));
    if(addedthings.length > 0) {packagecheck(addedthings);oldselectedthings = selectedthings};
    if(removedthings.length > 0) {packagecheck(removedthings); oldselectedthings = selectedthings};
  }

  //when a checkbox is modified, see if it was added by another item, and if so uncheck that one too
  function packagecheck(removedidsarray) {
    removedidsarray.every(boxid => {
        let boxaddedby = document.getElementById(boxid).getAttribute("addedby");
        if(boxaddedby.length > 0) {
            //console.log(boxid + " was added by " + boxaddedby)
            let strictinclude = document.getElementById(boxaddedby).getAttribute("inclstrict");
            if(strictinclude === "true") {
                let targetbox = document.getElementById(boxaddedby + "box");
                targetbox.click(); targetbox.checked = false;
                document.getElementById(boxid).setAttribute("addedby", "");
            }
        }
    })
    allthings.every(box => {
        let addedbycheck = box.parentElement.parentElement.getAttribute("addedby");
        if(addedbycheck.length > 0 && !box.checked) {
            box.parentElement.parentElement.setAttribute("addedby", "");
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
    
        // check if the checkbox should be disabled based on the selected checkboxes
        if (incompArray.some(id => selectedthings.includes(id))) {
          incompPass = false;
        } else {
          incompPass = true;
        }

        //check if the selected checkboxes meet the required things to allow some items to be selected
        requiresPass = requiresArray.every(requiredArray => {
            return requiredArray.some(requiredItem => {
                return document.getElementById(requiredItem + "box").checked;
            });
        });


        //final check, is this box disabled? the council will now decide your fate
        if(incompPass && requiresPass) {
            box.disabled = false;
        } else {
            box.disabled = true;
        }


        //if a box that was checked is disabled, revert to the default value if it's a radio. if there's no options to choose, it'll just deselect all of them and have no option chosen
        if (box.disabled && box.checked) {
            box.checked = false;
            let parentdivvalue = box.parentElement.parentElement.getAttribute("parentdiv");
            let parentdiv = document.getElementById(parentdivvalue);
            let alldivs = [...parentdiv.getElementsByClassName("bapitem")];
            let hacknocheck = 0;
            console.log(alldivs);
            alldivs.some(div => {
                if (!div.firstChild.firstChild.disabled == true && div.getAttribute("hackno") == hacknocheck) {
                    div.firstChild.firstChild.checked = true;
                    div.firstChild.firstChild.click();
                    return;
                }
                hacknocheck++;
            })
          }                               
      });
  }

  function selectpackages(boxid) {
    //if the user selects something that includes another thing, let's select that too, all the other things should catch if a package includes an incompatible item
    let toSelectString = document.getElementById(boxid).parentElement.parentElement.getAttribute("includes");
    let toSelectArray = toSelectString ? JSON.parse(toSelectString) : [];
    if(toSelectArray.length > 0) {
        toSelectArray.forEach(require => {
            require.some(options => {
                let optbox = document.getElementById(options + "box");
                let getaddedby = document.getElementById(options).getAttribute("addedby");
                if(getaddedby.length > 0) {
                    let isstrictlyadded = document.getElementById(options).getAttribute("inclstrict");
                    if(!optbox.disabled && isstrictlyadded != "true") {
                        optbox.click(); optbox.checked = true;
                        let boxiddivid = document.getElementById(boxid).parentElement.parentElement.getAttribute("id");
                        optbox.parentElement.parentElement.setAttribute("addedby", boxiddivid);
                    }
                }
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
                            document.getElementById(boxidparent).querySelector(".itemcosts").innerHTML = "";
                            boxiddiv.setAttribute("true_i_cost", 0);boxiddiv.setAttribute("true_r_cost", 0);
                        } else {
                            document.getElementById(boxidparent).querySelector(".itemcosts").innerHTML = "Invoice: $" + oldi_cost + " MSRP: $" + oldr_cost;
                            boxiddiv.setAttribute("true_i_cost", oldi_cost);boxiddiv.setAttribute("true_r_cost", oldr_cost);
                        }
                    } 
                } else {
                    document.getElementById(boxidparent).querySelector(".itemcosts").innerHTML = "Invoice: $" + boxiddiv.getAttribute("i_cost") + " MSRP: $" + boxiddiv.getAttribute("r_cost");
                    boxiddiv.setAttribute("true_i_cost", boxiddiv.getAttribute("i_cost"));boxiddiv.setAttribute("true_r_cost", boxiddiv.getAttribute("r_cost"));
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
    document.getElementById("fc3").innerHTML = "Final Cost: $" + (finalrcost + dad)
    //fun fact, you can probably give this list of option codes to your salesperson and that will be your order
    document.getElementById("fc4").innerHTML = "Option Codes: " + ordercodes
    }}
  
  updateboxes();