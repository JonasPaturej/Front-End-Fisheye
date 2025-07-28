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
  if (modalName) modalName.textContent = photographer.name;
}

function displayMediaGallery(medias) {
  const gallery = document.getElementById("media-gallery");
  gallery.innerHTML = "";

  const likedMedia = JSON.parse(localStorage.getItem("likedMedia")) || [];

  medias.forEach((media) => {
    const article = document.createElement("article");
    let content = "";

    if (media.image) {
      content = `<img src="Sample_Photos/${media.image}" alt="${media.title}" class="media-clickable" data-id="${media.id}" />`;
    } else if (media.video) {
      content = `<video class="media-clickable" data-id="${media.id}" controls><source src="Sample_Photos/${media.video}" type="video/mp4" /></video>`;
    }

    article.innerHTML = `
      ${content}
      <div class="media-info">
        <h2>${media.title}</h2>
        <p class="like">
          <span class="likes-count" data-id="${media.id}" data-likes="${media.likes}">${media.likes}</span>
          <span class="like-icon" data-id="${media.id}" aria-label="likes" tabindex="0">❤</span>
        </p>
      </div>
    `;

    gallery.appendChild(article);
  });

  setupLikes(medias);
  setupLightbox(medias);
}

function setupLikes(medias) {
  const likedMedia = JSON.parse(localStorage.getItem("likedMedia")) || [];

  document.querySelectorAll(".like-icon").forEach((icon) => {
    const mediaId = icon.getAttribute("data-id");
    const likeCount = document.querySelector(
      `.likes-count[data-id="${mediaId}"]`
    );
    const baseLikes = parseInt(likeCount.getAttribute("data-likes"));
    let isLiked = likedMedia.includes(mediaId);

    if (isLiked) {
      icon.classList.add("liked");
      likeCount.textContent = baseLikes + 1;
    }

    icon.addEventListener("click", () => {
      let currentLikes = parseInt(likeCount.textContent);
      if (!isLiked) {
        likeCount.textContent = baseLikes + 1;
        icon.classList.add("liked");
        likedMedia.push(mediaId);
        isLiked = true;
      } else {
        likeCount.textContent = baseLikes;
        icon.classList.remove("liked");
        const index = likedMedia.indexOf(mediaId);
        if (index > -1) likedMedia.splice(index, 1);
        isLiked = false;
      }

      localStorage.setItem("likedMedia", JSON.stringify(likedMedia));
    });
  });
}

function setupLightbox(medias) {
  const oldOverlay = document.getElementById("lightbox-overlay");
  if (oldOverlay) oldOverlay.remove();

  const overlay = document.createElement("div");
  overlay.id = "lightbox-overlay";
  overlay.style.display = "none";
  overlay.innerHTML = `
    <div id="lightbox-content">
      <button id="lightbox-close" aria-label="Fermer">×</button>
      <button id="lightbox-prev" aria-label="Image précédente"><</button>
      <div id="lightbox-media"></div>
      <button id="lightbox-next" aria-label="Image suivante">></button>
    </div>
  `;
  document.body.appendChild(overlay);

  const mediaElements = document.querySelectorAll(".media-clickable");
  const lightboxMedia = document.getElementById("lightbox-media");
  const closeBtn = document.getElementById("lightbox-close");
  const nextBtn = document.getElementById("lightbox-next");
  const prevBtn = document.getElementById("lightbox-prev");

  let currentIndex = 0;

  function showLightbox(index) {
    currentIndex = index;
    const media = medias[index];

    lightboxMedia.innerHTML = media.image
      ? `<img src="Sample_Photos/${media.image}" alt="${media.title}" />`
      : `<video controls autoplay><source src="Sample_Photos/${media.video}" type="video/mp4" /></video>`;

    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    overlay.style.display = "none";
    document.body.style.overflow = "";
  }

  mediaElements.forEach((el, index) => {
    el.addEventListener("click", () => showLightbox(index));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") showLightbox(index);
    });
  });

  closeBtn.addEventListener("click", closeLightbox);

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % medias.length;
    showLightbox(currentIndex);
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + medias.length) % medias.length;
    showLightbox(currentIndex);
  });

  document.addEventListener("keydown", (e) => {
    if (overlay.style.display === "flex") {
      if (e.key === "ArrowRight") nextBtn.click();
      if (e.key === "ArrowLeft") prevBtn.click();
      if (e.key === "Escape") closeBtn.click();
    }
  });
}

function displayModal() {
  document.getElementById("contact_modal").style.display = "block";
}
function closeModal() {
  document.getElementById("contact_modal").style.display = "none";
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
