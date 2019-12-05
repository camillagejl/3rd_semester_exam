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
    activateThemeButtons();
    activateStartButton(wheels);
    addWheelsToDOM(wheels);
}

function buildWheels() {

    // Initial state of wheels.
    let wheel1 = {
        id: 1,

        // The symbols are fetched from a json-file. Symbols can be added several times, and order doesn't matter.
        symbols: [symbols[0], symbols[1], symbols[2], symbols[3], symbols[4]],
        isHolding: false,

        // "active" refers to the active symbol in the wheel array. This starts on 1 (i.e. the second symbol in the
        // array), so that the "active" symbol is the second in the visual wheel, and these are the symbols that will be
        // compared for winning.
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

// Activating all three theme buttons
function activateThemeButtons() {
    document.querySelectorAll(".theme_button").forEach(button => {
        button.addEventListener("click", function () {
            document.querySelector(".game").setAttribute("data-game-theme", button.getAttribute("data-theme"));
        })
    });
}

function activateStartButton(wheels) {
    //
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

// The hold button listeners are stored in a global variable, so they can be removed later, and not on button click.
const holdButtonsListeners = {};

function toggleHoldButtons(wheels, spins) {

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

            button.addEventListener("click", holdButtonsListeners[holdWheelID]);
        }

        // Removes eventListeners from the hold buttons after the last spin, or after win, where spins is set to 0.
        if (spins === 0) {
            button.removeEventListener("click", holdButtonsListeners[holdWheelID]);
        }
    });
}

// Main spin function on click
function spin(wheels, spins) {

    // Stores the previously active symbol index, so it can be used to see how many times the DOM wheel should spin.
    wheels.forEach(wheel => {
        wheel.previouslyActive = wheel.active;
    });

    // The spin result is an array with the index of the "active" symbol in each wheel.
    let spinResult = calculateSpinResult(wheels);

    // didWin compares the active symbols, and returns true (if they are the same) or false (if they are not the same).
    let didWin = compareSpinResult(wheels, spinResult);

    spins--;

    // If the user wins:
    if (didWin) {

        // Sets spins to 0 and toggles hold buttons, so they are deactivated.
        spins = 0;
        toggleHoldButtons(wheels, spins);

        // Gets the prices from the active symbols.
        payPrice(wheels, spinResult);

        // Activates the start button, so the user can start a new game.
        activateStartButton(wheels);
    }

    // Starts the visual part of spinning the wheels, separately for each wheel.
    wheels.forEach(wheel => {
        spinVisualWheel(wheel);
    });

    // Toggles the hold buttons.
    toggleHoldButtons(wheels, spins);

    // If the user loses:
    if (!didWin) {

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


// ----- RETURN FUNCTIONS -----
// Commented in the functions where they are used.

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

// Adds the wheels, their symbols and hold buttons to the DOM.
function addWheelsToDOM(wheels) {
    wheels.forEach(wheel => {
        document.querySelector(".wheels").innerHTML += `<div class="wheel wheel_${wheel.id}"></div>`;

        wheel.symbols.forEach(symbol => {
            document.querySelector(`.wheel_${wheel.id}`).innerHTML += `<div class="item" data-symbol-id="${symbol.id}"></div>`;
        });

        document.querySelector(".hold_buttons").innerHTML += `<button class="hold_wheel" data-holdwheel="${wheel.id}">Hold wheel ${wheel.id}</button>`
    })
}

function spinVisualWheel(wheel) {
    // Only spins each wheel if they are not on hold.
    if (!wheel.isHolding) {

        // To calculate how many times the wheel should spin to land on the active index, we take the current position
        // of the wheel (the previously active index) - the new position where it should land (the active index). For
        // the wheel to spin several rounds, take the wheel length * 2, and * the wheel.id so the wheels will stop
        // one after one.
        let spinRounds = wheel.previouslyActive - wheel.active + (wheel.symbols.length * 2 * wheel.id);
        console.log(wheel.id + " Active " + (wheel.active));

        spinWheel(wheel, spinRounds)
    }
}

function spinWheel(wheel, spinRounds) {
    document.querySelectorAll(`.wheel_${wheel.id} .item`).forEach(item => {

        // Moves all symbols down 100% of their height.
        item.style.transitionDuration = ".05s";
        item.style.transform = "translateY(100%)";
    });

    document.querySelector(`.wheel_${wheel.id} .item`).addEventListener("transitionend", function _function() {
        document.querySelector(`.wheel_${wheel.id} .item`).removeEventListener("transitionend", _function);
        moveLastItem(wheel, spinRounds);
    })
}

function moveLastItem(wheel, spinRounds) {

    // Moves all symbols back to their original position (which will change because there is another div added at the
    // top - as happens below).
    document.querySelectorAll(`.wheel_${wheel.id} .item`).forEach(item => {
        item.style.transitionDuration = "0s";
        item.style.transform = "translateY(0)";
    });

    // Variable that contains all the divs in a wheel.
    const allItems = document.querySelectorAll(`.wheel_${wheel.id} .item`);

    // Finds the last div in the wheel by taking the amount of divs in the wheel.
    const lastItem = allItems[allItems.length - 1];

    // Gets the ID from the last div, so it can be added to the top below.
    const lastSymbolID = lastItem.getAttribute("data-symbol-id");

    // Removes the last div completely from the DOM.
    lastItem.parentNode.removeChild(lastItem);

    addLastItem(wheel, lastSymbolID, spinRounds);
}

function addLastItem(wheel, lastSymbolID, spinRounds) {

    // Inserts div to the start of the wheel, with the ID from the div removed from the end of the wheel.
    let lastItemTemplate = `<div class="item" data-symbol-id="${lastSymbolID}"></div>`;
    document.querySelector(`.wheel_${wheel.id}`).insertAdjacentHTML('afterbegin', lastItemTemplate);

    spinRounds--;

    // If spinRounds is over 0, the functions will loop and the wheel will keep spinning until spinRounds hits 0.
    if (spinRounds > 0) {
        setTimeout(function () {
            spinWheel(wheel, spinRounds)
        }, 1)
    }
}