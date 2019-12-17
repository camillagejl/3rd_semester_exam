"use strict";

document.addEventListener("DOMContentLoaded", fetchSymbols);

// The content we fetch is defined as variables, so we don't need to pass them all the way down as parameters.
let symbols;
let slotMachineSVG;
let holdButtonSVG;

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

    Promise
        .all([slotMachineSVGFile, holdButtonSVGFile])
        .then(
            function (responses) {
                const [slotMachineSVGFile, holdButtonSVGFile] = responses;
                slotMachineSVG = slotMachineSVGFile;
                holdButtonSVG = holdButtonSVGFile;
                buildGame();
            }
        );
}

function buildGame() {
    let wheels = buildWheels();
    addItemsToDom(wheels);
    activateButtons(wheels);
}

function activateButtons(wheels) {
    activateStartButton(wheels);
    activatePlayGameButton();
    activateThemeButtons();
    addMusic();
}

function buildWheels() {
    // Initial state of wheels.
    let wheel1 = {
        id: 1,

        // This line of symbols is only used when we want to test the winning popup.
        // symbols: [symbols[0], symbols[0], symbols[5], symbols[5]],

        // The symbols are fetched from a json-file. Symbols can be added several times, and order doesn't matter.
        symbols: [symbols[3], symbols[2], symbols[3], symbols[0], symbols[5], symbols[1], symbols[0], symbols[5], symbols[1], symbols[2], symbols[0], symbols[4], symbols[0], symbols[5], symbols[2]],
        isHolding: false,

        // "active" refers to the active symbol in the wheel array. This starts on 1 (i.e. the second symbol in the
        // array), so that the "active" symbol is the second in the visual wheel, and these are the symbols that will be
        // compared for winning.
        active: 1
    };
    let wheel2 = {
        id: 2,
        // symbols: [symbols[0], symbols[0], symbols[5], symbols[5]],
        symbols: [symbols[5], symbols[3], symbols[4], symbols[0], symbols[5], symbols[0], symbols[3], symbols[1], symbols[4], symbols[2], symbols[0], symbols[1], symbols[2], symbols[1], symbols[5]],
        isHolding: false,
        active: 1
    };
    let wheel3 = {
        id: 3,
        // symbols: [symbols[0], symbols[0], symbols[5], symbols[5]],
        symbols: [symbols[3], symbols[5], symbols[1], symbols[0], symbols[4], symbols[5], symbols[2], symbols[1], symbols[0], symbols[0], symbols[5], symbols[3], symbols[3], symbols[2], symbols[3]],
        isHolding: false,
        active: 1
    };

    // Contains all wheels. If another wheel is added above, this is the only place it also needs to be added, and will
    // then work along with the other wheels.
    return [wheel1, wheel2, wheel3];
}

function activateStartButton(wheels) {
    startButtonIsActivated();
    setIsHoldingFalse(wheels);

    document.querySelector(".start_button").addEventListener("click", function _function() {
        document.querySelector(".start_button").removeEventListener("click", _function);
        showSpinsLeft(0);
        startButtonIsClicked();

        // When the start button is activated (when the page is loaded or the user has used all three spins),
        // this will set the remaining spins to 3.
        activateSpinButton(wheels, 3);
    })
}

function setIsHoldingFalse(wheels) {
    // Sets all wheels isHolding to false, so wheels can't be on hold from one game to another.
    wheels.forEach(wheel => {
        wheel.isHolding = false;
    });
}

function activateSpinButton(wheels, spins) {
    document.querySelector(".spin_button").addEventListener("click", function _function() {
        document.querySelector(".spin_button").removeEventListener("click", _function);
        spin(wheels, spins);
    });
}

// The hold button listeners are stored in a global variable, so they can be removed later, and not on the button click.
const holdButtonsListeners = {};

// Main spin function on click
function spin(wheels, spins) {
    spins--;
    setPreviouslyActive(wheels);

    let spinResult = calculateSpinResult(wheels);
    let prizeWon = calculatePrizeWon(wheels, spinResult);

    // Starts the visual part of spinning the wheels.
    startVisualSpin(wheels, prizeWon, spins);

    if (prizeWon > 0) {
        // If the user wins, spins is set to 0.
        spins = 0;
    }

    // Toggles the hold buttons.
    toggleHoldButtons(wheels, spins);
}

function setPreviouslyActive(wheels) {
    // Stores the previously active symbol index, so it can be used to see how many times the DOM wheel should spin.
    wheels.forEach(wheel => {
        wheel.previouslyActive = wheel.active;
    });
}

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


// ----- RETURN FUNCTIONS -----
// Commented in the functions where they are used.

function calculateSpinResult(wheels) {
    // The spin result is an array with the index of the "active" symbol in each wheel.
    let spinResult = [];
    wheels.forEach(wheel => {
        if (!wheel.isHolding) {
            wheel.active = Math.ceil(Math.random() * wheel.symbols.length) - 1
        }
        spinResult.push(wheel.active);
    });
    return spinResult;
}

function calculatePrizeWon(wheels, spinResult) {
    // Compares the active symbols in all wheels.
    // If the active symbols are the same, it returns the prize of the active symbols.
    // If they are not the same, it returns 0.
    if (wheels[0].symbols[spinResult[0]] === wheels[1].symbols[spinResult[1]]
        && wheels[1].symbols[spinResult[1]] === wheels[2].symbols[spinResult[2]]) {
        return wheels[0].symbols[spinResult[0]].prize;
    } else {
        return 0;
    }

}


// ----- ADDING VISUAL PARTS -----

// Adds the wheels, their symbols and hold buttons to the DOM.
function addItemsToDom(wheels) {
    addSlotMachineToDom();
    addWheelsToDom(wheels);
}

function addSlotMachineToDom() {
    // Adding the slot machine SVG to the DOM. This is added as an image with JavaScript so we are able to change
    // text elements (coins and spins left) through JavaScript.
    document.querySelector(".slot_machine").insertAdjacentHTML('afterbegin', slotMachineSVG);
}

function addWheelsToDom(wheels) {
    wheels.forEach(wheel => {
        // Adds each of the wheels to the DOM.
        document.querySelector(".wheels").innerHTML += `<div class="wheel wheel_${wheel.id}"></div>`;

        // Adds the symbols found in the wheel's symbols array.
        wheel.symbols.forEach(symbol => {
            document.querySelector(`.wheel_${wheel.id}`).innerHTML += `<div class="item" data-symbol-id="${symbol.id}"></div>`;
        });

        // Adds a hold button under the wheel, with the corresponding data attribute.
        document.querySelector(".hold_buttons").innerHTML += `<button class="hold_wheel" data-holdwheel="${wheel.id}">${holdButtonSVG}</button>`;
    });
}


// ----- EVENTLISTENERS FOR BUTTONS FOR VISUALS -----

function activatePlayGameButton() {
    // Activates the "Start" and "Keep playing" buttons.
    document.querySelectorAll(".popup_play_game").forEach(button => {
        button.addEventListener("click", function _function() {
            document.querySelector(".game_popup").style.display = "none";
            document.querySelectorAll(".game_popup_content").forEach(element => {
                element.style.display = "none";
            });
        });

        document.querySelector(".coins_won").textContent = "0";
    });
}

function activateThemeButtons() {
    // Activating all three theme buttons
    document.querySelectorAll(".theme_button").forEach(button => {
        button.addEventListener("click", function () {
            // Gives the game_container a data-attribute to set the theme for the whole game.
            document.querySelector(".game_container").setAttribute("data-game-theme", button.getAttribute("data-theme"));
        });
    });
}

function addMusic() {
    const musicButton = document.querySelector(".music_toggle");
    const music = document.querySelector("#music");
    const buttonSound = document.querySelector("#button_sound");

    // The music file should loop as long as it is playing.
    music.loop = true;

    // The music volume is always .5 when it is playing.
    music.volume = .5;

    // The button sound volume starts at 0, so the sounds will only play when the user has turned sounds on.
    buttonSound.volume = 0;

    // Adds sounds to all buttons in the game - however, these sounds are at volume 0 to start with.
    document.querySelectorAll(".game_container button").forEach(button => {
        button.addEventListener("click", function _function() {
            buttonSound.play();

            // Set the currentTime to 0 so that the sound will play every time a button is clicked - even if the sound
            // from the last click hasn't finished playing.
            buttonSound.currentTime = 0;
        })
    });


    musicButton.addEventListener("click", function _function() {
        // Toggles the music data-attribute between on and off.
        this.setAttribute("data-music", this.getAttribute("data-music") === "off" ? "on" : "off");

        // If the data-attribute is now set to off, the music will pause and the button sounds volume will be 0.
        if (this.getAttribute("data-music") === "off") {
            music.pause();
            buttonSound.volume = 0;
            musicButton.style.backgroundImage = 'url("elements/static/music_off.svg")';
        }

        // If the data-attribute is now set to on, the music will play and the button sounds volume will be 1.
        if (this.getAttribute("data-music") === "on") {
            music.play();
            buttonSound.volume = 1;
            musicButton.style.backgroundImage = 'url("elements/static/music_on.svg")';
        }
    });
}


// ----- MODIFYING VISUAL PARTS -----

function startButtonIsActivated() {
    document.querySelector(".spin_button").classList.add("inactive");
    document.querySelector(".start_button").classList.remove("inactive");
}

function startButtonIsClicked() {
    document.querySelectorAll(".hold_wheel").forEach(button => {
        holdButtonColorChange(button, false)
    });

    document.querySelector(".spin_button").classList.remove("inactive");
    document.querySelector(".start_button").classList.add("inactive");
    document.querySelector(".coins_won").textContent = "0";
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

function startVisualSpin(wheels, prizeWon, spins) {
    // Updates visual display of spins left.
    showSpinsLeft(spins);

    // We start out with defining the spinRounds by random here, because this part is not repeated like the rest of the
    // spinning process.
    const spinRounds = setSpinRounds(wheels);
    visualSpin(wheels, prizeWon, spins, spinRounds);
}

function setSpinRounds(wheels) {
    // To calculate how many times the wheel should spin to land on the active index, we take the current position
    // of the wheel (the previously active index) - the new position where it should land (the active index). For
    // the wheel to spin several rounds, take the wheel length * the wheel.id so the wheels will stop
    // one after one.
    let spinRounds = [];
    wheels.forEach(wheel => {
        if (!wheel.isHolding) {
            spinRounds.push(wheel.previouslyActive - wheel.active + (wheel.symbols.length * wheel.id));
        } else {
            spinRounds.push(0);
        }
    });
    return spinRounds;
}

function visualSpin(wheels, prizeWon, spins, spinRounds) {
    // Setting a timeout so the wheel doesn't spin too quickly.
    setTimeout(function () {

        // The visual spinning of the wheels
        let lastSymbolsOfWheels = getLastSymbols(wheels);
        let lastSymbolsIds = getLastSymbolIds(wheels, lastSymbolsOfWheels);
        moveWheelsDown(wheels, spinRounds);
        removeLastItems(wheels, spinRounds, lastSymbolsOfWheels);
        addLastItem(wheels, spinRounds, lastSymbolsIds);
        moveItemsBackToPlace();

        // Spinning the first symbol is finished, and we now retract one number from the spin rounds.
        spinRounds = subtractSpinRounds(spinRounds);

        // Function that checks whether the wheel should continue spinning or not. Returns true or false.
        const shouldContinueSpinning = continueSpinning(spinRounds);

        if (shouldContinueSpinning.includes(true)) {
            visualSpin(wheels, prizeWon, spins, spinRounds)
        } else {
            endOfSpinning(prizeWon, spins, wheels);
        }

    }, 35);
}

function endOfSpinning(prizeWon, spins, wheels) {
    if (prizeWon > 0) {
        displayPrice(prizeWon);
        toggleHoldButtons(wheels, 3);

        // Sets timeout on activating the start button, so it isn't activated before the popup is showing.
        setTimeout(function () {
            activateStartButton(wheels);
        }, 4000)
    }

    // If spins reaches 0, the user has lost and the start button will be activated.
    if (prizeWon === 0 && spins === 0) {
        console.log("YOU LOST!");
        activateStartButton(wheels);
    }

    if (prizeWon === 0 && spins > 0) {
        activateSpinButton(wheels, spins);
    }
}

function moveWheelsDown(wheels, spinRounds) {
    wheels.forEach(wheel => {
        const wheelSpinRounds = spinRounds[wheel.id - 1];
        if (wheelSpinRounds > 0) {
            document.querySelectorAll(`.wheel_${wheel.id} .item`).forEach(item => {
                item.style.transform = "translateY(100%)";
            });
        }
    })
}

function removeLastItems(wheels, spinRounds, lastSymbols) {
    wheels.forEach(wheel => {

        const lastSymbol = lastSymbols[wheel.id - 1];

        const wheelSpinRounds = spinRounds[wheel.id - 1];

        if (wheelSpinRounds > 0) {
            // Removes the last div completely from the DOM.
            lastSymbol.parentNode.removeChild(lastSymbol);
        }
    });
}

function getLastSymbolIds(wheels, symbols) {
    let lastSymbolIds = [];

    wheels.forEach(wheel => {
        const lastSymbol = symbols[wheel.id - 1];
        // Gets the ID from the last div, so it can be added to the top.
        const lastSymbolId = lastSymbol.getAttribute("data-symbol-id");
        lastSymbolIds.push(lastSymbolId);
    });
    return lastSymbolIds;
}

function getLastSymbols(wheels) {

    let lastItems = [];
    wheels.forEach(wheel => {

        // Variable that contains all the divs in a wheel.
        const allItems = document.querySelectorAll(`.wheel_${wheel.id} .item`);

        // Finds the last div in the wheel by taking the amount of divs in the wheel.
        const lastItem = allItems[allItems.length - 1];

        lastItems.push(lastItem);
    });

    return lastItems;
}

function addLastItem(wheels, spinRounds, lastSymbolsIds) {
    wheels.forEach(wheel => {
        let wheelSpinRounds = spinRounds[wheel.id - 1];
        const lastSymbolId = lastSymbolsIds[wheel.id - 1];

        if (wheelSpinRounds > 0) {
            // Inserts div to the start of the wheel, with the ID from the div removed from the end of the wheel.
            let lastItemTemplate = `<div class="item" data-symbol-id="${lastSymbolId}"></div>`;
            document.querySelector(`.wheel_${wheel.id}`).insertAdjacentHTML('afterbegin', lastItemTemplate);
        }
    })
}

function moveItemsBackToPlace() {
    // Moves all symbols back to their original position (which will change because there is another div added at the
    // top).
    document.querySelectorAll(`.item`).forEach(item => {
        item.style.transform = "translateY(0)";
    });
}

function subtractSpinRounds(spinRounds) {
    let roundId = -1;
    spinRounds.forEach(round => {
            roundId++;
            spinRounds[roundId]--;
        }
    );
    return spinRounds;
}

function continueSpinning(spinRounds) {
    let shouldContinueSpinning = [];
    spinRounds.forEach(round => {
        if (round > 0) {
            shouldContinueSpinning.push(true);
        } else {
            shouldContinueSpinning.push(false);
        }
    });
    return shouldContinueSpinning;
}

function displayPrice(prizeWon) {
    let coinsDisplay = document.querySelector(".coins_won").textContent;

    if (coinsDisplay < prizeWon) {
        console.log("Done spinning", prizeWon);

        coinsDisplay++;
        document.querySelector(".coins_won").textContent = coinsDisplay;

        setTimeout(function _function() {
            displayPrice(prizeWon)
        }, 100);
    }

    if (prizeWon !== 0 && prizeWon === coinsDisplay) {
        const toggleCount = 30;
        toggleCoinsDisplay(toggleCount);
        setTimeout(function _function() {
            displayPopup(prizeWon);
        }, 2000);
    }
}

function toggleCoinsDisplay(toggleCount) {
    toggleCount--;
    console.log(toggleCount);
    if (toggleCount > 0) {

        if (document.querySelector(".coins_won").style.display === "block") {
            document.querySelector(".coins_won").style.display = "none";
        } else {
            document.querySelector(".coins_won").style.display = "block";
        }
        setTimeout(function _function() {
            toggleCoinsDisplay(toggleCount);
        }, 100);
    } else {
        document.querySelector(".coins_won").style.display = "block";
    }
}

function displayPopup(prizeWon) {
    document.querySelector(".game_popup").style.display = "flex";

    if (prizeWon === 20) {
        document.querySelector(".jackpot").style.display = "block";
    }

    if (prizeWon !== 20) {
        document.querySelector(".no_jackpot").style.display = "block";
        document.querySelector(".popup_prize").innerHTML = prizeWon;
    }
}