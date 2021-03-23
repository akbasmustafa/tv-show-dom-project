//You can edit ALL of the code here
function setup() {
  //const allEpisodes = getAllEpisodes();
  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => response.json())
    .then((data) => makePageForEpisodes(data));
  //makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodesAll) {
  const rootElem = document.getElementById("root");

  //update rootElem
  rootElem.innerHTML = "";
  episodesAll.forEach((episode) => {
    rootElem.appendChild(card(episode));
  });
  //Search
  const search = document.createElement("input");
  search.setAttribute("type", "text");
  const stats = document.createElement("p");
  stats.innerText = `Displaying ${episodesAll.length} episodes`;

  let inputRegEx = new RegExp("", "ig");
  search.addEventListener("keyup", () => {
    inputRegEx = new RegExp(search.value, "ig");
    //update rootElem
    rootElem.innerHTML = "";
    let episodesFiltered = episodesAll.filter((episode) => {
      return inputRegEx.test(episode.name) || inputRegEx.test(episode.summary);
    });
    stats.innerText = `Displaying ${episodesFiltered.length} / ${episodesAll.length} episodes`;
    episodesFiltered.forEach((episode) => {
      rootElem.appendChild(card(episode));
    });
  });
  document.body.insertBefore(search, rootElem);
  document.body.insertBefore(stats, rootElem);

  //   .filter(({ name }) => {
  //   inputRegEx.test(name);
  // })

  //Create a Card for each Episode Object in episodesAll Array
}

function card({ name, season, number, summary, image }) {
  const card = document.createElement("div");
  card.className = "card-style";

  const headerText = document.createElement("h5");
  let text =
    name +
    " - S" +
    season.toString().padStart(2, "0") +
    "E" +
    number.toString().padStart(2, "0");
  headerText.innerHTML = text;
  headerText.className = "card-header";
  card.appendChild(headerText);

  const img = document.createElement("img");
  img.src = image.medium;
  img.className = "card-image";
  card.appendChild(img);

  const summaryText = document.createElement("p");
  summaryText.innerHTML = summary;
  summaryText.className = "card-summary";
  card.appendChild(summaryText);
  return card;
}

window.onload = setup;
