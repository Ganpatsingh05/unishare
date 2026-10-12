// requests.js - Universal Request System (Spring Boot backend)
import { apiCall, API_CONFIG } from "./base";

// Handle API errors consistently
const handleApiError = (error) => {
  if (error?.message?.includes('Authentication required')) throw error;
  throw new Error(error?.message || 'Something went wrong with your request');
};

// Generic request API for modules that don't have real backend endpoints yet
// (rooms, itemsell, lostfound, ticketsell) — stubs that won't crash the app
class UniversalRequestAPI {
  constructor(module) {
    this.module = module;
    this.baseEndpoint = `/api/${module}`;
  }

  async sendRequest(itemId, data = {}) {
    try {
      return await apiCall(`${this.baseEndpoint}/${itemId}/request`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) { handleApiError(error); }
  }

  async getReceivedRequests() {
    try { return await apiCall(`${this.baseEndpoint}/my/requests`); }
    catch (error) { handleApiError(error); }
  }

  async getSentRequests() {
    try { return await apiCall(`${this.baseEndpoint}/requests/sent`); }
    catch (error) { handleApiError(error); }
  }

  async respondToRequest(requestId, action) {
    try {
      return await apiCall(`${this.baseEndpoint}/requests/${requestId}/respond`, {
        method: 'PUT',
        body: JSON.stringify({ action }),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) { handleApiError(error); }
  }

  async cancelRequest(requestId) {
    try {
      return await apiCall(`${this.baseEndpoint}/requests/${requestId}`, { method: 'DELETE' });
    } catch (error) { handleApiError(error); }
  }

  async getRequestCounts() {
    try {
      const [received, sent] = await Promise.all([
        this.getReceivedRequests(),
        this.getSentRequests()
      ]);
      const r = Array.isArray(received?.content) ? received.content : (received?.data || []);
      const s = Array.isArray(sent?.content) ? sent.content : (sent?.data || []);
      const receivedPending = r.filter(req => req.status === 'PENDING').length;
      const sentPending = s.filter(req => req.status === 'PENDING').length;
      return { received: receivedPending, sent: sentPending, total: receivedPending + sentPending };
    } catch (error) {
      console.error(`Failed to get request counts for ${this.module}:`, error);
      return { received: 0, sent: 0, total: 0 };
    }
  }
}

export const roomsAPI = new UniversalRequestAPI('rooms');
export const marketplaceAPI = new UniversalRequestAPI('itemsell');
export const lostFoundAPI = new UniversalRequestAPI('lostfound');
export const ticketsAPI = new UniversalRequestAPI('ticketsell');

// Rides uses dedicated endpoints matching the actual Spring Boot backend
export const ridesAPI = {
  // POST /api/rides/{rideId}/request
  async sendRequest(rideId, data = {}) {
    try {
      return await apiCall(`/api/rides/${rideId}/request`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) { handleApiError(error); }
  },

  // GET /api/rides/{rideId}/requests (requests on a ride I own)
  async getReceivedRequests(rideId) {
    try { return await apiCall(`/api/rides/${rideId}/requests`); }
    catch (error) { handleApiError(error); }
  },

  // GET /api/rides/my-requests (requests I sent as a passenger)
  async getSentRequests() {
    try { return await apiCall('/api/rides/my-requests'); }
    catch (error) { handleApiError(error); }
  },

  // POST /api/rides/{requestId}/approve or /decline
  async respondToRequest(requestId, action) {
    try {
      const endpoint = action === 'approve'
        ? `/api/rides/${requestId}/approve`
        : `/api/rides/${requestId}/decline`;
      return await apiCall(endpoint, { method: 'POST' });
    } catch (error) { handleApiError(error); }
  },

  // POST /api/rides/{requestId}/cancel
  async cancelRequest(requestId) {
    try { return await apiCall(`/api/rides/${requestId}/cancel`, { method: 'POST' }); }
    catch (error) { handleApiError(error); }
  },

  async getRequestCounts() {
    try {
      const sent = await this.getSentRequests();
      const pending = (sent?.content || []).filter(r => r.status === 'PENDING').length;
      return { received: 0, sent: pending, total: pending };
    } catch (error) {
      console.error('Failed to get ride request counts:', error);
      return { received: 0, sent: 0, total: 0 };
    }
  }
};

// Central function to get all request counts
export const getAllRequestCounts = async () => {
  try {
    const [rooms, marketplace, lostFound, tickets, rides] = await Promise.all([
      roomsAPI.getRequestCounts(),
      marketplaceAPI.getRequestCounts(),
      lostFoundAPI.getRequestCounts(),
      ticketsAPI.getRequestCounts(),
      ridesAPI.getRequestCounts()
    ]);
    return {
      rooms, marketplace, lostFound, tickets, rides,
      totalRequests: rooms.total + marketplace.total + lostFound.total + tickets.total + rides.total
    };
  } catch (error) {
    console.error('Failed to get all request counts:', error);
    return {
      rooms: { received: 0, sent: 0, total: 0 },
      marketplace: { received: 0, sent: 0, total: 0 },
      lostFound: { received: 0, sent: 0, total: 0 },
      tickets: { received: 0, sent: 0, total: 0 },
      rides: { received: 0, sent: 0, total: 0 },
      totalRequests: 0
    };
  }
};

export { UniversalRequestAPI, handleApiError };
