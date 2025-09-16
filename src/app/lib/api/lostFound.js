// api/lostFound.js - Lost and found items API functions
import { apiCall, apiCallFormData } from './base.js';

// ============== LOST & FOUND ==============

export const fetchLostFoundItems = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams(Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null && value !== '')).toString();
    const endpoint = queryString ? `/api/lostfound?${queryString}` : '/api/lostfound';
    const data = await apiCall(endpoint, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching lost/found items:', error);
    throw error;
  }
};

export const fetchMyLostFoundItems = async (options = {}) => {
  try {
    const queryString = new URLSearchParams(Object.entries(options).filter(([_, value]) => value !== undefined && value !== null && value !== '')).toString();
    const endpoint = queryString ? `/api/lostfound/my?${queryString}` : '/api/lostfound/my';
    const data = await apiCall(endpoint, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching user lost/found items:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to view your lost/found items');
    }
    throw error;
  }
};

// Create a new lost/found item with backend image upload
export const createLostFoundItem = async (itemData, imageFiles = []) => {
  try {
    console.log('Creating lost/found item with backend upload:', { 
      itemName: itemData.itemName, 
      mode: itemData.mode, 
      images: imageFiles?.length || 0 
    });

    const formData = new FormData();

    // Add item data as JSON string (backend expects it this way)
    formData.append('itemData', JSON.stringify(itemData));

    // Add images if provided (backend expects 'images' field for multiple files)
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
    }

    const data = await apiCallFormData('/api/lostfound/create', formData, 'POST');
    return data;
  } catch (error) {
    console.error('Error creating lost/found item:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to report lost/found items');
    }
    throw error;
  }
};

export const updateLostFoundItem = async (itemId, updateData) => {
  try {
    const data = await apiCall(`/api/lostfound/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    return data;
  } catch (error) {
    console.error('Error updating lost/found item:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to update this item');
    }
    if (error.message.includes('403')) {
      throw new Error('You can only update your own items');
    }
    throw error;
  }
};

export const deleteLostFoundItem = async (itemId) => {
  try {
    const data = await apiCall(`/api/lostfound/${itemId}`, { method: 'DELETE' });
    return data;
  } catch (error) {
    console.error('Error deleting lost/found item:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to delete this item');
    }
    if (error.message.includes('403')) {
      throw new Error('You can only delete your own items');
    }
    throw error;
  }
};

export const fetchLostFoundItem = async (itemId) => {
  try {
    const data = await apiCall(`/api/lostfound/${itemId}`, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching lost/found item:', error);
    if (error.message.includes('404')) {
      throw new Error('Item not found');
    }
    throw error;
  }
};

export const contactLostFoundItem = async (itemId, contactData) => {
  try {
    const data = await apiCall(`/api/lostfound/${itemId}/contact`, {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
    return data;
  } catch (error) {
    console.error('Error sending contact message:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to send messages');
    }
    if (error.message.includes('404')) {
      throw new Error('Item not found');
    }
    throw error;
  }
};

export const getLostFoundStats = async () => {
  try {
    const data = await apiCall('/api/lostfound/stats', { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching lost/found stats:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to view statistics');
    }
    throw error;
  }
};