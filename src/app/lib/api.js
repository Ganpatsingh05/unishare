// lib/api.js - Updated with comprehensive profile management
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    // If no backend URL is configured, return mock data or throw a descriptive error
    if (!BACKEND_URL) {
      console.warn('NEXT_PUBLIC_BACKEND_URL is not configured. API calls will be mocked.');
      // Return mock data for development
      if (endpoint === '/auth/me') {
        return { isAuthenticated: false, user: null };
      }
      throw new Error('Backend URL not configured');
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      credentials: 'include', // Always include cookies
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();
    console.log("Api data: ",data);

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// Helper function for FormData calls (file uploads)
const apiCallFormData = async (endpoint, formData, method = 'POST') => {
  try {
    // If no backend URL is configured, return mock data or throw a descriptive error
    if (!BACKEND_URL) {
      console.warn('NEXT_PUBLIC_BACKEND_URL is not configured. FormData API calls will be mocked.');
      throw new Error('Backend URL not configured');
    }

    console.log(`FormData API call to: ${BACKEND_URL}${endpoint}`);
    console.log('FormData contents:', Array.from(formData.entries()));

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method,
      credentials: 'include',
      body: formData // Don't set Content-Type, let browser handle it for FormData
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      throw new Error(`Server returned non-JSON response (${response.status})`);
    }

    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || data.error || data.details || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// ============== AUTHENTICATION ==============

export const fetchCurrentUser = async () => {
  try {
    const data = await apiCall('/auth/me');
    console.log("User: ",data);
    return data.user;
  } catch (error) {
    return null;
  }
};

export const checkAuthStatus = async () => {
  try {
    const user = await fetchCurrentUser();
    return { authenticated: !!user, user };
  } catch (error) {
    return null;
  }
};

export const logout = async () => {
  try {
    await apiCall('/auth/logout', { method: 'GET' }); 
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};


export const startGoogleLogin = () => {
  window.location.href = `${BACKEND_URL}/auth/google`;
};

// ============== USER PROFILE MANAGEMENT ==============

export const fetchUserProfile = async () => {
  try {
    const data = await apiCall('/profile/me');
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to view your profile');
    }
    throw error;
  }
};

export const updateUserProfile = async (profileData, avatarFile = null) => {
  try {
    console.log('Updating profile with data:', profileData, 'has avatar:', !!avatarFile);

    // Use FormData for profile update (supports file upload)
    const formData = new FormData();
    
    // Add profile fields
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== undefined && profileData[key] !== null) {
        formData.append(key, profileData[key]);
      }
    });

    // Add avatar file if provided
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    const data = await apiCallFormData('/profile/me', formData, 'PUT');
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to update your profile');
    }
    throw error;
  }
};

export const uploadUserAvatar = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('avatar', imageFile);
    
    const data = await apiCallFormData('/profile/me', formData, 'PUT');
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to upload avatar');
    }
    throw error;
  }
};

export const deleteUserAvatar = async () => {
  try {
    const data = await apiCall('/profile/avatar', { method: 'DELETE' });
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to delete avatar');
    }
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const data = await apiCall('/profile/stats');
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to view stats');
    }
    throw error;
  }
};

export const getUserDashboard = async () => {
  try {
    const data = await apiCall('/profile/dashboard');
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to view dashboard');
    }
    throw error;
  }
};

export const fetchPublicProfile = async (userId) => {
  try {
    const data = await apiCall(`/profile/${userId}`);
    return data;
  } catch (error) {
    if (error.message.includes('404')) {
      throw new Error('Profile not found or not public');
    }
    throw error;
  }
};

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

// ============== ITEM MARKETPLACE ==============

export const fetchMarketplaceItems = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value !== '' && value != null)
    ).toString();
    
    const endpoint = queryString ? `/itemsell?${queryString}` : '/itemsell';
    const data = await apiCall(endpoint, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    return { data: [], error: error.message };
  }
};

export const fetchMyItems = async (options = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (options.limit) queryParams.set('limit', options.limit);
    if (options.offset) queryParams.set('offset', options.offset);
    if (options.sort) queryParams.set('sort', options.sort);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/itemsell/mine?${queryString}` : '/itemsell/mine';
    
    const data = await apiCall(endpoint, { method: 'GET' });
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to view your items');
    }
    throw error;
  }
};

// Create a new item listing with backend image upload
export const createItem = async (itemData, imageFile = null) => {
  try {
    console.log('Creating item with backend upload:', { 
      title: itemData.title, 
      hasImage: !!imageFile 
    });

    // Prepare FormData for backend
    const formData = new FormData();
    
    // Add item data
    formData.append('title', itemData.title);
    formData.append('price', itemData.price);
    formData.append('category', itemData.category);
    formData.append('condition', itemData.condition);
    formData.append('location', itemData.location);
    formData.append('available_from', itemData.available_from);
    formData.append('description', itemData.description || '');
    formData.append('contact_info', JSON.stringify(itemData.contact_info || {}));
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const data = await apiCallFormData('/itemsell', formData, 'POST');
    return data;
  } catch (error) {
    console.error('Error creating item:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to create an item listing');
    }
    throw error;
  }
};

export const updateItem = async (itemId, itemData, imageFile = null) => {
  try {
    console.log('Updating item with backend upload:', { 
      itemId, 
      title: itemData.title, 
      hasNewImage: !!imageFile 
    });

    // Prepare FormData for backend
    const formData = new FormData();
    
    // Add item data
    formData.append('title', itemData.title);
    formData.append('price', itemData.price);
    formData.append('category', itemData.category);
    formData.append('condition', itemData.condition);
    formData.append('location', itemData.location);
    formData.append('available_from', itemData.available_from);
    formData.append('description', itemData.description || '');
    formData.append('contact_info', JSON.stringify(itemData.contact_info || {}));
    
    // Add new image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const data = await apiCallFormData(`/itemsell/${itemId}`, formData, 'PUT');
    return data;
  } catch (error) {
    console.error('Error updating item:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to update this item');
    }
    if (error.message.includes('403')) {
      throw new Error('You can only update your own items');
    }
    throw error;
  }
};

export const deleteItem = async (itemId) => {
  try {
    const data = await apiCall(`/itemsell/${itemId}`, { method: 'DELETE' });
    return data;
  } catch (error) {
    console.error('Error deleting item:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to delete this item');
    }
    if (error.message.includes('403')) {
      throw new Error('You can only delete your own items');
    }
    throw error;
  }
};

export const fetchItem = async (itemId) => {
  try {
    const data = await apiCall(`/itemsell/${itemId}`, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching item:', error);
    if (error.message.includes('404')) {
      throw new Error('Item not found');
    }
    throw error;
  }
};

// ============== TICKET MARKETPLACE ==============

export const fetchTickets = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value !== '' && value != null)
    ).toString();
    const endpoint = queryString ? `/api/tickets?${queryString}` : '/api/tickets';
    const data = await apiCall(endpoint, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return { data: [], error: error.message };
  }
};

export const fetchMyTickets = async (options = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (options.limit) queryParams.set('limit', options.limit);
    if (options.offset) queryParams.set('offset', options.offset);
    if (options.sort) queryParams.set('sort', options.sort);
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/tickets/my?${queryString}` : '/api/tickets/my';
    const data = await apiCall(endpoint, { method: 'GET' });
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to view your tickets');
    }
    throw error;
  }
};

// Create a new ticket listing with backend image upload
export const createTicket = async (ticketData, imageFile = null) => {
  try {
    console.log('Creating ticket with backend upload:', { 
      title: ticketData.title, 
      hasImage: !!imageFile 
    });

    // Prepare FormData for backend
    const formData = new FormData();
    
    // Add ticket data as JSON string (backend expects it this way)
    formData.append('ticketData', JSON.stringify(ticketData));
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const data = await apiCallFormData('/api/tickets/create', formData, 'POST');
    return data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

export const updateTicket = async (ticketId, ticketData, imageFile = null) => {
  try {
    console.log('Updating ticket with backend upload:', { 
      ticketId, 
      title: ticketData.title, 
      hasNewImage: !!imageFile 
    });

    // Prepare FormData for backend
    const formData = new FormData();
    
    // Add ticket data as JSON string (backend expects it this way)
    formData.append('ticketData', JSON.stringify(ticketData));
    
    // Add new image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const data = await apiCallFormData(`/api/tickets/${ticketId}`, formData, 'PUT');
    return data;
  } catch (error) {
    console.error('Error updating ticket:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to update this ticket');
    }
    if (error.message.includes('403')) {
      throw new Error('You can only update your own tickets');
    }
    throw error;
  }
};

export const deleteTicket = async (ticketId) => {
  try {
    const data = await apiCall(`/api/tickets/${ticketId}`, { method: 'DELETE' });
    return data;
  } catch (error) {
    console.error('Error deleting ticket:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to delete this ticket');
    }
    if (error.message.includes('403')) {
      throw new Error('You can only delete your own tickets');
    }
    throw error;
  }
};

export const fetchTicket = async (ticketId) => {
  try {
    const data = await apiCall(`/api/tickets/${ticketId}`, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    if (error.message.includes('404')) {
      throw new Error('Ticket not found');
    }
    throw error;
  }
};

// ============== LOST & FOUND ==============

export const fetchLostFoundItems = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams(Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null && value !== '')).toString();
    const endpoint = queryString ? `/api/lostfound?${queryString}` : '/api/lostfound';
    const data = await apiCall(endpoint, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching lost/found items:', error);
    throw error;
  }
};

export const fetchMyLostFoundItems = async (options = {}) => {
  try {
    const queryString = new URLSearchParams(Object.entries(options).filter(([_, value]) => value !== undefined && value !== null && value !== '')).toString();
    const endpoint = queryString ? `/api/lostfound/my?${queryString}` : '/api/lostfound/my';
    const data = await apiCall(endpoint, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching user lost/found items:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to view your lost/found items');
    }
    throw error;
  }
};

// Create a new lost/found item with backend image upload
export const createLostFoundItem = async (itemData, imageFiles = []) => {
  try {
    console.log('Creating lost/found item with backend upload:', { 
      itemName: itemData.itemName, 
      mode: itemData.mode, 
      images: imageFiles?.length || 0 
    });

    const formData = new FormData();

    // Add item data as JSON string (backend expects it this way)
    formData.append('itemData', JSON.stringify(itemData));

    // Add images if provided (backend expects 'images' field for multiple files)
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
    }

    const data = await apiCallFormData('/api/lostfound/create', formData, 'POST');
    return data;
  } catch (error) {
    console.error('Error creating lost/found item:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to report lost/found items');
    }
    throw error;
  }
};

export const updateLostFoundItem = async (itemId, updateData) => {
  try {
    const data = await apiCall(`/api/lostfound/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    return data;
  } catch (error) {
    console.error('Error updating lost/found item:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to update this item');
    }
    if (error.message.includes('403')) {
      throw new Error('You can only update your own items');
    }
    throw error;
  }
};

export const deleteLostFoundItem = async (itemId) => {
  try {
    const data = await apiCall(`/api/lostfound/${itemId}`, { method: 'DELETE' });
    return data;
  } catch (error) {
    console.error('Error deleting lost/found item:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to delete this item');
    }
    if (error.message.includes('403')) {
      throw new Error('You can only delete your own items');
    }
    throw error;
  }
};

export const fetchLostFoundItem = async (itemId) => {
  try {
    const data = await apiCall(`/api/lostfound/${itemId}`, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching lost/found item:', error);
    if (error.message.includes('404')) {
      throw new Error('Item not found');
    }
    throw error;
  }
};

export const contactLostFoundItem = async (itemId, contactData) => {
  try {
    const data = await apiCall(`/api/lostfound/${itemId}/contact`, {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
    return data;
  } catch (error) {
    console.error('Error sending contact message:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to send messages');
    }
    if (error.message.includes('404')) {
      throw new Error('Item not found');
    }
    throw error;
  }
};

export const getLostFoundStats = async () => {
  try {
    const data = await apiCall('/api/lostfound/stats', { method: 'GET' });
    return data;
  } catch (error) {
    console.error('Error fetching lost/found stats:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to view statistics');
    }
    throw error;
  }
};

// ============== UNIFIED DASHBOARD DATA ==============

export const fetchUserDashboardData = async () => {
  try {
    // Use the new dashboard endpoint that fetches everything at once
    const dashboardData = await getUserDashboard();
    
    if (dashboardData.success) {
      return dashboardData;
    }
    
    // Fallback: Fetch components individually if dashboard endpoint fails
    const [userProfile, userRooms, userItems, userStats] = await Promise.allSettled([
      fetchUserProfile(),
      fetchMyRooms({ limit: 50 }),
      fetchMyItems({ limit: 50 }),
      getUserStats()
    ]);

    const result = {
      profile: null,
      rooms: [],
      items: [],
      stats: {
        totalRooms: 0,
        totalItems: 0,
        totalViews: 0,
        memberSince: null
      },
      errors: []
    };

    // Handle user profile
    if (userProfile.status === 'fulfilled' && userProfile.value?.success) {
      result.profile = userProfile.value.data;
    } else if (userProfile.status === 'rejected') {
      result.errors.push('Failed to fetch user profile');
    }

    // Handle user rooms
    if (userRooms.status === 'fulfilled' && userRooms.value?.success) {
      result.rooms = userRooms.value.data || [];
      result.stats.totalRooms = result.rooms.length;
    } else if (userRooms.status === 'rejected') {
      result.errors.push('Failed to fetch rooms');
    }

    // Handle user items
    if (userItems.status === 'fulfilled' && userItems.value?.success) {
      result.items = userItems.value.data || [];
      result.stats.totalItems = result.items.length;
    } else if (userItems.status === 'rejected') {
      result.errors.push('Failed to fetch items');
    }

    // Handle user stats
    if (userStats.status === 'fulfilled' && userStats.value?.success) {
      result.stats = { ...result.stats, ...userStats.value.data };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { success: false, error: error.message };
  }
};

// ============== IMAGE UPLOAD (Direct to backend) ==============

export const uploadItemImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const data = await apiCallFormData('/upload/item-image', formData, 'POST');
    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to upload images');
    }
    throw error;
  }
};

export const deleteItemImage = async (imagePath) => {
  try {
    const data = await apiCall('/upload/item-image', {
      method: 'DELETE',
      body: JSON.stringify({ imagePath })
    });
    return data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const uploadRoomImages = async (imageFiles) => {
  try {
    const formData = new FormData();
    imageFiles.forEach((file, index) => {
      formData.append(`images`, file);
    });
    
    const data = await apiCallFormData('/upload/room-images', formData, 'POST');
    return data;
  } catch (error) {
    console.error('Error uploading room images:', error);
    if (error.message.includes('401')) {
      throw new Error('Please log in to upload images');
    }
    throw error;
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