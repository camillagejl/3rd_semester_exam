"use strict";

const popularGames = document.querySelector(".popular_games");
const jackpotGames = document.querySelector(".jackpot_games");
let sections = [];

async function getAllGames() {
  let pagesUrl =
    "http://creativegamerstuff.dk/kea/sem3/wordpress/wp-json/wp/v2/Game";
  let jsonData = await fetch(pagesUrl);
  sections = await jsonData.json();
  insertAllGames();
}

function insertAllGames() {
  sections.forEach(section => {
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
    <h3>${section.gametitle}</h3>
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

document.querySelector(".browse_games").addEventListener("click", function _function() {
document.querySelector(".browse_games").textContent = "Coming soon!";
})