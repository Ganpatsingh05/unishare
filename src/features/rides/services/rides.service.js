// rides.service.js - Ride sharing API (Spring Boot backend)
import { apiCall } from '@lib/api/base.js';

// ===========================
// All endpoints: /api/rides/*
// Backend returns PageResponse: { content, page, size, totalElements, totalPages }
// ===========================

// GET /api/rides?page=&size=&sort=
export const fetchRides = async (filters = {}) => {
  try {
    const q = new URLSearchParams();
    if (filters.page !== undefined) q.append('page', filters.page);
    if (filters.size !== undefined) q.append('size', filters.size);
    if (filters.sort) q.append('sort', filters.sort);
    const endpoint = '/api/rides' + (q.toString() ? '?' + q.toString() : '');
    const response = await apiCall(endpoint, { method: 'GET' });
    return {
      success: true,
      data: response.content || [],
      total: response.totalElements || 0,
      pagination: {
        page: response.page || 0,
        size: response.size || 10,
        totalPages: response.totalPages || 0,
        totalElements: response.totalElements || 0
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// POST /api/rides
export const createRide = async (rideData) => {
  try {
    const required = ['fromLocation', 'toLocation', 'rideDate', 'rideTime', 'totalSeats', 'price', 'vehicleInfo'];
    const missing = required.filter(f => !rideData[f]);
    if (missing.length) throw new Error('Missing required fields: ' + missing.join(', '));
    if (new Date(rideData.rideDate + 'T' + rideData.rideTime) <= new Date())
      throw new Error('Ride date and time must be in the future');
    if (isNaN(rideData.price) || rideData.price <= 0) throw new Error('Price must be a positive number');
    if (isNaN(rideData.totalSeats) || rideData.totalSeats <= 0 || rideData.totalSeats > 6)
      throw new Error('Seats must be between 1 and 6');
    if (!rideData.contactInfo || Object.keys(rideData.contactInfo).length === 0)
      throw new Error('At least one contact method is required');

    const payload = {
      fromLocation: rideData.fromLocation.trim(),
      toLocation: rideData.toLocation.trim(),
      rideDate: rideData.rideDate,
      rideTime: rideData.rideTime,
      totalSeats: Number(rideData.totalSeats),
      price: Number(rideData.price),
      vehicleInfo: rideData.vehicleInfo.trim(),
      description: rideData.description?.trim() || '',
      contactInfo: rideData.contactInfo
    };
    const response = await apiCall('/api/rides', { method: 'POST', body: JSON.stringify(payload) });
    return { success: true, data: response, message: 'Ride posted successfully!' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// GET /api/rides/my-rides
export const getMyRides = async (page = 0, size = 10) => {
  try {
    const response = await apiCall(`/api/rides/my-rides?page=${page}&size=${size}`);
    return { success: true, data: response.content || [], pagination: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// GET /api/rides/my-requests
export const getMyRequests = async (page = 0, size = 10) => {
  try {
    const response = await apiCall(`/api/rides/my-requests?page=${page}&size=${size}`);
    return { success: true, data: response.content || [], pagination: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// NOTE: GET /api/rides/{id} does NOT exist on the backend yet.
export const getRideById = async (rideId) => {
  console.warn('getRideById: No backend endpoint for GET /api/rides/{id}.');
  return { success: false, error: 'Endpoint not available on backend' };
};

// POST /api/rides/{rideId}/request
export const requestRideJoin = async (rideId, requestData) => {
  try {
    if (!rideId) throw new Error('Ride ID is required');
    const payload = {
      seatsRequested: Number(requestData.seatsRequested) || 1,
      message: requestData.message?.trim() || ''
    };
    const response = await apiCall(`/api/rides/${rideId}/request`, { method: 'POST', body: JSON.stringify(payload) });
    return { success: true, data: response, message: 'Ride request sent successfully!' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// GET /api/rides/{rideId}/requests
export const getRideRequests = async (rideId, page = 0, size = 10) => {
  try {
    if (!rideId) throw new Error('Ride ID is required');
    const response = await apiCall(`/api/rides/${rideId}/requests?page=${page}&size=${size}`);
    return { success: true, data: response.content || [], pagination: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// GET /api/rides/{rideId}/passengers
export const getRidePassengers = async (rideId, page = 0, size = 10) => {
  try {
    if (!rideId) throw new Error('Ride ID is required');
    const response = await apiCall(`/api/rides/${rideId}/passengers?page=${page}&size=${size}`);
    return { success: true, data: response.content || [], pagination: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// POST /api/rides/{requestId}/approve or /decline
export const respondToRideRequest = async (requestId, action) => {
  try {
    if (!requestId || !action) throw new Error('Request ID and action are required');
    if (!['approve', 'decline'].includes(action)) throw new Error('Action must be approve or decline');
    const endpoint = `/api/rides/${requestId}/${action}`;
    const response = await apiCall(endpoint, { method: 'POST' });
    return { success: true, data: response, message: `Request ${action}d successfully!` };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// POST /api/rides/{requestId}/cancel
export const cancelRideRequest = async (requestId) => {
  try {
    if (!requestId) throw new Error('Request ID is required');
    const response = await apiCall(`/api/rides/${requestId}/cancel`, { method: 'POST' });
    return { success: true, data: response, message: 'Request cancelled successfully!' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// PATCH /api/rides/{id}
export const updateRide = async (rideId, rideData) => {
  try {
    if (!rideId) throw new Error('Ride ID is required');
    const payload = {
      fromLocation: rideData.fromLocation?.trim(),
      toLocation: rideData.toLocation?.trim(),
      rideDate: rideData.rideDate,
      rideTime: rideData.rideTime,
      totalSeats: Number(rideData.totalSeats),
      price: Number(rideData.price),
      vehicleInfo: rideData.vehicleInfo?.trim(),
      description: rideData.description?.trim() || '',
      contactInfo: rideData.contactInfo
    };
    const response = await apiCall(`/api/rides/${rideId}`, { method: 'PATCH', body: JSON.stringify(payload) });
    return { success: true, data: response, message: 'Ride updated successfully!' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// DELETE /api/rides/{id}
export const deleteRide = async (rideId) => {
  try {
    if (!rideId) throw new Error('Ride ID is required');
    const response = await apiCall(`/api/rides/${rideId}`, { method: 'DELETE' });
    return { success: true, data: response, message: 'Ride cancelled successfully!' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Alias
export const getUserSentRequests = async () => getMyRequests();

// No stats endpoint on backend
export const getRideStats = async () => {
  console.warn('getRideStats: No backend endpoint for ride statistics.');
  return { success: false, error: 'Endpoint not available on backend' };
};

// Validate ride data client-side
export const validateRideData = (rideData) => {
  const errors = [];
  if (!rideData.fromLocation?.trim()) errors.push('From location is required');
  if (!rideData.toLocation?.trim()) errors.push('To location is required');
  if (!rideData.rideDate) errors.push('Ride date is required');
  if (!rideData.rideTime) errors.push('Ride time is required');
  if (!rideData.totalSeats || isNaN(rideData.totalSeats) || rideData.totalSeats <= 0 || rideData.totalSeats > 6)
    errors.push('Total seats must be between 1 and 6');
  if (!rideData.price || isNaN(rideData.price) || rideData.price <= 0)
    errors.push('Price must be a positive number');
  if (!rideData.vehicleInfo?.trim()) errors.push('Vehicle info is required');
  if (!rideData.contactInfo || Object.keys(rideData.contactInfo).length === 0)
    errors.push('At least one contact method is required');
  if (rideData.rideDate && rideData.rideTime) {
    if (new Date(rideData.rideDate + 'T' + rideData.rideTime) <= new Date())
      errors.push('Ride date and time must be in the future');
  }
  return errors;
};
