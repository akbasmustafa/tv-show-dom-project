//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  //rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  //Create a Card for each Episode Object in episodeList Array
  episodeList.forEach((episode) => {
    const card = document.createElement("div");
    card.className = "card-style";

    const headerText = document.createElement("h5");
    let text = episode.name + " - S" + episode.season + "E" + episode.number;
    headerText.innerHTML = text;
    headerText.className = "card-header";
    card.appendChild(headerText);

    const image = document.createElement("img");
    image.src = episode.image.medium;
    image.className = "card-image";
    card.appendChild(image);

    const summaryText = document.createElement("p");
    summaryText.innerHTML = episode.summary;
    summaryText.className = "card-summary";
    card.appendChild(summaryText);

    rootElem.appendChild(card);
  });
}

window.onload = setup;
