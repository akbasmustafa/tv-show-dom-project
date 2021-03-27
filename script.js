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
  //Show all episodes in rootElem
  rootElem.innerHTML = "";
  episodesAll.forEach((episode) => {
    rootElem.appendChild(card(episode));
  });
  //#region  Search
  const search = document.createElement("input");
  search.setAttribute("type", "text");
  const stats = document.createElement("p");
  stats.innerText = `Displaying ${episodesAll.length} episodes`;

  let inputRegEx = new RegExp("", "ig");
  search.addEventListener("keyup", () => {
    select.value = "-1";
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
  //#endregion

  //#region Select
  const select = document.createElement("select");
  select.id = "episodes";
  select.onchange = function () {
    console.log("hello");
  };
  const optionAll = document.createElement("option");
  optionAll.value = "-1";
  optionAll.innerText = "All Episodes : Select One";
  select.appendChild(optionAll);

  episodesAll.forEach(({ season, number, name }, index) => {
    const option = document.createElement("option");
    option.value = index;
    let text =
      "S" +
      season.toString().padStart(2, "0") +
      "E" +
      number.toString().padStart(2, "0") +
      " - " +
      name;
    option.text = text;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    search.value = "";
    if (parseInt(select.value) === -1) {
      rootElem.innerHTML = "";
      episodesAll.forEach((episode) => {
        rootElem.appendChild(card(episode));
      });
    } else {
      rootElem.innerHTML = "";
      rootElem.appendChild(card(episodesAll[select.value]));
    }
  });
  //#endregion
  document.body.insertBefore(search, rootElem);
  document.body.insertBefore(stats, rootElem);
  document.body.insertBefore(select, rootElem);
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
