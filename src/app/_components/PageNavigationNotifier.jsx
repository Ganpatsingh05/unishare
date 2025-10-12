"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * PageNavigationNotifier - Shows Dynamic Island notifications when users navigate to different pages
 * 
 * This component tracks route changes and displays contextual welcome messages
 * for each page/section of the application.
 */
const PageNavigationNotifier = () => {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const hasShownNotification = useRef(new Set());

  // Define page-specific messages
    const pageMessages = {
    // Main sections
    '/': {
        type: 'home',
        title: 'Welcome Home',
        message: 'Discover what UniShare has for you.',
        skipIfFirst: true
    },

    // Housing & Accommodation
    '/housing': {
        type: 'home',
        title: 'Housing & Rooms',
        message: 'Find the right place to stay.',
    },
    '/housing/post': {
        type: 'home',
        title: 'Post a Room',
        message: 'List your room and find a roommate.',
    },
    '/housing/search': {
        type: 'search',
        title: 'Search Rooms',
        message: 'Explore rooms near your campus.',
    },

    // Ride Sharing
    '/share-ride': {
        type: 'network',
        title: 'Ride Sharing',
        message: 'Share rides and travel smarter.',
    },
    '/share-ride/postride': {
        type: 'send',
        title: 'Offer a Ride',
        message: 'Post your ride to help others out.',
    },
    '/share-ride/findride': {
        type: 'search',
        title: 'Find a Ride',
        message: 'Search rides heading your way.',
    },

    // Marketplace
    '/marketplace': {
        type: 'cart',
        title: 'Marketplace',
        message: 'Buy and sell with fellow students.',
    },
    '/marketplace/buy': {
        type: 'cart',
        title: 'Browse Items',
        message: 'Find great deals around campus.',
    },
    '/marketplace/sell': {
        type: 'package',
        title: 'Sell Items',
        message: 'List what you don’t need anymore.',
    },

    // Tickets
    '/ticket': {
        type: 'star',
        title: 'Event Tickets',
        message: 'Buy or sell tickets easily.',
    },
    '/ticket/buy': {
        type: 'search',
        title: 'Find Tickets',
        message: 'Browse tickets for upcoming events.',
    },
    '/ticket/sell': {
        type: 'send',
        title: 'Sell Tickets',
        message: 'List your event tickets for sale.',
    },

    // Lost & Found
    '/lost-found': {
        type: 'search',
        title: 'Lost & Found',
        message: 'Help return lost items to their owners.',
    },
    '/lost-found/report': {
        type: 'alert',
        title: 'Report Lost Item',
        message: 'Let others know what you lost.',
    },
    '/lost-found/found': {
        type: 'checkcheck',
        title: 'Report Found Item',
        message: 'Report something you’ve found.',
    },

    // Resources
    '/resources': {
        type: 'file',
        title: 'Study Resources',
        message: 'Access notes and study materials.',
    },

    // Announcements
    '/announcements': {
        type: 'notification',
        title: 'Announcements',
        message: 'Stay updated with the latest news.',
    },
    '/announcements/submit': {
        type: 'send',
        title: 'Create Announcement',
        message: 'Share news with the community.',
    },

    // Contacts
    '/contacts': {
        type: 'user',
        title: 'Campus Contacts',
        message: 'Find key contacts and details.',
    },

    // User Profile & Settings
    '/profile': {
        type: 'user',
        title: 'Your Profile',
        message: 'Update your details and preferences.',
    },
    '/settings': {
        type: 'settings',
        title: 'Settings',
        message: 'Customize your UniShare experience.',
    },
    '/my-activity': {
        type: 'user',
        title: 'My Activity',
        message: 'View your recent posts and listings.',
    },

    // Authentication
    '/login': {
        type: 'auth',
        title: 'Sign In',
        message: 'Welcome back to UniShare.',
    },
    '/register': {
        type: 'userplus',
        title: 'Join UniShare',
        message: 'Create your account to get started.',
    },

    // Info pages
    '/info/about': {
        type: 'info',
        title: 'About UniShare',
        message: 'Learn more about what we do.',
    },
    '/info/help': {
        type: 'info',
        title: 'Help Center',
        message: 'Get help and quick answers.',
    },
    '/info/faqs': {
        type: 'info',
        title: 'FAQs',
        message: 'See answers to common questions.',
    },
    };


  useEffect(() => {
    // Skip if this is the initial mount
    if (previousPathname.current === pathname) {
      return;
    }

    // Check if we should show a notification for this page
    const pageConfig = pageMessages[pathname];
    
    if (pageConfig) {
      // Skip if this is the homepage and it's the first visit (welcome message handles this)
      if (pageConfig.skipIfFirst && !previousPathname.current) {
        previousPathname.current = pathname;
        return;
      }

      // Create a unique key for this navigation event
      const navigationKey = `${previousPathname.current}->${pathname}`;
      
      // Only show if we haven't shown this exact navigation before
      if (!hasShownNotification.current.has(navigationKey)) {
        hasShownNotification.current.add(navigationKey);
        
        // Small delay to ensure page has started transitioning
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('dynamicIslandNotification', {
            detail: {
              type: pageConfig.type,
              title: pageConfig.title,
              message: pageConfig.message,
              duration: 4000 // 4 seconds for page notifications
            }
          }));
        }, 300); // 300ms delay for smoother transition
      }
    }

    // Update previous pathname
    previousPathname.current = pathname;
    
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default PageNavigationNotifier;
