import { createElement } from "./component.js";

export const Liste = [];

export function contactList() {
  function createInput(placeholder) {
    const input = createElement("input", {
      placeholder,
      class: ["border", "rounded", "px-2", "py-2", "outline-none"]
    });
    const error = createElement("small", {
      class: ["text-red-500", "hidden"]
    });
    const wrapper = createElement("div", { class: ["flex", "flex-col", "gap-1"] }, [input, error]);
    return { input, error, wrapper };
  }

  const { input: inputPrenom, error: errorPrenom, wrapper: prenomField } = createInput("Prénom");
  const { input: inputNom, error: errorNom, wrapper: nomField } = createInput("Nom");
  const { input: inputContact, error: errorContact, wrapper: contactField } = createInput("Contact (chiffres uniquement)");

  const addBtn = createElement("button", {
    class: ["bg-black", "text-white", "px-4", "py-2", "rounded"],
    onclick: () => {
      let valid = true;
      const prenom = inputPrenom.value.trim();
      const nom = inputNom.value.trim();
      const contact = inputContact.value.trim();
      [inputPrenom, inputNom, inputContact].forEach(input => input.classList.remove("border-red-500"));
      [errorPrenom, errorNom, errorContact].forEach(err => {
        err.textContent = "";
        err.classList.add("hidden");
      });

      if (!prenom) {
        inputPrenom.classList.add("border-red-500");
        errorPrenom.textContent = "Le prénom est requis.";
        errorPrenom.classList.remove("hidden");
        valid = false;
      }
      if (!nom) {
        inputNom.classList.add("border-red-500");
        errorNom.textContent = "Le nom est requis.";
        errorNom.classList.remove("hidden");
        valid = false;
      }
      if (!contact) {
        inputContact.classList.add("border-red-500");
        errorContact.textContent = "Le contact est requis.";
        errorContact.classList.remove("hidden");
        valid = false;
      } else if (!/^\d+$/.test(contact)) {
        inputContact.classList.add("border-red-500");
        errorContact.textContent = "Le contact doit contenir uniquement des chiffres.";
        errorContact.classList.remove("hidden");
        valid = false;
      } else if (Liste.some(c => c.contact === contact)) {
        inputContact.classList.add("border-red-500");
        errorContact.textContent = "Ce numéro est déjà enregistré.";
        errorContact.classList.remove("hidden");
        valid = false;
      }

      if (!valid) return;

      function generateUniquePrenom(prenom, nom) {
        let suffix = 1;
        let uniqueFullName = `${prenom} ${nom}`;
        while (Liste.some(c => `${c.prenom} ${c.name}` === uniqueFullName)) {
          uniqueFullName = `${prenom} ${nom}${suffix}`;
          suffix++;
        }
        const [uniquePrenom, ...uniqueNomParts] = uniqueFullName.split(" ");
        const uniqueNom = uniqueNomParts.join(" ");
        return { uniquePrenom, uniqueNom };
      }

      const { uniquePrenom, uniqueNom } = generateUniquePrenom(prenom, nom);
      const newContact = {
        prenom: uniquePrenom,
        name: uniqueNom,
        contact
      };
      Liste.push(newContact);
    }
  }, "Ajouter");

  const cancelBtn = createElement("button", {
    class: ["bg-gray-500", "text-white", "px-4", "py-2", "rounded"],
    onclick: () => {
      const wrapper = document.getElementById("form-add-contact");
      if (wrapper) wrapper.innerHTML = "";
    }
  }, "Annuler");

  // Quick actions (boutons verticaux)
  const quickActions = createElement("div", {
    class: ["flex", "flex-col", "gap-2", "px-4", "py-2"]
  });

  [
    { icon: 'fa-users', label: 'Nouveau groupe', action: () => alert("Fonction à venir") },
    { icon: 'fa-user-plus', label: 'Nouveau contact', action: () => contactList() },
    { icon: 'fa-users-cog', label: 'Nouvelle communauté', action: () => alert("Fonction à venir") }
  ].forEach(btn => {
    const b = document.createElement('button');
    b.className = 'flex items-center gap-3 bg-[#00a884] text-white px-4 py-2 rounded font-medium hover:bg-[#01976a] transition-colors';
    b.innerHTML = `<i class="fas ${btn.icon}"></i> ${btn.label}`;
    if (btn.action) b.onclick = btn.action;
    quickActions.appendChild(b);
  });

  const formContainer = createElement("div", {
    class: ["p-4", "space-y-3", "flex", "flex-col", "bg-white", "rounded-lg", "shadow-md", "mb-4"]
  }, [
    createElement("h2", { class: ["text-xl", "font-semibold"] }, "Ajouter un contact"),
    quickActions,
    prenomField,
    nomField,
    contactField,
    createElement("div", { class: ["flex", "gap-2"] }, [addBtn, cancelBtn])
  ]);

  const wrapper = document.getElementById("form-add-contact");
  if (wrapper) wrapper.replaceChildren(formContainer);
}
