"use strict";

let myData;

function get() {
    fetch("https://eexam-6f38.restdb.io/rest/website-users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=uf-8",
                "x-apikey": "5dde99ff4658275ac9dc1fce",
                "cache-control": "no-cache"
            }
        })
        .then(e => e.json())
        .then(data => {
            myData = data;
        });
}
get();

document.querySelector("#dropdown-btn").addEventListener("click", e => {
    document.querySelector(".dropdown-content").classList.toggle("show");
    // document.querySelector(".fa-caret-down").classList.toggle("rotate");
});

document.querySelector("#profile").addEventListener("click", e => {
    document.querySelector("#modal").style.display = "block";
    document.querySelector(".dropdown-content").classList.toggle("show");
    // document.querySelector(".fa-caret-down").classList.toggle("rotate");
});

document.querySelector("#close").addEventListener("click", e => {
    document.querySelector("#modal").style.display = "none";
});

window.addEventListener("click", e => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

document.querySelector("#logout").addEventListener("click", e => {
    localStorage.clear();
    window.open("index.html", "_self");
});
