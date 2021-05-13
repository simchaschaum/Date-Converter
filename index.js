// The API:
const url1 = "https://www.hebcal.com/converter?cfg=json&gy="  // followed by YEAR (4 digits)
const url2 = "&gm="  // followed by number for MONTH (1 or 2 digit number)
const url3 = "&gd="  // followed by number for DAY (1 or two digit number)
const url4 = "&g2h=1&"  // means converting Gregorian to Hebrew

// DOM Selectors
const totalDate = document.getElementById("totalDate");
const sunset = document.getElementById("sunset");
const form = document.getElementById("form");
const display = document.getElementById("display");
const grDisplay = document.getElementById("grDisplay");
const heDisplay = document.getElementById("heDisplay");

// Declaring Variables:
let beforeSunset = 'gs=off'; 
let year, month, day;  // the Gregorian info
let dataObj = {};
let heYear, heMonth, heDay, heHebrew; // the Hebrew info

// Event Listeners:
totalDate.addEventListener("change",(e)=>{
    makeDate();
})
sunset.addEventListener("change",(e)=>{
    beforeSunset = sunset.checked ? "gs=on" : "gs-off";
})
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(totalDate.value != ""){
        sendApi();
    } 
})

// Functions:
function makeDate(){
    let dateArr = totalDate.value.split("-");
    year = dateArr[0].match(/^\d{4}/)[0];
    month = dateArr[1];
    day = dateArr[2];
}

function sendApi(){
    console.log(url1+year+url2+month+url3+day+url4+beforeSunset);
    fetch(url1+year+url2+month+url3+day+url4+beforeSunset)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            dataObj = data;
        })
        .then(()=>hebrewInfo())
        .catch(error => {
            console.log(error);
            // Put error message here
        })
}

function hebrewInfo(){
    console.log(dataObj);
    heYear = dataObj.hy;
    heMonth = dataObj.hm;
    heDay = dataObj.hd;
    heHebrew = dataObj.hebrew;

    setDisplay()
}

function setDisplay(){
    grDisplay.innerText = `Gregorian date: month: ${month}, day: ${day}, year: ${year}`;
    heDisplay.innerText = `Hebrew date: month: ${heMonth}, day: ${heDay}, year: ${heYear}`;
}


/* 
notes:
- get date from date input, break it up into array using .split() (don't need regex)
- get "beforesunsest" from input
- make sure only submit if a date is first input
- make sure year has only 4 digits - tried tofixed but it's a string, not a digit.  Used regex. 
- problem with after sunset? (missing the & in the url)
- interface: one date input or month/day/year? Go with split - makes it uniform for both ways. 

*/