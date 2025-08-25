import { createModal } from "../utils/contactForm.js";

function getPhotographerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}

async function getData() {
  const response = await fetch("./data/photographers.json");
  return await response.json();
}

/* --------- Bandeau Photographe --------- */
function photographerFactory(photographer) {
  return {
    getHeaderDOM: function () {
      const wrapper = document.createDocumentFragment();

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
      contactButton.id = "contact_button";
      contactButton.className = "contact_button";
      contactButton.textContent = "Contactez-moi";
      contactButton.setAttribute("aria-label", "Contact me");

      contactButton.addEventListener("click", () => {
        if (typeof createModal === "function") createModal();

        const modalName = document.getElementById("modal-name");
        if (modalName) modalName.textContent = photographer.name;

        displayModal();
      });

      const portrait = document.createElement("img");
      portrait.className = "photographer-portrait";
      portrait.src = photographer.portrait;
      portrait.alt = photographer.name;

      wrapper.appendChild(infoDiv);
      wrapper.appendChild(contactButton);
      wrapper.appendChild(portrait);

      return wrapper;
    },
  };
}

/* --------- Factory des médias --------- */
function mediaFactory(media) {
  if (media.image) return new ImageMedia(media);
  else if (media.video) return new VideoMedia(media);
}

class ImageMedia {
  constructor(media) {
    this.media = media;
  }

  getDOM() {
    const img = document.createElement("img");
    img.src = `Sample_Photos/${this.media.image}`;
    img.alt = this.media.title;
    img.classList.add("media-clickable");
    img.dataset.id = this.media.id;
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    return img;
  }
}

class VideoMedia {
  constructor(media) {
    this.media = media;
  }

  getDOM() {
    const video = document.createElement("video");
    video.classList.add("media-clickable");
    video.dataset.id = this.media.id;
    video.tabIndex = 0;
    video.setAttribute("role", "button");

    const source = document.createElement("source");
    source.src = `Sample_Photos/${this.media.video}`;
    source.type = "video/mp4";
    source.setAttribute("aria-label", this.media.title);

    video.appendChild(source);
    return video;
  }
}

/* --------- Affichage des médias --------- */
function displayMediaGallery(medias) {
  const gallery = document.getElementById("media-gallery");
  gallery.innerHTML = "";

  medias.forEach((media) => {
    const article = document.createElement("article");

    const mediaElement = mediaFactory(media).getDOM();
    article.appendChild(mediaElement);

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("media-info");

    const title = document.createElement("h2");
    title.textContent = media.title;

    const likeContainer = document.createElement("p");
    likeContainer.classList.add("like");

    const likesCount = document.createElement("span");
    likesCount.classList.add("likes-count");
    likesCount.dataset.id = media.id;
    likesCount.dataset.likes = media.likes;
    likesCount.textContent = media.likes;

    const likeIcon = document.createElement("span");
    likeIcon.classList.add("like-icon");
    likeIcon.dataset.id = media.id;
    likeIcon.setAttribute("aria-label", "likes");
    likeIcon.tabIndex = 0;
    likeIcon.textContent = "❤";

    likeContainer.appendChild(likesCount);
    likeContainer.appendChild(likeIcon);

    infoDiv.appendChild(title);
    infoDiv.appendChild(likeContainer);

    article.appendChild(infoDiv);
    gallery.appendChild(article);
  });

  setupLikes(medias);
  setupLightbox(medias);
}

/* --------- Footer --------- */
function createStickyFooter(photographer, medias) {
  const totalLikes = medias.reduce((sum, media) => sum + media.likes, 0);

  const footer = document.createElement("div");
  footer.id = "sticky-footer";
  footer.innerHTML = `
    <span><span id="total-likes">${totalLikes.toLocaleString(
      "fr-FR"
    )}</span> ❤</span>
    <span>${photographer.price}€ / jour</span>
  `;

  document.body.appendChild(footer);
}

/* --------- Système de likes --------- */
function setupLikes() {
  const likedMedia = JSON.parse(localStorage.getItem("likedMedia")) || [];

  document.querySelectorAll(".like-icon").forEach((icon) => {
    const mediaId = icon.getAttribute("data-id");
    const likeCount = document.querySelector(
      `.likes-count[data-id="${mediaId}"]`
    );
    const baseLikes = parseInt(likeCount.getAttribute("data-likes"));
    let isLiked = likedMedia.includes(mediaId);

    icon.setAttribute("role", "button");
    icon.setAttribute("aria-pressed", isLiked ? "true" : "false");

    if (isLiked) {
      icon.classList.add("liked");
      likeCount.textContent = baseLikes + 1;
    }

    function toggleLike() {
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

      icon.setAttribute("aria-pressed", isLiked ? "true" : "false");
      localStorage.setItem("likedMedia", JSON.stringify(likedMedia));
      updateTotalLikes();
    }

    icon.addEventListener("click", toggleLike);
    icon.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleLike();
      }
    });
  });
}

let allLikeSpans;

function updateTotalLikes() {
  let newTotal = 0;
  allLikeSpans.forEach((span) => {
    newTotal += parseInt(span.textContent);
  });
  const totalLikesElem = document.getElementById("total-likes");
  if (totalLikesElem) {
    totalLikesElem.textContent = newTotal.toLocaleString("fr-FR");
  }
}

/* --------- Lightbox --------- */
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

    let mediaHTML = "";
    if (media.image) {
      mediaHTML = `<img src="Sample_Photos/${media.image}" alt="${media.title}" />`;
    } else if (media.video) {
      mediaHTML = `<video controls>
                   <source src="Sample_Photos/${media.video}" type="video/mp4" aria-label="${media.title}" />
                 </video>`;
    }

    lightboxMedia.innerHTML = `
    ${mediaHTML}
    <p class="lightbox-title">${media.title}</p>
  `;

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

/* --------- Tri --------- */
function setupSorting(medias) {
  function sortAndDisplay(criteria) {
    const sortedMedias = [...medias];

    if (criteria === "popularity") {
      sortedMedias.sort((a, b) => b.likes - a.likes);
    } else if (criteria === "date") {
      sortedMedias.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (criteria === "title") {
      sortedMedias.sort((a, b) =>
        a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
      );
    }

    displayMediaGallery(sortedMedias);
    setupLikes(sortedMedias);
    setupLightbox(sortedMedias);

    allLikeSpans = document.querySelectorAll(".likes-count");
    updateTotalLikes();
  }

  document.addEventListener("change", (e) => {
    const target = e.target;
    if (!target) return;
    if (target.id === "sortSelect") sortAndDisplay(target.value);
  });

  document.addEventListener("click", (e) => {
    const item = e.target.closest && e.target.closest(".dropdown-item");
    if (item && item.dataset && item.dataset.value) {
      const value = item.dataset.value;
      const sel = document.getElementById("sortSelect");
      if (sel) sel.value = value;
      sortAndDisplay(value);
    }
  });

  const sel = document.getElementById("sortSelect");
  const initial = sel ? sel.value : "popularity";
  sortAndDisplay(initial);
}

/* --------- Modale --------- */
function displayModal() {
  const modal = document.getElementById("contact_modal");
  if (modal) modal.style.display = "block";
}

/* --------- Init --------- */
async function init() {
  const id = getPhotographerIdFromUrl();
  const { photographers, media } = await getData();

  const photographer = photographers.find((p) => p.id === id);
  if (!photographer) {
    console.error("Photographe introuvable à cet ID :", id);
    return;
  }

  const photographerMedia = media.filter((m) => m.photographerId === id);

  const headerContainer = document.getElementById("photographer-header");
  const photographerModel = photographerFactory(photographer);
  headerContainer.innerHTML = "";
  headerContainer.appendChild(photographerModel.getHeaderDOM());

  createStickyFooter(photographer, photographerMedia);
  setupSorting(photographerMedia);
}

init();
