// This is the entry point for the application. It initializes the app and sets up necessary configurations.

import { createDiscussionsPanel } from './discussionsPanel.js';
import userManager from './user.js';
import contactList from './contacts.js';
import statusManager from './status.js';
import { createGroupPanel } from './groupe.js'; // Import the group creation function

const app = document.getElementById('app'); // Assuming there is an element with id 'app' in your HTML

function initializeApp() {
    const discussionsPanel = createDiscussionsPanel();
    app.appendChild(discussionsPanel);

    // Additional initialization logic can go here
}

// Call the initializeApp function to start the application
initializeApp();