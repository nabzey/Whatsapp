import './style.css';
import authManager from './auth.js';
import userManager from './user.js';
import chatManager from './chat.js';
import statusManager from './status.js';
import callsManager from './calls.js';


class WhatsAppClone {
  constructor() {
    this.app = document.getElementById('app');
    this.currentView = 'chats';
    this.currentChat = null;
    this.isMobile = window.innerWidth < 768;
  }

  async init() {
    const user = authManager.init();
    
    if (!user) {
      this.showLoginScreen();
    } else {
      await this.initializeApp();
      this.showMainApp();
    }

    authManager.setAuthChangeCallback((user) => {
      if (user) {
        this.initializeApp().then(() => {
          this.showMainApp();
        });
      } else {
        this.showLoginScreen();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
      if (this.currentChat && !this.isMobile) {
        this.showMainApp();
      }
    });
  }

  async initializeApp() {
    await userManager.init();
    await chatManager.init();
    await statusManager.init();
    await callsManager.init();
  }

  showLoginScreen() {
    this.app.innerHTML = '';
    const loginForm = authManager.createLoginForm();
    this.app.appendChild(loginForm);
  }

  createLeftSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = 'w-16 bg-[#202c33] h-screen flex flex-col justify-between items-center py-4 border-r border-[#3b4a54]';

    // Top icons
    const topIcons = document.createElement('div');
    topIcons.className = 'flex flex-col items-center gap-6';

    // Chat icon
    const chatIcon = document.createElement('button');
    chatIcon.className = `p-3 rounded-lg transition-colors ${this.currentView === 'chats' ? 'bg-[#0a1733] text-white' : 'text-[#8696a0] hover:bg-[#1d4ed8]'}`;
    chatIcon.innerHTML = '<i class="fas fa-comment-alt text-xl"></i>';
    chatIcon.title = 'Discussions';
    chatIcon.addEventListener('click', () => {
      this.currentView = 'chats';
      this.currentChat = null;
      this.showMainApp();
    });

    // Status icon
    const statusIcon = document.createElement('button');
    statusIcon.className = `p-3 rounded-lg transition-colors ${this.currentView === 'status' ? 'bg-[#0a1733] text-white' : 'text-[#8696a0] hover:bg-[#1d4ed8]'}`;
    statusIcon.innerHTML = '<i class="fas fa-circle-notch text-xl"></i>';
    statusIcon.title = 'Statuts';
    statusIcon.addEventListener('click', () => {
      this.currentView = 'status';
      this.currentChat = null;
      this.showMainApp();
    });

    // Channels icon
    const channelsIcon = document.createElement('button');
    channelsIcon.className = `p-3 rounded-lg transition-colors ${this.currentView === 'channels' ? 'bg-[#0a1733] text-white' : 'text-[#8696a0] hover:bg-[#1d4ed8]'}`;
    channelsIcon.innerHTML = '<i class="fas fa-bullhorn text-xl"></i>';
    channelsIcon.title = 'Chaînes';
    channelsIcon.addEventListener('click', () => {
      this.currentView = 'channels';
      this.currentChat = null;
      this.showMainApp();
    });

    // Communities icon
    const communitiesIcon = document.createElement('button');
    communitiesIcon.className = `p-3 rounded-lg transition-colors ${this.currentView === 'communities' ? 'bg-[#0a1733] text-white' : 'text-[#8696a0] hover:bg-[#1d4ed8]'}`;
    communitiesIcon.innerHTML = '<i class="fas fa-users text-xl"></i>';
    communitiesIcon.title = 'Communautés';
    communitiesIcon.addEventListener('click', () => {
      this.currentView = 'communities';
      this.currentChat = null;
      this.showMainApp();
    });

    topIcons.appendChild(chatIcon);
    topIcons.appendChild(statusIcon);
    topIcons.appendChild(channelsIcon);
    topIcons.appendChild(communitiesIcon);

    // Bottom icons
    const bottomIcons = document.createElement('div');
    bottomIcons.className = 'flex flex-col items-center gap-4';

    // Settings icon
    const settingsIcon = document.createElement('button');
    settingsIcon.className = 'text-[#8696a0] hover:bg-[#3b4a54] p-3 rounded-lg transition-colors';
    settingsIcon.innerHTML = '<i class="fas fa-cog text-xl"></i>';
    settingsIcon.title = 'Paramètres';
    settingsIcon.addEventListener('click', () => {
      this.currentView = 'settings';
      this.currentChat = null;
      this.showMainApp();
    });

    // Profile avatar
    const currentUser = userManager.getCurrentUser();
    const profileBtn = document.createElement('button');
    profileBtn.className = 'w-10 h-10 rounded-full overflow-hidden border-2 border-[#00a884]';
    profileBtn.title = 'Profil';
    
    const avatarImg = document.createElement('img');
    avatarImg.src = currentUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=00a884&color=fff';
    avatarImg.alt = 'Profil';
    avatarImg.className = 'w-full h-full object-cover';
    profileBtn.appendChild(avatarImg);
    
    profileBtn.addEventListener('click', () => {
      this.currentView = 'profile';
      this.currentChat = null;
      this.showMainApp();
    });

    // Logout button
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'w-10 h-10 flex items-center justify-center rounded-full mt-4 text-[#8696a0] hover:text-red-500 transition-colors';
    logoutBtn.title = 'Déconnexion';
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt text-xl"></i>';
    logoutBtn.addEventListener('click', () => {
      authManager.logout();
      this.showLoginScreen();
    });

    bottomIcons.appendChild(settingsIcon);
    bottomIcons.appendChild(profileBtn);
    bottomIcons.appendChild(logoutBtn);

    sidebar.appendChild(topIcons);
    sidebar.appendChild(bottomIcons);

    return sidebar;
  }

  createDiscussionsPanel() {
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
    searchContainer.className = 'px-3 py-2 bg-[#111b21]';

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

  createContentList() {
    const container = document.createElement('div');
    container.className = 'flex flex-col';

    switch (this.currentView) {
      case 'chats':
        return this.createChatsList();
      case 'status':
        return this.createStatusList();
      case 'calls':
        return this.createCallsList();
      case 'channels':
        return this.createChannelsList();
      case 'communities':
        return this.createCommunitiesList();
      case 'settings':
        return this.createSettingsList();
      default:
        return this.createChatsList();
    }
  }

  createChatsList() {
    const container = document.createElement('div');
    container.className = 'flex flex-col';

    chatManager.chats.forEach(chat => {
      const currentUser = userManager.getCurrentUser();
      const otherUser = userManager.getUserById(
        chat.participants.find(id => id !== currentUser.id)
      );

      if (!otherUser) return;

      const chatItem = document.createElement('div');
      chatItem.className = 'flex items-center px-4 py-3 hover:bg-[#202c33] cursor-pointer border-b border-[#3b4a54]/30';

      // Avatar
      const avatar = document.createElement('img');
      avatar.src = otherUser.avatar;
      avatar.className = 'w-12 h-12 rounded-full object-cover';

      // Content
      const content = document.createElement('div');
      content.className = 'ml-3 flex-1 min-w-0';

      const topRow = document.createElement('div');
      topRow.className = 'flex justify-between items-center';

      const name = document.createElement('div');
      name.className = 'text-white font-medium truncate';
      name.textContent = otherUser.name;

      const time = document.createElement('div');
      time.className = 'text-[#8696a0] text-xs';
      time.textContent = chatManager.formatMessageTime(chat.lastMessageTime);

      topRow.appendChild(name);
      topRow.appendChild(time);

      const bottomRow = document.createElement('div');
      bottomRow.className = 'flex justify-between items-center mt-1';

      const lastMessage = document.createElement('div');
      lastMessage.className = 'text-[#8696a0] text-sm truncate';
      lastMessage.textContent = chat.lastMessage || 'Aucun message';

      bottomRow.appendChild(lastMessage);

      if (chat.unreadCount > 0) {
        const badge = document.createElement('div');
        badge.className = 'bg-[#00a884] text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center';
        badge.textContent = chat.unreadCount;
        bottomRow.appendChild(badge);
      }

      content.appendChild(topRow);
      content.appendChild(bottomRow);

      chatItem.appendChild(avatar);
      chatItem.appendChild(content);

      chatItem.addEventListener('click', () => {
        this.currentChat = chat;
        this.showMainApp();
      });

      container.appendChild(chatItem);
    });

    return container;
  }

  createStatusList() {
    const container = document.createElement('div');
    container.className = 'flex flex-col';

    // My Status section
    const myStatusSection = document.createElement('div');
    myStatusSection.className = 'px-4 py-3 border-b border-[#3b4a54]';

    const myStatusTitle = document.createElement('div');
    myStatusTitle.className = 'text-[#8696a0] text-sm mb-3';
    myStatusTitle.textContent = 'Mon statut';

    const myStatusItem = document.createElement('div');
    myStatusItem.className = 'flex items-center cursor-pointer hover:bg-[#202c33] p-2 rounded-lg';

    const currentUser = userManager.getCurrentUser();
    const myAvatar = document.createElement('div');
    myAvatar.className = 'relative';

    const avatarImg = document.createElement('img');
    avatarImg.src = currentUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=00a884&color=fff';
    avatarImg.className = 'w-12 h-12 rounded-full object-cover';

    const addIcon = document.createElement('div');
    addIcon.className = 'absolute -bottom-1 -right-1 w-6 h-6 bg-[#00a884] rounded-full flex items-center justify-center border-2 border-[#111b21]';
    addIcon.innerHTML = '<i class="fas fa-plus text-white text-xs"></i>';

    myAvatar.appendChild(avatarImg);
    myAvatar.appendChild(addIcon);

    const myStatusText = document.createElement('div');
    myStatusText.className = 'ml-3';

    const myStatusName = document.createElement('div');
    myStatusName.className = 'text-white font-medium';
    myStatusName.textContent = 'Mon statut';

    const myStatusDesc = document.createElement('div');
    myStatusDesc.className = 'text-[#8696a0] text-sm';
    myStatusDesc.textContent = 'Appuyez pour ajouter une mise à jour de statut';

    myStatusText.appendChild(myStatusName);
    myStatusText.appendChild(myStatusDesc);

    myStatusItem.appendChild(myAvatar);
    myStatusItem.appendChild(myStatusText);

    myStatusItem.addEventListener('click', () => {
      const creator = statusManager.createStoryCreator(async (content, type, backgroundColor) => {
        await statusManager.createStory(content, type, backgroundColor);
        this.showMainApp();
      });
      document.body.appendChild(creator);
    });

    myStatusSection.appendChild(myStatusTitle);
    myStatusSection.appendChild(myStatusItem);

    // Recent updates
    const recentSection = document.createElement('div');
    recentSection.className = 'px-4 py-3';

    const recentTitle = document.createElement('div');
    recentTitle.className = 'text-[#8696a0] text-sm mb-3';
    recentTitle.textContent = 'Mises à jour récentes';

    recentSection.appendChild(recentTitle);

    // Group stories by user
    const userStories = new Map();
    statusManager.stories.forEach(story => {
      if (!userStories.has(story.userId)) {
        userStories.set(story.userId, []);
      }
      userStories.get(story.userId).push(story);
    });

    userStories.forEach((stories, userId) => {
      const user = userManager.getUserById(userId);
      const currentUser = userManager.getCurrentUser();
      
      if (userId !== currentUser.id && user) {
        const statusItem = document.createElement('div');
        statusItem.className = 'flex items-center cursor-pointer hover:bg-[#202c33] p-2 rounded-lg mb-2';

        const statusAvatar = document.createElement('div');
        statusAvatar.className = 'relative';

        const hasViewed = stories.every(story => story.views.includes(currentUser.id));
        const ringClass = hasViewed ? 'border-[#8696a0]' : 'border-[#00a884]';

        const userAvatarImg = document.createElement('img');
        userAvatarImg.src = user.avatar;
        userAvatarImg.className = `w-12 h-12 rounded-full object-cover border-2 ${ringClass}`;

        statusAvatar.appendChild(userAvatarImg);

        const statusInfo = document.createElement('div');
        statusInfo.className = 'ml-3 flex-1';

        const statusName = document.createElement('div');
        statusName.className = 'text-white font-medium';
        statusName.textContent = user.name;

        const statusTime = document.createElement('div');
        statusTime.className = 'text-[#8696a0] text-sm';
        statusTime.textContent = statusManager.formatStoryTime(stories[0].timestamp);

        statusInfo.appendChild(statusName);
        statusInfo.appendChild(statusTime);

        statusItem.appendChild(statusAvatar);
        statusItem.appendChild(statusInfo);

        statusItem.addEventListener('click', () => {
          const storyViewer = statusManager.createStoryViewer(stories[0]);
          document.body.appendChild(storyViewer);
        });

        recentSection.appendChild(statusItem);
      }
    });

    container.appendChild(myStatusSection);
    container.appendChild(recentSection);

    return container;
  }

  createCallsList() {
    const container = document.createElement('div');
    container.className = 'flex flex-col';

    callsManager.calls.forEach(call => {
      const currentUser = userManager.getCurrentUser();
      const otherUser = userManager.getUserById(
        call.participants.find(id => id !== currentUser.id)
      );

      if (!otherUser) return;

      const callItem = document.createElement('div');
      callItem.className = 'flex items-center px-4 py-3 hover:bg-[#202c33] cursor-pointer border-b border-[#3b4a54]/30';

      // Avatar
      const avatar = document.createElement('img');
      avatar.src = otherUser.avatar;
      avatar.className = 'w-12 h-12 rounded-full object-cover';

      // Content
      const content = document.createElement('div');
      content.className = 'ml-3 flex-1';

      const topRow = document.createElement('div');
      topRow.className = 'flex justify-between items-center';

      const nameContainer = document.createElement('div');
      nameContainer.className = 'flex items-center gap-2';

      const name = document.createElement('div');
      name.className = 'text-white font-medium';
      name.textContent = otherUser.name;

      const callTypeIcon = document.createElement('i');
      callTypeIcon.className = `fas ${call.type === 'video' ? 'fa-video' : 'fa-phone'} text-[#8696a0] text-sm`;

      nameContainer.appendChild(name);
      nameContainer.appendChild(callTypeIcon);

      const time = document.createElement('div');
      time.className = 'text-[#8696a0] text-xs';
      time.textContent = callsManager.formatCallTime(call.timestamp);

      topRow.appendChild(nameContainer);
      topRow.appendChild(time);

      const bottomRow = document.createElement('div');
      bottomRow.className = 'flex justify-between items-center mt-1';

      const statusContainer = document.createElement('div');
      statusContainer.className = 'flex items-center gap-2';

      const statusIcon = document.createElement('i');
      const statusText = document.createElement('span');
      statusText.className = 'text-sm';

      switch (call.status) {
        case 'completed':
          statusIcon.className = 'fas fa-phone text-green-500 text-sm';
          statusText.className += ' text-[#8696a0]';
          statusText.textContent = call.duration > 0 ? callsManager.formatCallDuration(call.duration) : 'Terminé';
          break;
        case 'missed':
          statusIcon.className = 'fas fa-phone text-red-500 text-sm';
          statusText.className += ' text-red-400';
          statusText.textContent = 'Manqué';
          break;
        case 'declined':
          statusIcon.className = 'fas fa-phone-slash text-red-500 text-sm';
          statusText.className += ' text-red-400';
          statusText.textContent = 'Refusé';
          break;
      }

      statusContainer.appendChild(statusIcon);
      statusContainer.appendChild(statusText);

      const callButton = document.createElement('button');
      callButton.className = 'p-2 hover:bg-[#3b4a54] rounded-full transition-colors';
      callButton.innerHTML = `<i class="fas ${call.type === 'video' ? 'fa-video' : 'fa-phone'} text-[#00a884]"></i>`;

      callButton.addEventListener('click', (e) => {
        e.stopPropagation();
        callsManager.startCall(call.type, otherUser);
      });

      bottomRow.appendChild(statusContainer);
      bottomRow.appendChild(callButton);

      content.appendChild(topRow);
      content.appendChild(bottomRow);

      callItem.appendChild(avatar);
      callItem.appendChild(content);

      container.appendChild(callItem);
    });

    if (callsManager.calls.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'flex flex-col items-center justify-center h-64 text-[#8696a0]';
      emptyState.innerHTML = `
        <i class="fas fa-phone text-4xl mb-4"></i>
        <p>Aucun appel récent</p>
      `;
      container.appendChild(emptyState);
    }

    return container;
  }

  createChannelsList() {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center justify-center h-64 text-[#8696a0]';
    container.innerHTML = `
      <i class="fas fa-bullhorn text-4xl mb-4"></i>
      <p class="text-center mb-4">Aucune chaîne disponible</p>
      <button class="px-4 py-2 bg-[#00a884] text-white rounded-lg hover:bg-[#00a884]/80 transition-colors">
        Créer une chaîne
      </button>
    `;
    return container;
  }

  createCommunitiesList() {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center justify-center h-64 text-[#8696a0]';
    container.innerHTML = `
      <i class="fas fa-users text-4xl mb-4"></i>
      <p class="text-center mb-4">Aucune communauté disponible</p>
      <button class="px-4 py-2 bg-[#00a884] text-white rounded-lg hover:bg-[#00a884]/80 transition-colors">
        Créer une communauté
      </button>
    `;
    return container;
  }

  createSettingsList() {
    const container = document.createElement('div');
    container.className = 'flex flex-col p-4';

    const currentUser = userManager.getCurrentUser();

    // Profile section
    const profileSection = document.createElement('div');
    profileSection.className = 'flex items-center p-4 hover:bg-[#202c33] cursor-pointer rounded-lg mb-4';

    const profileAvatar = document.createElement('img');
    profileAvatar.src = currentUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=00a884&color=fff';
    profileAvatar.className = 'w-16 h-16 rounded-full object-cover';

    const profileInfo = document.createElement('div');
    profileInfo.className = 'ml-4 flex-1';

    const profileName = document.createElement('div');
    profileName.className = 'text-white font-medium text-lg';
    profileName.textContent = currentUser?.name || 'Utilisateur';

    const profileStatus = document.createElement('div');
    profileStatus.className = 'text-[#8696a0] text-sm';
    profileStatus.textContent = currentUser?.status || 'Disponible';

    profileInfo.appendChild(profileName);
    profileInfo.appendChild(profileStatus);

    profileSection.appendChild(profileAvatar);
    profileSection.appendChild(profileInfo);

    // Settings items
    const settingsItems = [
      { icon: 'fa-key', label: 'Compte', desc: 'Confidentialité, sécurité, changer le numéro' },
      { icon: 'fa-comments', label: 'Discussions', desc: 'Thème, fonds d\'écran, historique des discussions' },
      { icon: 'fa-bell', label: 'Notifications', desc: 'Sons des messages, groupes et appels' },
      { icon: 'fa-database', label: 'Stockage et données', desc: 'Utilisation du réseau, téléchargement automatique' },
      { icon: 'fa-question-circle', label: 'Aide', desc: 'Centre d\'aide, nous contacter, politique de confidentialité' },
    ];

    settingsItems.forEach(item => {
      const settingItem = document.createElement('div');
      settingItem.className = 'flex items-center p-4 hover:bg-[#202c33] cursor-pointer rounded-lg';

      const iconContainer = document.createElement('div');
      iconContainer.className = 'w-12 h-12 bg-[#3b4a54] rounded-full flex items-center justify-center';
      iconContainer.innerHTML = `<i class="fas ${item.icon} text-[#8696a0]"></i>`;

      const itemInfo = document.createElement('div');
      itemInfo.className = 'ml-4 flex-1';

      const itemLabel = document.createElement('div');
      itemLabel.className = 'text-white font-medium';
      itemLabel.textContent = item.label;

      const itemDesc = document.createElement('div');
      itemDesc.className = 'text-[#8696a0] text-sm';
      itemDesc.textContent = item.desc;

      itemInfo.appendChild(itemLabel);
      itemInfo.appendChild(itemDesc);

      settingItem.appendChild(iconContainer);
      settingItem.appendChild(itemInfo);

      container.appendChild(settingItem);
    });

    // Logout button
    const logoutButton = document.createElement('button');
    logoutButton.className = 'flex items-center p-4 hover:bg-[#202c33] cursor-pointer rounded-lg text-red-400 hover:text-red-300 transition-colors mt-4';
    logoutButton.innerHTML = `
      <div class="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
        <i class="fas fa-sign-out-alt text-red-400"></i>
      </div>
      <span class="ml-4 font-medium">Déconnexion</span>
    `;
    logoutButton.addEventListener('click', () => {
      authManager.logout();
    });

    const finalContainer = document.createElement('div');
    finalContainer.appendChild(profileSection);
    finalContainer.appendChild(container);
    finalContainer.appendChild(logoutButton);

    return finalContainer;
  }

  createMainContent() {
    const mainContent = document.createElement('div');
    mainContent.className = 'flex-1 bg-[#0a1733] h-screen flex flex-col items-center justify-center relative';

    if (this.currentChat) {
      // Show chat view with proper styling
      const chatView = chatManager.createChatView(this.currentChat);
      mainContent.className = 'flex-1 bg-[#0a1733] h-screen flex flex-col';
      mainContent.innerHTML = '';
      
      // Apply WhatsApp Web chat styling
      chatView.className = 'flex-1 bg-[#0a1733] h-screen flex flex-col';
      mainContent.appendChild(chatView);
    } else {
      // Show welcome screen
      const welcomeContainer = document.createElement('div');
      welcomeContainer.className = 'text-center max-w-md';

      // Illustration
      const illustration = document.createElement('div');
      illustration.className = 'mb-8';
      illustration.innerHTML = `
        <svg width="320" height="200" viewBox="0 0 320 200" class="opacity-80">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#00a884;stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:#00a884;stop-opacity:0.1" />
            </linearGradient>
          </defs>
          <rect x="50" y="40" width="180" height="120" rx="20" fill="url(#grad1)" stroke="#00a884" stroke-width="2"/>
          <circle cx="280" cy="60" r="25" fill="#00a884" opacity="0.6"/>
          <rect x="240" y="100" width="60" height="40" rx="10" fill="#00a884" opacity="0.4"/>
          <path d="M140 80 L140 120 L180 100 Z" fill="#00a884"/>
        </svg>
      `;

      const title = document.createElement('h1');
      title.className = 'text-[#e9edef] text-3xl font-light mb-4';
      title.textContent = 'WhatsApp Web';

      const description = document.createElement('p');
      description.className = 'text-[#8696a0] text-sm leading-relaxed mb-8';
      description.textContent = 'Envoyez et recevez des messages sans avoir à garder votre téléphone connecté. Utilisez WhatsApp sur un maximum de 4 appareils et 1 téléphone, simultanément.';

      welcomeContainer.appendChild(illustration);
      welcomeContainer.appendChild(title);
      welcomeContainer.appendChild(description);

      // Footer
      const footer = document.createElement('div');
      footer.className = 'absolute bottom-8 flex items-center gap-2 text-[#8696a0] text-xs';
      footer.innerHTML = '<i class="fas fa-lock"></i> Vos messages personnels sont chiffrés de bout en bout';

      mainContent.appendChild(welcomeContainer);
      mainContent.appendChild(footer);
    }

    return mainContent;
  }

  getViewTitle() {
    switch (this.currentView) {
      case 'chats': return 'Discussions';
      case 'status': return 'Statuts';
      case 'calls': return 'Appels';
      case 'channels': return 'Chaînes';
      case 'communities': return 'Communautés';
      case 'settings': return 'Paramètres';
      case 'profile': return 'Profil';
      default: return 'Discussions';
    }
  }

  showChatView(chat) {
    this.currentChat = chat;
    this.showMainApp();
  }

  showMainApp() {
    this.app.innerHTML = '';
    
    const container = document.createElement('div');
    container.className = 'flex h-screen w-full bg-[#0a1733]';

    // Left sidebar with icons
    const leftSidebar = this.createLeftSidebar();
    
    // Discussions panel
    const discussionsPanel = this.createDiscussionsPanel();
    
    // Main content area
    const mainContent = this.createMainContent();

    container.appendChild(leftSidebar);
    container.appendChild(discussionsPanel);
    container.appendChild(mainContent);

    this.app.appendChild(container);
  }
}

// Initialize the app
const app = new WhatsAppClone();
app.init();