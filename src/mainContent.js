
import chatManager from './chat.js';

export function createMainContent() {
  
      const mainContent = document.createElement('div');
      mainContent.className = 'flex-1 bg-white h-screen flex flex-col items-center justify-center relative overflow-hidden';
      if (this.currentChat) {
          const chatView = chatManager.createChatView(this.currentChat);
          mainContent.className = 'flex-1 bg-white h-screen flex flex-col';
          mainContent.innerHTML = '';
          chatView.className = 'flex-1 bg-white backdrop-blur-xl h-screen flex flex-col border border-[#00e676]/10 shadow-2xl';
          mainContent.appendChild(chatView);
      } else {
          const welcomeContainer = document.createElement('div');
          welcomeContainer.className = 'text-center'; 
          const message = document.createElement('p');
          message.className = 'text-black text-lg';
          message.textContent = 'SELECTIONNER UN CONTACT POUR COMMENCER À DISCUTER';
          welcomeContainer.appendChild(message);
          mainContent.appendChild(welcomeContainer);
      }
      return mainContent;

}