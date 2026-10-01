// api/rideSharing.js - Ride sharing related API functions
import { apiCall } from "../../core/client.js";
import { 
  mapToBackendRide, 
  mapToFrontendRide, 
  mapPaginationResponse,
  validateRideForBackend 
} from "./rides.mapper.js";

// ===========================
// RIDESHARE API FUNCTIONS
// ===========================

// Fetch rides with filtering options
export const fetchRides = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Spring Boot uses 'page' and 'size' for pagination
    if (filters.page !== undefined) queryParams.append('page', filters.page);
    else if (filters.offset) queryParams.append('page', Math.floor(filters.offset / (filters.limit || 10)));
    
    if (filters.size) queryParams.append('size', filters.size);
    else if (filters.limit) queryParams.append('size', filters.limit);

    const endpoint = `/rides${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiCall(endpoint, { method: 'GET' });

    // Map Spring Boot response to frontend format
    return {
      success: true,
      ...mapPaginationResponse(response)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: [],
      pagination: {}
    };
  }
};

// Create a new ride offer
export const createRide = async (rideData) => {
  try {
    // Validate ride data
    const validation = validateRideForBackend(rideData);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    // Map to backend format
    const backendData = mapToBackendRide(rideData);

    const response = await apiCall('/rides', {
      method: 'POST',
      body: JSON.stringify(backendData)
    });

    return {
      success: true,
      data: mapToFrontendRide(response),
      message: 'Ride posted successfully!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Get rides posted by the current user
export const getMyRides = async (options = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Spring Boot pagination
    if (options.page !== undefined) queryParams.append('page', options.page);
    else if (options.offset) queryParams.append('page', Math.floor(options.offset / (options.size || options.limit || 10)));
    
    if (options.size) queryParams.append('size', options.size);
    else if (options.limit) queryParams.append('size', options.limit);

    const endpoint = `/rides/my-rides${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiCall(endpoint, { method: 'GET' });

    return {
      success: true,
      ...mapPaginationResponse(response)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: [],
      pagination: {}
    };
  }
};

// Update a ride
export const updateRide = async (rideId, updateData) => {
  try {
    if (!rideId) {
      throw new Error('Ride ID is required');
    }

    // Map to backend format
    const backendData = mapToBackendRide(updateData);

    const response = await apiCall(`/rides/${rideId}`, {
      method: 'PATCH',
      body: JSON.stringify(backendData)
    });

    return {
      success: true,
      data: mapToFrontendRide(response),
      message: 'Ride updated successfully!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete a ride
export const deleteRide = async (rideId) => {
  try {
    if (!rideId) {
      throw new Error('Ride ID is required');
    }

    const response = await apiCall(`/rides/${rideId}`, {
      method: 'DELETE'
    });

    return {
      success: true,
      message: response || 'Ride cancelled successfully!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Request to join a ride - NOT YET IMPLEMENTED IN BACKEND
export const requestRideJoin = async (rideId, requestData) => {
  try {
    if (!rideId) {
      throw new Error('Ride ID is required');
    }

    // TODO: Implement in backend first
    console.warn('requestRideJoin: Backend endpoint not yet implemented');
    
    return {
      success: false,
      error: 'Ride join requests not yet implemented in backend'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Get join requests for a ride (for ride owner) - NOT YET IMPLEMENTED
export const getRideRequests = async () => {
  try {
    console.warn('getRideRequests: Backend endpoint not yet implemented');
    return {
      success: false,
      error: 'Ride requests not yet implemented in backend',
      data: []
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Get user's sent ride join requests - NOT YET IMPLEMENTED
export const getUserSentRequests = async () => {
  try {
    console.warn('getUserSentRequests: Backend endpoint not yet implemented');
    return {
      success: false,
      error: 'User ride requests not yet implemented in backend',
      data: []
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

// Respond to a join request (confirm/decline) - NOT YET IMPLEMENTED
export const respondToRideRequest = async (requestId, action, message = '') => {
  try {
    console.warn('respondToRideRequest: Backend endpoint not yet implemented');
    return {
      success: false,
      error: 'Ride request responses not yet implemented in backend'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Get ride details by ID - NOT YET IMPLEMENTED
export const getRideById = async (rideId) => {
  try {
    if (!rideId) {
      throw new Error('Ride ID is required');
    }

    console.warn('getRideById: Backend endpoint not yet implemented');
    return {
      success: false,
      error: 'Get ride by ID not yet implemented in backend'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Get ride statistics for the current user - NOT YET IMPLEMENTED
export const getRideStats = async () => {
  try {
    console.warn('getRideStats: Backend endpoint not yet implemented');
    return {
      success: false,
      error: 'Ride statistics not yet implemented in backend',
      data: {}
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Validation helper for ride data
export const validateRideData = (rideData) => {
  const errors = [];
  
  if (!rideData.from?.trim()) errors.push('Starting location is required');
  if (!rideData.to?.trim()) errors.push('Destination is required');
  if (!rideData.date) errors.push('Date is required');
  if (!rideData.time) errors.push('Time is required');
  if (!rideData.vehicle?.trim()) errors.push('Vehicle information is required');
  if (!rideData.price || isNaN(rideData.price) || rideData.price <= 0) {
    errors.push('Valid price is required');
  }
  if (!rideData.seats || isNaN(rideData.seats) || rideData.seats < 1 || rideData.seats > 6) {
    errors.push('Seats must be between 1 and 6');
  }
  
  // Validate contacts
  const validContacts = rideData.contacts?.filter(c => c.value?.trim()) || [];
  if (validContacts.length === 0) {
    errors.push('At least one contact method is required');
  }
  
  // Validate date is in future
  const rideDateTime = new Date(`${rideData.date}T${rideData.time}`);
  if (rideDateTime <= new Date()) {
    errors.push('Ride date and time must be in the future');
  }
  
  return errors;
};
