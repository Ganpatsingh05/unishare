// api/rideSharing.js - Ride sharing related API functions
import { apiCall } from './base.js';

// ===========================
// RIDESHARE API FUNCTIONS
// ===========================

// Fetch rides with filtering options
export const fetchRides = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.from) queryParams.append('from', filters.from);
    if (filters.to) queryParams.append('to', filters.to);
    if (filters.date) queryParams.append('date', filters.date);
    if (filters.seatsNeeded) queryParams.append('seatsNeeded', filters.seatsNeeded);
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.order) queryParams.append('order', filters.order);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);

    const endpoint = `/api/shareride${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiCall(endpoint, { method: 'GET' });

    return {
      success: true,
      data: response.data || [],
      total: response.total || 0,
      pagination: response.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching rides:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Create a new ride offer
export const createRide = async (rideData) => {
  try {
    // Validate required fields
    const requiredFields = ['from', 'to', 'date', 'time', 'seats', 'price', 'vehicle'];
    const missingFields = requiredFields.filter(field => !rideData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate date is in the future
    const rideDateTime = new Date(`${rideData.date}T${rideData.time}`);
    if (rideDateTime <= new Date()) {
      throw new Error('Ride date and time must be in the future');
    }

    // Validate price and seats
    if (isNaN(rideData.price) || rideData.price <= 0) {
      throw new Error('Price must be a positive number');
    }
    
    if (isNaN(rideData.seats) || rideData.seats <= 0 || rideData.seats > 6) {
      throw new Error('Seats must be between 1 and 6');
    }

    // Validate contacts
    if (!rideData.contacts || rideData.contacts.length === 0) {
      throw new Error('At least one contact method is required');
    }

    // Format contact info for backend
    const contactInfo = {};
    rideData.contacts.forEach(contact => {
      if (contact.value && contact.value.trim()) {
        contactInfo[contact.type] = contact.value.trim();
      }
    });

    const processedData = {
      from: rideData.from.trim(),
      to: rideData.to.trim(),
      date: rideData.date,
      time: rideData.time,
      seats: Number(rideData.seats),
      price: Number(rideData.price),
      vehicle: rideData.vehicle.trim(),
      description: rideData.description?.trim() || '',
      contact_info: contactInfo,
      contacts: rideData.contacts.filter(contact => contact.value.trim())
    };

    console.log('Creating ride with data:', processedData);

    const response = await apiCall('/api/shareride/create', {
      method: 'POST',
      body: JSON.stringify(processedData)
    });

    return {
      success: true,
      data: response.data || response,
      message: 'Ride posted successfully!'
    };
  } catch (error) {
    console.error('Error creating ride:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get rides posted by the current user
export const getMyRides = async () => {
  try {
    const response = await apiCall('/api/shareride/my', { method: 'GET' });

    return {
      success: true,
      data: response.data || []
    };
  } catch (error) {
    console.error('Error fetching my rides:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Update a ride
export const updateRide = async (rideId, updateData) => {
  try {
    if (!rideId) {
      throw new Error('Ride ID is required');
    }

    const response = await apiCall(`/api/shareride/${rideId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    return {
      success: true,
      data: response.data || response,
      message: 'Ride updated successfully!'
    };
  } catch (error) {
    console.error('Error updating ride:', error);
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

    const response = await apiCall(`/api/shareride/${rideId}`, {
      method: 'DELETE'
    });

    return {
      success: true,
      message: 'Ride cancelled successfully!'
    };
  } catch (error) {
    console.error('Error deleting ride:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Request to join a ride
export const requestRideJoin = async (rideId, requestData) => {
  try {
    if (!rideId) {
      throw new Error('Ride ID is required');
    }

    const processedData = {
      seatsRequested: requestData.seatsRequested || 1,
      message: requestData.message?.trim() || 'Hi, I would like to join your ride.',
      contactMethod: requestData.contactMethod || 'mobile',
      pickupLocation: requestData.pickupLocation?.trim() || ''
    };

    const response = await apiCall(`/api/shareride/${rideId}/request`, {
      method: 'POST',
      body: JSON.stringify(processedData)
    });

    return {
      success: true,
      data: response.data || response,
      message: 'Join request sent successfully!'
    };
  } catch (error) {
    console.error('Error requesting to join ride:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get join requests for a ride (for ride owner)
export const getRideRequests = async () => {
  try {
    const response = await apiCall('/api/shareride/my/requests', { method: 'GET' });

    return {
      success: true,
      data: response.data || []
    };
  } catch (error) {
    console.error('Error fetching ride requests:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Respond to a join request (confirm/decline)
export const respondToRideRequest = async (requestId, action, message = '') => {
  try {
    if (!requestId) {
      throw new Error('Request ID is required');
    }

    if (!['confirm', 'decline'].includes(action)) {
      throw new Error('Action must be either "confirm" or "decline"');
    }

    const response = await apiCall(`/api/shareride/requests/${requestId}/respond`, {
      method: 'PUT',
      body: JSON.stringify({
        action,
        message: message.trim()
      })
    });

    return {
      success: true,
      data: response.data || response,
      message: `Request ${action}ed successfully!`
    };
  } catch (error) {
    console.error('Error responding to ride request:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get ride details by ID
export const getRideById = async (rideId) => {
  try {
    if (!rideId) {
      throw new Error('Ride ID is required');
    }

    const response = await apiCall(`/api/shareride/${rideId}`, { method: 'GET' });

    return {
      success: true,
      data: response.data || response
    };
  } catch (error) {
    console.error('Error fetching ride details:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get ride statistics for the current user
export const getRideStats = async () => {
  try {
    const response = await apiCall('/api/shareride/stats', { method: 'GET' });

    return {
      success: true,
      data: response.data || {}
    };
  } catch (error) {
    console.error('Error fetching ride stats:', error);
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

// ===========================
// ADMIN FUNCTIONS
// ===========================

// Get all rides for admin view
export const getAllRidesAdmin = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.userId) queryParams.append('userId', filters.userId);
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.order) queryParams.append('order', filters.order);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);

    const endpoint = `/admin/shareride${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiCall(endpoint, { method: 'GET' });

    return {
      success: true,
      data: response.data || [],
      total: response.total || 0,
      pagination: response.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching rides (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get ride details by ID for admin
export const getRideByIdAdmin = async (rideId) => {
  try {
    if (!rideId) {
      throw new Error('Ride ID is required');
    }

    const response = await apiCall(`/admin/shareride/${rideId}`, { method: 'GET' });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching ride details (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Update ride status (admin)
export const updateRideStatusAdmin = async (rideId, status, reason = '') => {
  try {
    if (!rideId || !status) {
      throw new Error('Ride ID and status are required');
    }

    const response = await apiCall(`/admin/shareride/${rideId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason })
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating ride status (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete ride (admin)
export const deleteRideAdmin = async (rideId, reason = '') => {
  try {
    if (!rideId) {
      throw new Error('Ride ID is required');
    }

    const response = await apiCall(`/admin/shareride/${rideId}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason })
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error deleting ride (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get ride sharing statistics (admin)
export const getRideSharingStatsAdmin = async () => {
  try {
    const response = await apiCall('/admin/shareride/stats', { method: 'GET' });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching ride sharing stats (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get flagged rides (admin)
export const getFlaggedRidesAdmin = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.order) queryParams.append('order', filters.order);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);

    const endpoint = `/admin/shareride/flagged${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiCall(endpoint, { method: 'GET' });

    return {
      success: true,
      data: response.data || [],
      total: response.total || 0,
      pagination: response.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching flagged rides (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};