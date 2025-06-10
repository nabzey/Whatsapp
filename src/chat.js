import apiService from './api.js';
import userManager from './user.js';

class ChatManager {
  constructor() {
    this.chats = [];
    this.messages = [];
    this.currentChat = null;
    this.messageSubscribers = [];
  }

  async init() {
    try {
      this.chats = await apiService.getChats();
    } catch (error) {
      console.error('Failed to initialize chats:', error);
    }
  }

  async loadMessages(chatId) {
    try {
      this.messages = await apiService.getMessages(chatId);
      this.notifyMessageSubscribers();
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }

  async sendMessage(content, type = 'text') {
    if (!this.currentChat) return;

    const currentUser = userManager.getCurrentUser();
    const message = {
      chatId: this.currentChat.id,
      senderId: currentUser.id,
      content,
      type
    };

    try {
      const newMessage = await apiService.sendMessage(message);
      this.messages.push(newMessage);
      this.notifyMessageSubscribers();
      return newMessage;
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  subscribeToMessages(callback) {
    this.messageSubscribers.push(callback);
  }

  notifyMessageSubscribers() {
    this.messageSubscribers.forEach(callback => callback(this.messages));
  }

  formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (messageDate.getTime() === today.getTime() - 86400000) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }

  createMessageBubble(message) {
    const currentUser = userManager.getCurrentUser();
    const isOwn = message.senderId === currentUser.id;
    const sender = userManager.getUserById(message.senderId);

    const container = document.createElement('div');
    container.className = `flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`;

    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${isOwn ? 'message-sent' : 'message-received'}`;

    const content = document.createElement('div');
    content.className = 'mb-1';

    if (message.type === 'text') {
      content.textContent = message.content;
    } else if (message.type === 'image') {
      const img = document.createElement('img');
      img.src = message.content;
      img.className = 'max-w-full rounded-lg';
      img.alt = 'Shared image';
      content.appendChild(img);
    }

    const meta = document.createElement('div');
    meta.className = `flex items-center justify-end text-xs ${isOwn ? 'text-white/70' : 'text-gray-500'} mt-1`;

    const time = document.createElement('span');
    time.textContent = this.formatMessageTime(message.timestamp);

    meta.appendChild(time);

    if (isOwn) {
      const statusIcon = document.createElement('i');
      statusIcon.className = 'fas fa-check ml-1';
      
      if (message.status === 'read') {
        statusIcon.className = 'fas fa-check-double ml-1 text-blue-300';
      } else if (message.status === 'delivered') {
        statusIcon.className = 'fas fa-check-double ml-1';
      }
      
      meta.appendChild(statusIcon);
    }

    bubble.appendChild(content);
    bubble.appendChild(meta);
    container.appendChild(bubble);

    return container;
  }

  createChatInput(onSend) {
    const container = document.createElement('div');
    container.className = 'p-4 bg-white dark:bg-wa-dark-100 border-t border-gray-200 dark:border-wa-dark-300';

    const inputContainer = document.createElement('div');
    inputContainer.className = 'flex items-center space-x-3';

    const emojiButton = document.createElement('button');
    emojiButton.className = 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200';
    emojiButton.innerHTML = '<i class="fas fa-smile text-xl"></i>';

    const attachButton = document.createElement('button');
    attachButton.className = 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200';
    attachButton.innerHTML = '<i class="fas fa-paperclip text-xl"></i>';

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'flex-1 relative';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type a message...';
    input.className = 'chat-input pr-12';

    const voiceButton = document.createElement('button');
    voiceButton.className = 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200';
    voiceButton.innerHTML = '<i class="fas fa-microphone text-lg"></i>';

    const sendButton = document.createElement('button');
    sendButton.className = 'w-12 h-12 bg-whatsapp-500 hover:bg-whatsapp-600 text-white rounded-full flex items-center justify-center transition-colors';
    sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';

    // Handle send
    const handleSend = () => {
      const content = input.value.trim();
      if (content) {
        onSend(content);
        input.value = '';
      }
    };

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSend();
      }
    });

    sendButton.addEventListener('click', handleSend);

    // Emoji picker simulation
    emojiButton.addEventListener('click', () => {
      const emojis = ['😀', '😂', '😍', '🤔', '👍', '❤️', '🎉', '🔥'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      input.value += randomEmoji;
      input.focus();
    });

    inputWrapper.appendChild(input);
    inputWrapper.appendChild(voiceButton);

    inputContainer.appendChild(emojiButton);
    inputContainer.appendChild(attachButton);
    inputContainer.appendChild(inputWrapper);
    inputContainer.appendChild(sendButton);

    container.appendChild(inputContainer);

    return container;
  }

  createChatHeader(chat) {
    const currentUser = userManager.getCurrentUser();
    const otherUser = userManager.getUserById(
      chat.participants.find(id => id !== currentUser.id)
    );

    const header = document.createElement('div');
    header.className = 'flex items-center p-4 bg-white dark:bg-wa-dark-100 border-b border-gray-200 dark:border-wa-dark-300';

    const backButton = document.createElement('button');
    backButton.className = 'mr-3 p-2 hover:bg-gray-100 dark:hover:bg-wa-dark-200 rounded-full transition-colors md:hidden';
    backButton.innerHTML = '<i class="fas fa-arrow-left text-gray-600 dark:text-gray-300"></i>';

    const avatar = userManager.createUserAvatar(otherUser);

    const info = document.createElement('div');
    info.className = 'ml-3 flex-1';

    const name = document.createElement('div');
    name.className = 'font-semibold text-gray-900 dark:text-gray-100';
    name.textContent = otherUser.name;

    const status = document.createElement('div');
    status.className = 'text-sm text-gray-500 dark:text-gray-400';
    status.textContent = otherUser.isOnline ? 'Online' : `Last seen ${userManager.formatLastSeen(otherUser.lastSeen)}`;

    info.appendChild(name);
    info.appendChild(status);

    const actions = document.createElement('div');
    actions.className = 'flex items-center space-x-2';

    const videoCallButton = document.createElement('button');
    videoCallButton.className = 'p-2 hover:bg-gray-100 dark:hover:bg-wa-dark-200 rounded-full transition-colors';
    videoCallButton.innerHTML = '<i class="fas fa-video text-gray-600 dark:text-gray-300"></i>';

    const voiceCallButton = document.createElement('button');
    voiceCallButton.className = 'p-2 hover:bg-gray-100 dark:hover:bg-wa-dark-200 rounded-full transition-colors';
    voiceCallButton.innerHTML = '<i class="fas fa-phone text-gray-600 dark:text-gray-300"></i>';

    const menuButton = document.createElement('button');
    menuButton.className = 'p-2 hover:bg-gray-100 dark:hover:bg-wa-dark-200 rounded-full transition-colors';
    menuButton.innerHTML = '<i class="fas fa-ellipsis-v text-gray-600 dark:text-gray-300"></i>';

    // Call functionality
    videoCallButton.addEventListener('click', () => this.startCall('video', otherUser));
    voiceCallButton.addEventListener('click', () => this.startCall('voice', otherUser));

    actions.appendChild(videoCallButton);
    actions.appendChild(voiceCallButton);
    actions.appendChild(menuButton);

    header.appendChild(backButton);
    header.appendChild(avatar);
    header.appendChild(info);
    header.appendChild(actions);

    return header;
  }

  startCall(type, user) {
    // Create call overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50';

    const callContainer = document.createElement('div');
    callContainer.className = 'text-center text-white';

    const avatar = document.createElement('img');
    avatar.src = user.avatar;
    avatar.className = 'w-32 h-32 rounded-full mx-auto mb-6';

    const name = document.createElement('h2');
    name.className = 'text-2xl font-semibold mb-2';
    name.textContent = user.name;

    const status = document.createElement('p');
    status.className = 'text-gray-300 mb-8';
    status.textContent = type === 'video' ? 'Video calling...' : 'Calling...';

    const controls = document.createElement('div');
    controls.className = 'flex justify-center space-x-8';

    const endCallButton = document.createElement('button');
    endCallButton.className = 'call-button bg-red-500 hover:bg-red-600';
    endCallButton.innerHTML = '<i class="fas fa-phone-slash"></i>';

    if (type === 'video') {
      const muteButton = document.createElement('button');
      muteButton.className = 'call-button bg-gray-600 hover:bg-gray-700';
      muteButton.innerHTML = '<i class="fas fa-microphone"></i>';

      const videoButton = document.createElement('button');
      videoButton.className = 'call-button bg-gray-600 hover:bg-gray-700';
      videoButton.innerHTML = '<i class="fas fa-video"></i>';

      controls.appendChild(muteButton);
      controls.appendChild(videoButton);
    }

    controls.appendChild(endCallButton);

    callContainer.appendChild(avatar);
    callContainer.appendChild(name);
    callContainer.appendChild(status);
    callContainer.appendChild(controls);

    overlay.appendChild(callContainer);
    document.body.appendChild(overlay);

    // Simulate call end after 3 seconds
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 3000);

    endCallButton.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    // Record call in API
    apiService.createCall({
      participants: [userManager.getCurrentUser().id, user.id],
      type,
      status: 'completed',
      duration: Math.floor(Math.random() * 300)
    });
  }

  createChatView(chat) {
    this.currentChat = chat;
    this.loadMessages(chat.id);

    const container = document.createElement('div');
    container.className = 'flex flex-col h-full bg-gray-50 dark:bg-wa-dark-100';

    const header = this.createChatHeader(chat);
    
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'flex-1 overflow-y-auto p-4 space-y-2';

    const chatInput = this.createChatInput((content) => {
      this.sendMessage(content);
    });

    // Subscribe to message updates
    this.subscribeToMessages((messages) => {
      messagesContainer.innerHTML = '';
      messages.forEach(message => {
        const bubble = this.createMessageBubble(message);
        messagesContainer.appendChild(bubble);
      });
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });

    container.appendChild(header);
    container.appendChild(messagesContainer);
    container.appendChild(chatInput);

    return container;
  }

  createChatsList(onChatSelect) {
    const container = document.createElement('div');
    container.className = 'bg-white dark:bg-wa-dark-100 h-full';

    const header = document.createElement('div');
    header.className = 'p-4 border-b border-gray-200 dark:border-wa-dark-300';

    const title = document.createElement('h2');
    title.className = 'text-lg font-semibold text-gray-900 dark:text-gray-100';
    title.textContent = 'Chats';

    header.appendChild(title);

    const chatsList = document.createElement('div');
    chatsList.className = 'overflow-y-auto flex-1';

    // Render chats
    this.chats.forEach(chat => {
      const currentUser = userManager.getCurrentUser();
      const otherUserId = chat.participants.find(id => id !== currentUser.id);
      const otherUser = userManager.getUserById(otherUserId);

      if (!otherUser) {
        // Ne pas afficher ce chat si l'utilisateur n'existe pas
        return;
      }

      const chatItem = document.createElement('div');
      chatItem.className = 'flex items-center p-4 hover:bg-gray-50 dark:hover:bg-wa-dark-200 cursor-pointer border-b border-gray-100 dark:border-wa-dark-300';

      const avatar = userManager.createUserAvatar(otherUser);

      const content = document.createElement('div');
      content.className = 'ml-3 flex-1 min-w-0';

      const topRow = document.createElement('div');
      topRow.className = 'flex justify-between items-center';

      const name = document.createElement('div');
      name.className = 'font-semibold text-gray-900 dark:text-gray-100 truncate';
      name.textContent = otherUser.name;

      const time = document.createElement('div');
      time.className = 'text-xs text-gray-500 dark:text-gray-400';
      time.textContent = this.formatMessageTime(chat.lastMessageTime);

      topRow.appendChild(name);
      topRow.appendChild(time);

      const bottomRow = document.createElement('div');
      bottomRow.className = 'flex justify-between items-center mt-1';

      const lastMessage = document.createElement('div');
      lastMessage.className = 'text-sm text-gray-500 dark:text-gray-400 truncate';
      lastMessage.textContent = chat.lastMessage;

      bottomRow.appendChild(lastMessage);

      if (chat.unreadCount > 0) {
        const badge = document.createElement('div');
        badge.className = 'bg-whatsapp-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center';
        badge.textContent = chat.unreadCount;
        bottomRow.appendChild(badge);
      }

      content.appendChild(topRow);
      content.appendChild(bottomRow);

      chatItem.appendChild(avatar);
      chatItem.appendChild(content);

      chatItem.addEventListener('click', () => {
        onChatSelect(chat);
      });

      chatsList.appendChild(chatItem);
    });

    container.appendChild(header);
    container.appendChild(chatsList);

    return container;
  }
}

export default new ChatManager();