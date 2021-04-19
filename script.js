//You can edit ALL of the code here
let global;
function setup() {
  global = {
    get rootElem() {
      return document.getElementById("root");
    },
    get page() {
      if (this._page === undefined) {
        this._page = "episodes"; // default value
      }
      return this._page;
    },
    set page(value) {
      if (value === "shows" || value === "episodes") {
        this._page = value;
      }
    },
    get shows() {
      return getAllShows();
    },
    get filteredShows() {
      if (!this._filteredShows) {
        this._filteredShows = this.shows;
      }
      return this._filteredShows;
    },
    set filteredShows(value) {
      this._filteredShows = value;
      renderStats();
    },
    set episodes(value) {
      this._episodes = value;
      document.getElementById("search").value = "";
      renderSelectEpisode();
      renderStats();
      renderMainEpisodes();
    },
    get episodes() {
      return this._episodes;
    },
    set filteredEpisodes(value) {
      this._filteredEpisodes = value;
      renderStats();
    },
    get filteredEpisodes() {
      if (!this._filteredEpisodes) {
        this._filteredEpisodes = this.episodes;
      }
      return this._filteredEpisodes;
    },
    set searchRegEx(value) {
      if (this.selectedShowId === "-1") {
        renderMainShows();
      } else {
        renderMainEpisodes();
      }
    },
    get searchRegEx() {
      const searchText = document.getElementById("search").value;
      if (searchText) {
        return new RegExp(searchText, "ig");
      } else {
        return new RegExp("", "ig");
      }
    },
    get selectedShowId() {
      return document.getElementById("select-show")?.value;
    },
    set selectedShowId(value) {
      document.getElementById("search").value = "";
      document.getElementById("select-show").value = value;
      if (this.selectedShowId !== "-1") {
        fetchEpisodes();
      } else {
        this.episodes = null;
        renderMainShows();
        renderStats();
      }
      this._searchRegEx = null;
    },
    get selectedEpisodeId() {
      return document.getElementById("select-episode")?.value;
    },
    set selectedEpisodeId(value) {
      document.getElementById("search").value = "";
      document.getElementById("select-episode").value = value;
      renderMainEpisodes();
      this._searchRegEx = null;
    },
  };

  render();
}

function render() {
  if (global.page === "episodes") {
    pageMain();
  } else {
    global.rootElem.innerHTML = "No Page";
  }
}
function pageMain() {
  global.rootElem.innerHTML = "";
  navBar();
  mainContent();
}

function navBar() {
  const navbar = document.createElement("div");
  navbar.className = "navbar";
  global.rootElem.appendChild(navbar);

  //#region  create select show
  const selectShow = document.createElement("select");
  selectShow.id = "select-show";
  selectShow.className = "col-12 col-md-6 col-lg-3";
  navbar.appendChild(selectShow);
  selectShow.addEventListener("change", () => {
    global.selectedShowId = document.getElementById("select-show").value;
    console.log(global.selectedShowId); //Delete BR
  });
  renderSelectShow();
  //#endregion
  //#region  create select episode
  const selectEpisode = document.createElement("select");
  selectEpisode.id = "select-episode";
  selectEpisode.className = "col-12 col-md-6 col-lg-3";
  navbar.appendChild(selectEpisode);
  renderSelectEpisode();
  selectEpisode.addEventListener("change", () => {
    global.selectedEpisodeId = document.getElementById("select-episode").value;
  });
  //#endregion
  //#region  create search
  const search = document.createElement("input");
  search.setAttribute("type", "text");
  search.id = "search";
  search.placeholder = "Search";
  search.className = "col-12 col-md-6 col-lg-3";
  navbar.appendChild(search);
  search.addEventListener("keyup", () => {
    global.searchRegEx = search.value;
  });
  //#endregion
  //#region  create stats
  const stats = document.createElement("p");
  stats.id = "stats";
  stats.className = "col-12 col-md-6 col-lg-3";
  navbar.appendChild(stats);
  renderStats();
  //#endregion
}
function renderSelectShow() {
  const select = document.getElementById("select-show");
  if (!select) return;
  //Default option
  const option = document.createElement("option");
  option.value = "-1";
  option.text = "All Shows - Select one";
  select.appendChild(option);
  //Other options
  if (global.shows) {
    global.shows.forEach(({ id, name }) => {
      const option = document.createElement("option");
      option.value = id;
      option.text = name;
      select.appendChild(option);
    });
  }
}
function renderSelectEpisode() {
  const select = document.getElementById("select-episode");
  if (!select) return;
  if (select.options) {
    for (let i = select.options.length - 1; i >= 0; i--) {
      select.remove(i);
    }
  }
  //Default option
  const option = document.createElement("option");
  option.value = "-1";
  option.text = "All Episodes - Select One";
  select.appendChild(option);
  //Other options
  if (global.selectedShowId && global.selectedShowId !== "-1") {
    if (global.episodes && global.episodes.length > 0) {
      global.episodes.forEach(({ season, number, name, id }) => {
        const option = document.createElement("option");
        option.value = id;
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
    }
  }
}
function renderStats() {
  const stats = document.getElementById("stats");
  if (!stats) return;
  if (global.episodes) {
    stats.innerText = `Displaying ${global.filteredEpisodes.length} / ${global.episodes.length} episodes`;
  } else {
    stats.innerText = `Displaying ${global.filteredShows.length} / ${global.shows.length} shows`;
  }
}

function fetchEpisodes() {
  apiUrl = `https://api.tvmaze.com/shows/${global.selectedShowId}/episodes`;
  return fetch(apiUrl)
    .then((response) => response.json())
    .then((episodes) => {
      global.episodes = episodes;
      //console.log(global.episodes);
      //renderEpisodesList();
      //const content = episodesList(global.episodes);
      //rootElem.appendChild(content);
    })
    .catch((err) => console.log(err));
}
function mainContent() {
  const container = document.createElement("div");
  container.id = "content-container";
  global.rootElem.appendChild(container);
  if (global.selectedShowId === "-1") {
    renderMainShows();
  } else {
    renderMainEpisodes();
  }
}
function renderMainShows() {
  const main = document.getElementById("content-container");
  if (!main) return;
  main.innerHTML = "";
  if (global.shows) {
    global.filteredShows = global.shows.filter((show) => {
      return (
        global.searchRegEx.test(show.name) ||
        global.searchRegEx.test(show.summary)
      );
    });
    global.filteredShows.forEach((show) => {
      main.appendChild(showCard(show));
    });
  }
}
function showCard({
  id,
  name,
  image,
  summary,
  genres,
  status,
  rating,
  runtime,
}) {
  const card = document.createElement("div");
  card.className = "show-card";
  card.id = id;
  card.addEventListener("click", (e) => {
    global.selectedShowId = e.currentTarget.id;
  });

  card.className = "show-card";
  const content = document.createElement("div");
  content.className = "show-content";
  const header = document.createElement("h1");
  header.innerText = name;
  const poster = document.createElement("img");
  poster.className = "show-image";
  defaultImage =
    "https://images.unsplash.com/photo-1572177191856-3cde618dee1f?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=282&q=80";
  if (image !== null) {
    poster.src = image.medium ? image.medium : ""; //TODO:
  } else {
    poster.src = defaultImage;
  }
  const summaryText = document.createElement("p");
  summaryText.innerHTML = summary;
  const details = document.createElement("div");
  details.innerHTML = `<p>Rated:${rating.average}</p>
  <p>Genres:${genres}</p> 
  <p>Status:${status}</p>
  <p>Runtime:${runtime}</p>`;

  content.append(poster, summaryText, details);
  card.append(header, content);
  return card;
}
function renderMainEpisodes() {
  const main = document.getElementById("content-container");
  if (!main) return;
  main.innerHTML = "";
  if (global.episodes) {
    global.filteredEpisodes = global.episodes.filter((episode) => {
      if (global.selectedEpisodeId === "-1") {
        return (
          global.searchRegEx.test(episode.name) ||
          global.searchRegEx.test(episode.summary)
        );
      } else if (global.selectedEpisodeId === episode.id.toString()) {
        return true;
      } else {
        return false;
      }
    });

    global.filteredEpisodes.forEach((episode) => {
      main.appendChild(episodeCard(episode));
    });
  }
}
function episodeCard({ name, season, number, summary, image }) {
  const card = document.createElement("div");
  card.className = "episode-card";

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
