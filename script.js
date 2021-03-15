//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  //rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  //Create a Card for each Episode Object in episodeList Array
  episodeList.forEach(({ name, season, number, summary, image }) => {
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

    rootElem.appendChild(card);
  });
}

window.onload = setup;
