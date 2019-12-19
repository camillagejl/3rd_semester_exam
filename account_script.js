"use strict";

document.addEventListener("DOMContentLoaded", function() {
    getUser();
  });

const profileForm = document.querySelector("#profile-form");

function getUser() {
    fetch("https://eexam-6f38.restdb.io/rest/website-users/" + localStorage.getItem("userID"), {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=uf-8",
                "x-apikey": "5dde99ff4658275ac9dc1fce",
                "cache-control": "no-cache"
            }
        })
        .then(e => e.json())
        .then(data => {
            profileForm.elements.email.value = data.email,
            profileForm.elements.firstname.value = data.firstname,
            profileForm.elements.lastname.value = data.lastname,
            profileForm.elements.country.value = data.country;
            document.querySelector('#profile-form > input:nth-child(16)').value = data.dateofbirth.slice(0, 10);
        });
}

function updateProfile() {
    let newUserInfo = {
        email: profileForm.elements.email.value,
        firstname: profileForm.elements.firstname.value,
        lastname: profileForm.elements.lastname.value,
        dateofbirth: profileForm.elements.dateofbirth.value,
        country: profileForm.elements.country.value
    }

    let postData = JSON.stringify(newUserInfo);

    fetch("https://eexam-6f38.restdb.io/rest/website-users/" + localStorage.getItem("userID"), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": "5dde99ff4658275ac9dc1fce",
                "cache-control": "no-cache"
            },
            body: postData
        })
        .then(res => res.json())
        .then(updatedUserInfo => {
            
        });
}

document.querySelector("#profile-btn").addEventListener("click", e => {
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
    document.querySelector("#profile-form h1").style.display = "none";
    profileFieldsArray.forEach((field) => {
        field.setAttribute("disabled", "true");
    });
});

window.addEventListener("click", e => {
    if (e.target === modal) {
        modal.style.display = "none";
        document.querySelector("#profile-form h1").style.display = "none";
        profileFieldsArray.forEach((field) => {
            field.setAttribute("disabled", "true");
        });
    }
});

document.querySelector("#logout").addEventListener("click", e => {
    localStorage.clear();
    window.open("index.html", "_self");
});

const profileFields = document.querySelectorAll(".fields");
const profileFieldsArray = Array.from(profileFields);

document.querySelector("#edit-btn").addEventListener("click", e => {
    profileFieldsArray.forEach((field) => {
        field.removeAttribute("disabled");
    });
});

profileForm.addEventListener("submit", e => {
    e.preventDefault();
    document.querySelector("#profile-form h1").style.display = "block";
    profileFieldsArray.forEach((field) => {
        field.setAttribute("disabled", "true");
    });
    updateProfile();
});
