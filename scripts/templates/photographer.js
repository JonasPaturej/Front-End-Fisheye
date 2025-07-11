function photographerTemplate(data) {
  const { name, portrait, city, country, tagline, price } = data;

  const picture = portrait;

  function getUserCardDOM() {
    const article = document.createElement("article");

    const link = document.createElement("a");
    link.setAttribute("href", `photographer.html?id=${id}`);
    link.setAttribute(`Voir la page de ${name}`);

    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", name);

    const h2 = document.createElement("h2");
    h2.textContent = name;

    link.appendChild(img);
    link.appendChild(h2);

    const loc = document.createElement("p");
    loc.textContent = `${city}, ${country}`;
    loc.classList.add("loc");

    const citation = document.createElement("p");
    citation.textContent = tagline;
    citation.classList.add("citation");

    const prix = document.createElement("p");
    prix.textContent = `${price}€/jour`;
    prix.classList.add("prix");

    article.appendChild(link);
    article.appendChild(loc);
    article.appendChild(citation);
    article.appendChild(prix);

    return article;
  }
  return { name, picture, getUserCardDOM };
}
