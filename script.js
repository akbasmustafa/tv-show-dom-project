//You can edit ALL of the code here
let global;
function setup() {
  global = {
    page: "episodes",
    get getPage() {
      return this.page;
    },
    set setPage(value) {
      if (!(value === "shows" || value === "episodes")) {
        return;
      }
      this.page = value;
    },
    get showId() {
      if (this._showId === undefined) {
        this._showId = getAllShows()[0].id;
      }
      return this._showId;
    },
    set showId(value) {
      this._showId = value;
    },
    get shows() {
      return getAllShows();
    },
    set episodes(value) {
      this._episodes = value;
    },
    get episodes() {
      return this._episodes;
    },
    set selectedShow(value) {
      const select = document.getElementById("select-show");
      select.value = value;
    },
    get selectedShow() {
      const select = document.getElementById("select-show");
      return select.value;
    },
    set searchRegEx(value) {
      this._searchRegEx = new RegExp(value, "ig");
    },
    get searchRegEx() {
      if (this._searchRegEx == undefined) {
        this._searchRegEx = new RegExp("", "ig");
      }
      return this._searchRegEx;
    },
  };

  render();
}

function render() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  if (global.getPage === "shows") {
    pageShow();
  } else if (global.getPage === "episodes") {
    pageEpisodes();
  } else {
    rootElem.innerHTML = "No Page";
  }
}

function pageEpisodes() {
  const rootElem = document.getElementById("root");

  const navbar = renderNavBar();
  rootElem.appendChild(navbar);

  apiUrl = `https://api.tvmaze.com/shows/${global.showId}/episodes`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((episodes) => {
      global.episodes = episodes;
      const content = renderEpisodesContent(global.episodes);
      rootElem.appendChild(content);
    })
    .catch((err) => console.log(err));

  global.showId = "1201";
}

function renderEpisodesContent(episodes) {
  document.getElementsByClassName("contentContainer")[0]?.remove();
  const contentContainer = document.createElement("div");
  contentContainer.className = "contentContainer";

  let regExp = global.searchRegEx;
  let episodesFiltered = episodes.filter((episode) => {
    return regExp.test(episode.name) || regExp.test(episode.summary);
  });
  episodesFiltered.forEach((episode) => {
    contentContainer.appendChild(card(episode));
  });

  return contentContainer;
}

function renderNavBar() {
  const rootElem = document.getElementById("root");
  const navbar = document.createElement("div");
  navbar.className = "navbar";

  const showSelect = selectShow();
  const episodeSelect = selectEpisode();
  const search = searchBar();
  const stats = statsBar();

  navbar.append(showSelect, episodeSelect, search, stats);

  return navbar;
}

function selectShow() {
  //#region Select Show
  const allShows = global.shows;
  const select = document.createElement("select");
  // select.id = "select-show";
  // allShows.forEach(({ id, name }) => {
  //   const option = document.createElement("option");
  //   option.value = id;
  //   option.text = name;
  //   select.appendChild(option);
  // });

  // select.addEventListener("change", () => {
  //   global.showId = select.value;
  //   //global.setPage = "episodes";
  //   renderEpisodesContent();
  // });
  // //#endregion
  return select;
}

function selectEpisode() {
  //#region Select
  const select = document.createElement("select");
  // select.id = "episodes";
  // const optionAll = document.createElement("option");
  // optionAll.value = "-1";
  // optionAll.innerText = "All Episodes : Select One";
  // select.appendChild(optionAll);

  // episodes.forEach(({ season, number, name }, index) => {
  //   const option = document.createElement("option");
  //   option.value = index;
  //   let text =
  //     "S" +
  //     season.toString().padStart(2, "0") +
  //     "E" +
  //     number.toString().padStart(2, "0") +
  //     " - " +
  //     name;
  //   option.text = text;
  //   select.appendChild(option);
  // });

  // select.addEventListener("change", () => {
  //   search.value = "";
  //   if (parseInt(select.value) === -1) {
  //     contentContainer.innerHTML = "";
  //     episodes.forEach((episode) => {
  //       contentContainer.appendChild(card(episode));
  //     });
  //   } else {
  //     contentContainer.innerHTML = "";
  //     contentContainer.appendChild(card(episodes[select.value]));
  //   }
  // });
  // //#endregion

  return select;
}
function searchBar() {
  //#region  Search
  const search = document.createElement("input");
  // search.setAttribute("type", "text");
  // search.className = "search";

  // let inputRegEx = new RegExp("", "ig");
  // search.addEventListener("keyup", () => {
  //   //console.log(select.value);
  //   //select.value = "-1";
  //   //inputRegEx = new RegExp(search.value, "ig");
  //   global.searchRegEx = search.value;
  //   renderEpisodesContent();
  // });
  // //#endregion
  return search;
}
function statsBar() {
  const stats = document.createElement("p");
  // stats.className = "stats";
  // stats.innerText = `Displaying ${episodesFiltered.length} / ${episodes.length} episodes`;

  return stats;
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
  img.src = image?.medium;
  img.className = "card-image";
  card.appendChild(img);

  const summaryText = document.createElement("p");
  summaryText.innerHTML = summary;
  summaryText.className = "card-summary";
  card.appendChild(summaryText);
  return card;
}

window.onload = setup;
