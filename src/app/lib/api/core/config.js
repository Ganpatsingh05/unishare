// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:7500',
  TIMEOUT: 30000,
  
  ENDPOINTS: {
    // Auth
    AUTH: '/auth',
    
    // Rides
    RIDES: '/rides',
    RIDES_MY: '/rides/my-rides',
    
    // Housing
    ROOMS: '/rooms',
    ROOMS_MY: '/rooms/my-rooms',
    HOUSING: '/housing',
    
    // Marketplace
    MARKETPLACE: '/marketplace',
    ITEMS: '/itemsell',
    
    // Community
    ANNOUNCEMENTS: '/announcements',
    LOST_FOUND: '/lostfound',
    TICKETS: '/tickets',
    NOTICES: '/notices',
    
    // User
    PROFILE: '/profile',
    CONTACTS: '/contacts',
    
    // Admin
    ADMIN: '/admin',
    
    // Shared
    NOTIFICATIONS: '/notifications',
    RESOURCES: '/resources',
    REQUESTS: '/requests'
  }
};

export default API_CONFIG;
