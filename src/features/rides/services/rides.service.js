// rides.service.js - Ride sharing API (Spring Boot backend)
import { apiCall } from '@lib/api/base.js';

// ===========================
// All endpoints: /api/rides/*
// Backend returns PageResponse: { content, page, size, totalElements, totalPages }
// ===========================

// Page/size may be passed either positionally or as one { page, size, limit } object.
const pageQuery = (pageOrOptions, size) => {
  const options =
    typeof pageOrOptions === 'object' && pageOrOptions !== null
      ? pageOrOptions
      : { page: pageOrOptions, size };
  const q = new URLSearchParams();
  q.append('page', options.page ?? 0);
  q.append('size', options.size ?? options.limit ?? size ?? 10);
  return q.toString();
};

// GET /api/rides?page=&size=
// The backend takes page and size only; `limit` is accepted as an alias for size
// because callers were written against an API that paged by limit.
export const fetchRides = async (filters = {}) => {
  try {
    const size = filters.size ?? filters.limit;
    const q = new URLSearchParams();
    if (filters.page !== undefined) q.append('page', filters.page);
    if (size !== undefined) q.append('size', size);
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

// GET /api/rides/my-rides?page=&size=
// Accepts either (page, size) or a single { page, size, limit } object.
export const getMyRides = async (page = 0, size = 10) => {
  try {
    const response = await apiCall(`/api/rides/my-rides?${pageQuery(page, size)}`);
    return { success: true, data: response.content || [], pagination: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// GET /api/rides/my-requests?page=&size=
export const getMyRequests = async (page = 0, size = 10) => {
  try {
    const response = await apiCall(`/api/rides/my-requests?${pageQuery(page, size)}`);
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
    const response = await apiCall(`/api/rides/${rideId}/requests?${pageQuery(page, size)}`);
    return { success: true, data: response.content || [], pagination: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Every seat request made to every ride I organize, flattened.
//
// The backend only exposes requests per ride (GET /api/rides/{rideId}/requests),
// with no "all incoming requests" endpoint, so this aggregates over my rides.
export const getAllIncomingRequests = async ({ page = 0, size = 100 } = {}) => {
  try {
    const mine = await getMyRides({ page: 0, size: 100 });
    if (!mine.success) return { success: false, error: mine.error };

    const perRide = await Promise.all(
      (mine.data || []).map((ride) => getRideRequests(ride.id, page, size))
    );

    return {
      success: true,
      data: perRide.flatMap((result) => (result.success ? result.data || [] : [])),
    };
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
// The UI vocabulary is confirm/decline; the backend endpoints are approve/decline.
const DECISION_ENDPOINTS = { approve: 'approve', confirm: 'approve', decline: 'decline', reject: 'decline' };

export const respondToRideRequest = async (requestId, action) => {
  try {
    if (!requestId || !action) throw new Error('Request ID and action are required');
    const decision = DECISION_ENDPOINTS[String(action).toLowerCase()];
    if (!decision) throw new Error('Action must be approve or decline');
    const endpoint = `/api/rides/${requestId}/${decision}`;
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
