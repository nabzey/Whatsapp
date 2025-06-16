// filepath: /home/zeynab/Bureau/App-complet/src/discussionsPanel.js
function showNewDiscussionPanel(panel, userManager, contactList) {
  panel.innerHTML = ''; // Vide tout le panel

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
  title.textContent = 'Nouvelle discussion';
  header.appendChild(backBtn);
  header.appendChild(title);

  // Search bar
  const searchContainer = document.createElement('div');
  searchContainer.className = 'px-4 py-3 bg-[#111b21]';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Rechercher un nom ou un numéro';
  searchInput.className = 'w-full px-3 py-2 rounded bg-[#202c33] text-white placeholder-[#8696a0] outline-none';
  searchContainer.appendChild(searchInput);

  // Boutons rapides
  const quickActions = document.createElement('div');
  quickActions.className = 'flex flex-col gap-2 px-4 py-2';

  // Ajout du bouton "Nouveau contact" avec formulaire
  const addContactBtn = document.createElement('button');
  addContactBtn.className = 'flex items-center gap-3 bg-[#00a884] text-white px-4 py-2 rounded font-medium hover:bg-[#01976a] transition-colors';
  addContactBtn.innerHTML = `<i class="fas fa-user-plus"></i> Nouveau contact`;
  addContactBtn.onclick = () => {
    addContactBtn.disabled = true;

    const form = document.createElement('form');
    form.className = 'flex flex-col gap-2 bg-[#202c33] p-4 rounded mt-2';

    // Prénom
    const prenomInput = document.createElement('input');
    prenomInput.type = 'text';
    prenomInput.placeholder = 'Prénom';
    prenomInput.className = 'px-2 py-1 rounded bg-[#111b21] text-white placeholder-[#8696a0]';
    const prenomError = document.createElement('small');
    prenomError.className = 'text-red-500 hidden';

    // Nom
    const nomInput = document.createElement('input');
    nomInput.type = 'text';
    nomInput.placeholder = 'Nom';
    nomInput.className = 'px-2 py-1 rounded bg-[#111b21] text-white placeholder-[#8696a0]';
    const nomError = document.createElement('small');
    nomError.className = 'text-red-500 hidden';

    // Contact
    const contactInput = document.createElement('input');
    contactInput.type = 'text';
    contactInput.placeholder = 'Contact (chiffres uniquement)';
    contactInput.className = 'px-2 py-1 rounded bg-[#111b21] text-white placeholder-[#8696a0]';
    const contactError = document.createElement('small');
    contactError.className = 'text-red-500 hidden';

    // Boutons
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Ajouter';
    submitBtn.className = 'bg-[#00a884] text-white px-3 py-1 rounded hover:bg-[#01976a]';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Annuler';
    cancelBtn.className = 'bg-gray-500 text-white px-3 py-1 rounded ml-2';
    cancelBtn.onclick = () => {
      form.remove();
      addContactBtn.disabled = false;
    };

    form.appendChild(prenomInput);
    form.appendChild(prenomError);
    form.appendChild(nomInput);
    form.appendChild(nomError);
    form.appendChild(contactInput);
    form.appendChild(contactError);
    const btns = document.createElement('div');
    btns.className = 'flex gap-2';
    btns.appendChild(submitBtn);
    btns.appendChild(cancelBtn);
    form.appendChild(btns);

    quickActions.appendChild(form);

    form.onsubmit = (e) => {
      e.preventDefault();
      [prenomInput, nomInput, contactInput].forEach(i => i.classList.remove('border-red-500'));
      [prenomError, nomError, contactError].forEach(e => { e.textContent = ""; e.classList.add('hidden'); });

      let valid = true;
      const prenom = prenomInput.value.trim();
      const nom = nomInput.value.trim();
      const contact = contactInput.value.trim();

      // Validation
      if (!prenom) {
        prenomInput.classList.add('border-red-500');
        prenomError.textContent = "Le prénom est requis.";
        prenomError.classList.remove('hidden');
        valid = false;
      }
      if (!nom) {
        nomInput.classList.add('border-red-500');
        nomError.textContent = "Le nom est requis.";
        nomError.classList.remove('hidden');
        valid = false;
      }
      if (!contact) {
        contactInput.classList.add('border-red-500');
        contactError.textContent = "Le contact est requis.";
        contactError.classList.remove('hidden');
        valid = false;
      } else if (!/^\d+$/.test(contact)) {
        contactInput.classList.add('border-red-500');
        contactError.textContent = "Le contact doit contenir uniquement des chiffres.";
        contactError.classList.remove('hidden');
        valid = false;
      } else if (
        userManager.getCurrentUser().contacts &&
        userManager.getCurrentUser().contacts.some(c => c.contact === contact)
      ) {
        contactInput.classList.add('border-red-500');
        contactError.textContent = "Ce numéro est déjà enregistré.";
        contactError.classList.remove('hidden');
        valid = false;
      }
      if (!valid) return;

      // Génère un prénom/nom unique si besoin
      function generateUniquePrenom(prenom, nom) {
        let suffix = 1;
        let uniqueFullName = `${prenom} ${nom}`;
        const contacts = userManager.getCurrentUser().contacts || [];
        while (contacts.some(c => `${c.prenom || ""} ${c.name || ""}`.trim() === uniqueFullName)) {
          uniqueFullName = `${prenom} ${nom}${suffix}`;
          suffix++;
        }
        const [uniquePrenom, ...uniqueNomParts] = uniqueFullName.split(" ");
        const uniqueNom = uniqueNomParts.join(" ");
        return { uniquePrenom, uniqueNom };
      }
      const { uniquePrenom, uniqueNom } = generateUniquePrenom(prenom, nom);

      // Ajoute le contact
      const currentUser = userManager.getCurrentUser();
      if (!currentUser.contacts) currentUser.contacts = [];
      currentUser.contacts.push({
        id: Date.now(),
        prenom: uniquePrenom,
        name: uniqueNom,
        contact,
        avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
      });
      userManager.saveUsers && userManager.saveUsers();
      showNewDiscussionPanel.call(this, panel, userManager, contactList);
    };
  };

  // Ajoute les autres boutons rapides
  [
    { icon: 'fa-users', label: 'Nouveau groupe' },
    { icon: 'fa-users-cog', label: 'Nouvelle communauté' }
  ].forEach(btn => {
    const b = document.createElement('button');
    b.className = 'flex items-center gap-3 bg-[#00a884] text-white px-4 py-2 rounded font-medium hover:bg-[#01976a] transition-colors';
    b.innerHTML = `<i class="fas ${btn.icon}"></i> ${btn.label}`;
    if (btn.label === 'Nouveau groupe') {
      b.onclick = () => {
        // Call the group creation function
        createNewGroup(panel, userManager);
      };
    }
    quickActions.appendChild(b);
  });

  quickActions.appendChild(addContactBtn);

  // Génération de la liste des contacts
  const currentUser = userManager.getCurrentUser();
  const contacts = (currentUser && Array.isArray(currentUser.contacts)) ? currentUser.contacts : [];
  const contactsTitle = document.createElement('div');
  contactsTitle.className = 'px-4 pt-4 pb-2 text-[#00a884] font-semibold text-sm';
  contactsTitle.textContent = 'Mes contacts';
  const contactsList = document.createElement('div');
  contactsList.className = 'flex flex-col gap-1 px-2 pb-4 overflow-y-auto';

  // Trie et identification des doublons
  const sortedContacts = [...contacts].sort((a, b) => {
    const nameA = `${a.prenom || ""} ${a.name || ""}`.toLowerCase();
    const nameB = `${b.prenom || ""} ${b.name || ""}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });
  const nameCount = {};
  sortedContacts.forEach(c => {
    const key = `${c.prenom || ""} ${c.name || ""}`.trim().toLowerCase();
    nameCount[key] = (nameCount[key] || 0) + 1;
  });

  function renderContacts(list) {
    contactsList.innerHTML = '';
    list.forEach(contact => {
      const key = `${contact.prenom || ""} ${contact.name || ""}`.trim().toLowerCase();
      let displayName = `${contact.prenom || ""} ${contact.name || ""}`.trim();
      if (nameCount[key] > 1) {
        displayName += ` (${contact.contact})`;
      }
      const contactItem = document.createElement('div');
      contactItem.className = 'flex items-center gap-3 px-2 py-2 rounded hover:bg-[#202c33] cursor-pointer';
      contactItem.innerHTML = `
        <img src="${contact.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}" class="w-10 h-10 rounded-full object-cover" alt=""/> 
        <div>
          <div class="text-white font-medium">${displayName}</div>
          <div class="text-[#8696a0] text-xs">${contact.contact}</div>
        </div>
      `;
      contactsList.appendChild(contactItem);
    });
  }

  renderContacts(sortedContacts);

  // Recherche dynamique
  searchInput.addEventListener('input', function () {
    const value = this.value.trim().toLowerCase();
    const filtered = sortedContacts.filter(contact => {
      const fullName = `${contact.prenom || ""} ${contact.name || ""}`.toLowerCase();
      return (
        fullName.includes(value) ||
        (contact.contact && contact.contact.toLowerCase().includes(value))
      );
    });
    renderContacts(filtered);
  });

  // Ajout dans le bon ordre
  panel.appendChild(header);
  panel.appendChild(searchContainer);
  panel.appendChild(quickActions);
  panel.appendChild(contactsTitle);
  panel.appendChild(contactsList);
}

function createNewGroup(panel, userManager) {
  panel.innerHTML = ''; // Clear the panel

  // Header
  const header = document.createElement('div');
  header.className = 'flex items-center gap-3 px-4 py-4 bg-[#202c33]';
  const backBtn = document.createElement('button');
  backBtn.innerHTML = '<i class="fas fa-arrow-left text-xl text-[#00a884]"></i>';
  backBtn.className = 'mr-2';
  backBtn.onclick = () => {
    showNewDiscussionPanel(panel, userManager, contactList);
  };
  const title = document.createElement('span');
  title.className = 'text-white text-lg font-semibold';
  title.textContent = 'Créer un groupe';
  header.appendChild(backBtn);
  header.appendChild(title);

  // Form for group creation
  const form = document.createElement('form');
  form.className = 'flex flex-col gap-2 bg-[#202c33] p-4 rounded mt-2';

  const groupNameInput = document.createElement('input');
  groupNameInput.type = 'text';
  groupNameInput.placeholder = 'Nom du groupe';
  groupNameInput.className = 'px-2 py-1 rounded bg-[#111b21] text-white placeholder-[#8696a0]';

  const membersInput = document.createElement('input');
  membersInput.type = 'text';
  membersInput.placeholder = 'Ajouter des membres (contacts séparés par des virgules)';
  membersInput.className = 'px-2 py-1 rounded bg-[#111b21] text-white placeholder-[#8696a0]';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Créer le groupe';
  submitBtn.className = 'bg-[#00a884] text-white px-3 py-1 rounded hover:bg-[#01976a]';

  form.appendChild(groupNameInput);
  form.appendChild(membersInput);
  form.appendChild(submitBtn);

  form.onsubmit = (e) => {
    e.preventDefault();
    const groupName = groupNameInput.value.trim();
    const members = membersInput.value.split(',').map(m => m.trim()).filter(m => m);

    if (!groupName) {
      alert("Le nom du groupe est requis.");
      return;
    }

    // Logic to create the group
    const currentUser = userManager.getCurrentUser();
    if (!currentUser.groups) currentUser.groups = [];
    currentUser.groups.push({
      id: Date.now(),
      name: groupName,
      members: members,
      avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
    });
    userManager.saveUsers && userManager.saveUsers();
    showNewDiscussionPanel(panel, userManager, contactList);
  };

  panel.appendChild(header);
  panel.appendChild(form);
}