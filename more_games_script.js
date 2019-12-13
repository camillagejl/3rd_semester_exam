"use strict";

const popularGames = document.querySelector(".popular_games");
const jackpotGames = document.querySelector(".jackpot_games");
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
    let template = `<div class="grid_div">
    <div class="container">
    <div class="image_content">
    <img src="${section.thumbnail.guid}" alt="Image for: ${section.title.rendered}">
    <button class="play_btn">PLAY</button>
     </div>
    <div class="overlay">
      <div class="text">Coming Soon!</div>
    </div>
    </div>
                   
    <div class="gametitle">
    <h2>${section.gametitle}</h2>
    </div>
            </div>`;

                        if (section.category[0] === "Popular Games") {
                popularGames.insertAdjacentHTML("beforeend", template);
                }

                if (section.category[0] === "Jackpot Games") {
                jackpotGames.insertAdjacentHTML("beforeend", template);
                }


  });
}
getAllGames();