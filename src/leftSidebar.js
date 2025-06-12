import authManager from './auth.js';
import userManager from './user.js';

export function createLeftSidebar() {

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

// Toujours utiliser ton image personnalisée du dossier assets
const avatarImg = document.createElement('img');
avatarImg.src = '/src/assets/zeynab.jpg'; // Mets ici le chemin relatif depuis "public" ou la racine du projet selon ton serveur
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
