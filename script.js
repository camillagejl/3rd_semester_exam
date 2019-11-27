"use strict";

document.addEventListener("DOMContentLoaded", start);

let lastItemID = 5;
let spinRounds;

function start() {
    document.querySelector("button").addEventListener("click", spinClick);
}

function spinClick() {
    spinRounds = Math.random() * Math.floor(20) + 1;
    spinWheel();
}

function spinWheel() {
    console.log("Spinning");
    document.querySelectorAll(".item").forEach(item => {
        item.style.transitionDuration = ".1s";
        item.style.transform = "translateY(100%)";
    });

    document.querySelector(".item").addEventListener("transitionend", moveLastItem)
}

function moveLastItem() {
    console.log("moving last item");
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
    console.log(spinRounds);

    if (spinRounds > 0) {
        console.log("I'm over");
        setTimeout(spinWheel, .1)
    }

}