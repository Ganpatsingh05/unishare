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

// ===========================
// ADMIN FUNCTIONS
// ===========================

// Get all lost/found items for admin view
export const getAllLostFoundItemsAdmin = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.mode) queryParams.append('mode', filters.mode);
    if (filters.userId) queryParams.append('userId', filters.userId);
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.order) queryParams.append('order', filters.order);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);

    const endpoint = `/admin/lostfound${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiCall(endpoint, { method: 'GET' });

    return {
      success: true,
      data: response.data || [],
      total: response.total || 0,
      pagination: response.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching lost/found items (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get lost/found item details by ID for admin
export const getLostFoundItemByIdAdmin = async (itemId) => {
  try {
    if (!itemId) {
      throw new Error('Item ID is required');
    }

    const response = await apiCall(`/admin/lostfound/${itemId}`, { method: 'GET' });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching lost/found item details (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Update lost/found item status (admin)
export const updateLostFoundItemStatusAdmin = async (itemId, status, reason = '') => {
  try {
    if (!itemId || !status) {
      throw new Error('Item ID and status are required');
    }

    const response = await apiCall(`/admin/lostfound/${itemId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason })
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating lost/found item status (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete lost/found item (admin)
export const deleteLostFoundItemAdmin = async (itemId, reason = '') => {
  try {
    if (!itemId) {
      throw new Error('Item ID is required');
    }

    const response = await apiCall(`/admin/lostfound/${itemId}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason })
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error deleting lost/found item (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get lost/found statistics (admin)
export const getLostFoundStatsAdmin = async () => {
  try {
    const response = await apiCall('/admin/lostfound/stats', { method: 'GET' });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching lost/found stats (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get flagged lost/found items (admin)
export const getFlaggedLostFoundItemsAdmin = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.order) queryParams.append('order', filters.order);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);

    const endpoint = `/admin/lostfound/flagged${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiCall(endpoint, { method: 'GET' });

    return {
      success: true,
      data: response.data || [],
      total: response.total || 0,
      pagination: response.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching flagged lost/found items (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};