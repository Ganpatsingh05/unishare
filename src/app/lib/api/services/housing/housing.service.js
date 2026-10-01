// api/housing.js - Optimized housing and room related API functions
import { apiCall, apiCallFormData, buildQueryParams, batchAPICall, clearAPICache, APIError } from "./base.js";

// ============== ROOM LISTINGS ==============

// Optimized room search with caching and proper pagination
export const fetchRooms = async (searchParams = {}, options = {}) => {
  try {
    const {
      cache = true,
      cacheTTL = 5 * 60 * 1000, // 5 minutes cache
      page = 1,
      limit = 20,
      ...filters
    } = searchParams;

    // Build optimized query parameters
    const params = {
      ...filters,
      page,
      limit,
    };

    const queryString = buildQueryParams(params);
    const endpoint = `/api/rooms${queryString}`;
    
    const data = await apiCall(endpoint, { 
      method: 'GET',
      cache,
      cacheTTL,
      ...options
    });

    return {
      success: true,
      data: data.data || [],
      pagination: data.pagination || {
        currentPage: page,
        totalPages: Math.ceil((data.total || 0) / limit),
        totalCount: data.total || 0,
        hasNext: false,
        hasPrev: false
      },
      total: data.total || 0,
      message: data.message || `Found ${(data.data || []).length} room listings`
    };
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw new APIError(
      'Failed to fetch room listings',
      error.status || 500,
      error.message,
      error.errors || []
    );
  }
};

// Backward compatibility
export const fetchhousedata = fetchRooms;

// Optimized fetch user's rooms with caching
export const fetchMyRooms = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = 'created_at',
      order = 'desc',
      cache = true,
      cacheTTL = 2 * 60 * 1000, // 2 minutes cache for user data
    } = options;

    const params = { page, limit, sort, order };
    const queryString = buildQueryParams(params);
    const endpoint = `/api/rooms/mine${queryString}`;
    
    const data = await apiCall(endpoint, { 
      method: 'GET',
      cache,
      cacheTTL
    });

    return {
      success: true,
      data: data.data || [],
      pagination: data.pagination || {
        currentPage: page,
        totalPages: Math.ceil((data.total || 0) / limit),
        totalCount: data.total || 0
      },
      total: data.total || 0,
      message: data.message || `Found ${(data.data || []).length} of your room listings`
    };
  } catch (error) {
    if (error.status === 401) {
      throw new APIError('Please log in to view your rooms', 401);
    }
    throw error;
  }
};

// Optimized room creation with proper error handling
export const createRoom = async (roomData, options = {}) => {
  try {
    const { onUploadProgress } = options;
    
    const result = await apiCallFormData('/api/rooms', roomData, {
      method: 'POST',
      onUploadProgress
    });

    // Clear relevant caches after successful creation
    clearAPICache('rooms');
    
    return {
      success: true,
      data: result.data || result,
      message: result.message || 'Room listing created successfully'
    };
  } catch (error) {
    throw new APIError(
      'Failed to create room listing',
      error.status || 500,
      error.message,
      error.errors || []
    );
  }
};

// Backward compatibility
export const postRoom = createRoom;

// Optimized room update
export const updateRoom = async (roomId, roomData, options = {}) => {
  try {
    if (!roomId) {
      throw new APIError('Room ID is required', 400);
    }

    const { onUploadProgress } = options;
    
    const result = await apiCallFormData(`/api/rooms/${roomId}`, roomData, {
      method: 'PUT',
      onUploadProgress
    });

    // Clear relevant caches after successful update
    clearAPICache('rooms');
    
    return {
      success: true,
      data: result.data || result,
      message: result.message || 'Room listing updated successfully'
    };
  } catch (error) {
    if (error.status === 403) {
      throw new APIError('You can only edit your own room listings', 403);
    }
    if (error.status === 404) {
      throw new APIError('Room listing not found', 404);
    }
    throw new APIError(
      'Failed to update room listing',
      error.status || 500,
      error.message,
      error.errors || []
    );
  }
};

// Optimized room deletion
export const deleteRoom = async (roomId) => {
  try {
    if (!roomId) {
      throw new APIError('Room ID is required', 400);
    }

    const result = await apiCall(`/api/rooms/${roomId}`, { 
      method: 'DELETE',
      cache: false // Never cache DELETE requests
    });

    // Clear relevant caches after successful deletion
    clearAPICache('rooms');
    
    return {
      success: true,
      message: result.message || 'Room listing deleted successfully'
    };
  } catch (error) {
    if (error.status === 401) {
      throw new APIError('Please log in to delete room listings', 401);
    }
    if (error.status === 403) {
      throw new APIError('You can only delete your own room listings', 403);
    }
    if (error.status === 404) {
      throw new APIError('Room listing not found', 404);
    }
    throw new APIError(
      'Failed to delete room listing',
      error.status || 500,
      error.message,
      error.errors || []
    );
  }
};

// Optimized single room fetch with caching
export const fetchRoom = async (roomId, options = {}) => {
  try {
    if (!roomId) {
      throw new APIError('Room ID is required', 400);
    }

    const { cache = true, cacheTTL = 10 * 60 * 1000 } = options; // 10 minute cache

    const result = await apiCall(`/api/rooms/${roomId}`, { 
      method: 'GET',
      cache,
      cacheTTL
    });
    
    return {
      success: true,
      data: result.data || result,
      message: result.message || 'Room details fetched successfully'
    };
  } catch (error) {
    if (error.status === 404) {
      throw new APIError('Room listing not found', 404);
    }
    throw new APIError(
      'Failed to fetch room details',
      error.status || 500,
      error.message,
      error.errors || []
    );
  }
};

// Batch operations for multiple rooms
export const batchFetchRooms = async (roomIds) => {
  try {
    const requests = roomIds.map(id => ({
      endpoint: `/api/rooms/${id}`,
      options: { method: 'GET', cache: true }
    }));

    const results = await batchAPICall(requests);
    
    return {
      success: true,
      data: results,
      message: `Fetched details for ${results.length} rooms`
    };
  } catch (error) {
    throw new APIError('Failed to fetch room details', 500, error.message);
  }
};

// Get room statistics for dashboard
export const getRoomStats = async () => {
  try {
    const result = await apiCall('/api/rooms/stats', {
      method: 'GET',
      cache: true,
      cacheTTL: 5 * 60 * 1000 // 5 minute cache
    });
    
    return {
      success: true,
      data: result.data || result,
      message: 'Room statistics fetched successfully'
    };
  } catch (error) {
    throw new APIError(
      'Failed to fetch room statistics',
      error.status || 500,
      error.message,
      error.errors || []
    );
  }
};

// Search rooms with advanced filters
export const searchRoomsAdvanced = async (searchQuery, filters = {}) => {
  try {
    const params = {
      q: searchQuery,
      type: filters.type,
      min_price: filters.minPrice,
      max_price: filters.maxPrice,
      location: filters.location,
      available_from: filters.availableFrom,
      limit: filters.limit || 20,
      page: filters.page || 1
    };

    const queryString = buildQueryParams(params);
    const endpoint = `/api/rooms/search${queryString}`;
    
    const result = await apiCall(endpoint, {
      method: 'GET',
      cache: true,
      cacheTTL: 3 * 60 * 1000 // 3 minute cache for searches
    });

    return {
      success: true,
      data: result.data || [],
      pagination: result.pagination || {},
      total: result.total || 0,
      message: result.message || `Found ${(result.data || []).length} matching rooms`
    };
  } catch (error) {
    throw new APIError(
      'Failed to search rooms',
      error.status || 500,
      error.message,
      error.errors || []
    );
  }
};

// Validation helper for room data
export const validateRoomData = (roomData) => {
  const errors = [];
  
  if (!roomData.title || roomData.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  
  if (!roomData.description || roomData.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }
  
  if (!roomData.price || roomData.price <= 0) {
    errors.push('Price must be a positive number');
  }
  
  if (!roomData.location || roomData.location.trim().length === 0) {
    errors.push('Location is required');
  }
  
  if (!roomData.type || !['single', 'shared', 'studio'].includes(roomData.type)) {
    errors.push('Valid room type is required (single, shared, studio)');
  }

  return errors.length === 0 ? null : errors;
};

// Utility to prepare room form data
export const prepareRoomFormData = (roomData, imageFiles = []) => {
  const formData = new FormData();
  
  // Create a copy of room data for processing
  const processedData = { ...roomData };
  
  // Ensure rent field is set (backend compatibility)
  if (processedData.rent && !processedData.price) {
    processedData.price = processedData.rent;
  } else if (processedData.price && !processedData.rent) {
    processedData.rent = processedData.price;
  }
  
  // Handle existingImages separately to avoid JSON.stringify issues
  const existingImages = processedData.existingImages;
  delete processedData.existingImages;
  
  // Add room data fields
  Object.keys(processedData).forEach(key => {
    if (processedData[key] !== null && processedData[key] !== undefined) {
      if (typeof processedData[key] === 'object') {
        formData.append(key, JSON.stringify(processedData[key]));
      } else {
        formData.append(key, processedData[key]);
      }
    }
  });
  
  // Add existing images as separate fields to avoid array literal issues
  if (existingImages && Array.isArray(existingImages)) {
    existingImages.forEach((imageUrl, index) => {
      formData.append(`existingImages[${index}]`, imageUrl);
    });
  }
  
  // Add image files
  imageFiles.forEach((file, index) => {
    formData.append('photos', file);
  });
  
  return formData;
};
