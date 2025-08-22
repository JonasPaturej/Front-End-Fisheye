/*global photographerTemplate*/

async function getPhotographers() {
  try {
    const reponse = await fetch("./data/photographers.json");
    if (!reponse.ok) {
      throw new Error(
        "Impossible de charger les informations des photographes."
      );
    }
    const data = await reponse.json();
    const photographers = data.photographers;

    return { photographers };
  } catch (error) {
    console.error("Erreur lors du chargement des photographes :", error);
    return { photographers: [] };
  }
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  console.log("photographers:", photographers);
  console.log("photographersSection:", photographersSection);

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();
