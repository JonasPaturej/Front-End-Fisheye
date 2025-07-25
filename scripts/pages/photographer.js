function getPhotographerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}

async function getData() {
  const response = await fetch("./data/photographers.json");
  return await response.json();
}

function displayPhotographerHeader(photographer) {
  const header = document.getElementById("photographer-header");
  header.innerHTML = "";

  const infoDiv = document.createElement("div");
  infoDiv.className = "photographer-info";

  const name = document.createElement("h1");
  name.textContent = photographer.name;

  const location = document.createElement("p");
  location.className = "location";
  location.textContent = `${photographer.city}, ${photographer.country}`;

  const tagline = document.createElement("p");
  tagline.className = "tagline";
  tagline.textContent = photographer.tagline;

  infoDiv.appendChild(name);
  infoDiv.appendChild(location);
  infoDiv.appendChild(tagline);

  const contactButton = document.createElement("button");
  contactButton.className = "contact_button";
  contactButton.textContent = "Contactez-moi";
  contactButton.addEventListener("click", displayModal);

  const portrait = document.createElement("img");
  portrait.className = "photographer-portrait";
  portrait.src = photographer.portrait;
  portrait.alt = photographer.name;

  header.appendChild(infoDiv);
  header.appendChild(contactButton);
  header.appendChild(portrait);

  const modalName = document.getElementById("modal-name");
  if (modalName) {
    modalName.textContent = photographer.name;
  }
}

function displayMediaGallery(medias) {
  const gallery = document.getElementById("media-gallery");
  gallery.innerHTML = "";

  medias.forEach((media) => {
    const article = document.createElement("article");
    let content = "";

    if (media.image) {
      content = `<img src="Sample_Photos/${media.image}" alt="${media.title}" />`;
    } else if (media.video) {
      content = `<video controls><source src="Sample_Photos/${media.video}" type="video/mp4" /></video>`;
    }

    article.innerHTML = `
      ${content}
      <h2>${media.title}</h2>
      <p>${media.likes} ❤</p>
    `;

    gallery.appendChild(article);
  });
}

async function init() {
  const id = getPhotographerIdFromUrl();
  const { photographers, media } = await getData();

  const photographer = photographers.find((p) => p.id === id);
  if (!photographer) {
    console.error("Photographe introuvable à cet ID :", id);
    return;
  }
  const photographerMedia = media.filter((m) => m.photographerId === id);

  displayPhotographerHeader(photographer);
  displayMediaGallery(photographerMedia);
}

init();
