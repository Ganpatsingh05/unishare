// api/rooms.js - Room sharing related API functions
import { apiCall } from '../../app/lib/api/base.js';

// ===========================
// ROOMS API FUNCTIONS
// ===========================

// Fetch rooms with filtering options
export const fetchRooms = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.priceMin) queryParams.append('priceMin', filters.priceMin);
    if (filters.priceMax) queryParams.append('priceMax', filters.priceMax);
    if (filters.roomType) queryParams.append('roomType', filters.roomType);
    if (filters.availableFrom) queryParams.append('availableFrom', filters.availableFrom);
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.order) queryParams.append('order', filters.order);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);

    const endpoint = `/api/rooms${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiCall(endpoint, { method: 'GET' });

    return {
      success: true,
      data: response.data || [],
      total: response.total || 0,
      pagination: response.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get room by ID
export const fetchRoom = async (roomId) => {
  try {
    if (!roomId) {
      throw new Error('Room ID is required');
    }

    const response = await apiCall(`/api/rooms/${roomId}`, { method: 'GET' });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching room:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get my posted rooms (authenticated)
export const fetchMyRooms = async () => {
  try {
    const response = await apiCall('/api/rooms/my', { method: 'GET' });

    return {
      success: true,
      data: response.data || []
    };
  } catch (error) {
    console.error('Error fetching my rooms:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Create a new room posting
export const createRoom = async (roomData) => {
  try {
    // Validate required fields
    const requiredFields = ['title', 'description', 'location', 'price', 'roomType', 'availableFrom'];
    const missingFields = requiredFields.filter(field => !roomData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const response = await apiCall('/api/rooms/create', {
      method: 'POST',
      body: JSON.stringify(roomData)
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error creating room:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Update room posting
export const updateRoom = async (roomId, updateData) => {
  try {
    if (!roomId) {
      throw new Error('Room ID is required');
    }

    const response = await apiCall(`/api/rooms/${roomId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating room:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete room posting
export const deleteRoom = async (roomId) => {
  try {
    if (!roomId) {
      throw new Error('Room ID is required');
    }

    const response = await apiCall(`/api/rooms/${roomId}`, { method: 'DELETE' });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error deleting room:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Contact room owner
export const contactRoomOwner = async (roomId, contactData) => {
  try {
    if (!roomId || !contactData) {
      throw new Error('Room ID and contact data are required');
    }

    const response = await apiCall(`/api/rooms/${roomId}/contact`, {
      method: 'POST',
      body: JSON.stringify(contactData)
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error contacting room owner:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get room statistics (authenticated user)
export const getRoomStats = async () => {
  try {
    const response = await apiCall('/api/rooms/stats', { method: 'GET' });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching room stats:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ===========================
// ADMIN FUNCTIONS
// ===========================

// Get all rooms for admin view
export const getAllRoomsAdmin = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.userId) queryParams.append('userId', filters.userId);
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.order) queryParams.append('order', filters.order);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);

    const endpoint = `/admin/rooms${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiCall(endpoint, { method: 'GET' });

    return {
      success: true,
      data: response.data || [],
      total: response.total || 0,
      pagination: response.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching rooms (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get room details by ID for admin
export const getRoomByIdAdmin = async (roomId) => {
  try {
    if (!roomId) {
      throw new Error('Room ID is required');
    }

    const response = await apiCall(`/admin/rooms/${roomId}`, { method: 'GET' });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching room details (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Update room status (admin)
export const updateRoomStatusAdmin = async (roomId, status, reason = '') => {
  try {
    if (!roomId || !status) {
      throw new Error('Room ID and status are required');
    }

    const response = await apiCall(`/admin/rooms/${roomId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason })
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating room status (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete room (admin)
export const deleteRoomAdmin = async (roomId, reason = '') => {
  try {
    if (!roomId) {
      throw new Error('Room ID is required');
    }

    const response = await apiCall(`/admin/rooms/${roomId}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason })
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error deleting room (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get room statistics (admin)
export const getRoomStatsAdmin = async () => {
  try {
    const response = await apiCall('/admin/rooms/stats', { method: 'GET' });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching room stats (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get flagged rooms (admin)
export const getFlaggedRoomsAdmin = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.order) queryParams.append('order', filters.order);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);

    const endpoint = `/admin/rooms/flagged${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiCall(endpoint, { method: 'GET' });

    return {
      success: true,
      data: response.data || [],
      total: response.total || 0,
      pagination: response.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching flagged rooms (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};