// This file manages the contacts functionality, including adding, removing, and listing contacts.

const contacts = [];

export function addContact(contact) {
    contacts.push(contact);
}

export function removeContact(contactId) {
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index !== -1) {
        contacts.splice(index, 1);
    }
}

export function listContacts() {
    return contacts;
}

export function findContactById(contactId) {
    return contacts.find(contact => contact.id === contactId);
}

export function findContactByName(name) {
    return contacts.filter(contact => 
        (contact.prenom + ' ' + contact.name).toLowerCase().includes(name.toLowerCase())
    );
}