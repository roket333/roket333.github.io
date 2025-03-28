//show and hide the tables for the appropriate button pressed

var tireselection = 0

window.onload = function() {
    //checkmag();
    //checkae();
    //checkass();
}

function showoldtire() {
    document.getElementById("oldtlayout").style.display = "block";
    document.getElementById("newtlayout").style.display = "none";
}

function shownewtire() {
    document.getElementById("oldtlayout").style.display = "none";
    document.getElementById("newtlayout").style.display = "block";
}

function showolddiff() {
    document.getElementById("olddlayout").style.display = "block";
    document.getElementById("newdlayout").style.display = "none";
}

function shownewdiff() {
    document.getElementById("olddlayout").style.display = "none";
    document.getElementById("newdlayout").style.display = "block";
}

function showimptire() {
    document.getElementById("tiresizeimp").style.display = "grid";
    document.getElementById("tiresizemet").style.display = "none";
    tireselection = 1
}

function showmettire() {
    document.getElementById("tiresizeimp").style.display = "none";
    document.getElementById("tiresizemet").style.display = "grid";
    tireselection = 0
}

function checkmag() {
    magvalue = document.getElementById("hasmag").value;
    if(magvalue == 0) {document.getElementById("magsus").style.display = "none"; document.getElementById("magsusp").style.display = "none"}
    else if(magvalue == 1) {document.getElementById("magsus").style.display = "block"; document.getElementById("magsusp").style.display = "block"}
}

function checkae() {
    aevalue = document.getElementById("hasae").value;
    if(aevalue == 0) {document.getElementById("actexh").style.display = "none"; document.getElementById("actexhp").style.display = "none"}
    else if(aevalue == 1) {document.getElementById("actexh").style.display = "block"; document.getElementById("actexhp").style.display = "block"}
}

function checkass() {
    assvalue = document.getElementById("hasass").value;
    if(assvalue == 0) {document.getElementById("ass").style.display = "none"; document.getElementById("assp").style.display = "none"}
    else if(assvalue == 1) {document.getElementById("ass").style.display = "block"; document.getElementById("assp").style.display = "block"}
}

//calculate the tire value
function tirecalc() {
    //calculate the tire circumference, multiply it by 0.967, then convert it to hex
    if(tireselection == 0) {
        var tirewidth = document.getElementById("tiresize_width").value;
        var tireaspect = document.getElementById("tiresize_aspect").value / 100; //convert the aspect ratio into a tenths
        var wheeldiam = document.getElementById("tiresize_wdiam").value;
        var tireheight = (tirewidth * tireaspect) * 2 + (wheeldiam * 25.4); //multiply the width by the aspect ratio then add that to the wheel diameter converted to mm
        var tirecirc = Math.floor(tireheight * Math.PI); //mutliply the total height by pi to get the circumference
    }
    else if (tireselection == 1) {
        var tireheight = document.getElementById("tiresize_tirediam_imp").value
        var tirecirc = Math.floor((tireheight * 25.4) * Math.PI); //mutliply the total height by pi to get the circumference
        //yeah, we dont even need the width and wheel diameter of the imperial tires. those are there just for user experience. that way it feels like some actual calculations are being done. its the same reason why KBB has you wait 10 seconds for your vehicle value
    }

    //console.log(tirecirc);
    var finalcirc = Math.ceil(tirecirc * 0.968).toString().padStart(4,0); //multiply the circumference by 0.968 because Ford does that for some reason, then round that up, convert it to a string, and pad the start
    //console.log(finalcirc);
    var hexcirc = parseInt(finalcirc).toString(16).padStart(4,0).toUpperCase(); //convert the new circumference to an int, then convert it to base16, pad it, and make it uppercase
    document.getElementById("tiresize_result_old").innerHTML = hexcirc;
    document.getElementById("tiresize_result_n1").innerHTML = hexcirc.slice(0,2) + "XX";
    document.getElementById("tiresize_result_n2").innerHTML = hexcirc.slice(2,4) + "XX";

    document.getElementById("tiresize_result").innerHTML = tirecirc;
    tiretoobig1 = document.getElementById("tiretoobig1");
    tiretoobig2 = document.getElementById("tiretoobig2");
    tiretoobig3 = document.getElementById("tiretoobig3");

    tiretoobig1.style.display = "none";
    tiretoobig2.style.display = "none";
    tiretoobig3.style.display = "none";

    //Bronco Raptor and Raptor 37 package have 37 inch tires, so this is an educated guess
    if (tirecirc > 2960) {
        tiretoobig3.style.display = "block";
    }
    //most people will fall under this category
    else if (tirecirc > 2750) {
        tiretoobig2.style.display = "block";
    }
    //on the lower end
    else if(tirecirc > 2270){
        tiretoobig1.style.display = "block";
    }
    
}

//calculate the differential value
function diffcalc() {
    //take the ratio, remove the decimal, then convert it to hex
    var decdiff = Math.ceil(document.getElementById("diffratio").value * 100); //take the input and mutliply it by 100 then round it up
    var intdiff = decdiff.toString().padStart(4,0); //convert it to a string and add "0" until it's 4 characters long
    var hexdiff = parseInt(intdiff).toString(16).padStart(4,0).toUpperCase(); //convert it to a number, then back to a string but now base16, pad it again, and make it uppercase
    document.getElementById("diffcorrect1").innerHTML = hexdiff; document.getElementById("diffcorrect2").innerHTML = hexdiff;
    //console.log("dec: " + decdiff + ", hex: " + hexdiff + ", int: " + intdiff);
}

//make the custom mode
function makecustommode() {
    document.getElementById("custommoderesults").style.display = "block"
}