import { Liste } from "./contacts.js"; // si tu utilises Liste pour les contacts

export function showNewGroupPanel(panel, userManager, contactList) {
  panel.innerHTML = '';
  // Header
  const header = document.createElement('div');
  header.className = 'flex items-center gap-3 px-4 py-4 bg-[#202c33]';
  const backBtn = document.createElement('button');
  backBtn.innerHTML = '<i class="fas fa-arrow-left text-xl text-[#00a884]"></i>';
  backBtn.className = 'mr-2';
  backBtn.onclick = () => {
    this.showMainApp();
  };
  const title = document.createElement('span');
  title.className = 'text-white text-lg font-semibold';
  title.textContent = 'Nouveau groupe';
  header.appendChild(backBtn);
  header.appendChild(title);

  // Formulaire de création de groupe
  const form = document.createElement('form');
  form.className = 'flex flex-col gap-3 bg-[#202c33] p-4 rounded mt-4 mx-4';

  // Nom du groupe
  const groupNameInput = document.createElement('input');
  groupNameInput.type = 'text';
  groupNameInput.placeholder = 'Nom du groupe';
  groupNameInput.className = 'px-2 py-1 rounded bg-[#111b21] text-white placeholder-[#8696a0]';
  const groupNameError = document.createElement('small');
  groupNameError.className = 'text-red-500 hidden';

  // Image du groupe (optionnel)
  const groupImgInput = document.createElement('input');
  groupImgInput.type = 'text';
  groupImgInput.placeholder = "URL de l'image du groupe (optionnel)";
  groupImgInput.className = 'px-2 py-1 rounded bg-[#111b21] text-white placeholder-[#8696a0]';

  // Sélection des admins (1 ou 2)
  const adminsLabel = document.createElement('div');
  adminsLabel.className = 'text-white font-medium mt-2';
  adminsLabel.textContent = 'Sélectionne 1 ou 2 admins :';

  const adminsList = document.createElement('div');
  adminsList.className = 'flex flex-col gap-1 max-h-40 overflow-y-auto';

  const currentUser = userManager.getCurrentUser();
  const contacts = (currentUser && Array.isArray(currentUser.contacts)) ? currentUser.contacts : [];
  const adminCheckboxes = [];

  contacts.forEach(contact => {
    const wrapper = document.createElement('label');
    wrapper.className = 'flex items-center gap-2 text-white';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = contact.contact;
    wrapper.appendChild(checkbox);
    wrapper.appendChild(document.createTextNode(`${contact.prenom || ''} ${contact.name || ''} (${contact.contact})`));
    adminsList.appendChild(wrapper);
    adminCheckboxes.push(checkbox);
  });

  // Boutons
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Créer le groupe';
  submitBtn.className = 'bg-[#00a884] text-white px-3 py-1 rounded hover:bg-[#01976a]';
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Annuler';
  cancelBtn.className = 'bg-gray-500 text-white px-3 py-1 rounded ml-2';
  cancelBtn.onclick = () => {
    this.showMainApp();
  };
  const btns = document.createElement('div');
  btns.className = 'flex gap-2';
  btns.appendChild(submitBtn);
  btns.appendChild(cancelBtn);

  form.appendChild(groupNameInput);
  form.appendChild(groupNameError);
  form.appendChild(groupImgInput);
  form.appendChild(adminsLabel);
  form.appendChild(adminsList);
  form.appendChild(btns);

  form.onsubmit = (e) => {
    e.preventDefault();
    groupNameInput.classList.remove('border-red-500');
    groupNameError.textContent = '';
    groupNameError.classList.add('hidden');

    const groupName = groupNameInput.value.trim();
    const groupImg = groupImgInput.value.trim();
    const selectedAdmins = adminCheckboxes.filter(cb => cb.checked).map(cb => cb.value);

    let valid = true;
    if (!groupName) {
      groupNameInput.classList.add('border-red-500');
      groupNameError.textContent = 'Le nom du groupe est requis.';
      groupNameError.classList.remove('hidden');
      valid = false;
    }
    if (selectedAdmins.length < 1) {
      adminsLabel.textContent = 'Sélectionne au moins 1 admin !';
      adminsLabel.classList.add('text-red-500');
      valid = false;
    } else if (selectedAdmins.length > 2) {
      adminsLabel.textContent = 'Pas plus de 2 admins !';
      adminsLabel.classList.add('text-red-500');
      valid = false;
    } else {
      adminsLabel.textContent = 'Sélectionne 1 ou 2 admins :';
      adminsLabel.classList.remove('text-red-500');
    }
    if (!valid) return;

    // Création du groupe
    const newGroup = {
      id: Date.now(),
      nom: groupName,
      description: "",
      image: groupImg || 'https://cdn-icons-png.flaticon.com/512/616/616489.png',
      admins: selectedAdmins,
      membres: [...selectedAdmins], // Les admins sont aussi membres
      messages: []
    };

    if (!currentUser.groups) currentUser.groups = [];
    currentUser.groups.push(newGroup);
    userManager.saveUsers && userManager.saveUsers();

    // Affiche les détails du groupe nouvellement créé
    showGroupeDetails(newGroup, currentUser.groups, true);
  };

  panel.appendChild(header);
  panel.appendChild(form);
}

// Ajoute cette fonction dans le même fichier ou importe-la si besoin
function showGroupeDetails(groupe, groupes, isAdmin) {
  // ...reprends ici la logique de ton prompt pour afficher/modifier le groupe...
  // (tu peux copier-coller la fonction showGroupeDetails de ton prompt ici)
}