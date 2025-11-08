"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import DynamicIsland, { DynamicIslandNotifications } from "./../../_components/ui/DynamicIsland";

/**
 * Custom hook for using Dynamic Island notifications with common app patterns
 */
export const useDynamicIslandNotification = () => {
  const router = useRouter();

  // Login required notification with automatic redirect
  const showLoginRequired = useCallback((redirectPath = '/') => {

    DynamicIslandNotifications.loginRequired(() => {
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    });
  }, [router]);

  // Success notification for requests
  const showRequestSuccess = useCallback((action = 'sent') => {
    DynamicIslandNotifications.success(
      `Your request has been ${action} successfully`,
      'Request Success'
    );
  }, []);

  // Error notification for failed operations
  const showOperationError = useCallback((operation = 'operation', error) => {
    const message = error?.message || `Failed to ${operation}. Please try again.`;
    DynamicIslandNotifications.error(message, 'Operation Failed');
  }, []);

  // Network status notifications
  const showNetworkError = useCallback(() => {
    DynamicIslandNotifications.networkError();
  }, []);

  const showNetworkRestored = useCallback(() => {
    DynamicIslandNotifications.networkRestored();
  }, []);

  // Authentication success notification
  const showLoginSuccess = useCallback((username) => {
    DynamicIslandNotifications.loginSuccess(username);
  }, []);

  const showLogoutSuccess = useCallback(() => {
    DynamicIslandNotifications.logoutSuccess();
  }, []);

  // Feature-specific notifications
  const showItemLiked = useCallback(() => {
    DynamicIslandNotifications.itemLiked();
  }, []);

  const showNewMessage = useCallback((count = 1) => {
    DynamicIslandNotifications.newMessage(count);
  }, []);

  const showDownloadComplete = useCallback((filename) => {
    DynamicIslandNotifications.downloadComplete(filename);
  }, []);

  // Generic notification methods
  const showSuccess = useCallback((message, title) => {
    DynamicIslandNotifications.success(message, title);
  }, []);

  const showError = useCallback((message, title) => {
    DynamicIslandNotifications.error(message, title);
  }, []);

  const showWarning = useCallback((message, title) => {
    DynamicIslandNotifications.warning(message, title);
  }, []);

  const showInfo = useCallback((message, title) => {
    DynamicIslandNotifications.info(message, title);
  }, []);

  // Custom notification with action
  const showCustomNotification = useCallback(({
    message,
    type = 'info',
    title,
    actionLabel,
    action,
    duration = 4000,
    persistent = false,
    showLoading = false,
    progress = 0
  }) => {
    window.dispatchEvent(new CustomEvent('dynamicIslandNotification', {
      detail: {
        message,
        type,
        title,
        actionLabel,
        action,
        duration,
        persistent,
        showLoading,
        progress
      }
    }));
  }, []);

  // Loading notification with progress
  const showLoadingNotification = useCallback((message, progress = 0) => {
    showCustomNotification({
      type: 'info',
      title: 'Loading...',
      message,
      showLoading: true,
      progress,
      persistent: true
    });
  }, [showCustomNotification]);

  // Change Dynamic Island position
  const setIslandPosition = useCallback((position) => {
    window.dispatchEvent(new CustomEvent('dynamicIslandSetPosition', {
      detail: { position }
    }));
  }, []);

  return {
    // Authentication
    showLoginRequired,
    showLoginSuccess,
    showLogoutSuccess,
    
    // Operations
    showRequestSuccess,
    showOperationError,
    
    // Network
    showNetworkError,
    showNetworkRestored,
    
    // Features
    showItemLiked,
    showNewMessage,
    showDownloadComplete,
    
    // Generic
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCustomNotification,
    
    // Advanced
    showLoadingNotification,
    setIslandPosition
  };
};

export default useDynamicIslandNotification;
