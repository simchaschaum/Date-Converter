// DOM Selectors
const grMonthInput = document.getElementById("grMonthInput");
const grDayInput = document.getElementById("grDayInput");
const grYearInput = document.getElementById("grYearInput")
const sunset = document.getElementById("sunset");
const gthForm = document.getElementById("gthForm");

const heMonthInput = document.getElementById("heMonthInput");
const heDayInput = document.getElementById("heDayInput");
const heYearInput = document.getElementById("heYearInput")
const htgForm = document.getElementById("htgForm");

const today = document.getElementById("todaySubmit");
const afterSunset = document.getElementById("afterSunset");

const displayModal = document.querySelector(".modal");
const display = document.getElementById("display");
const displayTitle = document.getElementById("displayModalLabel");
const displaySpecial = document.getElementById("displaySpecial")
const newConversion = document.getElementById("newConversion");
const closeModal = document.getElementById("closeModal");
const modal = document.getElementsByClassName("modal")[0];
const spinner = document.getElementById("spinner");

// Declaring Variables:
let beforeSunset = "";
let year, month, day;  // the Gregorian info
let dataObj = {};
let heYear, heMonth, heDay, heHebrew, heSpecial; // the Hebrew info
let grYear, grMonth, grDay

// Event Listeners:
// For converting a Gregorian date
gthForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(grYearInput.value != "" && grDayInput.value != ""){
        sendApi(1);
    } else {
        errorMessage("Oops! You are missing some details.")
    }
})
// For converting a Hebrew date
htgForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(heYearInput.value != "" && heDayInput.value != ""){
        sendApi(2);
    } else {
        errorMessage("Oops! You are missing some details.")
    }})
// For showing today's dates
today.addEventListener("click",(e)=>{
    e.preventDefault();
    sendApi(3);
})
// for closing modal and clearing display
closeModal.addEventListener("click",()=>{
    clearDisplay()
})
modal.addEventListener("click",()=>{
    clearDisplay()
})


// Functions:
function sendApi(num){
    // first, turn on the spinner:
    spinnerShowHide(true);
    const url1 = "https://www.hebcal.com/converter?cfg=json&"
    if(num===1){
        year = `gy=${grYearInput.value}`;
        month = `&gm=${grMonthInput.value}`;
        day = `&gd=${grDayInput.value}`;
        beforeSunset = sunset.checked ? "&gs=on" : "&gs-off";
    } else if (num===2){
        year = `hy=${heYearInput.value}`;
        month = `&hm=${heMonthInput.value}`;
        day = `&hd=${heDayInput.value}`
    } else {
        let today = new Date;
        year = `gy=${today.getFullYear()}`;
        month = `gy=${today.getMonth()+1}`;
        day = `&gd=${today.getDate()}`;
        beforeSunset = afterSunset.checked ? "&gs=on" : "&gs-off";
    }
    const url2 = num===1 || num===3? "&g2h=1" :  "&h2g=1" // gregorian to hebrew or hebrew to gregorian (or today)
    fetch(url1+year+month+day+url2+beforeSunset)
        .then(response => response.json())
        .then(data => {
            dataObj = data;
        })
        .then(()=> {
            if(dataObj.hasOwnProperty("error")){
                spinnerShowHide(false);
                errorMessage(`Sorry! ${dataObj.error}`)
            } else {
                conversionInfo(num)
            }
        })
        .catch(error => {
            console.log(error);
            errorMessage("Sorry! We could not make the date conversion now.")
        })
}

// Getting the info from the object for display:
function conversionInfo(num){
    heYear = dataObj.hy;
    heMonth = dataObj.hm;
    heDay = dataObj.hd;
    heHebrew = dataObj.hebrew;
    grYear = dataObj.gy;
    heSpecial = dataObj.events;
    // converting the number into the month name
    let grMonthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    grMonth = grMonthArr[dataObj.gm-1];
    grDay = dataObj.gd;
    setDisplay(num)
}

function setDisplay(num){
    // first, turn off the spinner:
    spinnerShowHide(false);
    let grSuffix, heSuffix;
    // Setting the number suffix to fit the number
    if(grDay===1 || grDay===21 || grDay===31){
        grSuffix = "st"
    } else if (grDay===2 || grDay===22){
        grSuffix = "nd"
    } else if (grDay===3 || grDay===23){
        grSuffix = "rd"
    } else {
        grSuffix = "th"
    }
    if(heDay===1 || heDay===21 || heDay===31){
        heSuffix = "st"
    } else if (heDay===2 || heDay===22){
        heSuffix = "nd"
    } else if (heDay===3 || heDay===23){
        heSuffix = "rd"
    } else {
        heSuffix = "th"
    }
    // The order of display depends on the direction of the conversion.
    if (num===1){
        displayTitle.innerText = `Converting to Hebrew Date`;
        display.innerText = `${grMonth} ${grDay}${grSuffix}, ${grYear} = ${heMonth} ${heDay}${heSuffix}, ${heYear}
        ${heHebrew}`;
    } else if(num===2){
        displayTitle.innerText = `Converting to Gregorian Date`;
        display.innerText = `${heMonth} ${heDay}${heSuffix}, ${heYear} = ${grMonth} ${grDay}${grSuffix}, ${grYear}
        ${heHebrew}`;
    } else {
        displayTitle.innerText = `Today's Dates`;
        display.innerText = `${heMonth} ${heDay}${heSuffix}, ${heYear} = ${grMonth} ${grDay}${grSuffix}, ${grYear}
        ${heHebrew}`;
    }
    heSpecial.forEach(item => {
        let p = document.createElement("p");
        let txt = document.createTextNode(item);
        p.appendChild(txt);
        displaySpecial.appendChild(p);
    })
}

function errorMessage(msg){
    displayTitle.innerText = "Error Message"
    display.innerText = `${msg}`;
}

function spinnerShowHide(bool){
    if(bool){
        spinner.classList.remove("spinnerHide");
    } else {
        spinner.classList.add("spinnerHide");
    }
}

function clearDisplay(){
    while (displaySpecial.firstChild) {
        displaySpecial.removeChild(displaySpecial.firstChild);
    }
    displayTitle.innerText = "";
    display.innerText = "";
}
