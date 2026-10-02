/**
 * Action Notifications Utility
 * 
 * Comprehensive notification system for all user actions in UniShare
 * Logs notifications for user interactions
 */

// ============================================
// HOUSING & ROOMS NOTIFICATIONS
// ============================================

export const HousingNotifications = {
  roomPosted: (roomTitle) => console.log('Room Listed!', `"${roomTitle}" is now live and visible to students`),
  roomUpdated: () => console.log('Room Updated', 'Your listing has been successfully updated'),
  roomDeleted: () => console.log('Room Removed', 'Your listing has been deleted'),
  roomViewed: (roomTitle) => console.log('Viewing Room', roomTitle),
  roomSaved: () => console.log('Room Saved', 'Added to your favorites'),
  roomUnsaved: () => console.log('Room Removed', 'Removed from favorites'),
  contactRequested: () => console.log('Interest Sent!', 'The room owner will contact you soon'),
  phoneRevealed: () => console.log('Contact Revealed', 'You can now see the phone number'),
  emailSent: () => console.log('Email Sent', 'Your message has been delivered'),
};

// ============================================
// RIDE SHARING NOTIFICATIONS
// ============================================

export const RideNotifications = {
  authRequired: () => console.log('Login Required', 'Please login to post a ride'),
  ridePosted: (destination) => console.log('Ride Posted!', `Your ride to ${destination} is now available`),
  rideUpdated: () => console.log('Ride Updated', 'Your ride details have been saved'),
  rideCancelled: () => console.log('Ride Cancelled', 'Your ride has been cancelled'),
  rideRequested: (driverName) => console.log('Request Sent!', `Waiting for ${driverName} to accept`),
  rideJoined: () => console.log('Seat Confirmed!', 'You\'ve successfully joined this ride'),
  rideLeft: () => console.log('Ride Left', 'You have left the ride'),
  passengerAccepted: (passengerName) => console.log('Passenger Accepted', `${passengerName} joined your ride`),
  passengerRejected: () => console.log('Request Declined', 'Passenger request has been declined'),
  rideFull: () => console.log('Ride Full', 'All seats have been taken'),
};

// ============================================
// MARKETPLACE (BUY/SELL) NOTIFICATIONS
// ============================================

export const MarketplaceNotifications = {
  itemListed: (itemName) => console.log('Item Listed!', `"${itemName}" is now available for sale`),
  itemUpdated: () => console.log('Item Updated', 'Your listing has been updated'),
  itemSold: (itemName) => console.log('Item Sold!', `Congratulations! "${itemName}" has been sold`),
  itemDeleted: () => console.log('Item Removed', 'Your listing has been deleted'),
  itemAddedToCart: (itemName) => console.log('Added to Cart', itemName),
  itemRemovedFromCart: () => console.log('Removed from Cart', 'Item removed successfully'),
  itemLiked: () => console.log('Item Liked', 'Added to your wishlist'),
  itemUnliked: () => console.log('Removed from Wishlist', 'Item unliked'),
  purchaseRequested: (sellerName) => console.log('Purchase Request Sent', `Waiting for ${sellerName}'s response`),
  purchaseConfirmed: () => console.log('Purchase Confirmed!', 'Contact the seller to arrange pickup'),
  offerMade: (amount) => console.log('Offer Submitted', `Your offer of $${amount} has been sent`),
  offerReceived: (amount) => console.log('New Offer!', `Someone offered $${amount} for your item`),
};

// ============================================
// TICKETS NOTIFICATIONS
// ============================================

export const TicketNotifications = {
  ticketListed: (eventName) => console.log('Ticket Listed!', `Your ${eventName} ticket is now available`),
  ticketUpdated: () => console.log('Ticket Updated', 'Ticket details have been saved'),
  ticketSold: () => console.log('Ticket Sold!', 'Your ticket has been purchased'),
  ticketPurchased: (eventName) => console.log('Ticket Purchased!', `You got a ticket for ${eventName}`),
  ticketRequested: () => console.log('Request Sent', 'Waiting for seller confirmation'),
  ticketTransferred: () => console.log('Ticket Transferred', 'Ticket ownership has been transferred'),
  ticketCancelled: () => console.log('Ticket Cancelled', 'Your ticket listing has been removed'),
};

// ============================================
// LOST & FOUND NOTIFICATIONS
// ============================================

export const LostFoundNotifications = {
  lostItemReported: (itemName) => console.log('Lost Item Reported', `"${itemName}" has been added to lost items`),
  lostItemUpdated: () => console.log('Report Updated', 'Lost item details have been updated'),
  lostItemFound: (itemName) => console.log('Item Found!', `Great news! "${itemName}" has been found`),
  lostItemClosed: () => console.log('Report Closed', 'Lost item report has been closed'),
  foundItemPosted: (itemName) => console.log('Found Item Posted', `"${itemName}" is now in found items`),
  foundItemUpdated: () => console.log('Item Updated', 'Found item details have been updated'),
  foundItemClaimed: () => console.log('Item Claimed!', 'The owner has been notified'),
  potentialMatchFound: () => console.log('Possible Match!', 'We found an item that might be yours'),
  claimRequested: (itemName) => console.log('Claim Submitted', `Your claim for "${itemName}" has been sent`),
  ownerContacted: () => console.log('Message Sent', 'The finder has been contacted'),
};

// ============================================
// ANNOUNCEMENTS NOTIFICATIONS
// ============================================

export const AnnouncementNotifications = {
  announcementPosted: (title) => console.log('Announcement Posted!', `"${title}" is now live`),
  announcementUpdated: () => console.log('Announcement Updated', 'Your announcement has been updated'),
  announcementDeleted: () => console.log('Announcement Deleted', 'Your announcement has been removed'),
  announcementLiked: () => console.log('Announcement Liked', 'Added to your liked announcements'),
  announcementShared: () => console.log('Announcement Shared', 'Shared with your network'),
  commentPosted: () => console.log('Comment Posted', 'Your comment has been added'),
  announcementSaved: () => console.log('Announcement Saved', 'Added to your saved items'),
};

// ============================================
// RESOURCES NOTIFICATIONS
// ============================================

export const ResourceNotifications = {
  resourceShared: (resourceName) => console.log('Resource Shared!', `"${resourceName}" is now available`),
  resourceDownloaded: (fileName) => console.log('Download Started', `Downloading ${fileName}...`),
  resourceDownloadComplete: () => console.log('Download Complete!', 'Resource downloaded successfully'),
  resourceUploaded: () => console.log('Upload Complete!', 'Your resource has been uploaded'),
  resourceLiked: () => console.log('Resource Liked', 'Added to your favorites'),
  resourceReported: () => console.log('Report Submitted', 'Thank you for keeping our community safe'),
};

// ============================================
// PROFILE & USER NOTIFICATIONS
// ============================================

export const ProfileNotifications = {
  profileUpdated: () => console.log('Profile Updated!', 'Your changes have been saved'),
  profilePictureUpdated: () => console.log('Profile Picture Updated', 'Your new photo looks great!'),
  bioUpdated: () => console.log('Bio Updated', 'Your bio has been saved'),
  passwordChanged: () => console.log('Password Changed', 'Your account is now more secure'),
  emailVerified: () => console.log('Email Verified!', 'Your email has been confirmed'),
  phoneVerified: () => console.log('Phone Verified!', 'Your phone number has been confirmed'),
  privacyUpdated: () => console.log('Privacy Updated', 'Your privacy settings have been saved'),
  notificationsEnabled: () => console.log('Notifications On', 'You\'ll now receive notifications'),
  notificationsDisabled: () => console.log('Notifications Off', 'Notifications have been disabled'),
  accountDeactivated: () => console.log('Account Deactivated', 'Your account has been deactivated'),
};

// ============================================
// AUTHENTICATION NOTIFICATIONS
// ============================================

export const AuthNotifications = {
  loginSuccess: (username) => console.log('Welcome Back!', `Logged in as ${username}`),
  loginFailed: () => console.log('Login Failed', 'Invalid credentials, please try again'),
  registrationSuccess: () => console.log('Account Created!', 'Welcome to UniShare community'),
  logoutSuccess: () => console.log('Logged Out', 'See you soon!'),
  sessionExpired: () => console.log('Session Expired', 'Please log in again to continue'),
  passwordResetSent: () => console.log('Reset Link Sent', 'Check your email for password reset link'),
  passwordResetSuccess: () => console.log('Password Reset!', 'You can now log in with your new password'),
};

// ============================================
// MESSAGING NOTIFICATIONS
// ============================================

export const MessagingNotifications = {
  messageSent: () => console.log('Message Sent', 'Your message has been delivered'),
  messageReceived: (senderName) => console.log('New Message', `${senderName} sent you a message`),
  messageDeleted: () => console.log('Message Deleted', 'Message has been removed'),
  conversationMuted: () => console.log('Conversation Muted', 'You won\'t receive notifications'),
  conversationUnmuted: () => console.log('Conversation Unmuted', 'Notifications are now enabled'),
};

// ============================================
// SYSTEM & ERROR NOTIFICATIONS
// ============================================

export const SystemNotifications = {
  offline: () => console.log('No Internet', 'You\'re currently offline'),
  online: () => console.log('Back Online', 'Connection restored'),
  error: (message) => console.log('Error', message || 'Something went wrong'),
  success: (message) => console.log('Success', message || 'Operation completed successfully'),
  warning: (message) => console.log('Warning', message || 'Please review your action'),
  linkCopied: () => console.log('Link Copied', 'Link copied to clipboard'),
  textCopied: () => console.log('Copied', 'Text copied to clipboard'),
  shared: (platform) => console.log('Shared', `Shared via ${platform}`),
  saved: (itemType) => console.log('Saved', `${itemType} saved successfully`),
  unsaved: () => console.log('Removed', 'Removed from saved items'),
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

export default ActionNotifications;
