// api/tickets.js - Ticket marketplace related API functions
import { apiCall, apiCallFormData } from './base.js';

// ============== TICKET MARKETPLACE ==============

export const fetchTickets = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value !== '' && value != null)
    ).toString();
    const endpoint = queryString ? `/api/ticketsell?${queryString}` : '/api/ticketsell';
    const data = await apiCall(endpoint, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return { data: [], error: error.message };
  }
};

export const fetchMyTickets = async (options = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (options.limit) queryParams.set('limit', options.limit);
    if (options.offset) queryParams.set('offset', options.offset);
    if (options.sort) queryParams.set('sort', options.sort);
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/ticketsell/my?${queryString}` : '/api/ticketsell/my';
    const data = await apiCall(endpoint, { method: 'GET' });
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to view your tickets');
    }
    throw error;
  }
};

// Create a new ticket listing with backend image upload
export const createTicket = async (ticketData, imageFile = null) => {
  try {
    console.log('Creating ticket with backend upload:', { 
      title: ticketData.title, 
      hasImage: !!imageFile 
    });

    // Prepare FormData for backend
    const formData = new FormData();
    
    // Add ticket data as JSON string (backend expects it this way)
    formData.append('ticketData', JSON.stringify(ticketData));
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const data = await apiCallFormData('/api/ticketsell/create', formData, 'POST');
    return data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

export const updateTicket = async (ticketId, ticketData, imageFile = null) => {
  try {
    console.log('Updating ticket with backend upload:', { 
      ticketId, 
      title: ticketData.title, 
      hasNewImage: !!imageFile 
    });

    // Prepare FormData for backend
    const formData = new FormData();
    
    // Add ticket data as JSON string (backend expects it this way)
    formData.append('ticketData', JSON.stringify(ticketData));
    
    // Add new image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const data = await apiCallFormData(`/api/ticketsell/${ticketId}`, formData, 'PUT');
    return data;
  } catch (error) {
    console.error('Error updating ticket:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to update this ticket');
    }
    if (error.message.includes('403')) {
      throw new Error('You can only update your own tickets');
    }
    throw error;
  }
};

export const deleteTicket = async (ticketId) => {
  try {
    const data = await apiCall(`/api/ticketsell/${ticketId}`, { method: 'DELETE' });
    return data;
  } catch (error) {
    console.error('Error deleting ticket:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to delete this ticket');
    }
    if (error.message.includes('403')) {
      throw new Error('You can only delete your own tickets');
    }
    throw error;
  }
};

export const fetchTicket = async (ticketId) => {
  try {
    const data = await apiCall(`/api/ticketsell/${ticketId}`, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    if (error.message.includes('404')) {
      throw new Error('Ticket not found');
    }
    throw error;
  }
};

// ============== AUTHENTICATED USER FUNCTIONS ==============

export const getTicketStats = async () => {
  try {
    const data = await apiCall('/api/ticketsell/stats', { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching ticket stats:', error);
    throw error;
  }
};

export const inquireAboutTicket = async (ticketId, message) => {
  try {
    const data = await apiCall(`/api/ticketsell/${ticketId}/inquire`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    return data;
  } catch (error) {
    console.error('Error sending ticket inquiry:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to inquire about tickets');
    }
    throw error;
  }
};

// ============== ADMIN FUNCTIONS ==============

export const fetchAllTickets = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value !== '' && value != null)
    ).toString();
    
    const endpoint = queryString ? `/admin/ticketsell?${queryString}` : '/admin/ticketsell';
    const data = await apiCall(endpoint, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching all tickets (admin):', error);
    return { data: [], error: error.message };
  }
};

export const deleteTicketAdmin = async (ticketId) => {
  try {
    const data = await apiCall(`/admin/ticketsell/${ticketId}`, { method: 'DELETE' });
    return data;
  } catch (error) {
    console.error('Error deleting ticket (admin):', error);
    if (error.message.includes('401')) {
      throw new Error('Admin authentication required');
    }
    if (error.message.includes('403')) {
      throw new Error('Admin access required');
    }
    throw error;
  }
};