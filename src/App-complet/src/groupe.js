function showNewGroupPanel(panel, userManager) {
  panel.innerHTML = ''; // Clear the panel

  // Header
  const header = document.createElement('div');
  header.className = 'flex items-center gap-3 px-4 py-4 bg-[#202c33]';
  const backBtn = document.createElement('button');
  backBtn.innerHTML = '<i class="fas fa-arrow-left text-xl text-[#00a884]"></i>';
  backBtn.className = 'mr-2';
  backBtn.onclick = () => {
    this.showMainApp();
  };
  const title = document.createElement('span');
  title.className = 'text-white text-lg font-semibold';
  title.textContent = 'Nouveau groupe';
  header.appendChild(backBtn);
  header.appendChild(title);

  // Group name input
  const groupNameInput = document.createElement('input');
  groupNameInput.type = 'text';
  groupNameInput.placeholder = 'Nom du groupe';
  groupNameInput.className = 'w-full px-3 py-2 rounded bg-[#202c33] text-white placeholder-[#8696a0] outline-none mt-4';

  // Add members section
  const membersContainer = document.createElement('div');
  membersContainer.className = 'mt-4';

  const membersTitle = document.createElement('div');
  membersTitle.className = 'text-white font-semibold';
  membersTitle.textContent = 'Ajouter des membres';
  membersContainer.appendChild(membersTitle);

  const membersList = document.createElement('div');
  membersList.className = 'flex flex-col gap-2 mt-2';
  membersContainer.appendChild(membersList);

  // Fetch contacts
  const currentUser = userManager.getCurrentUser();
  const contacts = (currentUser && Array.isArray(currentUser.contacts)) ? currentUser.contacts : [];

  contacts.forEach(contact => {
    const memberItem = document.createElement('div');
    memberItem.className = 'flex items-center gap-2 cursor-pointer';
    memberItem.innerHTML = `
      <input type="checkbox" class="member-checkbox" data-contact="${contact.contact}" />
      <span class="text-white">${contact.prenom} ${contact.name}</span>
    `;
    membersList.appendChild(memberItem);
  });

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Créer le groupe';
  submitBtn.className = 'bg-[#00a884] text-white px-4 py-2 rounded mt-4 hover:bg-[#01976a]';
  submitBtn.onclick = () => {
    const groupName = groupNameInput.value.trim();
    const selectedMembers = Array.from(membersList.querySelectorAll('.member-checkbox:checked')).map(checkbox => checkbox.dataset.contact);

    if (!groupName) {
      alert("Le nom du groupe est requis.");
      return;
    }

    // Create group logic
    const newGroup = {
      id: Date.now(),
      name: groupName,
      members: selectedMembers,
      createdBy: currentUser.contact,
      createdAt: new Date().toISOString()
    };

    // Save group logic (this part depends on how groups are managed in your application)
    // For example, you might want to push this to a groups array in userManager
    userManager.createGroup(newGroup);
    showNewDiscussionPanel.call(this, panel, userManager, contactList);
  };

  panel.appendChild(header);
  panel.appendChild(groupNameInput);
  panel.appendChild(membersContainer);
  panel.appendChild(submitBtn);
}

export { showNewGroupPanel };