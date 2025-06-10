import apiService from './api.js';

class UserManager {
  constructor() {
    this.users = [];
    this.currentUser = null;
  }

  async init() {
    try {
      this.users = await apiService.getUsers();
      this.currentUser = apiService.getCurrentUser();
    } catch (error) {
      console.error('Failed to initialize users:', error);
    }
  }

  getUsers() {
    return this.users;
  }

  getUserById(id) {
    return this.users.find(user => user.id === id);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  formatLastSeen(lastSeen) {
    if (!lastSeen) return 'Never';
    
    const date = new Date(lastSeen);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  }

  createUserAvatar(user, size = 'md') {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24'
    };

    const container = document.createElement('div');
    container.className = 'relative flex-shrink-0';

    const avatar = document.createElement('img');
    avatar.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=25D366&color=fff`;
    avatar.alt = user.name;
    avatar.className = `${sizeClasses[size]} rounded-full object-cover`;

    // Online indicator
    if (user.isOnline) {
      const onlineIndicator = document.createElement('div');
      onlineIndicator.className = 'absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-wa-dark-100 rounded-full';
      container.appendChild(onlineIndicator);
    }

    container.appendChild(avatar);
    return container;
  }

  createUserCard(user, onClick = null) {
    const card = document.createElement('div');
    card.className = 'flex items-center p-4 hover:bg-gray-50 dark:hover:bg-wa-dark-200 cursor-pointer transition-colors';

    if (onClick) {
      card.addEventListener('click', () => onClick(user));
    }

    const avatar = this.createUserAvatar(user);
    
    const content = document.createElement('div');
    content.className = 'ml-3 flex-1 min-w-0';

    const name = document.createElement('div');
    name.className = 'font-semibold text-gray-900 dark:text-gray-100 truncate';
    name.textContent = user.name;

    const status = document.createElement('div');
    status.className = 'text-sm text-gray-500 dark:text-gray-400 truncate';
    
    if (user.isOnline) {
      status.textContent = 'Online';
      status.className += ' text-green-600 dark:text-green-400';
    } else {
      status.textContent = `Last seen ${this.formatLastSeen(user.lastSeen)}`;
    }

    content.appendChild(name);
    content.appendChild(status);

    card.appendChild(avatar);
    card.appendChild(content);

    return card;
  }

  createContactsList(onUserSelect) {
    const container = document.createElement('div');
    container.className = 'bg-white dark:bg-wa-dark-100 h-full';

    const header = document.createElement('div');
    header.className = 'p-4 border-b border-gray-200 dark:border-wa-dark-300';

    const title = document.createElement('h2');
    title.className = 'text-lg font-semibold text-gray-900 dark:text-gray-100';
    title.textContent = 'Contacts';

    const searchContainer = document.createElement('div');
    searchContainer.className = 'mt-3 relative';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search contacts...';
    searchInput.className = 'w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-wa-dark-300 rounded-full bg-gray-50 dark:bg-wa-dark-200 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-whatsapp-500';

    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400';

    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchInput);

    header.appendChild(title);
    header.appendChild(searchContainer);

    const contactsList = document.createElement('div');
    contactsList.className = 'overflow-y-auto flex-1';

    const renderContacts = (searchTerm = '') => {
      contactsList.innerHTML = '';
      
      const filteredUsers = this.users.filter(user => 
        user.id !== this.currentUser?.id &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredUsers.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'p-8 text-center text-gray-500 dark:text-gray-400';
        emptyState.textContent = searchTerm ? 'No contacts found' : 'No contacts available';
        contactsList.appendChild(emptyState);
        return;
      }

      filteredUsers.forEach(user => {
        const userCard = this.createUserCard(user, onUserSelect);
        contactsList.appendChild(userCard);
      });
    };

    searchInput.addEventListener('input', (e) => {
      renderContacts(e.target.value);
    });

    renderContacts();

    container.appendChild(header);
    container.appendChild(contactsList);

    return container;
  }
}

export default new UserManager();