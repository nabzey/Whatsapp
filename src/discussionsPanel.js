import statusManager from './status.js';
import { Liste as contactList } from './contacts.js';
import { showNewGroupPanel } from './groupe.js';
import userManager from './user.js'; // Assure-toi d'importer userManager

export function createDiscussionsPanel() {
    const panel = document.createElement('div');
    panel.className = 'w-[400px] bg-[#0a1733] h-screen flex flex-col border-r border-[#3b4a54]';
    // Header
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between px-4 py-3 bg-[#202c33]';
    const title = document.createElement('h1');
    title.className = 'text-white text-xl font-medium';
    title.textContent = this.getViewTitle();
    const headerActions = document.createElement('div');
    headerActions.className = 'flex items-center gap-2';
    // New chat button
    const newChatBtn = document.createElement('button');
    newChatBtn.className = 'text-[#8696a0] hover:text-white p-2 rounded-full hover:bg-[#3b4a54] transition-colors';
    newChatBtn.innerHTML = '<i class="fas fa-plus text-lg"></i>';
    newChatBtn.title = 'Nouvelle discussion';
    newChatBtn.addEventListener('click', () => {
      if (this.currentView === 'status') {
        // Create new status
        const creator = statusManager.createStoryCreator(async (content, type, backgroundColor) => {
          await statusManager.createStory(content, type, backgroundColor);
          this.showMainApp();
        });
        document.body.appendChild(creator);
      } else if (this.currentView === 'chats') {
        showNewDiscussionPanel.call(this, panel, userManager, contactList);
      }
    });

    // Menu button
    const menuBtn = document.createElement('button');
    menuBtn.className = 'text-[#8696a0] hover:text-white p-2 rounded-full hover:bg-[#3b4a54] transition-colors';
    menuBtn.innerHTML = '<i class="fas fa-ellipsis-v text-lg"></i>';
    menuBtn.title = 'Menu';

    headerActions.appendChild(newChatBtn);
    headerActions.appendChild(menuBtn);

    header.appendChild(title);
    header.appendChild(headerActions);

    // Search bar
    const searchContainer = document.createElement('div');
    searchContainer.className = 'px-3 py-2 bg-[#111b21] search-bar-whatsapp'; // Ajoute une classe simple

    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'flex items-center bg-[#202c33] rounded-lg px-3 py-2';

    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search text-[#8696a0] mr-3';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Rechercher';
    searchInput.className = 'bg-transparent text-white placeholder-[#8696a0] outline-none flex-1';

    searchWrapper.appendChild(searchIcon);
    searchWrapper.appendChild(searchInput);
    searchContainer.appendChild(searchWrapper);

    // Filter tabs (only for chats)
    let filterTabs = null;
    if (this.currentView === 'chats') {
      filterTabs = document.createElement('div');
      filterTabs.className = 'flex gap-2 px-3 py-2 bg-[#111b21]';

      const filters = ['Toutes', 'Non lues', 'Favoris', 'Groupes'];
      filters.forEach((filter, index) => {
        const tab = document.createElement('button');
        tab.className = `px-3 py-1 rounded-full text-sm transition-colors ${
          index === 0 
            ? 'bg-[#0a1733] text-white' 
            : 'bg-[#202c33] text-[#8696a0] hover:bg-[#1d4ed8]'
        }`;
        tab.textContent = filter;
        filterTabs.appendChild(tab);
      });
    }
    // Content area
    const content = document.createElement('div');
    content.className = 'flex-1 overflow-y-auto';
    // Connection status (only for chats)
    if (this.currentView === 'chats') {
      const connectionStatus = document.createElement('div');
      connectionStatus.className = 'flex items-center gap-3 px-4 py-3 bg-[#1f2937] border-b border-[#3b4a54]';
      // Archived chats
      const archivedChats = document.createElement('div');
      archivedChats.className = 'flex items-center justify-between px-4 py-3 hover:bg-[#202c33] cursor-pointer border-b border-[#3b4a54]';

      const archivedLeft = document.createElement('div');
      archivedLeft.className = 'flex items-center gap-3';

      const archiveIcon = document.createElement('div');
      archiveIcon.className = 'w-10 h-10 bg-[#0a1733] rounded-full flex items-center justify-center';
      archiveIcon.innerHTML = '<i class="fas fa-archive text-white"></i>';

      const archivedText = document.createElement('span');
      archivedText.className = 'text-white font-medium';
      archivedText.textContent = 'Archivées';

      const archivedCount = document.createElement('span');
      archivedCount.className = 'bg-[#0a1733] text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center';
      archivedCount.textContent = '1';

      archivedLeft.appendChild(archiveIcon);
      archivedLeft.appendChild(archivedText);

      archivedChats.appendChild(archivedLeft);
      archivedChats.appendChild(archivedCount);
      content.appendChild(archivedChats);
    }
    // Main content list
    const mainList = this.createContentList();
    content.appendChild(mainList);

    panel.appendChild(header);
    panel.appendChild(searchContainer);
    if (filterTabs) {
      panel.appendChild(filterTabs);
    }
    panel.appendChild(content);

    return panel;
}
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
  const addContactBtn = document.createElement('button');
  addContactBtn.className = 'flex items-center gap-3 bg-[#00a884] text-white px-4 py-2 rounded font-medium hover:bg-[#01976a] transition-colors';
  addContactBtn.innerHTML = `<i class="fas fa-user-plus"></i> Nouveau contact`;
  addContactBtn.onclick = () => {
    addContactBtn.disabled = true;

    const form = document.createElement('form');
    form.className = 'flex flex-col gap-2 bg-[#202c33] p-4 rounded mt-2';

    const prenomInput = document.createElement('input');
    prenomInput.type = 'text';
    prenomInput.placeholder = 'Prénom';
    prenomInput.className = 'px-2 py-1 rounded bg-[#111b21] text-white placeholder-[#8696a0]';
    const prenomError = document.createElement('small');
    prenomError.className = 'text-red-500 hidden';

    const nomInput = document.createElement('input');
    nomInput.type = 'text';
    nomInput.placeholder = 'Nom';
    nomInput.className = 'px-2 py-1 rounded bg-[#111b21] text-white placeholder-[#8696a0]';
    const nomError = document.createElement('small');
    nomError.className = 'text-red-500 hidden';

    const contactInput = document.createElement('input');
    contactInput.type = 'text';
    contactInput.placeholder = 'Contact (chiffres uniquement)';
    contactInput.className = 'px-2 py-1 rounded bg-[#111b21] text-white placeholder-[#8696a0]';
    const contactError = document.createElement('small');
    contactError.className = 'text-red-500 hidden';

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

  [
    { icon: 'fa-users', label: 'Nouveau groupe' },
    { icon: 'fa-users-cog', label: 'Nouvelle communauté' }
  ].forEach(btn => {
    const b = document.createElement('button');
    b.className = 'flex items-center gap-3 bg-[#00a884] text-white px-4 py-2 rounded font-medium hover:bg-[#01976a] transition-colors';
    b.innerHTML = `<i class="fas ${btn.icon}"></i> ${btn.label}`;
    b.addEventListener('click', () => {
      showNewGroupPanel.call(this, panel, userManager, contactList);
    });
    quickActions.appendChild(b);
  });

  quickActions.appendChild(addContactBtn);
  const currentUser = userManager.getCurrentUser();

  // 🔥 AJOUT ICI : contacts = fusion entre utilisateurs JSON (sauf soi) + contacts enregistrés
  const userContacts = (currentUser && Array.isArray(currentUser.contacts)) ? currentUser.contacts : [];
  const jsonUsers = contactList.filter(u => u.id !== currentUser.id).map(u => ({
    id: u.id,
    prenom: u.username,
    name: u.name,
    contact: u.contact,
    avatar: u.avatar,
  }));

  const uniqueContactsMap = new Map();
  [...userContacts, ...jsonUsers].forEach(c => {
    if (!uniqueContactsMap.has(c.contact)) {
      uniqueContactsMap.set(c.contact, c);
    }
  });
  const contacts = Array.from(uniqueContactsMap.values());

  const contactsTitle = document.createElement('div');
  contactsTitle.className = 'px-4 pt-4 pb-2 text-[#00a884] font-semibold text-sm';
  contactsTitle.textContent = 'Mes contacts';

  const contactsList = document.createElement('div');
  contactsList.className = 'flex flex-col gap-1 px-2 pb-4 overflow-y-auto';

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

  const groups = (currentUser && Array.isArray(currentUser.groups)) ? currentUser.groups : [];
  if (groups.length > 0) {
    const groupsTitle = document.createElement('div');
    groupsTitle.className = 'px-4 pt-4 pb-2 text-[#00a884] font-semibold text-sm';
    groupsTitle.textContent = 'Groupes';
    content.appendChild(groupsTitle);
    groups.forEach(group => {
      const groupItem = document.createElement('div');
      groupItem.className = 'flex items-center gap-3 px-4 py-2 rounded hover:bg-[#202c33] cursor-pointer';
      groupItem.innerHTML = `
        <img src="${group.image || 'https://cdn-icons-png.flaticon.com/512/616/616489.png'}" class="w-10 h-10 rounded-full object-cover" alt=""/>
        <div>
          <div class="text-white font-medium">${group.name}</div>
          <div class="text-[#8696a0] text-xs">Groupe (${group.members.length} membres)</div>
        </div>
      `;
      content.appendChild(groupItem);
    });
  }

  panel.appendChild(header);
  panel.appendChild(searchContainer);
  panel.appendChild(quickActions);
  panel.appendChild(contactsTitle);
  panel.appendChild(contactsList);
}
