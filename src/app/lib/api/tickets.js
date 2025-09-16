// api/tickets.js - Ticket marketplace related API functions
import { apiCall, apiCallFormData } from './base.js';

// ============== TICKET MARKETPLACE ==============

export const fetchTickets = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value !== '' && value != null)
    ).toString();
    const endpoint = queryString ? `/api/tickets?${queryString}` : '/api/tickets';
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
    const endpoint = queryString ? `/api/tickets/my?${queryString}` : '/api/tickets/my';
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

    const data = await apiCallFormData('/api/tickets/create', formData, 'POST');
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

    const data = await apiCallFormData(`/api/tickets/${ticketId}`, formData, 'PUT');
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
    const data = await apiCall(`/api/tickets/${ticketId}`, { method: 'DELETE' });
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
    const data = await apiCall(`/api/tickets/${ticketId}`, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    if (error.message.includes('404')) {
      throw new Error('Ticket not found');
    }
    throw error;
  }
};