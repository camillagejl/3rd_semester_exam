"use strict";

document.addEventListener("DOMContentLoaded", fetchSymbols);

// The content we fetch is defined as variables, so we don't need to pass them all the way down as parameters.
let symbols;
let slotMachineSVG;
let holdButtonSVG;
let textSVG;

// Fetching all different symbols from the gameitems.json file.
async function fetchSymbols() {
    let pagesUrl = "gameitems.json";
    let jsonData = await fetch(pagesUrl);
    symbols = await jsonData.json();

    fetchSVGs();
}

// Fetching all the SVGs that we need to be able to edit with javaScript.
function fetchSVGs() {
    const slotMachineSVGFile = fetch("elements/static/slot_machine.svg").then(r => r.text());
    const holdButtonSVGFile = fetch("elements/static/hold.svg").then(r => r.text());
    const textSVGFile = fetch("elements/static/text.svg").then(r => r.text());

    Promise
        .all([slotMachineSVGFile, holdButtonSVGFile, textSVGFile])
        .then(
            function (responses) {
                const [slotMachineSVGFile, holdButtonSVGFile, textSVGFile] = responses;
                slotMachineSVG = slotMachineSVGFile;
                holdButtonSVG = holdButtonSVGFile;
                textSVG = textSVGFile;
                startGame();
            }
        );
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

        // This line of symbols is only used when we want to test the winning popup.
        // symbols: [symbols[0], symbols[0], symbols[5], symbols[5]],

        // The symbols are fetched from a json-file. Symbols can be added several times, and order doesn't matter.
        symbols: [symbols[3], symbols[2], symbols[3], symbols[0], symbols[5], symbols[1], symbols[0], symbols[5], symbols[1], symbols[2], symbols[0], symbols[4], symbols[0], symbols[5]],
        isHolding: false,

        // "active" refers to the active symbol in the wheel array. This starts on 1 (i.e. the second symbol in the
        // array), so that the "active" symbol is the second in the visual wheel, and these are the symbols that will be
        // compared for winning.
        active: 1
    };
    let wheel2 = {
        id: 2,
        // symbols: [symbols[0], symbols[0], symbols[5], symbols[5]],
        symbols: [symbols[5], symbols[3], symbols[4], symbols[0], symbols[5], symbols[0], symbols[3], symbols[1], symbols[4], symbols[2], symbols[0], symbols[1], symbols[2], symbols[1]],
        isHolding: false,
        active: 1
    };
    let wheel3 = {
        id: 3,
        // symbols: [symbols[0], symbols[0], symbols[5], symbols[5]],
        symbols: [symbols[3], symbols[5], symbols[1], symbols[0], symbols[4], symbols[5], symbols[2], symbols[1], symbols[0], symbols[0], symbols[5], symbols[3], symbols[3], symbols[2]],
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
            // Gives the game_container a data-attribute to set the theme for the whole game.
            document.querySelector(".game_container").setAttribute("data-game-theme", button.getAttribute("data-theme"));
        });
    });
}

function activateStartButton(wheels) {
    document.querySelector(".spin_button").classList.add("inactive");
    document.querySelector(".start_button").classList.remove("inactive");

    wheels.forEach(wheel => {
        wheel.isHolding = false;
    });

    document.querySelector(".start_button").addEventListener("click", function _function() {

        document.querySelectorAll(".hold_wheel").forEach(button => {
            holdButtonColorChange(button, false)
        });


        // When the start button is activated (when the page is loaded or the user has used all three spins),
        // is will set the remaining spins to 3.
        activateSpinButton(wheels, 3);
        document.querySelector(".spin_button").classList.remove("inactive");
        document.querySelector(".start_button").classList.add("inactive");
        document.querySelector(".start_button").removeEventListener("click", _function);
        document.querySelector(".coins_won").textContent = "0";
    })
}

function activateSpinButton(wheels, spins) {
    console.log("Activating - Activate spin button", spins);
    showSpinsLeft(spins);

    document.querySelector(".spin_button").addEventListener("click", function _function() {
        spin(wheels, spins);
        document.querySelector(".spin_button").removeEventListener("click", _function);
    });
}

// The hold button listeners are stored in a global variable, so they can be removed later, and not on button click.
const holdButtonsListeners = {};

function toggleHoldButtons(wheels, spins) {

    let thisIsHolding;

    document.querySelectorAll(".hold_wheel").forEach(button => {

        // When clicking a hold button, this will find out which button has been clicked.
        let holdWheelID = button.getAttribute("data-holdwheel") - 1;

        // Add eventListeners for the hold buttons after the first spin.
        if (spins === 2) {
            holdButtonsListeners[holdWheelID] = function () {

                console.log("Hold it!");
                // This will toggle the isHolding state of the wheel matching the button that was clicked.
                wheels[holdWheelID].isHolding = !wheels[holdWheelID].isHolding;
                thisIsHolding = wheels[holdWheelID].isHolding;
                console.log(wheels);


                holdButtonColorChange(button, thisIsHolding);

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
    let priceWon = calculatePriceWon(wheels, spinResult);

    spins--;

    console.log(priceWon);

    // Starts the visual part of spinning the wheels, separately for each wheel.
    wheels.forEach(wheel => {
        spinVisualWheel(wheel, priceWon, spins, wheels);
    });

    // If the user wins:
    if (priceWon > 0) {
        console.log("won!", priceWon);

        // Sets spins to 0 and toggles hold buttons, so they are deactivated.
        spins = 0;
        toggleHoldButtons(wheels, spins);

        // Activates the start button, so the user can start a new game.
        activateStartButton(wheels);
    }


    // Updates visual display of spins left.
    showSpinsLeft(spins);

    // Toggles the hold buttons.
    toggleHoldButtons(wheels, spins);

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

function calculatePriceWon(wheels, spinResult) {
    if (wheels[0].symbols[spinResult[0]] === wheels[1].symbols[spinResult[1]]
        && wheels[1].symbols[spinResult[1]] === wheels[2].symbols[spinResult[2]]) {
        return wheels[0].symbols[spinResult[0]].price;
    } else {
        return 0;
    }

}


// ----- VISUAL -----

// Adds the wheels, their symbols and hold buttons to the DOM.
function addWheelsToDOM(wheels) {
    // First, adding the slot machine SVG to the DOM. This is added as an image with JavaScript so we are able to change
    // text elements (coins and spins left) through JavaScript.

    document.querySelector(".slot_machine").insertAdjacentHTML('afterbegin', slotMachineSVG);
    document.querySelectorAll(".slot_machine_color").forEach(element => {
        element.style.fill = "var(--slot_machine_color)";
    });
    document.querySelector(".slot_machine_color_dark").style.fill = "var(--slot_machine_color_dark)";

    wheels.forEach(wheel => {
        document.querySelector(".wheels").innerHTML += `<div class="wheel wheel_${wheel.id}"></div>`;

        wheel.symbols.forEach(symbol => {
            document.querySelector(`.wheel_${wheel.id}`).innerHTML += `<div class="item" data-symbol-id="${symbol.id}"></div>`;
        });

        document.querySelector(".hold_buttons").innerHTML += `<button class="hold_wheel" data-holdwheel="${wheel.id}">${holdButtonSVG}</button>`;

    });

    addSVGsToPopup();
}

function addSVGsToPopup() {

    // Adds editable text SVGs to where they are needed.
    document.querySelectorAll(".text_svg").forEach(element => {
        element.innerHTML = textSVG;
    });

    // Add texts to the two different popups - one for when the user wins the jackpot, one for when the user wins
    // anything else.
    const welcomePopup = document.querySelector(".game_welcome");
    const noJackpotPopup = document.querySelector(".no_jackpot");
    const jackpotPopup = document.querySelector(".jackpot");

    welcomePopup.querySelector(".game_popup_heading").querySelector(".svg_text").textContent = "Welcome to the World Games slot machine!";
    welcomePopup.querySelector(".popup_text_one").querySelector(".svg_text").textContent = "Take a few spins for free, and win coins";
    welcomePopup.querySelector(".popup_text_two").querySelector(".svg_text").textContent = "to spend on our other fabulous games!";

    noJackpotPopup.querySelector(".popup_text_one").querySelector(".svg_text").textContent = "Sign up now, and spend your coins on winning real money prices!";
    noJackpotPopup.querySelector(".popup_text_two").querySelector(".svg_text").textContent = "Or keep playing, and aim for the big jackpot of 20 coins!";

    jackpotPopup.querySelector(".popup_text_one").querySelector(".svg_text").textContent = "You won the jackpot. Don't loose your coins!";
    jackpotPopup.querySelector(".popup_text_two").querySelector(".svg_text").textContent = "Sign up now, and spend your coins on winning real money prices!";

//    eventListeners for buttons

    document.querySelectorAll(".popup_signup_button").forEach(button => {
        button.addEventListener("click", function _function() {
            console.log("Please sign up");
        });
    });

    document.querySelectorAll(".popup_keep_playing_button").forEach(button => {
        button.addEventListener("click", function _function() {
            document.querySelector(".game_popup").style.display = "none";

            document.querySelectorAll(".game_popup_content").forEach(element => {
                element.style.display = "none";
            });
        });

        document.querySelector(".coins_won").textContent = "0";
    })

}

function showSpinsLeft(spins) {
    document.querySelector(".spins_left").textContent = spins;
}

function holdButtonColorChange(button, thisIsHolding) {
    if (thisIsHolding) {
        button.querySelector(".hold_button_color").style.fill = "#08d002";
    } else {
        button.querySelector(".hold_button_color").style.fill = "#97b88d";
    }
}

function spinVisualWheel(wheel, priceWon, spins, wheels) {
        // To calculate how many times the wheel should spin to land on the active index, we take the current position
        // of the wheel (the previously active index) - the new position where it should land (the active index). For
        // the wheel to spin several rounds, take the wheel length * 2, and * the wheel.id so the wheels will stop
        // one after one.

    let spinRounds;
    if (!wheel.isHolding) {
        spinRounds = wheel.previouslyActive - wheel.active + (wheel.symbols.length * wheel.id);
    }

    else {
        spinRounds = 0;
    }

    console.log(wheel.id + " Active " + (wheel.active));

        spinWheel(wheel, spinRounds, priceWon, spins, wheels)
}

function spinWheel(wheel, spinRounds, priceWon, spins, wheels) {
    if (spinRounds > 0) {
    document.querySelectorAll(`.wheel_${wheel.id} .item`).forEach(item => {

        // Moves all symbols down 100% of their height.
        item.style.transitionDuration = ".04s";
        item.style.transform = "translateY(100%)";
    });

    document.querySelector(`.wheel_${wheel.id} .item`).addEventListener("transitionend", function _function() {
        document.querySelector(`.wheel_${wheel.id} .item`).removeEventListener("transitionend", _function);
        moveLastItem(wheel, spinRounds, priceWon, spins, wheels);
    });

    }

    if (spinRounds === 0) {
        moveLastItem(wheel, spinRounds, priceWon, spins, wheels);
    }
}

function moveLastItem(wheel, spinRounds, priceWon, spins, wheels) {

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

    if (spinRounds > 0) {
    // Removes the last div completely from the DOM.
    lastItem.parentNode.removeChild(lastItem);
    }

    addLastItem(wheel, lastSymbolID, spinRounds, priceWon, spins, wheels);
}

function addLastItem(wheel, lastSymbolID, spinRounds, priceWon, spins, wheels) {
    console.log("spins", spins);

    if (spinRounds > 0) {
    // Inserts div to the start of the wheel, with the ID from the div removed from the end of the wheel.
    let lastItemTemplate = `<div class="item" data-symbol-id="${lastSymbolID}"></div>`;
    document.querySelector(`.wheel_${wheel.id}`).insertAdjacentHTML('afterbegin', lastItemTemplate);
    }

    spinRounds--;

    // If spinRounds is over 0, the functions will loop and the wheel will keep spinning until spinRounds hits 0.
    if (spinRounds > 0) {
        setTimeout(function () {
            spinWheel(wheel, spinRounds, priceWon, spins, wheels)
        }, 1)

    } else if (wheel.id === 3 && spinRounds <= 0) {
        displayPrice(priceWon);

        if (priceWon === 0) {

            // If spins is still above 0, the spin button will get activated again.
            if (spins > 0) {
                console.log("Activate spin button", spins);
                activateSpinButton(wheels, spins);
            }

            // If spins reaches 0, the user has lost and the start button will be activated.
            else {
                console.log("YOU LOST!");
                activateStartButton(wheels);
            }
        }

    }
}

function displayPrice(priceWon) {

    let coinsDisplay = document.querySelector(".coins_won").textContent;

    if (coinsDisplay < priceWon) {
        console.log("Done spinning", priceWon);

        coinsDisplay++;
        document.querySelector(".coins_won").textContent = coinsDisplay;

        setTimeout(function _function() {
            displayPrice(priceWon)
        }, 100);
    }

    if (priceWon !== 0 && priceWon === coinsDisplay) {
        const toggleCount = 30;
        toggleCoinsDisplay(toggleCount);
        setTimeout(function _function() {
            displayPopup(priceWon);
        }, 2000);
    }
}

function toggleCoinsDisplay(toggleCount) {
    toggleCount--;
    if (toggleCount > 0) {

        if (document.querySelector(".coins_won").style.display === "block") {
            document.querySelector(".coins_won").style.display = "none";
        } else {
            document.querySelector(".coins_won").style.display = "block";
        }
        setTimeout(function _function() {
            toggleCoinsDisplay(toggleCount);
        }, 100);
    }
}

function displayPopup(priceWon) {

    document.querySelectorAll(".game_popup_heading").forEach(heading => {
        heading.querySelector(".svg_text").innerHTML = `Congratulations! &nbsp; You won ${priceWon} coins!`;
    });

    document.querySelector(".game_popup").style.display = "flex";

    if (priceWon === 20) {
        document.querySelector(".jackpot").style.display = "block";
    }

    if (priceWon !== 20) {
        document.querySelector(".no_jackpot").style.display = "block";
    }
}