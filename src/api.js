const API_BASE = 'https://json-server-1-suy9.onrender.com/';

class ApiService {
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Users
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  // Authentication
  async login(username, password) {
    const users = await this.getUsers();
    const user = users.find(u => u.username === username);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    throw new Error('Invalid credentials');
  }

  async logout() {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  // Chats
  async getChats() {
    return this.request('/chats');
  }

  async getChat(id) {
    return this.request(`/chats/${id}`);
  }

  // Messages
  async getMessages(chatId) {
    return this.request(`/messages?chatId=${chatId}&_sort=timestamp&_order=asc`);
  }

  async sendMessage(message) {
    const newMessage = {
      ...message,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(newMessage)
    });
  }

  // Stories
  async getStories() {
    return this.request('/stories?_sort=timestamp&_order=desc');
  }

  async createStory(story) {
    const newStory = {
      ...story,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      views: []
    };
    
    return this.request('/stories', {
      method: 'POST',
      body: JSON.stringify(newStory)
    });
  }

  async viewStory(storyId, userId) {
    const story = await this.request(`/stories/${storyId}`);
    if (!story.views.includes(userId)) {
      story.views.push(userId);
      return this.request(`/stories/${storyId}`, {
        method: 'PUT',
        body: JSON.stringify(story)
      });
    }
    return story;
  }

  // Calls
  async getCalls() {
    return this.request('/calls?_sort=timestamp&_order=desc');
  }

  async createCall(call) {
    const newCall = {
      ...call,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    
    return this.request('/calls', {
      method: 'POST',
      body: JSON.stringify(newCall)
    });
  }
}

export default new ApiService();