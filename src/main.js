import './style.css';
import authManager from './auth.js';
import userManager from './user.js';
import chatManager from './chat.js';
import statusManager from './status.js';
import callsManager from './calls.js';
import { createLeftSidebar } from './leftSidebar.js';
import { createDiscussionsPanel } from './discussionsPanel.js';
import { createMainContent } from './mainContent.js';
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
    } }
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

    // Toujours utiliser l'image personnalisée du dossier assets
    const myAvatar = document.createElement('div');
    myAvatar.className = 'relative';

    const avatarImg = document.createElement('img');
    avatarImg.src = 'https://img.freepik.com/photos-gratuite/portrait-jeune-femme-musulmane-portant-hijab-regardant-camera_1157-49747.jpg?ga=GA1.1.187790430.1741859635&semt=ais_hybrid&w=740';
    avatarImg.alt = 'Profil';
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
 createSettingsList() {
    const container = document.createElement('div');
    container.className = 'flex flex-col p-4';

    const currentUser = userManager.getCurrentUser();

    // Profile section
    const profileSection = document.createElement('div');
    profileSection.className = 'flex items-center p-4 hover:bg-[#202c33] cursor-pointer rounded-lg mb-4';

    // Utilise toujours l'image personnalisée du dossier assets
    const profileAvatar = document.createElement('img');
    profileAvatar.src = '/src/assets/zeynab.jpg';
    profileAvatar.alt = 'Profil';
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
    const leftSidebar = createLeftSidebar.call(this);
    const discussionsPanel = createDiscussionsPanel.call(this);
    const mainContent = createMainContent.call(this);

    container.appendChild(leftSidebar);
    container.appendChild(discussionsPanel);
    container.appendChild(mainContent);

    this.app.appendChild(container);
  }
}

const app = new WhatsAppClone();
app.init();