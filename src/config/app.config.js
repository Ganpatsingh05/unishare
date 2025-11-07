/**
 * UniShare Application Configuration
 * Central configuration file for environment variables, constants, and route configurations
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  TIMEOUT: 30000,
  ENDPOINTS: {
    AUTH: '/api/auth',
    USERS: '/api/users',
    RIDES: '/api/rides',
    HOUSING: '/api/housing',
    MARKETPLACE: '/api/marketplace',
    LOST_FOUND: '/api/lost-found',
    TICKETS: '/api/tickets',
    RESOURCES: '/api/resources',
    ANNOUNCEMENTS: '/api/announcements',
  },
};

// Route Configuration
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Share Ride Routes
  SHARE_RIDE: {
    HOME: '/share-ride',
    FIND: '/share-ride/findride',
    POST: '/share-ride/postride',
    MY_RIDES: '/profile/my-rides',
  },
  
  // Housing Routes
  HOUSING: {
    HOME: '/housing',
    SEARCH: '/housing/search',
    POST: '/housing/post',
    MY_ROOMS: '/profile/my-rooms',
  },
  
  // Marketplace Routes
  MARKETPLACE: {
    HOME: '/marketplace',
    BUY: '/marketplace/buy',
    SELL: '/marketplace/sell',
    MY_ITEMS: '/profile/my-items',
  },
  
  // Lost & Found Routes
  LOST_FOUND: {
    HOME: '/lost-found',
    REPORT: '/lost-found/report',
    FOUND: '/lost-found/found',
    VIEW_LOST: '/lost-found/view-lost',
    VIEW_FOUND: '/lost-found/view-found',
    MY_LOST: '/profile/my-lost-items',
    MY_FOUND: '/profile/my-found-items',
  },
  
  // Ticket Routes
  TICKET: {
    HOME: '/ticket',
    MY_TICKETS: '/profile/my-tickets',
  },
  
  // Resources Routes
  RESOURCES: {
    HOME: '/resources',
  },
  
  // Admin Routes
  ADMIN: {
    HOME: '/admin',
    USERS: '/admin/users',
    ANALYTICS: '/admin/analytics',
    MODERATION: '/admin/moderation',
    ANNOUNCEMENTS: '/admin/announcements',
    NOTIFICATIONS: '/admin/notifications',
    RESOURCES: '/admin/resources',
    CONTACTS: '/admin/contacts',
    NOTICE: '/admin/notice',
  },
  
  // Activity Routes
  ACTIVITY: {
    HOME: '/my-activity',
    REQUESTS: '/my-activity/requests',
  },
  
  // Info Routes
  INFO: {
    ABOUT: '/info/about',
    MISSION: '/info/mission',
    CAREERS: '/info/careers',
    HELP: '/info/help',
    FAQS: '/info/faqs',
    FEEDBACK: '/info/feedback',
    SUPPORT: '/info/support-guidelines',
    GUIDELINES: '/info/guidelines',
    TERMS: '/info/terms',
    PRIVACY: '/info/privacy',
    COOKIES: '/info/cookies',
    DATA_PROTECTION: '/info/data-protection',
    REPORT: '/info/report',
    BUY_COFFEE: '/info/buy-coffee',
  },
};

// Theme Configuration
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: '#facc15', // Yellow
    SECONDARY: '#38bdf8', // Sky Blue
    SHARERIDE_BG: '#1D3557', // Deep Ocean Blue
    DARK_BG: '#0f172a',
    LIGHT_BG: '#ffffff',
  },
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1280,
  },
};

// Feature Flags
export const FEATURES = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_ANALYTICS: false,
  ENABLE_COOKIE_CONSENT: true,
  ENABLE_DYNAMIC_ISLAND: true,
};

// Application Constants
export const APP_CONSTANTS = {
  APP_NAME: 'UniShare',
  DEFAULT_LANGUAGE: 'en',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  ITEMS_PER_PAGE: 20,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
};

// Service-specific Configuration
export const SERVICE_CONFIG = {
  SHARE_RIDE: {
    MAX_SEATS: 8,
    MIN_SEATS: 1,
    MAX_PRICE: 10000,
    BOOKING_ADVANCE_DAYS: 30,
  },
  HOUSING: {
    MAX_RENT: 100000,
    MIN_RENT: 0,
    MAX_IMAGES: 10,
  },
  MARKETPLACE: {
    MAX_PRICE: 1000000,
    MIN_PRICE: 0,
    MAX_IMAGES: 8,
  },
  LOST_FOUND: {
    MAX_IMAGES: 5,
    REPORT_EXPIRY_DAYS: 90,
  },
};

export default {
  API_CONFIG,
  ROUTES,
  THEME_CONFIG,
  FEATURES,
  APP_CONSTANTS,
  SERVICE_CONFIG,
};
