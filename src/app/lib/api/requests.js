// Universal Request System API
// Handles requests across all modules: rooms, itemsell, lostfound, ticketsell, shareride

import { apiCall, API_CONFIG } from './base';

const BASE_URL = API_CONFIG.BASE_URL;

// Handle API errors consistently
const handleApiError = (error) => {
  console.error('Request API Error:', error);
  
  // Use existing error handling from apiCall
  if (error?.message) {
    throw new Error(error.message);
  } else {
    throw new Error('Something went wrong with your request');
  }
};

// Universal Request API Class
class UniversalRequestAPI {
  constructor(module) {
    this.module = module; // 'rooms', 'itemsell', 'lostfound', 'ticketsell', 'shareride'
    this.baseEndpoint = `/api/${module}`;
  }

  // Send a request for an item/service
  async sendRequest(itemId, data = {}) {
    try {
      const result = await apiCall(`${this.baseEndpoint}/${itemId}/request`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return result;
    } catch (error) {
      handleApiError(error);
    }
  }

  // Get requests received (what others want from me)
  async getReceivedRequests() {
    try {
      const result = await apiCall(`${this.baseEndpoint}/my/requests`);
      return result;
    } catch (error) {
      handleApiError(error);
    }
  }

  // Get requests sent (my requests to others)
  async getSentRequests() {
    try {
      const result = await apiCall(`${this.baseEndpoint}/requests/sent`);
      return result;
    } catch (error) {
      handleApiError(error);
    }
  }

  // Respond to a request (accept/reject)
  async respondToRequest(requestId, action) {
    try {
      const result = await apiCall(`${this.baseEndpoint}/requests/${requestId}/respond`, {
        method: 'PUT',
        body: JSON.stringify({ action }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return result;
    } catch (error) {
      handleApiError(error);
    }
  }

  // Cancel a request
  async cancelRequest(requestId) {
    try {
      const result = await apiCall(`${this.baseEndpoint}/requests/${requestId}`, {
        method: 'DELETE'
      });
      
      return result;
    } catch (error) {
      handleApiError(error);
    }
  }

  // Get request counts for dashboard
  async getRequestCounts() {
    try {
      const [received, sent] = await Promise.all([
        this.getReceivedRequests(),
        this.getSentRequests()
      ]);

      const receivedPending = received.data?.filter(req => req.status === 'pending').length || 0;
      const sentPending = sent.data?.filter(req => req.status === 'pending').length || 0;

      return {
        received: receivedPending,
        sent: sentPending,
        total: receivedPending + sentPending
      };
    } catch (error) {
      console.error(`Failed to get request counts for ${this.module}:`, error);
      return { received: 0, sent: 0, total: 0 };
    }
  }
}

// Create API instances for each module
export const roomsAPI = new UniversalRequestAPI('rooms');
export const marketplaceAPI = new UniversalRequestAPI('itemsell');
export const lostFoundAPI = new UniversalRequestAPI('lostfound');
export const ticketsAPI = new UniversalRequestAPI('ticketsell');
export const ridesAPI = new UniversalRequestAPI('shareride');

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
      rooms,
      marketplace,
      lostFound,
      tickets,
      rides,
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

// Export individual APIs and utility functions
export { UniversalRequestAPI, handleApiError };