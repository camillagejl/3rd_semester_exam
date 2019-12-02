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
    console.log("whatever");
    let template = `<section>
                    <div class="image_content">
                        <img src="${section.thumbnail.guid}" alt="Image for: ${section.gametitle.rendered}">
                    </div>
                    <div class="gametitle">
                        <h2>${section.gametitle}</h2>
                    </div>
                    <div class="category">
                    <p>${section.category}</p></div>
            </section>`;
    destAllGames.insertAdjacentHTML("beforeend", template);
  });
}
getAllGames();
