// api/marketplace.js - Marketplace and item trading API functions
import { apiCall, apiCallFormData } from "./base.js";

// ============== ITEM MARKETPLACE ==============

export const fetchMarketplaceItems = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value !== '' && value != null)
    ).toString();
    
    const endpoint = queryString ? `/api/itemsell?${queryString}` : '/api/itemsell';
    const data = await apiCall(endpoint, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    return { data: [], error: error.message };
  }
};

export const fetchItem = async (itemId) => {
  try {
    const data = await apiCall(`/api/itemsell/${itemId}`, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching item:', error);
    if (error.message.includes('404')) {
      throw new Error('Item not found');
    }
    throw error;
  }
};

export const fetchMyItems = async (options = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (options.limit) queryParams.set('limit', options.limit);
    if (options.offset) queryParams.set('offset', options.offset);
    if (options.sort) queryParams.set('sort', options.sort);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/itemsell/mine?${queryString}` : '/api/itemsell/mine';
    
    const data = await apiCall(endpoint, { method: 'GET' });
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to view your items');
    }
    throw error;
  }
};

// Create a new item listing with backend image upload
export const createItem = async (itemData, imageFile = null) => {
  try {
    console.log('Creating item with backend upload:', { 
      title: itemData.title, 
      hasImage: !!imageFile 
    });

    // Prepare FormData for backend
    const formData = new FormData();
    
    // Add item data
    formData.append('title', itemData.title);
    formData.append('price', itemData.price);
    formData.append('category', itemData.category);
    formData.append('condition', itemData.condition);
    formData.append('location', itemData.location);
    formData.append('available_from', itemData.available_from);
    formData.append('description', itemData.description || '');
    formData.append('contact_info', JSON.stringify(itemData.contact_info || {}));
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const data = await apiCallFormData('/api/itemsell', formData, { method: 'POST' });
    return data;
  } catch (error) {
    console.error('Error creating item:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to create an item listing');
    }
    throw error;
  }
};

export const updateItem = async (itemId, itemData, imageFile = null) => {
  try {
    console.log('Updating item with backend upload:', { 
      itemId, 
      title: itemData.title, 
      hasNewImage: !!imageFile 
    });

    // Prepare FormData for backend
    const formData = new FormData();
    
    // Add item data
    formData.append('title', itemData.title);
    formData.append('price', itemData.price);
    formData.append('category', itemData.category);
    formData.append('condition', itemData.condition);
    formData.append('location', itemData.location);
    formData.append('available_from', itemData.available_from);
    formData.append('description', itemData.description || '');
    formData.append('contact_info', JSON.stringify(itemData.contact_info || {}));
    
    // Add new image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const data = await apiCallFormData(`/api/itemsell/${itemId}`, formData, { method: 'PUT' });
    return data;
  } catch (error) {
    console.error('Error updating item:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to update this item');
    }
    if (error.message.includes('403')) {
      throw new Error('You can only update your own items');
    }
    throw error;
  }
};

export const deleteItem = async (itemId) => {
  try {
    const data = await apiCall(`/api/itemsell/${itemId}`, { method: 'DELETE' });
    return data;
  } catch (error) {
    console.error('Error deleting item:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to delete this item');
    }
    if (error.message.includes('403')) {
      throw new Error('You can only delete your own items');
    }
    throw error;
  }
};

// export const fetchItem = async (itemId) => {
//   try {
//     const data = await apiCall(`/itemsell/${itemId}`, { method: 'GET' });
//     return data;
//   } catch (error) {
//     console.error('Error fetching item:', error);
//     if (error.message.includes('404')) {
//       throw new Error('Item not found');
//     }
//     throw error;
//   }
// };

// Image upload functions for marketplace items
export const uploadItemImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const data = await apiCallFormData('/itemsell/upload-image', formData);
    return data;
  } catch (error) {
    console.error('Error uploading item image:', error);
    throw error;
  }
};

export const deleteItemImage = async (imagePath) => {
  try {
    const data = await apiCall('/itemsell/delete-image', {
      method: 'DELETE',
      body: JSON.stringify({ imagePath }),
    });
    return data;
  } catch (error) {
    console.error('Error deleting item image:', error);
    throw error;
  }
};

// ============== ADMIN FUNCTIONS ==============

export const fetchAllItems = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value !== '' && value != null)
    ).toString();
    
    const endpoint = queryString ? `/admin/itemsell?${queryString}` : '/admin/itemsell';
    const data = await apiCall(endpoint, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching all items (admin):', error);
    return { data: [], error: error.message };
  }
};

export const deleteItemAdmin = async (itemId) => {
  try {
    const data = await apiCall(`/admin/itemsell/${itemId}`, { method: 'DELETE' });
    return data;
  } catch (error) {
    console.error('Error deleting item (admin):', error);
    if (error.message.includes('401')) {
      throw new Error('Admin authentication required');
    }
    if (error.message.includes('403')) {
      throw new Error('Admin access required');
    }
    throw error;
  }
};

// Validation helper for item data
export const validateItemData = (itemData) => {
  const errors = {};
  
  if (!itemData.title || itemData.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }
  
  if (!itemData.price || isNaN(itemData.price) || itemData.price <= 0) {
    errors.price = 'Price must be a valid positive number';
  }
  
  return Object.keys(errors).length === 0 ? null : errors;
};
