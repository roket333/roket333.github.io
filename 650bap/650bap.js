//ChatGPT helped a lot with this code, not so much in terms of writing it, but helping me debug and understand it, shoutout to the OpenAI team

setInterval(boxlist, 10);
setInterval(updateboxes, 10);
setInterval(updatecosts, 10);
getOptions("./650bap/prices_ecoboost.json", "checkbox_container") //debug and testing purposes

var boxes = document.querySelectorAll("input[type=\"checkbox\"]");
var radios = document.querySelectorAll("input[type=\"radio\"]");
var selectedthings = [];
var allthings = [];

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

function clickfunc(boxid) {
    updateboxes();
    selectpackages(boxid);
    updatecosts(boxid);
}

//load all the options from the specified json file to the specified location div
function getOptions(json, locationdiv) {
//get the json
fetch(json)
  .then((jsondata) => { return jsondata.json(); })
  .then((data) => { 
    //for each group of data, make it in a new div
    data.forEach(group => {
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
            itemdiv.setAttribute("id", item.id);
            let box = document.createElement("input");
            let label = document.createElement("label");
            if(item.default) {itemdiv.setAttribute("default", true)}
            if(item.incomp != undefined) {item.incomp = JSON.stringify(item.incomp);itemdiv.setAttribute("incomp", item.incomp)};
            if(item.requires != undefined) {item.requires = JSON.stringify(item.requires);itemdiv.setAttribute("requires", item.requires)};
            if(item.includes != undefined) {item.includes = JSON.stringify(item.includes);itemdiv.setAttribute("includes", item.includes)};
            if(item.inclstrict != undefined) {itemdiv.setAttribute("inclstrict", item.inclstrict)};
            if(!item.nocost) {itemdiv.setAttribute("i_cost", item.i_cost);itemdiv.setAttribute("r_cost", item.r_cost)};

            //if we only allow one choice, make it a "radio" button, and set the name to the group id so it can communicate with other radio buttons
            if(one_choice)
                box.setAttribute("type", "radio");
            else
                box.setAttribute("type", "checkbox");
            box.setAttribute("name", group.group_id);
            box.setAttribute("id", item.id + "box");
            box.setAttribute("defaultbox", item.default);
            itemdiv.setAttribute("addedby", "");
            box.addEventListener("click", function(boxid) {clickfunc(box.getAttribute("id"))})
            label.appendChild(box);

            //if this is a default item, set it to be checked
            if(item.default)
                box.setAttribute("checked", true)

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

            //set the label
            let iname = document.createTextNode(item.name);
            let brk = document.createElement("br");
            let costs = document.createTextNode("Invoice: $" + item.i_cost + " MSRP: $" + item.r_cost);
            label.appendChild(iname);
            if(!item.nocost) {
                label.appendChild(brk);
                label.appendChild(costs);
            }
            itemdiv.appendChild(label);
            groupdiv.appendChild(itemdiv);
        })

        document.getElementById(locationdiv).append(groupdiv);
    })
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
  }

  //updating whether or not a box/button can be used
  function updateboxes() {
    allthings.forEach(box => {

        //see if this item that was set by a package still has the origin package selected
        /*let boxroot = box.parentElement.parentElement.getAttribute("addedby");
        if(!selectedthings.includes(boxroot)) {
            box.click(); box.checked = false;
        }*/

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
        const isDisabled = requiresArray.every(requiredArray => {
            return requiredArray.some(requiredItem => {
              return document.getElementById(requiredItem + "box").checked;
            });
          });
          requiresPass = isDisabled;


        //final check, is this box disabled? the council will now decide your fate
        if(incompPass && requiresPass) {
            box.disabled = false;
        } else {
            box.disabled = true;
        }

        //if a box that was checked is disabled, revert to the default value if it's a radio, and if we can't, get a random one instead. if there's no options to choose, it'll just deselect all of them and have no option chosen
        if(box.disabled && box.checked) {
            box.click(); box.checked = false;
            //only look for a new box to check if it's a "Radio" box
            if(box.getAttribute("type") == "radio") {
                let groupid = box.parentElement.parentElement.parentElement.getAttribute("id");
                let childrenofdiv = Array.from(document.getElementById(groupid).children);
                childrenofdiv.reverse().some(item => {
                    let boxofdiv = item.firstChild.firstChild;
                    if(boxofdiv != null){
                        if(!boxofdiv.disabled) {
                            boxofdiv.click(); boxofdiv.checked = true;
                        }
                    }
                })
                childrenofdiv.some(item => {
                    let boxofdiv = item.firstChild.firstChild;
                    if(boxofdiv != null){
                        if(!boxofdiv.disabled) {
                            boxofdiv.click(); boxofdiv.checked = true;
                        }
                    }
                })
            }
        }
      });
  }

  function addedbytest() {
    allthings.forEach(box => {

        //see if this item that was set by a package still has the origin package selected
        let boxroot = box.parentElement.parentElement.getAttribute("addedby");
        if(!selectedthings.includes(boxroot)) {
            box.click(); box.checked = false;
            box.parentElement.parentElement.setAttribute("addedby", "");
        }
    })
  }

  function selectpackages(boxid) {
    //if the user selects something that includes another thing, let's select that too, all the other things should catch if a package includes an incompatible item
    let toSelectString = document.getElementById(boxid).parentElement.parentElement.getAttribute("includes");
    let toSelectArray = toSelectString ? JSON.parse(toSelectString) : [];
    if(toSelectArray.length > 0) {
        toSelectArray.forEach(require => {
            require.some(options => {
                let optbox = document.getElementById(options + "box");
                optbox.click(); optbox.checked = true;
                let boxiddivid = document.getElementById(boxid).parentElement.parentElement.getAttribute("id");
                optbox.parentElement.parentElement.setAttribute("addedby", boxiddivid);
            })
        })
    }
  }

  function updatecosts(boxid) {
    
  }
  
  updateboxes();