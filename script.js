"use strict";

const signupForm = document.querySelector("#signup-form");
const loginForm = document.querySelector("#login-form");
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

function post() {
    let newUser = {
        username: signupForm.elements.username.value,
        email: signupForm.elements.email.value,
        password: signupForm.elements.password.value
    }

    let postData = JSON.stringify(newUser);

    fetch("https://eexam-6f38.restdb.io/rest/website-users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": "5dde99ff4658275ac9dc1fce",
                "cache-control": "no-cache"
            },
            body: postData
        })
        .then(res => res.json())
        .then(data => {});
}

signupForm.addEventListener("submit", e => {
    e.preventDefault();
    post();
    get();
    document.querySelector("#signup-form").style.display = "none";
    document.querySelector("#login-form").style.display = "block";
    document.querySelector("#acc-created").style.display = "block";
});

loginForm.addEventListener("submit", e => {
    e.preventDefault();

    let foundUser = false;

    myData.forEach(function (user, index) {
        if (loginForm.elements.username.value === user.username && loginForm.elements.password.value === user.password) {
            document.querySelector("#logged-in").style.display = "block";
            document.querySelector("#acc-created").style.display = "none";
            document.querySelector("#error-msg").style.display = "none";
            foundUser = true;
        }

        if (!foundUser && index === myData.length - 1) {
            document.querySelector("#error-msg").style.display = "block";
            document.querySelector("#acc-created").style.display = "none";
        }
    })
});

document.querySelector("#new-acc").addEventListener("click", e => {
    document.querySelector("#login-form").style.display = "none";
    document.querySelector("#signup-form").style.display = "block";
    document.querySelector("#error-msg").style.display = "none";
});
