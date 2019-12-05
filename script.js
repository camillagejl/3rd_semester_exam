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
    activateThemeButton();
    activateStartButton(wheels);
    addWheelsToDOM(wheels);
}

function buildWheels() {

    // Initial state of wheels.
    // The amount of symbols needs to be odd, so the median symbol will be the initially "active" symbol, and it will
    // fit in the design.
    let wheel1 = {
        id: 1,
        symbols: [symbols[0], symbols[1], symbols[2], symbols[3], symbols[4]],
        isHolding: false,
        active: 1
    };
    let wheel2 = {
        id: 2,
        symbols: [symbols[0], symbols[1], symbols[2], symbols[3], symbols[4]],
        isHolding: false,
        active: 1
    };
    let wheel3 = {
        id: 3,
        symbols: [symbols[0], symbols[1], symbols[2], symbols[3], symbols[4]],
        isHolding: false,
        active: 1
    };

    // Contains all wheels. If another wheel is added above, this is the only place it also needs to be added, and will
    // then work along with the other wheels.
    return [wheel1, wheel2, wheel3];
}

function activateThemeButton() {
    document.querySelectorAll(".theme_button").forEach(button => {
        button.addEventListener("click", function () {
            document.querySelector(".game").setAttribute("data-game-theme", button.getAttribute("data-theme"));
        })
    });
}

function activateStartButton(wheels) {
    wheels.forEach(wheel => {
        wheel.isHolding = false;
    });

    document.querySelector(".start_button").addEventListener("click", function _function() {
        // When the start button is activated (when the page is loaded or the user has used all three spins),
        // is will set the remaining spins to 3.
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

const holdButtonsListeners = {};

function activateHoldButtons(wheels, spins) {

    document.querySelectorAll(".hold_wheel").forEach(button => {

        // When clicking a hold button, this will find out which button has been clicked.
        let holdWheelID = button.getAttribute("data-holdwheel") - 1;

        // Add eventListeners for the hold buttons after the first spin.
        if (spins === 2) {
            holdButtonsListeners[holdWheelID] = function () {

                console.log("Hold it!");
                // This will toggle the isHolding state of the wheel matching the button that was clicked.
                wheels[holdWheelID].isHolding = !wheels[holdWheelID].isHolding;
                console.log(wheels);
            };

            console.log("Adding listener");
            button.addEventListener("click", holdButtonsListeners[holdWheelID]);
        }

        // Removes eventListeners from the hold buttons after the last spin.
        if (spins === 0) {
            button.removeEventListener("click", holdButtonsListeners[holdWheelID]);
        }

    });
}


// Main spin function on click
function spin(wheels, spins) {
    wheels.forEach(wheel => {
        wheel.previouslyActive = wheel.active;
    });

    // The spin result is an array with the index of the "active" symbol in each wheel.
    let spinResult = calculateSpinResult(wheels);

    // didWin compares the active symbols, and returns true (if they are the same) or false (if they are not the same).
    let didWin = compareSpinResult(wheels, spinResult);

    // If didWin returns true, the user will get the price and the start button will be activated.
    if (didWin) {
        payPrice(wheels, spinResult);
        activateStartButton(wheels);
    }


    spins--;

    // This starts the visual part of spinning the wheels, separately for each wheel.
    wheels.forEach(wheel => {
        spinButtonClick(wheel);
    });

    activateHoldButtons(wheels, spins);

    // If didWin returns false, the user will have one less spin left.
    if (!didWin) {
        console.log("You didn't win!");


        // If spins is still above 0, the spin button will get activated again.
        if (spins > 0) {
            activateSpinButton(wheels, spins);
        }

        // If spins reaches 0, the user has lost and the start button will be activated.
        else {
            console.log("YOU LOST!");
            activateStartButton(wheels);
        }
    }


}

// Return functions

function calculateSpinResult(wheels) {
    let spinResult = [];
    wheels.forEach(wheel => {
        if (!wheel.isHolding) {
            wheel.active = Math.ceil(Math.random() * wheel.symbols.length) - 1
        }
        spinResult.push(wheel.active);
    });
    return spinResult;
}

function compareSpinResult(wheels, spinResult) {
    return wheels[0].symbols[spinResult[0]] === wheels[1].symbols[spinResult[1]]
        && wheels[1].symbols[spinResult[1]] === wheels[2].symbols[spinResult[2]];
}

function payPrice(wheels, spinResult) {
    console.log("Price!", wheels[0].symbols[spinResult[0]].price);
}


// ----- VISUAL WHEELS -----

function addWheelsToDOM(wheels) {
    wheels.forEach(wheel => {
        document.querySelector(".wheels").innerHTML += `<div class="wheel wheel_${wheel.id}"></div>`;

        wheel.symbols.forEach(symbol => {
            document.querySelector(`.wheel_${wheel.id}`).innerHTML += `<div class="item" data-symbol-id="${symbol.id}"></div>`;
        });

        document.querySelector(".hold_buttons").innerHTML += `<button class="hold_wheel" data-holdwheel="${wheel.id}">Hold wheel ${wheel.id}</button>`
    })
}

function spinButtonClick(wheel) {
    if (!wheel.isHolding) {
        let spinRounds = wheel.previouslyActive - wheel.active + (wheel.symbols.length * 2 * wheel.id);
        console.log(wheel.id + " Active " + (wheel.active));

        spinWheel(wheel, spinRounds)
    }
}

function spinWheel(wheel, spinRounds) {
    document.querySelectorAll(`.wheel_${wheel.id} .item`).forEach(item => {
        item.style.transitionDuration = ".05s";
        item.style.transform = "translateY(100%)";
    });

    document.querySelector(`.wheel_${wheel.id} .item`).addEventListener("transitionend", function _function() {
        document.querySelector(`.wheel_${wheel.id} .item`).removeEventListener("transitionend", _function);
        moveLastItem(wheel, spinRounds);
    })
}

function moveLastItem(wheel, spinRounds) {
    document.querySelectorAll(`.wheel_${wheel.id} .item`).forEach(item => {
        item.style.transitionDuration = "0s";
        item.style.transform = "translateY(0)";
    });

    const allItems = document.querySelectorAll(`.wheel_${wheel.id} .item`);
    const lastItem = allItems[allItems.length - 1];
    const lastSymbolID = lastItem.getAttribute("data-symbol-id");

    lastItem.parentNode.removeChild(lastItem);

    addLastItem(wheel, lastSymbolID, spinRounds);
}

function addLastItem(wheel, lastSymbolID, spinRounds) {

    let lastItemTemplate = `<div class="item" data-symbol-id="${lastSymbolID}"></div>`;
    document.querySelector(`.wheel_${wheel.id}`).insertAdjacentHTML('afterbegin', lastItemTemplate);

    spinRounds--;

    if (spinRounds > 0) {
        setTimeout(function () {
            spinWheel(wheel, spinRounds)
        }, 1)
    }
}