"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

const MessageNotification = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleMessage = (event) => {
      const { message, type = 'info' } = event.detail;
      const id = Date.now() + Math.random();
      
      setMessages(prev => [...prev, { id, message, type }]);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== id));
      }, 5000);
    };

    window.addEventListener('showMessage', handleMessage);
    
    return () => {
      window.removeEventListener('showMessage', handleMessage);
    };
  }, []);

  const removeMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColorClasses = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`
              flex items-center gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm
              min-w-[300px] max-w-md
              ${getColorClasses(msg.type)}
            `}
          >
            <div className="flex-shrink-0">
              {getIcon(msg.type)}
            </div>
            <p className="flex-1 text-sm font-medium">
              {msg.message}
            </p>
            <button
              onClick={() => removeMessage(msg.id)}
              className="flex-shrink-0 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MessageNotification;
