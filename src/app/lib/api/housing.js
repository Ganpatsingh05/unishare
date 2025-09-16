// api/housing.js - Housing and room related API functions
import { apiCall, apiCallFormData } from './base.js';

// ============== ROOM LISTINGS ==============

export const fetchhousedata = async (searchParams = {}) => {
  try {
    const queryString = new URLSearchParams(searchParams).toString();
    const endpoint = queryString ? `/api/rooms?${queryString}` : '/api/rooms';
    
    const data = await apiCall(endpoint, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching house data:', error);
    return { data: [], error: error.message };
  }
};

export const fetchMyRooms = async (options = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (options.limit) queryParams.set('limit', options.limit);
    if (options.offset) queryParams.set('offset', options.offset);
    if (options.sort) queryParams.set('sort', options.sort);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/rooms/my-rooms?${queryString}` : '/api/rooms/my-rooms';
    
    const data = await apiCall(endpoint, { method: 'GET' });
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to view your rooms');
    }
    throw error;
  }
};

export const postRoom = async (formData) => {
  try {
    return await apiCallFormData('/api/rooms', formData, 'POST');
  } catch (error) {
    console.error('Error posting room:', error);
    throw error;
  }
};

export const updateRoom = async (roomId, formData) => {
  try {
    return await apiCallFormData(`/api/rooms/${roomId}`, formData, 'PUT');
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
};

export const deleteRoom = async (roomId) => {
  try {
    const data = await apiCall(`/api/rooms/${roomId}`, { method: 'DELETE' });
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to delete this room');
    }
    if (error.message.includes('403')) {
      throw new Error('You can only delete your own rooms');
    }
    throw error;
  }
};

export const fetchRoom = async (roomId) => {
  try {
    const data = await apiCall(`/api/rooms/${roomId}`, { method: 'GET' });
    return data;
  } catch (error) {
    if (error.message.includes('404')) {
      throw new Error('Room not found');
    }
    throw error;
  }
};

// Room-specific image upload functions
export const uploadRoomImages = async (imageFiles) => {
  try {
    const formData = new FormData();
    
    // Handle multiple images
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('images', imageFiles[i]);
    }
    
    const data = await apiCallFormData('/api/rooms/upload-images', formData);
    return data;
  } catch (error) {
    console.error('Error uploading room images:', error);
    throw error;
  }
};

// Validation helper for room data
export const validateRoomData = (roomData) => {
  const errors = {};
  
  if (!roomData.title || roomData.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }
  
  return Object.keys(errors).length === 0 ? null : errors;
};