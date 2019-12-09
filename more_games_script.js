// GAMES

"use strict";

const destAllGames = document.querySelector("#all_games");
let section = [];

async function getAllGames() {
    let pagesUrl =
        "http://creativegamerstuff.dk/kea/sem3/wordpress/wp-json/wp/v2/Game";
    let jsonData = await fetch(pagesUrl);
    section = await jsonData.json();
    insertAllGames();
}

function insertAllGames() {
    section.forEach(section => {
        let template = `<section>
                    <div class="image_content">
                        <img src="${section.thumbnail.guid}" alt="Image for: ${section.title.rendered}">
                        <button class="play_btn">PLAY</button>
                    </div>
                    <div class="gametitle">
                        <h2>${section.gametitle}</h2>
                    </div>
            </section>`;

        // if (item.project_type[0] === "Coding") {
        //     document.querySelector("#coding-projects").insertAdjacentHTML("beforeend", template);
        // }
        //
        // if (item.project_type[0] === "Other projects") {
        //     document.querySelector("#other-projects").insertAdjacentHTML("beforeend", template);
        // }

        destAllGames.insertAdjacentHTML("beforeend", template);
    });
}
getAllGames();
