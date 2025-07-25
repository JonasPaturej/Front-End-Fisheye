function displayModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
}

function createModal() {
  const modalOverlay = document.createElement("div");
  modalOverlay.id = "contact_modal";
  modalOverlay.style.display = "none";
  modalOverlay.style.position = "fixed";
  modalOverlay.style.top = "0";
  modalOverlay.style.left = "0";
  modalOverlay.style.width = "100%";
  modalOverlay.style.height = "100%";
  modalOverlay.style.zIndex = "9999";

  const modal = document.createElement("div");
  modal.className = "modal";

  const modalHeader = document.createElement("header");

  const h2 = document.createElement("h2");
  h2.textContent = "Contactez-moi";

  const closeBtn = document.createElement("img");
  closeBtn.src = "assets/icons/close.svg";
  closeBtn.alt = "Fermer la modale";
  closeBtn.style.cursor = "pointer";
  closeBtn.addEventListener("click", closeModal);

  modalHeader.appendChild(h2);
  modalHeader.appendChild(closeBtn);

  const form = document.createElement("form");

  const div = document.createElement("div");
  const label = document.createElement("label");
  label.textContent = "Prénom";
  const input = document.createElement("input");

  div.appendChild(label);
  div.appendChild(input);

  const sendBtn = document.createElement("button");
  sendBtn.className = "contact_button";
  sendBtn.textContent = "Envoyer";
  sendBtn.type = "submit";

  form.appendChild(div);
  form.appendChild(sendBtn);

  modal.appendChild(modalHeader);
  modal.appendChild(form);
  modalOverlay.appendChild(modal);

  document.body.appendChild(modalOverlay);
}
