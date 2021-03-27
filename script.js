//You can edit ALL of the code here
function setup() {
  //#region ready object array from episodes.js
  //const allEpisodes = getAllEpisodes();
  //makePageForEpisodes(allEpisodes);
  //#endregion
  //#region Random api url fetch data
  // const apis = [
  //   "https://api.tvmaze.com/shows/82/episodes",
  //   "https://api.tvmaze.com/shows/527/episodes",
  //   "https://api.tvmaze.com/shows/22036/episodes",
  //   "https://api.tvmaze.com/shows/5/episodes",
  //   "https://api.tvmaze.com/shows/582/episodes",
  //   "https://api.tvmaze.com/shows/179/episodes",
  //   "https://api.tvmaze.com/shows/379/episodes",
  //   "https://api.tvmaze.com/shows/4729/episodes",
  // ];
  // const randomIndex = Math.floor(Math.random() * apis.length);
  // const selectedApi = apis[randomIndex];
  // fetch(selectedApi)
  //   .then((response) => response.json())
  //   .then((data) => makePageForEpisodes(data));
  //#endregion
  //#region all shows and selected api from shows.js
  const allShows = getAllShows();

  const rootElem = document.getElementById("root");
  const navbar = document.createElement("div");
  navbar.className = "navbar";
  const select = document.createElement("select");
  select.id = "shows";
  allShows.forEach(({ id, name }) => {
    const option = document.createElement("option");
    option.value = id;
    option.text = name;
    select.appendChild(option);
  });
  navbar.appendChild(select);
  rootElem.appendChild(navbar);

  initialApiUrl = `https://api.tvmaze.com/shows/${allShows[0].id}/episodes`;
  fetch(initialApiUrl)
    .then((response) => response.json())
    .then((data) => makePageForEpisodes(data));

  select.addEventListener("change", () => {
    document.getElementsByClassName("search")[0].remove();
    document.getElementsByClassName("stats")[0].remove();
    document.getElementsByClassName("contentContainer")[0].remove();
    document.getElementById("episodes").remove();
    apiUrl = `https://api.tvmaze.com/shows/${select.value}/episodes`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => makePageForEpisodes(data));
  });
  //#endregion
}

function makePageForEpisodes(episodesAll) {
  const rootElem = document.getElementById("root");
  //Show all episodes in rootElem
  const contentContainer = document.createElement("div");
  contentContainer.className = "contentContainer";
  episodesAll.forEach((episode) => {
    contentContainer.appendChild(card(episode));
  });
  //#region  Search
  const search = document.createElement("input");
  search.setAttribute("type", "text");
  search.className = "search";
  const stats = document.createElement("p");
  stats.className = "stats";
  stats.innerText = `Displaying ${episodesAll.length} episodes`;

  let inputRegEx = new RegExp("", "ig");
  search.addEventListener("keyup", () => {
    select.value = "-1";
    inputRegEx = new RegExp(search.value, "ig");
    //update rootElem
    contentContainer.innerHTML = "";
    let episodesFiltered = episodesAll.filter((episode) => {
      return inputRegEx.test(episode.name) || inputRegEx.test(episode.summary);
    });
    stats.innerText = `Displaying ${episodesFiltered.length} / ${episodesAll.length} episodes`;
    episodesFiltered.forEach((episode) => {
      contentContainer.appendChild(card(episode));
    });
  });
  //#endregion

  //#region Select
  const select = document.createElement("select");
  select.id = "episodes";
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
      contentContainer.innerHTML = "";
      episodesAll.forEach((episode) => {
        contentContainer.appendChild(card(episode));
      });
    } else {
      contentContainer.innerHTML = "";
      contentContainer.appendChild(card(episodesAll[select.value]));
    }
  });
  //#endregion
  rootElem.appendChild(contentContainer);
  const navbar = document.getElementsByClassName("navbar");
  navbar[0].append(select, search, stats);
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
