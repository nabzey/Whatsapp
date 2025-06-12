import statusManager from './status.js';
import { contactList } from './contacts.js';
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
    // Recharge le panel normal
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
  [
    { icon: 'fa-users', label: 'Nouveau groupe' },
    { icon: 'fa-user-plus', label: 'Nouveau contact', action: () => contactList() },
    { icon: 'fa-users-cog', label: 'Nouvelle communauté' }
  ].forEach(btn => {
    const b = document.createElement('button');
    b.className = 'flex items-center gap-3 bg-[#00a884] text-white px-4 py-2 rounded font-medium hover:bg-[#01976a] transition-colors';
    b.innerHTML = `<i class="fas ${btn.icon}"></i> ${btn.label}`;
    if (btn.action) b.onclick = btn.action;
    quickActions.appendChild(b);
  });

  // Liste des utilisateurs
  const usersTitle = document.createElement('div');
  usersTitle.className = 'px-4 pt-4 pb-2 text-[#00a884] font-semibold text-sm';
  usersTitle.textContent = 'listes des utilisateurs';
  const usersList = document.createElement('div');
  usersList.className = 'flex flex-col gap-1 px-2 pb-4 overflow-y-auto';
  const users = userManager.getUsers();
  users.forEach(user => {
    const userItem = document.createElement('div');
    userItem.className = 'flex items-center gap-3 px-2 py-2 rounded hover:bg-[#202c33] cursor-pointer';
    userItem.innerHTML = `<img src="${user.avatar}" class="w-10 h-10 rounded-full object-cover" alt=""/> 
      <div>
        <div class="text-white font-medium">${user.contact}</div>
        <div class="text-[#8696a0] text-xs">${user.status || ''}</div>
      </div>`;
    // Ajoute ici l'action pour démarrer une discussion si tu veux
    usersList.appendChild(userItem);
  });
  panel.appendChild(header);
  panel.appendChild(searchContainer);
  panel.appendChild(quickActions);
  panel.appendChild(usersTitle);
  panel.appendChild(usersList);
}