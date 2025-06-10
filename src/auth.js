import apiService from './api.js';
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.onAuthChange = null;
  }

  init() {
    this.currentUser = apiService.getCurrentUser();
    return this.currentUser;
  }

  async login(username, password) {
    try {
      const user = await apiService.login(username, password);
      this.currentUser = user;
      
      if (this.onAuthChange) {
        this.onAuthChange(user);
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    await apiService.logout();
    this.currentUser = null;
    
    if (this.onAuthChange) {
      this.onAuthChange(null);
    }
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  setAuthChangeCallback(callback) {
    this.onAuthChange = callback;
  }

  createLoginForm() {
    const container = document.createElement('div');
    // Fond général blanc
    container.className = 'min-h-screen flex items-center justify-center';
    container.style.background = '#fff';

    // Carte de login avec couleur unique (exemple bleu)
    const card = document.createElement('div');
    card.className = 'rounded-lg shadow-xl p-8 w-full max-w-md';
    card.style.background = '#0a1733'; // <-- couleur unique pour la carte

    const logo = document.createElement('div');
    logo.className = 'text-center mb-8';
    
    const logoIcon = document.createElement('div');
    logoIcon.className = 'text-6xl mb-4';
    logoIcon.textContent = '';
    
    const logoText = document.createElement('h1');
    logoText.className = 'text-2xl font-bold text-white';
    logoText.textContent = 'Bienvenue sur votre application';
    
    logo.appendChild(logoIcon);
    logo.appendChild(logoText);

    const form = document.createElement('form');
    form.className = 'space-y-6';

    const usernameGroup = document.createElement('div');
    const usernameLabel = document.createElement('label');
    usernameLabel.className = 'block text-sm font-medium text-white mb-2';
    usernameLabel.textContent = 'NOM';
    
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.required = true;
    usernameInput.className = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none';
    usernameInput.placeholder = 'Enter your username';
    usernameInput.value = 'john_doe'; // Default for demo
    
    usernameGroup.appendChild(usernameLabel);
    usernameGroup.appendChild(usernameInput);

    const passwordGroup = document.createElement('div');
    const passwordLabel = document.createElement('label');
    passwordLabel.className = 'block text-sm font-medium text-white mb-2';
    passwordLabel.textContent = 'MOT DE PASSE';
    
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.required = true;
    passwordInput.className = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none';
    passwordInput.placeholder = 'Enter your password';
    passwordInput.value = 'password';
    
    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(passwordInput);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0a1733] hover:bg-[#1d4ed8] focus:outline-none transition-colors';
    submitButton.textContent = 'SE CONNECTER';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'hidden text-red-100 text-sm text-center';
    const demoInfo = document.createElement('div');
    demoInfo.className = 'mt-6 p-4 bg-blue-100 rounded-md';
    const demoTitle = document.createElement('h3');
    const demoList = document.createElement('ul');
    demoList.className = 'text-xs text-blue-700 space-y-1';
    const accounts = ['john_doe', 'jane_smith', 'mike_wilson'];
    demoInfo.appendChild(demoTitle);
    demoInfo.appendChild(demoList);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        submitButton.textContent = 'Signing in...';
        submitButton.disabled = true;
        errorDiv.classList.add('hidden');
        await this.login(usernameInput.value, passwordInput.value);
      } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
      } finally {
        submitButton.textContent = 'Sign In';
        submitButton.disabled = false;
      }
    });
    form.appendChild(usernameGroup);
    form.appendChild(passwordGroup);
    form.appendChild(submitButton);
    form.appendChild(errorDiv);

    card.appendChild(logo);
    card.appendChild(form);
    card.appendChild(demoInfo);
    container.appendChild(card);
    return container;
  }
}
export default new AuthManager();