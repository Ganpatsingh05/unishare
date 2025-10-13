/**
 * Action Notifications Utility
 * 
 * Comprehensive notification system for all user actions in UniShare
 * Shows Dynamic Island notifications for every significant user interaction
 */

import { showDynamicIslandNotification } from '../../_components/DynamicIsland';

// ============================================
// HOUSING & ROOMS NOTIFICATIONS
// ============================================

export const HousingNotifications = {
  // Room Listing Actions
  roomPosted: (roomTitle) => showDynamicIslandNotification({
    type: 'success',
    title: 'Room Listed!',
    message: `"${roomTitle}" is now live and visible to students`,
    duration: 5000
  }),

  roomUpdated: () => showDynamicIslandNotification({
    type: 'checkcheck',
    title: 'Room Updated',
    message: 'Your listing has been successfully updated',
    duration: 4000
  }),

  roomDeleted: () => showDynamicIslandNotification({
    type: 'success',
    title: 'Room Removed',
    message: 'Your listing has been deleted',
    duration: 4000
  }),

  // Room Search & View Actions
  roomViewed: (roomTitle) => showDynamicIslandNotification({
    type: 'info',
    title: 'Viewing Room',
    message: roomTitle,
    duration: 3000
  }),

  roomSaved: () => showDynamicIslandNotification({
    type: 'star',
    title: 'Room Saved',
    message: 'Added to your favorites',
    duration: 3500
  }),

  roomUnsaved: () => showDynamicIslandNotification({
    type: 'info',
    title: 'Room Removed',
    message: 'Removed from favorites',
    duration: 3000
  }),

  // Contact & Interest Actions
  contactRequested: () => showDynamicIslandNotification({
    type: 'send',
    title: 'Interest Sent!',
    message: 'The room owner will contact you soon',
    duration: 5000
  }),

  phoneRevealed: () => showDynamicIslandNotification({
    type: 'unlocked',
    title: 'Contact Revealed',
    message: 'You can now see the phone number',
    duration: 4000
  }),

  emailSent: () => showDynamicIslandNotification({
    type: 'send',
    title: 'Email Sent',
    message: 'Your message has been delivered',
    duration: 4000
  }),
};

// ============================================
// RIDE SHARING NOTIFICATIONS
// ============================================

export const RideNotifications = {
  // Ride Posting Actions
  ridePosted: (destination) => showDynamicIslandNotification({
    type: 'success',
    title: 'Ride Posted!',
    message: `Your ride to ${destination} is now available`,
    duration: 5000
  }),

  rideUpdated: () => showDynamicIslandNotification({
    type: 'checkcheck',
    title: 'Ride Updated',
    message: 'Your ride details have been saved',
    duration: 4000
  }),

  rideCancelled: () => showDynamicIslandNotification({
    type: 'warning',
    title: 'Ride Cancelled',
    message: 'All passengers have been notified',
    duration: 5000
  }),

  // Ride Finding Actions
  rideRequested: (driverName) => showDynamicIslandNotification({
    type: 'send',
    title: 'Request Sent!',
    message: `Waiting for ${driverName}'s confirmation`,
    duration: 5000
  }),

  rideJoined: () => showDynamicIslandNotification({
    type: 'usercheck',
    title: 'Seat Confirmed!',
    message: 'You\'ve successfully joined this ride',
    duration: 5000
  }),

  rideLeft: () => showDynamicIslandNotification({
    type: 'info',
    title: 'Ride Left',
    message: 'You have left the ride',
    duration: 4000
  }),

  // Ride Management
  passengerAccepted: (passengerName) => showDynamicIslandNotification({
    type: 'usercheck',
    title: 'Passenger Accepted',
    message: `${passengerName} joined your ride`,
    duration: 4500
  }),

  passengerRejected: () => showDynamicIslandNotification({
    type: 'info',
    title: 'Request Declined',
    message: 'Passenger request has been declined',
    duration: 4000
  }),

  rideFull: () => showDynamicIslandNotification({
    type: 'warning',
    title: 'Ride Full',
    message: 'All seats have been taken',
    duration: 4000
  }),
};

// ============================================
// MARKETPLACE (BUY/SELL) NOTIFICATIONS
// ============================================

export const MarketplaceNotifications = {
  // Item Listing Actions
  itemListed: (itemName) => showDynamicIslandNotification({
    type: 'success',
    title: 'Item Listed!',
    message: `"${itemName}" is now available for sale`,
    duration: 5000
  }),

  itemUpdated: () => showDynamicIslandNotification({
    type: 'checkcheck',
    title: 'Item Updated',
    message: 'Your listing has been updated',
    duration: 4000
  }),

  itemSold: (itemName) => showDynamicIslandNotification({
    type: 'success',
    title: 'Item Sold!',
    message: `Congratulations! "${itemName}" has been sold`,
    duration: 5000
  }),

  itemDeleted: () => showDynamicIslandNotification({
    type: 'info',
    title: 'Item Removed',
    message: 'Your listing has been deleted',
    duration: 4000
  }),

  // Shopping Actions
  itemAddedToCart: (itemName) => showDynamicIslandNotification({
    type: 'cart',
    title: 'Added to Cart',
    message: itemName,
    duration: 3500
  }),

  itemRemovedFromCart: () => showDynamicIslandNotification({
    type: 'info',
    title: 'Removed from Cart',
    message: 'Item removed successfully',
    duration: 3000
  }),

  itemLiked: () => showDynamicIslandNotification({
    type: 'like',
    title: 'Item Liked',
    message: 'Added to your wishlist',
    duration: 3500
  }),

  itemUnliked: () => showDynamicIslandNotification({
    type: 'info',
    title: 'Removed from Wishlist',
    message: 'Item unliked',
    duration: 3000
  }),

  // Purchase Actions
  purchaseRequested: (sellerName) => showDynamicIslandNotification({
    type: 'send',
    title: 'Purchase Request Sent',
    message: `Waiting for ${sellerName}'s response`,
    duration: 5000
  }),

  purchaseConfirmed: () => showDynamicIslandNotification({
    type: 'success',
    title: 'Purchase Confirmed!',
    message: 'Contact the seller to arrange pickup',
    duration: 5000
  }),

  offerMade: (amount) => showDynamicIslandNotification({
    type: 'send',
    title: 'Offer Submitted',
    message: `Your offer of $${amount} has been sent`,
    duration: 4500
  }),

  offerReceived: (amount) => showDynamicIslandNotification({
    type: 'notification',
    title: 'New Offer!',
    message: `Someone offered $${amount} for your item`,
    duration: 5000
  }),
};

// ============================================
// TICKETS NOTIFICATIONS
// ============================================

export const TicketNotifications = {
  // Ticket Listing
  ticketListed: (eventName) => showDynamicIslandNotification({
    type: 'success',
    title: 'Ticket Listed!',
    message: `Your ${eventName} ticket is now available`,
    duration: 5000
  }),

  ticketUpdated: () => showDynamicIslandNotification({
    type: 'checkcheck',
    title: 'Ticket Updated',
    message: 'Ticket details have been saved',
    duration: 4000
  }),

  ticketSold: () => showDynamicIslandNotification({
    type: 'success',
    title: 'Ticket Sold!',
    message: 'Your ticket has been purchased',
    duration: 5000
  }),

  // Ticket Purchase
  ticketPurchased: (eventName) => showDynamicIslandNotification({
    type: 'success',
    title: 'Ticket Purchased!',
    message: `You got a ticket for ${eventName}`,
    duration: 5000
  }),

  ticketRequested: () => showDynamicIslandNotification({
    type: 'send',
    title: 'Request Sent',
    message: 'Waiting for seller confirmation',
    duration: 4500
  }),

  ticketTransferred: () => showDynamicIslandNotification({
    type: 'checkcheck',
    title: 'Ticket Transferred',
    message: 'Ticket ownership has been transferred',
    duration: 4500
  }),

  ticketCancelled: () => showDynamicIslandNotification({
    type: 'warning',
    title: 'Ticket Cancelled',
    message: 'Your ticket listing has been removed',
    duration: 4000
  }),
};

// ============================================
// LOST & FOUND NOTIFICATIONS
// ============================================

export const LostFoundNotifications = {
  // Lost Item Actions
  lostItemReported: (itemName) => showDynamicIslandNotification({
    type: 'success',
    title: 'Lost Item Reported',
    message: `"${itemName}" has been added to lost items`,
    duration: 5000
  }),

  lostItemUpdated: () => showDynamicIslandNotification({
    type: 'checkcheck',
    title: 'Report Updated',
    message: 'Lost item details have been updated',
    duration: 4000
  }),

  lostItemFound: (itemName) => showDynamicIslandNotification({
    type: 'success',
    title: 'Item Found!',
    message: `Great news! "${itemName}" has been found`,
    duration: 6000
  }),

  lostItemClosed: () => showDynamicIslandNotification({
    type: 'info',
    title: 'Report Closed',
    message: 'Lost item report has been closed',
    duration: 4000
  }),

  // Found Item Actions
  foundItemPosted: (itemName) => showDynamicIslandNotification({
    type: 'success',
    title: 'Found Item Posted',
    message: `"${itemName}" is now in found items`,
    duration: 5000
  }),

  foundItemUpdated: () => showDynamicIslandNotification({
    type: 'checkcheck',
    title: 'Item Updated',
    message: 'Found item details have been updated',
    duration: 4000
  }),

  foundItemClaimed: () => showDynamicIslandNotification({
    type: 'success',
    title: 'Item Claimed!',
    message: 'The owner has been notified',
    duration: 5000
  }),

  // Matching & Contact
  potentialMatchFound: () => showDynamicIslandNotification({
    type: 'notification',
    title: 'Possible Match!',
    message: 'We found an item that might be yours',
    duration: 6000
  }),

  claimRequested: (itemName) => showDynamicIslandNotification({
    type: 'send',
    title: 'Claim Submitted',
    message: `Your claim for "${itemName}" has been sent`,
    duration: 5000
  }),

  ownerContacted: () => showDynamicIslandNotification({
    type: 'message',
    title: 'Message Sent',
    message: 'The finder has been contacted',
    duration: 4500
  }),
};

// ============================================
// ANNOUNCEMENTS NOTIFICATIONS
// ============================================

export const AnnouncementNotifications = {
  // Announcement Actions
  announcementPosted: (title) => showDynamicIslandNotification({
    type: 'success',
    title: 'Announcement Posted!',
    message: `"${title}" is now live`,
    duration: 5000
  }),

  announcementUpdated: () => showDynamicIslandNotification({
    type: 'checkcheck',
    title: 'Announcement Updated',
    message: 'Your announcement has been updated',
    duration: 4000
  }),

  announcementDeleted: () => showDynamicIslandNotification({
    type: 'info',
    title: 'Announcement Deleted',
    message: 'Your announcement has been removed',
    duration: 4000
  }),

  // Engagement Actions
  announcementLiked: () => showDynamicIslandNotification({
    type: 'like',
    title: 'Announcement Liked',
    message: 'Added to your liked announcements',
    duration: 3500
  }),

  announcementShared: () => showDynamicIslandNotification({
    type: 'send',
    title: 'Announcement Shared',
    message: 'Shared with your network',
    duration: 4000
  }),

  commentPosted: () => showDynamicIslandNotification({
    type: 'message',
    title: 'Comment Posted',
    message: 'Your comment has been added',
    duration: 3500
  }),

  announcementSaved: () => showDynamicIslandNotification({
    type: 'star',
    title: 'Announcement Saved',
    message: 'Added to your saved items',
    duration: 3500
  }),
};

// ============================================
// RESOURCES NOTIFICATIONS
// ============================================

export const ResourceNotifications = {
  // Resource Actions
  resourceShared: (resourceName) => showDynamicIslandNotification({
    type: 'success',
    title: 'Resource Shared!',
    message: `"${resourceName}" is now available`,
    duration: 5000
  }),

  resourceDownloaded: (fileName) => showDynamicIslandNotification({
    type: 'download',
    title: 'Download Started',
    message: `Downloading ${fileName}...`,
    duration: 4000
  }),

  resourceDownloadComplete: () => showDynamicIslandNotification({
    type: 'success',
    title: 'Download Complete!',
    message: 'Resource downloaded successfully',
    duration: 4000
  }),

  resourceUploaded: () => showDynamicIslandNotification({
    type: 'upload',
    title: 'Upload Complete!',
    message: 'Your resource has been uploaded',
    duration: 4500
  }),

  resourceLiked: () => showDynamicIslandNotification({
    type: 'like',
    title: 'Resource Liked',
    message: 'Added to your favorites',
    duration: 3500
  }),

  resourceReported: () => showDynamicIslandNotification({
    type: 'send',
    title: 'Report Submitted',
    message: 'Thank you for keeping our community safe',
    duration: 5000
  }),
};

// ============================================
// PROFILE & USER NOTIFICATIONS
// ============================================

export const ProfileNotifications = {
  // Profile Actions
  profileUpdated: () => showDynamicIslandNotification({
    type: 'usercheck',
    title: 'Profile Updated!',
    message: 'Your changes have been saved',
    duration: 4000
  }),

  profilePictureUpdated: () => showDynamicIslandNotification({
    type: 'success',
    title: 'Profile Picture Updated',
    message: 'Your new photo looks great!',
    duration: 4000
  }),

  bioUpdated: () => showDynamicIslandNotification({
    type: 'checkcheck',
    title: 'Bio Updated',
    message: 'Your bio has been saved',
    duration: 3500
  }),

  passwordChanged: () => showDynamicIslandNotification({
    type: 'locked',
    title: 'Password Changed',
    message: 'Your account is now more secure',
    duration: 4500
  }),

  emailVerified: () => showDynamicIslandNotification({
    type: 'success',
    title: 'Email Verified!',
    message: 'Your email has been confirmed',
    duration: 4500
  }),

  phoneVerified: () => showDynamicIslandNotification({
    type: 'success',
    title: 'Phone Verified!',
    message: 'Your phone number has been confirmed',
    duration: 4500
  }),

  // Privacy & Settings
  privacyUpdated: () => showDynamicIslandNotification({
    type: 'security',
    title: 'Privacy Updated',
    message: 'Your privacy settings have been saved',
    duration: 4000
  }),

  notificationsEnabled: () => showDynamicIslandNotification({
    type: 'notification',
    title: 'Notifications On',
    message: 'You\'ll now receive notifications',
    duration: 4000
  }),

  notificationsDisabled: () => showDynamicIslandNotification({
    type: 'info',
    title: 'Notifications Off',
    message: 'Notifications have been disabled',
    duration: 4000
  }),

  accountDeactivated: () => showDynamicIslandNotification({
    type: 'warning',
    title: 'Account Deactivated',
    message: 'Your account has been deactivated',
    duration: 5000
  }),
};

// ============================================
// AUTHENTICATION NOTIFICATIONS
// ============================================

export const AuthNotifications = {
  // Login & Registration
  loginSuccess: (username) => showDynamicIslandNotification({
    type: 'login',
    title: 'Welcome Back!',
    message: `Logged in as ${username}`,
    duration: 4500
  }),

  loginFailed: () => showDynamicIslandNotification({
    type: 'error',
    title: 'Login Failed',
    message: 'Invalid credentials, please try again',
    duration: 4500
  }),

  registrationSuccess: () => showDynamicIslandNotification({
    type: 'success',
    title: 'Account Created!',
    message: 'Welcome to UniShare community',
    duration: 5000
  }),

  logoutSuccess: () => showDynamicIslandNotification({
    type: 'logout',
    title: 'Logged Out',
    message: 'See you soon!',
    duration: 3500
  }),

  sessionExpired: () => showDynamicIslandNotification({
    type: 'warning',
    title: 'Session Expired',
    message: 'Please log in again to continue',
    duration: 5000
  }),

  // Password Recovery
  passwordResetSent: () => showDynamicIslandNotification({
    type: 'send',
    title: 'Reset Link Sent',
    message: 'Check your email for password reset link',
    duration: 5000
  }),

  passwordResetSuccess: () => showDynamicIslandNotification({
    type: 'success',
    title: 'Password Reset!',
    message: 'You can now log in with your new password',
    duration: 5000
  }),
};

// ============================================
// MESSAGING NOTIFICATIONS
// ============================================

export const MessagingNotifications = {
  messageSent: () => showDynamicIslandNotification({
    type: 'send',
    title: 'Message Sent',
    message: 'Your message has been delivered',
    duration: 3500
  }),

  messageReceived: (senderName) => showDynamicIslandNotification({
    type: 'message',
    title: 'New Message',
    message: `${senderName} sent you a message`,
    duration: 4500
  }),

  messageDeleted: () => showDynamicIslandNotification({
    type: 'info',
    title: 'Message Deleted',
    message: 'Message has been removed',
    duration: 3000
  }),

  conversationMuted: () => showDynamicIslandNotification({
    type: 'info',
    title: 'Conversation Muted',
    message: 'You won\'t receive notifications',
    duration: 3500
  }),

  conversationUnmuted: () => showDynamicIslandNotification({
    type: 'notification',
    title: 'Conversation Unmuted',
    message: 'Notifications are now enabled',
    duration: 3500
  }),
};

// ============================================
// SYSTEM & ERROR NOTIFICATIONS
// ============================================

export const SystemNotifications = {
  // Network Status
  offline: () => showDynamicIslandNotification({
    type: 'offline',
    title: 'No Internet',
    message: 'You\'re currently offline',
    duration: 5000
  }),

  online: () => showDynamicIslandNotification({
    type: 'network',
    title: 'Back Online',
    message: 'Connection restored',
    duration: 3500
  }),

  // General Errors
  error: (message) => showDynamicIslandNotification({
    type: 'error',
    title: 'Error',
    message: message || 'Something went wrong',
    duration: 4500
  }),

  success: (message) => showDynamicIslandNotification({
    type: 'success',
    title: 'Success',
    message: message || 'Operation completed successfully',
    duration: 4000
  }),

  warning: (message) => showDynamicIslandNotification({
    type: 'warning',
    title: 'Warning',
    message: message || 'Please review your action',
    duration: 4500
  }),

  // Copy Actions
  linkCopied: () => showDynamicIslandNotification({
    type: 'checkcheck',
    title: 'Link Copied',
    message: 'Link copied to clipboard',
    duration: 3000
  }),

  textCopied: () => showDynamicIslandNotification({
    type: 'checkcheck',
    title: 'Copied',
    message: 'Text copied to clipboard',
    duration: 3000
  }),

  // Share Actions
  shared: (platform) => showDynamicIslandNotification({
    type: 'send',
    title: 'Shared',
    message: `Shared via ${platform}`,
    duration: 3500
  }),

  // Save Actions
  saved: (itemType) => showDynamicIslandNotification({
    type: 'star',
    title: 'Saved',
    message: `${itemType} saved successfully`,
    duration: 3500
  }),

  unsaved: () => showDynamicIslandNotification({
    type: 'info',
    title: 'Removed',
    message: 'Removed from saved items',
    duration: 3000
  }),
};

// ============================================
// EXPORT ALL NOTIFICATIONS
// ============================================

export const ActionNotifications = {
  Housing: HousingNotifications,
  Ride: RideNotifications,
  Marketplace: MarketplaceNotifications,
  Ticket: TicketNotifications,
  LostFound: LostFoundNotifications,
  Announcement: AnnouncementNotifications,
  Resource: ResourceNotifications,
  Profile: ProfileNotifications,
  Auth: AuthNotifications,
  Messaging: MessagingNotifications,
  System: SystemNotifications,
};

// Default export for easy imports
export default ActionNotifications;
