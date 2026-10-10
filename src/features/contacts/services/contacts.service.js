// api/contacts.js - Contacts API functions
import { apiCall } from '@lib/api/base.js';

// ============== PUBLIC CONTACTS ==============

// Get all active contacts for public display
export const getPublicContacts = async () => {
  try {
    const response = await apiCall('/api/contacts');
    
    // Handle different response structures
    const contacts = response.data || response.contacts || [];
    
    return {
      success: true,
      contacts: contacts,
      message: response.message || `Found ${contacts.length} contacts`
    };
  } catch (error) {
    // Never show made-up contacts: a student in an emergency could call a
    // fake number. Report the failure and let the page offer a retry.
    console.warn('Public contacts endpoint not available:', error.message);
    return { success: false, contacts: [], error: error.message };
  }
};


// ============== ADMIN CONTACTS MANAGEMENT ==============

// Get all contacts for admin (including inactive)
export const getAllContacts = async () => {
  try {
    const response = await apiCall('/admin/contacts', {
      method: 'GET'
    });
    
    // Handle different response structures
    const contacts = response.data || response.contacts || [];
    
    return {
      success: true,
      contacts: contacts,
      message: response.message || `Found ${contacts.length} contacts`
    };
  } catch (error) {
    console.warn('Admin contacts endpoint not available:', error.message);
    return { success: false, contacts: [], message: error.message || 'Could not load contacts' };
  }
};

// Create a new contact
export const createContact = async (contactData) => {
  try {
    const data = await apiCall('/admin/contacts', {
      method: 'POST',
      body: JSON.stringify({
        name: contactData.name,
        role: contactData.role,
        category: contactData.category,
        phone: contactData.phone,
        email: contactData.email,
        location: contactData.location,
        hours: contactData.hours,
        active: contactData.active !== false // Default to true if not specified
      })
    });
    
    return {
      success: true,
      contact: data.contact,
      message: data.message || 'Contact created successfully'
    };
  } catch (error) {
    console.warn('Create contact endpoint not available:', error.message);
    return { success: false, message: error.message || 'Could not create the contact' };
  }
};

// Update an existing contact
export const updateContact = async (contactId, updates) => {
  try {
    const data = await apiCall(`/admin/contacts/${contactId}`, {
      method: 'PUT', // the backend defines PUT for this route
      body: JSON.stringify(updates)
    });
    
    return {
      success: true,
      contact: data.contact,
      message: data.message || 'Contact updated successfully'
    };
  } catch (error) {
    console.warn('Update contact endpoint not available:', error.message);
    return { success: false, message: error.message || 'Could not update the contact' };
  }
};

// Delete a contact
export const deleteContact = async (contactId) => {
  try {
    const data = await apiCall(`/admin/contacts/${contactId}`, {
      method: 'DELETE'
    });
    
    return {
      success: true,
      message: data.message || 'Contact deleted successfully'
    };
  } catch (error) {
    console.warn('Delete contact endpoint not available:', error.message);
    return { success: false, message: error.message || 'Could not delete the contact' };
  }
};

// Toggle contact active status
export const toggleContactStatus = async (contactId, active) => {
  try {
    return await updateContact(contactId, { active });
  } catch (error) {
    console.error('Failed to toggle contact status:', error);
    throw error;
  }
};
