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
    addVisuals(wheels);
}

function buildWheels() {
    const wheel1 = {
        symbols: [symbols[0], symbols[1], symbols[2], symbols[3], symbols[4]],
        isHolding: false,
        active: null
    };
    const wheel2 = {
        symbols: [symbols[0], symbols[1], symbols[2], symbols[3], symbols[4]],
        isHolding: false,
        active: null
    };
    const wheel3 = {
        symbols: [symbols[0], symbols[1], symbols[2], symbols[3], symbols[4]],
        isHolding: false,
        active: null
    };
    return [wheel1, wheel2, wheel3];
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
            buildWheels();
        } else activateSpinButton(wheels, spins);
    }

    document.querySelectorAll(".hold_wheel").forEach(button => {
        let attr = button.getAttribute("data-holdwheel") - 1;
        console.log(attr);
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

    console.log(spinResult);
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

let lastItemID = 5;
let spinRounds;

function addVisuals(wheels) {
    addSymbolsToWheels(wheels);

    document.querySelector(".spin_button").addEventListener("click", function _function() {
        spinButtonClick(wheels);
    });

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

function spinButtonClick(wheels) {
    spinRounds = Math.random() * Math.floor(20) + 1;

    let wheelCount = 0;
    wheels.forEach(wheel => {
        wheelCount++;
        spinWheel(`.wheel_${wheelCount}`)
    });
}

function spinWheel(wheel) {
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
    const lastItem = document.querySelector(`[data-symbol-number="${lastItemID}"]`);
    lastItem.parentNode.removeChild(lastItem);

    addLastItem();

}

function addLastItem() {

    let lastItemTemplate = `<div class="item" data-symbol-number="${lastItemID}">${lastItemID}</div>`;
    document.querySelector(".wheel_1").insertAdjacentHTML('afterbegin', lastItemTemplate);

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