import apiService from './api.js';
import userManager from './user.js';

class StatusManager {
  constructor() {
    this.stories = [];
  }

  async init() {
    try {
      this.stories = await apiService.getStories();
    } catch (error) {
      console.error('Failed to initialize stories:', error);
    }
  }

  async createStory(content, type, backgroundColor = null) {
    const currentUser = userManager.getCurrentUser();
    const story = {
      userId: currentUser.id,
      content,
      type,
      backgroundColor
    };

    try {
      const newStory = await apiService.createStory(story);
      this.stories.unshift(newStory);
      return newStory;
    } catch (error) {
      console.error('Failed to create story:', error);
    }
  }

  async viewStory(storyId) {
    const currentUser = userManager.getCurrentUser();
    try {
      await apiService.viewStory(storyId, currentUser.id);
    } catch (error) {
      console.error('Failed to view story:', error);
    }
  }

  createStoryRing(user, hasStory = false, isViewed = false) {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center space-y-2 cursor-pointer';

    const avatarContainer = document.createElement('div');
    avatarContainer.className = hasStory 
      ? `status-ring ${isViewed ? 'opacity-50' : ''}` 
      : 'p-1';

    const avatar = document.createElement('img');
    avatar.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=25D366&color=fff`;
    avatar.className = 'w-14 h-14 rounded-full object-cover';

    const name = document.createElement('span');
    name.className = 'text-xs text-gray-600 dark:text-gray-300 max-w-[60px] truncate';
    name.textContent = user.name;

    avatarContainer.appendChild(avatar);
    container.appendChild(avatarContainer);
    container.appendChild(name);

    return container;
  }

  createAddStoryButton(onClick) {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center space-y-2 cursor-pointer';

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'relative';

    const avatar = document.createElement('div');
    avatar.className = 'w-14 h-14 rounded-full bg-gray-200 dark:bg-wa-dark-300 flex items-center justify-center';

    const icon = document.createElement('i');
    icon.className = 'fas fa-plus text-gray-500 dark:text-gray-400';

    const addButton = document.createElement('div');
    addButton.className = 'absolute -bottom-1 -right-1 w-6 h-6 bg-whatsapp-500 rounded-full flex items-center justify-center';

    const addIcon = document.createElement('i');
    addIcon.className = 'fas fa-plus text-white text-xs';

    const label = document.createElement('span');
    label.className = 'text-xs text-gray-600 dark:text-gray-300';
    label.textContent = 'My Status';

    avatar.appendChild(icon);
    addButton.appendChild(addIcon);
    buttonContainer.appendChild(avatar);
    buttonContainer.appendChild(addButton);
    container.appendChild(buttonContainer);
    container.appendChild(label);

    container.addEventListener('click', onClick);

    return container;
  }

  createStoryViewer(story) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black z-50 flex items-center justify-center';

    const container = document.createElement('div');
    container.className = 'relative w-full h-full max-w-md mx-auto';

    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'absolute top-4 left-4 right-4 h-1 bg-white/30 rounded-full z-10';

    const progress = document.createElement('div');
    progress.className = 'h-full bg-white rounded-full transition-all duration-1000 ease-linear';
    progress.style.width = '0%';

    progressBar.appendChild(progress);

    // Header
    const header = document.createElement('div');
    header.className = 'absolute top-8 left-4 right-4 flex items-center justify-between z-10 text-white';

    const userInfo = document.createElement('div');
    userInfo.className = 'flex items-center space-x-3';

    const user = userManager.getUserById(story.userId);
    const avatar = document.createElement('img');
    avatar.src = user.avatar;
    avatar.className = 'w-8 h-8 rounded-full';

    const name = document.createElement('span');
    name.className = 'font-semibold';
    name.textContent = user.name;

    const time = document.createElement('span');
    time.className = 'text-sm opacity-70';
    time.textContent = this.formatStoryTime(story.timestamp);

    userInfo.appendChild(avatar);
    userInfo.appendChild(name);
    userInfo.appendChild(time);

    const closeButton = document.createElement('button');
    closeButton.className = 'text-white hover:text-gray-300';
    closeButton.innerHTML = '<i class="fas fa-times text-xl"></i>';

    header.appendChild(userInfo);
    header.appendChild(closeButton);

    // Content
    const content = document.createElement('div');
    content.className = 'w-full h-full flex items-center justify-center';

    if (story.type === 'image') {
      const img = document.createElement('img');
      img.src = story.content;
      img.className = 'max-w-full max-h-full object-contain';
      content.appendChild(img);
    } else if (story.type === 'text') {
      content.style.backgroundColor = story.backgroundColor || '#FF6B6B';
      const text = document.createElement('div');
      text.className = 'text-white text-2xl font-bold text-center p-8';
      text.textContent = story.content;
      content.appendChild(text);
    }

    // Controls
    const prevButton = document.createElement('button');
    prevButton.className = 'absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white';
    prevButton.innerHTML = '<i class="fas fa-chevron-left text-2xl"></i>';

    const nextButton = document.createElement('button');
    nextButton.className = 'absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white';
    nextButton.innerHTML = '<i class="fas fa-chevron-right text-2xl"></i>';

    container.appendChild(progressBar);
    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(prevButton);
    container.appendChild(nextButton);

    overlay.appendChild(container);

    // Auto-close after 5 seconds
    setTimeout(() => {
      progress.style.width = '100%';
    }, 100);

    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, 5000);

    closeButton.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    // Mark as viewed
    this.viewStory(story.id);

    return overlay;
  }

  createStoryCreator(onCreateStory) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4';

    const container = document.createElement('div');
    container.className = 'bg-white dark:bg-wa-dark-100 rounded-lg p-6 w-full max-w-md';

    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-4';

    const title = document.createElement('h3');
    title.className = 'text-lg font-semibold text-gray-900 dark:text-gray-100';
    title.textContent = 'Create Status';

    const closeButton = document.createElement('button');
    closeButton.className = 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';

    header.appendChild(title);
    header.appendChild(closeButton);

    const form = document.createElement('form');
    form.className = 'space-y-4';

    const textArea = document.createElement('textarea');
    textArea.placeholder = 'What\'s on your mind?';
    textArea.className = 'w-full h-32 p-3 border border-gray-300 dark:border-wa-dark-300 rounded-lg resize-none bg-white dark:bg-wa-dark-200 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-whatsapp-500';

    const colorPicker = document.createElement('div');
    colorPicker.className = 'flex space-x-2';

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
    let selectedColor = colors[0];

    colors.forEach(color => {
      const colorButton = document.createElement('button');
      colorButton.type = 'button';
      colorButton.className = 'w-8 h-8 rounded-full border-2 border-white shadow-md';
      colorButton.style.backgroundColor = color;
      
      if (color === selectedColor) {
        colorButton.classList.add('ring-2', 'ring-whatsapp-500');
      }

      colorButton.addEventListener('click', () => {
        document.querySelectorAll('.color-picker button').forEach(btn => {
          btn.classList.remove('ring-2', 'ring-whatsapp-500');
        });
        colorButton.classList.add('ring-2', 'ring-whatsapp-500');
        selectedColor = color;
      });

      colorPicker.appendChild(colorButton);
    });

    colorPicker.className += ' color-picker';

    const buttons = document.createElement('div');
    buttons.className = 'flex space-x-3 justify-end';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200';
    cancelButton.textContent = 'Cancel';

    const postButton = document.createElement('button');
    postButton.type = 'submit';
    postButton.className = 'px-6 py-2 bg-whatsapp-500 hover:bg-whatsapp-600 text-white rounded-lg font-semibold';
    postButton.textContent = 'Post';

    buttons.appendChild(cancelButton);
    buttons.appendChild(postButton);

    form.appendChild(textArea);
    form.appendChild(colorPicker);
    form.appendChild(buttons);

    container.appendChild(header);
    container.appendChild(form);

    overlay.appendChild(container);

    // Event handlers
    const closeModal = () => {
      document.body.removeChild(overlay);
    };

    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const content = textArea.value.trim();
      
      if (content) {
        await onCreateStory(content, 'text', selectedColor);
        closeModal();
      }
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });

    return overlay;
  }

  formatStoryTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'now';
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  }

  createStatusView() {
    const container = document.createElement('div');
    container.className = 'bg-white dark:bg-wa-dark-100 h-full';

    const header = document.createElement('div');
    header.className = 'p-4 border-b border-gray-200 dark:border-wa-dark-300';

    const title = document.createElement('h2');
    title.className = 'text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4';
    title.textContent = 'Status';

    const myStatusSection = document.createElement('div');
    myStatusSection.className = 'mb-4';

    const myStatusTitle = document.createElement('h3');
    myStatusTitle.className = 'text-sm font-medium text-gray-500 dark:text-gray-400 mb-2';
    myStatusTitle.textContent = 'My Status';

    const statusRings = document.createElement('div');
    statusRings.className = 'flex space-x-4 overflow-x-auto pb-2';

    // Add "My Status" button
    const addButton = this.createAddStoryButton(() => {
      const creator = this.createStoryCreator(async (content, type, backgroundColor) => {
        await this.createStory(content, type, backgroundColor);
        this.refreshStatusView(container);
      });
      document.body.appendChild(creator);
    });

    statusRings.appendChild(addButton);

    myStatusSection.appendChild(myStatusTitle);
    myStatusSection.appendChild(statusRings);

    const recentSection = document.createElement('div');
    const recentTitle = document.createElement('h3');
    recentTitle.className = 'text-sm font-medium text-gray-500 dark:text-gray-400 mb-2';
    recentTitle.textContent = 'Recent Updates';

    const recentRings = document.createElement('div');
    recentRings.className = 'flex space-x-4 overflow-x-auto pb-2';

    // Group stories by user
    const userStories = new Map();
    this.stories.forEach(story => {
      if (!userStories.has(story.userId)) {
        userStories.set(story.userId, []);
      }
      userStories.get(story.userId).push(story);
    });

    // Create story rings for each user
    userStories.forEach((stories, userId) => {
      const user = userManager.getUserById(userId);
      const currentUser = userManager.getCurrentUser();
      
      if (userId !== currentUser.id) {
        const hasViewed = stories.every(story => story.views.includes(currentUser.id));
        const ring = this.createStoryRing(user, true, hasViewed);
        
        ring.addEventListener('click', () => {
          const storyViewer = this.createStoryViewer(stories[0]);
          document.body.appendChild(storyViewer);
        });
        
        recentRings.appendChild(ring);
      }
    });

    if (recentRings.children.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'text-center text-gray-500 dark:text-gray-400 py-8';
      emptyState.textContent = 'No recent updates';
      recentSection.appendChild(emptyState);
    } else {
      recentSection.appendChild(recentTitle);
      recentSection.appendChild(recentRings);
    }

    header.appendChild(title);
    header.appendChild(myStatusSection);
    header.appendChild(recentSection);

    container.appendChild(header);

    return container;
  }

  refreshStatusView(container) {
    const newView = this.createStatusView();
    container.replaceWith(newView);
  }
}

export default new StatusManager();