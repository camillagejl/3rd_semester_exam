"use strict";

document.addEventListener("DOMContentLoaded", fetchSymbols);

let symbols;

// Fetching all different symbols from the gameitems.json file.
async function fetchSymbols() {
    let pagesUrl = "gameitems.json";
    let jsonData = await fetch(pagesUrl);
    symbols = await jsonData.json();

    startGame();
}

function startGame() {
    let wheels = buildWheels();
    activateStartButton(wheels);
    addSymbolsToWheels(wheels);
}

function buildWheels() {
    const wheel1 = {
        id: 1,
        symbols: [symbols[0], symbols[1], symbols[2], symbols[3], symbols[4]],
        isHolding: false,
        active: null
    };
    const wheel2 = {
        id: 2,
        symbols: [symbols[0], symbols[1], symbols[2], symbols[3], symbols[4]],
        isHolding: false,
        active: null
    };
    const wheel3 = {
        id: 3,
        symbols: [symbols[0], symbols[1], symbols[2], symbols[3], symbols[4]],
        isHolding: false,
        active: null
    };
    return [wheel1, wheel2, wheel3];
}

function activateStartButton(wheels) {
    const wheelLengths = getWheelLengths(wheels);
    document.querySelector(".start_button").addEventListener("click", function _function() {
        activateSpinButton(wheels, 3, wheelLengths);
        startButtonClick(wheels, wheelLengths);
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
            buildWheels();
        } else activateSpinButton(wheels, spins);
    }

    document.querySelectorAll(".hold_wheel").forEach(button => {
        let attr = button.getAttribute("data-holdwheel") - 1;
        button.addEventListener("click", function _function() {
            wheels[attr].isHolding = !wheels[attr].isHolding;
        });
    });
}

function calculateSpinResult(wheels) {
    let spinResult = [];

    wheels.forEach(wheel => {

        if (!wheel.isHolding) {
            wheel.active = wheel.symbols[randomSymbol(wheel)];
        }

        spinResult.push(wheel.active);
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
    return Math.round(Math.random() * Math.floor(wheel.symbols.length - 1));
}


// ----- VISUAL WHEELS PROTOTYPE -----

let spinRounds;

function getWheelLengths(wheels) {
    let wheelLengths = [];
    wheels.forEach(wheel => {
        wheelLengths.push(wheel.symbols.length);
    });
    return wheelLengths;
}

function addSymbolsToWheels(wheels) {
    let wheelCount = 0;
    wheels.forEach(wheel => {
        wheelCount++;
        document.querySelector(".wheels").innerHTML += `<div class="wheel wheel_${wheelCount}"></div>`;

        let symbolCount = 0;
        wheel.symbols.forEach(symbol => {
            symbolCount++;
            document.querySelector(`.wheel_${wheelCount}`).innerHTML += `<div class="item" data-symbol-number="${symbolCount}">${symbolCount}</div>`;
        })
    })
}

function startButtonClick(wheels, wheelLengths) {
    let wheelCount = 0;
    wheels.forEach(wheel => {
        wheelCount++;

        let lastSymbolID = wheelLengths[wheelCount - 1];
        console.log(lastSymbolID);

        document.querySelector(".spin_button").addEventListener("click", function _function() {
            spinButtonClick(wheel, lastSymbolID);
            document.querySelector(".spin_button").removeEventListener("click", _function);
        });
    });
}

function spinButtonClick(wheel, lastSymbolID) {
    spinRounds = Math.round(Math.random() * Math.floor(20) + 1);

    spinWheel(wheel, lastSymbolID)
}

function spinWheel(wheel, lastSymbolID) {
    document.querySelectorAll(`.wheel_${wheel.id} .item`).forEach(item => {
        item.style.transitionDuration = ".1s";
        item.style.transform = "translateY(100%)";
    });

    document.querySelector(".item").addEventListener("transitionend", function _function() {
        moveLastItem(wheel, lastSymbolID)
    })
}

function moveLastItem(wheel, lastSymbolID) {

    document.querySelectorAll(".item").forEach(item => {
        item.style.transitionDuration = "0s";
        item.style.transform = "translateY(0)";
    });

    const lastItem = document.querySelector(`.wheel_${wheel.id} [data-symbol-number="${lastSymbolID}"]`);
    lastItem.parentNode.removeChild(lastItem);

    addLastItem(wheel, lastSymbolID);
}

function addLastItem(wheel, lastSymbolID) {

    let lastItemTemplate = `<div class="item" data-symbol-number="${lastSymbolID}">${lastSymbolID}</div>`;
    document.querySelector(`.wheel_${wheel.id}`).insertAdjacentHTML('afterbegin', lastItemTemplate);

    lastSymbolID--;

    if (lastSymbolID === 0) {
        lastSymbolID = 5;
    }

    spinRounds--;
    console.log(spinRounds);

    if (spinRounds > 0) {
        setTimeout(function () {
            spinWheel(wheel, lastSymbolID)
        }, .1)
    }
}