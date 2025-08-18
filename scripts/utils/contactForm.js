function displayModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");

  restoreFormData();

  const firstInput = modal.querySelector(
    "input, textarea, button, [tabindex='0']"
  );
  if (firstInput) firstInput.focus();

  trapFocus(modal);
}

function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");

  document.removeEventListener("keydown", handleTrapFocus);
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
  modalOverlay.style.background = "rgba(0,0,0,0.8)";
  modalOverlay.style.justifyContent = "center";
  modalOverlay.style.alignItems = "center";
  modalOverlay.setAttribute("role", "dialog");
  modalOverlay.setAttribute("aria-modal", "true");
  modalOverlay.setAttribute("aria-hidden", "true");

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.style.background = "#db8876";
  modal.style.padding = "2rem";
  modal.style.borderRadius = "8px";
  modal.style.maxWidth = "500px";
  modal.style.width = "90%";

  const modalHeader = document.createElement("header");
  modalHeader.style.display = "flex";
  modalHeader.style.justifyContent = "space-between";
  modalHeader.style.alignItems = "center";
  modalHeader.style.alignItems = "flex-start";

  const h2 = document.createElement("h2");
  h2.textContent = "Contactez-moi";
  h2.style.fontSize = "3rem";
  h2.style.marginTop = "-5px";

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "×";
  closeBtn.setAttribute("aria-label", "Fermer le formulaire");
  closeBtn.style.background = "none";
  closeBtn.style.border = "none";
  closeBtn.style.fontSize = "3rem";
  closeBtn.style.fontWeight = "bold";
  closeBtn.style.color = "white";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.lineHeight = "1";
  closeBtn.style.padding = "0";
  closeBtn.addEventListener("click", closeModal);

  modalHeader.appendChild(h2);
  modalHeader.appendChild(closeBtn);

  const form = document.createElement("form");

  function createField(labelText, type = "text", name) {
    const div = document.createElement("div");
    div.style.marginBottom = "1rem";

    const label = document.createElement("label");
    label.textContent = labelText;
    label.setAttribute("for", name);

    const input = document.createElement(
      type === "textarea" ? "textarea" : "input"
    );
    if (type !== "textarea") input.type = type;
    input.id = name;
    input.name = name;
    input.required = true;

    input.value = localStorage.getItem("contact_" + name) || "";

    input.addEventListener("input", () => {
      localStorage.setItem("contact_" + name, input.value);
    });

    div.appendChild(label);
    div.appendChild(input);
    return div;
  }

  form.appendChild(createField("Prénom", "text", "prenom"));
  form.appendChild(createField("Nom", "text", "nom"));
  form.appendChild(createField("Email", "email", "email"));
  form.appendChild(createField("Votre message", "textarea", "Votre message"));

  const sendBtn = document.createElement("button");
  sendBtn.className = "contact_button";
  sendBtn.textContent = "Envoyer";
  sendBtn.type = "submit";

  form.appendChild(sendBtn);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    console.log("Formulaire envoyé :", data);
    alert("Formulaire envoyé !");

    ["prenom", "nom", "email", "message"].forEach((field) => {
      localStorage.removeItem("contact_" + field);
    });

    form.reset();
    closeModal();
  });

  modal.appendChild(modalHeader);
  modal.appendChild(form);
  modalOverlay.appendChild(modal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.style.display === "flex") {
      closeModal();
    }
  });

  document.body.appendChild(modalOverlay);
}

function restoreFormData() {
  ["prenom", "nom", "email", "message"].forEach((field) => {
    const el = document.querySelector(`#${field}`);
    if (el) {
      el.value = localStorage.getItem("contact_" + field) || "";
    }
  });
}

let focusableEls, firstFocusableEl, lastFocusableEl;
function trapFocus(modal) {
  focusableEls = modal.querySelectorAll(
    'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
  );
  firstFocusableEl = focusableEls[0];
  lastFocusableEl = focusableEls[focusableEls.length - 1];
  document.addEventListener("keydown", handleTrapFocus);
}

function handleTrapFocus(e) {
  if (e.key !== "Tab") return;
  if (e.shiftKey) {
    if (document.activeElement === firstFocusableEl) {
      e.preventDefault();
      lastFocusableEl.focus();
    }
  } else {
    if (document.activeElement === lastFocusableEl) {
      e.preventDefault();
      firstFocusableEl.focus();
    }
  }
}
