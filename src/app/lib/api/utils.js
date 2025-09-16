// api/utils.js - Utility functions and helpers
import { apiCall, apiCallFormData } from './base.js';

// ============== UNIFIED DASHBOARD DATA ==============

export const fetchUserDashboardData = async () => {
  try {
    console.log('Fetching unified dashboard data...');

    // Fetch all dashboard data in parallel
    const [
      profileResponse,
      roomsResponse, 
      itemsResponse,
      ridesResponse,
      ticketsResponse,
      lostFoundResponse
    ] = await Promise.allSettled([
      apiCall('/profile/me'),
      apiCall('/api/rooms/my-rooms?limit=5'),
      apiCall('/itemsell/mine?limit=5'),
      apiCall('/api/shareride/my?limit=5'),
      apiCall('/api/tickets/my?limit=5'),
      apiCall('/api/lostfound/my?limit=5')
    ]);

    // Process responses
    const profile = profileResponse.status === 'fulfilled' ? profileResponse.value?.user : null;
    const rooms = roomsResponse.status === 'fulfilled' ? (roomsResponse.value?.data || []) : [];
    const items = itemsResponse.status === 'fulfilled' ? (itemsResponse.value?.data || []) : [];
    const rides = ridesResponse.status === 'fulfilled' ? (ridesResponse.value?.data || []) : [];
    const tickets = ticketsResponse.status === 'fulfilled' ? (ticketsResponse.value?.data || []) : [];
    const lostFound = lostFoundResponse.status === 'fulfilled' ? (lostFoundResponse.value?.data || []) : [];

    // Calculate stats
    const stats = {
      totalRooms: rooms.length,
      totalItems: items.length, 
      totalRides: rides.length,
      totalTickets: tickets.length,
      totalLostFound: lostFound.length,
      activeListings: rooms.length + items.length + rides.length + tickets.length,
      recentActivity: [
        ...rooms.slice(0, 3).map(room => ({ 
          type: 'room', 
          title: room.title, 
          date: room.created_at,
          status: 'active'
        })),
        ...items.slice(0, 3).map(item => ({ 
          type: 'item', 
          title: item.title, 
          date: item.created_at,
          status: 'active'
        })),
        ...rides.slice(0, 3).map(ride => ({ 
          type: 'ride', 
          title: `${ride.from} to ${ride.to}`, 
          date: ride.created_at,
          status: 'active'
        }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
    };

    return {
      success: true,
      data: {
        profile,
        rooms: rooms.slice(0, 5),
        items: items.slice(0, 5), 
        rides: rides.slice(0, 5),
        tickets: tickets.slice(0, 5),
        lostFound: lostFound.slice(0, 5),
        stats,
        errors: {
          profile: profileResponse.status === 'rejected' ? profileResponse.reason?.message : null,
          rooms: roomsResponse.status === 'rejected' ? roomsResponse.reason?.message : null,
          items: itemsResponse.status === 'rejected' ? itemsResponse.reason?.message : null,
          rides: ridesResponse.status === 'rejected' ? ridesResponse.reason?.message : null,
          tickets: ticketsResponse.status === 'rejected' ? ticketsResponse.reason?.message : null,
          lostFound: lostFoundResponse.status === 'rejected' ? lostFoundResponse.reason?.message : null
        }
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      success: false,
      error: error.message,
      data: {
        profile: null,
        rooms: [],
        items: [],
        rides: [],
        tickets: [],
        lostFound: [],
        stats: { totalRooms: 0, totalItems: 0, totalRides: 0, activeListings: 0, recentActivity: [] }
      }
    };
  }
};

// ============== UTILITY FUNCTIONS ==============

export const formatContactInfo = (contacts) => {
  const contactInfo = {};
  
  contacts.forEach(contact => {
    if (contact.value && contact.value.trim()) {
      contactInfo[contact.type] = contact.value.trim();
    }
  });
  
  return contactInfo;
};

export const parseContactInfo = (contactInfo) => {
  if (!contactInfo || typeof contactInfo !== 'object') {
    return [{ id: 1, type: 'mobile', value: '' }];
  }
  
  const contacts = [];
  let id = 1;
  
  Object.entries(contactInfo).forEach(([type, value]) => {
    if (value) {
      contacts.push({ id: id++, type, value });
    }
  });
  
  if (contacts.length === 0) {
    contacts.push({ id: 1, type: 'mobile', value: '' });
  }
  
  return contacts;
};

// Helper function to format dates consistently
export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString);
  const defaultOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options
  };
  
  return date.toLocaleDateString('en-IN', defaultOptions);
};

// Helper function to calculate time since posting
export const getTimeSince = (dateString) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInMs = now - postDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffInDays / 365)} year${Math.floor(diffInDays / 365) > 1 ? 's' : ''} ago`;
};

// Helper function to validate form data
export const validateRoomData = (roomData) => {
  const errors = [];
  
  if (!roomData.title?.trim()) errors.push('Title is required');
  if (!roomData.rent || roomData.rent <= 0) errors.push('Valid rent amount is required');
  if (!roomData.location?.trim()) errors.push('Location is required');
  if (!roomData.beds || roomData.beds <= 0) errors.push('Number of beds is required');
  if (!roomData.move_in_date) errors.push('Move-in date is required');
  
  return errors;
};

export const validateItemData = (itemData) => {
  const errors = [];
  
  if (!itemData.title?.trim()) errors.push('Title is required');
  if (!itemData.price || itemData.price <= 0) errors.push('Valid price is required');
  if (!itemData.category?.trim()) errors.push('Category is required');
  if (!itemData.condition?.trim()) errors.push('Condition is required');
  if (!itemData.location?.trim()) errors.push('Location is required');
  if (!itemData.available_from) errors.push('Available from date is required');
  
  return errors;
};

// Helper function to process file uploads with validation
export const validateImageFile = (file, options = {}) => {
  const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB default
  const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size: ${Math.round(maxSize / (1024 * 1024))}MB`);
  }
  
  return true;
};