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
        password: signupForm.elements.password.value,
        email: signupForm.elements.email.value,
        firstname: signupForm.elements.firstname.value,
        lastname: signupForm.elements.lastname.value,
        country: signupForm.elements.country.value,
        dateofbirth: signupForm.elements.dateofbirth.value,
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
});

loginForm.addEventListener("submit", e => {
    e.preventDefault();

    let foundUser = false;

    myData.forEach(function (user, index) {
        if (loginForm.elements.username.value === user.username && loginForm.elements.password.value === user.password) {
            localStorage.setItem("username", user.username);
            console.log(localStorage.setItem.value);
            foundUser = true;
        }

        if (!foundUser && index === myData.length - 1) {

        }

        if (loginForm.elements.username.value !== user.username) {
            document.querySelector("#error").style.display = "block";
            document.querySelector("#error").innerHTML = "Incorrect username";
        }

        if (loginForm.elements.password.value !== user.password) {
            document.querySelector("#error").style.display = "block";
            document.querySelector("#error").innerHTML = "Inocrect password";
        }

    })
});

document.querySelector("#next-btn").addEventListener("click", e => {
    e.preventDefault();

    if (signupForm.elements.username.value.length > 5 && signupForm.elements.password.value.length > 5 && signupForm.elements.repeatpw.value === signupForm.elements.password.value) {
        document.querySelector(".second-step").style.width = "100%";
        document.querySelector("#first-fields").style.display = "none";
        document.querySelector("#second-fields").style.display = "block";
        document.querySelector("#checkboxes").style.display = "block";
        document.querySelector("#next-btn").style.display = "none";
        document.querySelector("#buttons-container").style.display = "flex";
        document.querySelector("#error").style.display = "none";
    } else {
        document.querySelector("#error").style.display = "block";
        document.querySelector("#error").innerHTML = "The username and password must have more than 5 characters";
    }

    if (signupForm.elements.repeatpw.value !== signupForm.elements.password.value) {
        document.querySelector("#error").style.display = "block";
        document.querySelector("#error").innerHTML = "Incorrect repeat password";
    }
});

document.querySelector("#back-btn").addEventListener("click", e => {
    e.preventDefault();

    document.querySelector(".second-step").style.width = "0%";
    document.querySelector("#first-fields").style.display = "block";
    document.querySelector("#second-fields").style.display = "none";
    document.querySelector("#checkboxes").style.display = "none";
    document.querySelector("#next-btn").style.display = "block";
    document.querySelector("#buttons-container").style.display = "none";
});

document.querySelector("#already-acc").addEventListener("click", e => {
    signupForm.style.display = "none";
    document.querySelector("#signup-h1").innerHTML = "Log In";
    document.querySelector("#bars-container").style.display = "none";
    loginForm.style.display = "block";
});

document.querySelector("#new-acc").addEventListener("click", e => {
    loginForm.style.display = "none";
    document.querySelector("#signup-h1").innerHTML = "Sign Up";
    document.querySelector("#bars-container").style.display = "flex";
    signupForm.style.display = "block";
});

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    document.querySelector("#nav-buttons").style.display = "flex";
  } else {
    document.querySelector("#nav-buttons").style.display = "none";
  }
}

const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, c - c / 10);
    }
  };

document.querySelector("#nav-login").addEventListener("click", e => {
    signupForm.style.display = "none";
    document.querySelector("#signup-h1").innerHTML = "Log In";
    document.querySelector("#bars-container").style.display = "none";
    loginForm.style.display = "block";
    scrollToTop();
});

document.querySelector("#nav-signup").addEventListener("click", e => {
    loginForm.style.display = "none";
    document.querySelector("#signup-h1").innerHTML = "Sign Up";
    document.querySelector("#bars-container").style.display = "flex";
    signupForm.style.display = "block";
    scrollToTop();
});
