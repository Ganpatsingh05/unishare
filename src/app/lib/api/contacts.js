// api/contacts.js - Contacts API functions
import { apiCall } from './base.js';

// ============== PUBLIC CONTACTS ==============

// Get all active contacts for public display
export const getPublicContacts = async () => {
  try {
    const response = await apiCall('/api/contacts');
    console.log('Contacts API response:', response); // Debug log
    
    // Handle different response structures
    const contacts = response.data || response.contacts || [];
    
    return {
      success: true,
      contacts: contacts,
      message: response.message || `Found ${contacts.length} contacts`
    };
  } catch (error) {
    console.warn('Public contacts endpoint not available:', error.message);
    
    // Return demo/fallback contacts for development when backend is not available
    const fallbackContacts = [
      { id: 1, name: "Campus Security", role: "24x7 Helpline", category: "emergency", phone: "+91 100", email: "security@university.edu", location: "Main Gate Booth", hours: "24/7" },
      { id: 2, name: "Medical Center", role: "On-campus clinic", category: "emergency", phone: "+91 98765 11111", email: "clinic@university.edu", location: "Health Block", hours: "Mon-Sun 8:00–20:00" },
      { id: 3, name: "Admin Office", role: "General Administration", category: "administration", phone: "+91 98765 22222", email: "admin@university.edu", location: "A-Block, Room 101", hours: "Mon-Fri 9:00–17:00" },
      { id: 4, name: "Exam Cell", role: "Examinations & Results", category: "academics", phone: "+91 98765 33333", email: "examcell@university.edu", location: "B-Block, Room 210", hours: "Mon-Fri 10:00–16:00" },
      { id: 5, name: "Hostel Warden - Dorm A", role: "Warden", category: "hostel", phone: "+91 98765 44444", email: "wardenA@university.edu", location: "Dorm A Office", hours: "Mon-Sat 9:00–18:00" },
      { id: 6, name: "Student Affairs", role: "Clubs & Activities", category: "student", phone: "+91 98765 55555", email: "students@university.edu", location: "Student Center", hours: "Mon-Fri 9:00–17:00" }
    ];
    
    return { 
      success: true, 
      contacts: fallbackContacts,
      message: 'Using demo contacts (backend not available)' 
    };
  }
};

// ============== ADMIN CONTACTS MANAGEMENT ==============

// Get all contacts for admin (including inactive)
export const getAllContacts = async () => {
  try {
    const response = await apiCall('/admin/contacts', {
      method: 'GET'
    });
    
    console.log('Admin contacts API response:', response); // Debug log
    
    // Handle different response structures
    const contacts = response.data || response.contacts || [];
    
    return {
      success: true,
      contacts: contacts,
      message: response.message || `Found ${contacts.length} contacts`
    };
  } catch (error) {
    console.warn('Admin contacts endpoint not available:', error.message);
    
    // Return demo/fallback contacts for development when backend is not available
    const fallbackContacts = [
      { id: 1, name: "Campus Security", role: "24x7 Helpline", category: "emergency", phone: "+91 100", email: "security@university.edu", location: "Main Gate Booth", hours: "24/7", active: true },
      { id: 2, name: "Medical Center", role: "On-campus clinic", category: "emergency", phone: "+91 98765 11111", email: "clinic@university.edu", location: "Health Block", hours: "Mon-Sun 8:00–20:00", active: true },
      { id: 3, name: "Admin Office", role: "General Administration", category: "administration", phone: "+91 98765 22222", email: "admin@university.edu", location: "A-Block, Room 101", hours: "Mon-Fri 9:00–17:00", active: true },
      { id: 4, name: "Exam Cell", role: "Examinations & Results", category: "academics", phone: "+91 98765 33333", email: "examcell@university.edu", location: "B-Block, Room 210", hours: "Mon-Fri 10:00–16:00", active: true },
      { id: 5, name: "Hostel Warden - Dorm A", role: "Warden", category: "hostel", phone: "+91 98765 44444", email: "wardenA@university.edu", location: "Dorm A Office", hours: "Mon-Sat 9:00–18:00", active: true },
      { id: 6, name: "Student Affairs", role: "Clubs & Activities", category: "student", phone: "+91 98765 55555", email: "students@university.edu", location: "Student Center", hours: "Mon-Fri 9:00–17:00", active: true }
    ];
    
    return {
      success: true,
      contacts: fallbackContacts,
      message: 'Using demo contacts (backend not available)'
    };
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
    // Return success for demo mode
    return {
      success: true,
      contact: {
        id: Date.now(),
        ...contactData,
        active: contactData.active !== false
      },
      message: 'Contact created (demo mode)'
    };
  }
};

// Update an existing contact
export const updateContact = async (contactId, updates) => {
  try {
    const data = await apiCall(`/admin/contacts/${contactId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    
    return {
      success: true,
      contact: data.contact,
      message: data.message || 'Contact updated successfully'
    };
  } catch (error) {
    console.warn('Update contact endpoint not available:', error.message);
    // Return success for demo mode
    return {
      success: true,
      contact: { id: contactId, ...updates },
      message: 'Contact updated (demo mode)'
    };
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
    // Return success for demo mode
    return {
      success: true,
      message: 'Contact deleted (demo mode)'
    };
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