"use strict";

document.addEventListener("DOMContentLoaded", buildWheels);



async function buildWheels() {
    let pagesUrl = "gameitems.json";
    let jsonData = await fetch(pagesUrl);
    let symbols = await jsonData.json();

    const wheel1 = [symbols[0], symbols[1]];
    const wheel2 = [symbols[0], symbols[1], symbols[1]];
    const wheel3 = [symbols[0], symbols[1]];
    const wheels = [wheel1, wheel2, wheel3];

    document.querySelector(".hold_wheel_1").addEventListener("click", function _function() {
        console.log(wheels[1]);
    });

    activateStartButton(wheels);
}

function activateStartButton(wheels) {
    document.querySelector(".start_button").addEventListener("click", function _function() {
        activateSpinButton(wheels, 3);
        document.querySelector(".start_button").removeEventListener("click", _function);
    })
}

function activateSpinButton(wheels, spins) {
    document.querySelector(".spin_button").addEventListener("click", function _function() {
        spin(wheels, spins);
        document.querySelector(".spin_button").removeEventListener("click", _function);
    });
}

function spin(wheels, spins) {
    console.log(spins);
    let spinResult = calculateSpinResult(wheels);
    let didWin = compareSpinResult(spinResult);

    if (didWin) {
        payPrice(spinResult);
        activateStartButton(wheels);
    }

    if (!didWin) {
        console.log("You didn't win!");
        spins--;

        if (spins <= 0) {
            console.log("YOU LOST!");
            activateStartButton(wheels);
        }

        else activateSpinButton(wheels, spins);
    }
}

function calculateSpinResult(wheels) {
    let spinResult = [];

    wheels.forEach(wheel => {
        let wheelSymbol = wheel[randomSymbol(wheel)];
        spinResult.push(wheelSymbol);
    });
    return spinResult;
}

function compareSpinResult(spinResult) {
    return spinResult[0] === spinResult[1] && spinResult[1] === spinResult[2];
}

function payPrice(spinResult) {
    console.log(spinResult[0].price);
}


// ----- HELPING FUNCTIONS -----

function randomSymbol(wheel) {
    return Math.round(Math.random() * Math.floor(wheel.length - 1));
}

// ----- VISUAL WHEELS PROTOTYPE -----

// document.addEventListener("DOMContentLoaded", start);

const spinHandle = document.querySelector(".spin_handle");

let lastItemID = 6;
let spinRounds;

function start() {
    spinHandle.addEventListener("click", spinButtonClick);
}

function spinButtonClick() {
    spinRounds = Math.random() * Math.floor(20) + 1;
    spinWheel(".wheel_1");
    spinWheel(".wheel_2");
    spinWheel(".wheel_3");
}

function spinWheel(wheel, dest) {
    document.querySelectorAll(`${wheel} .item`).forEach(item => {
        item.style.transitionDuration = ".1s";
        item.style.transform = "translateY(100%)";
    });

    document.querySelector(".item").addEventListener("transitionend", moveLastItem)
}

function moveLastItem() {
    document.querySelectorAll(".item").forEach(item => {
        item.style.transitionDuration = "0s";
        item.style.transform = "translateY(0)";
    });
    const elem = document.querySelector(`.item_${lastItemID}`);
    elem.parentNode.removeChild(elem);

    addLastItem();

}

function addLastItem() {
    const movedElement = `<div class="item item_${lastItemID}">${lastItemID}</div>`;

    document.querySelector(".wheel_1").insertAdjacentHTML('afterbegin', movedElement);

    lastItemID--;

    if (lastItemID === 0) {
        lastItemID = 5;
    }

    spinRounds--;

    if (spinRounds > 0) {
        setTimeout(function() {
            spinWheel(".wheel_1");
            spinWheel(".wheel_2");
            spinWheel(".wheel_3")
        }, .1)
    }

}