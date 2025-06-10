import apiService from './api.js';
import userManager from './user.js';

class CallsManager {
  constructor() {
    this.calls = [];
  }

  async init() {
    try {
      this.calls = await apiService.getCalls();
    } catch (error) {
      console.error('Failed to initialize calls:', error);
    }
  }

  formatCallDuration(duration) {
    if (duration === 0) return '';
    
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    
    if (minutes === 0) return `${seconds}s`;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatCallTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const callDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (callDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (callDate.getTime() === today.getTime() - 86400000) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }

  createCallItem(call) {
    const currentUser = userManager.getCurrentUser();
    const otherUser = userManager.getUserById(
      call.participants.find(id => id !== currentUser.id)
    );

    const container = document.createElement('div');
    container.className = 'flex items-center p-4 hover:bg-gray-50 dark:hover:bg-wa-dark-200 cursor-pointer';

    const avatar = userManager.createUserAvatar(otherUser);

    const content = document.createElement('div');
    content.className = 'ml-3 flex-1';

    const topRow = document.createElement('div');
    topRow.className = 'flex items-center justify-between';

    const nameContainer = document.createElement('div');
    nameContainer.className = 'flex items-center space-x-2';

    const name = document.createElement('span');
    name.className = 'font-semibold text-gray-900 dark:text-gray-100';
    name.textContent = otherUser.name;

    const callIcon = document.createElement('i');
    callIcon.className = `fas ${call.type === 'video' ? 'fa-video' : 'fa-phone'} text-xs text-gray-500 dark:text-gray-400`;

    nameContainer.appendChild(name);
    nameContainer.appendChild(callIcon);

    const time = document.createElement('span');
    time.className = 'text-sm text-gray-500 dark:text-gray-400';
    time.textContent = this.formatCallTime(call.timestamp);

    topRow.appendChild(nameContainer);
    topRow.appendChild(time);

    const bottomRow = document.createElement('div');
    bottomRow.className = 'flex items-center justify-between mt-1';

    const statusContainer = document.createElement('div');
    statusContainer.className = 'flex items-center space-x-2';

    const statusIcon = document.createElement('i');
    const statusText = document.createElement('span');
    statusText.className = 'text-sm';

    switch (call.status) {
      case 'completed':
        statusIcon.className = 'fas fa-phone text-green-500';
        statusText.className += ' text-gray-600 dark:text-gray-400';
        statusText.textContent = call.duration > 0 ? this.formatCallDuration(call.duration) : 'Completed';
        break;
      case 'missed':
        statusIcon.className = 'fas fa-phone text-red-500';
        statusText.className += ' text-red-600 dark:text-red-400';
        statusText.textContent = 'Missed';
        break;
      case 'declined':
        statusIcon.className = 'fas fa-phone-slash text-red-500';
        statusText.className += ' text-red-600 dark:text-red-400';
        statusText.textContent = 'Declined';
        break;
    }

    statusContainer.appendChild(statusIcon);
    statusContainer.appendChild(statusText);

    const callButton = document.createElement('button');
    callButton.className = 'p-2 hover:bg-gray-100 dark:hover:bg-wa-dark-300 rounded-full transition-colors';
    callButton.innerHTML = `<i class="fas ${call.type === 'video' ? 'fa-video' : 'fa-phone'} text-whatsapp-500"></i>`;

    callButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.startCall(call.type, otherUser);
    });

    bottomRow.appendChild(statusContainer);
    bottomRow.appendChild(callButton);

    content.appendChild(topRow);
    content.appendChild(bottomRow);

    container.appendChild(avatar);
    container.appendChild(content);

    return container;
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

    const timer = document.createElement('p');
    timer.className = 'text-lg text-gray-300 mb-8';
    timer.textContent = '00:00';

    let seconds = 0;
    let timerInterval;

    const controls = document.createElement('div');
    controls.className = 'flex justify-center space-x-8';

    const endCallButton = document.createElement('button');
    endCallButton.className = 'call-button bg-red-500 hover:bg-red-600';
    endCallButton.innerHTML = '<i class="fas fa-phone-slash"></i>';

    if (type === 'video') {
      const muteButton = document.createElement('button');
      muteButton.className = 'call-button bg-gray-600 hover:bg-gray-700';
      muteButton.innerHTML = '<i class="fas fa-microphone"></i>';
      
      let isMuted = false;
      muteButton.addEventListener('click', () => {
        isMuted = !isMuted;
        muteButton.innerHTML = `<i class="fas fa-microphone${isMuted ? '-slash' : ''}"></i>`;
        muteButton.className = `call-button ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'}`;
      });

      const videoButton = document.createElement('button');
      videoButton.className = 'call-button bg-gray-600 hover:bg-gray-700';
      videoButton.innerHTML = '<i class="fas fa-video"></i>';
      
      let isVideoOff = false;
      videoButton.addEventListener('click', () => {
        isVideoOff = !isVideoOff;
        videoButton.innerHTML = `<i class="fas fa-video${isVideoOff ? '-slash' : ''}"></i>`;
        videoButton.className = `call-button ${isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'}`;
      });

      controls.appendChild(muteButton);
      controls.appendChild(videoButton);
    }

    controls.appendChild(endCallButton);

    callContainer.appendChild(avatar);
    callContainer.appendChild(name);
    callContainer.appendChild(status);
    callContainer.appendChild(timer);
    callContainer.appendChild(controls);

    overlay.appendChild(callContainer);
    document.body.appendChild(overlay);

    // Simulate call connection after 2 seconds
    setTimeout(() => {
      status.textContent = type === 'video' ? 'Video call connected' : 'Call connected';
      timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timer.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }, 1000);
    }, 2000);

    const endCall = () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      // Record call
      const currentUser = userManager.getCurrentUser();
      apiService.createCall({
        participants: [currentUser.id, user.id],
        type,
        status: 'completed',
        duration: seconds
      });
      
      document.body.removeChild(overlay);
    };

    endCallButton.addEventListener('click', endCall);

    // Auto-end after 30 seconds for demo
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        endCall();
      }
    }, 30000);
  }

  createCallsView() {
    const container = document.createElement('div');
    container.className = 'bg-white dark:bg-wa-dark-100 h-full';

    const header = document.createElement('div');
    header.className = 'p-4 border-b border-gray-200 dark:border-wa-dark-300';

    const title = document.createElement('h2');
    title.className = 'text-lg font-semibold text-gray-900 dark:text-gray-100';
    title.textContent = 'Calls';

    header.appendChild(title);

    const callsList = document.createElement('div');
    callsList.className = 'overflow-y-auto flex-1';

    if (this.calls.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400';
      
      const icon = document.createElement('i');
      icon.className = 'fas fa-phone text-4xl mb-4';
      
      const text = document.createElement('p');
      text.textContent = 'No recent calls';
      
      emptyState.appendChild(icon);
      emptyState.appendChild(text);
      callsList.appendChild(emptyState);
    } else {
      this.calls.forEach(call => {
        const callItem = this.createCallItem(call);
        callsList.appendChild(callItem);
      });
    }

    container.appendChild(header);
    container.appendChild(callsList);

    return container;
  }
}

export default new CallsManager();