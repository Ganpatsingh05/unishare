"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Sun, Moon, Monitor, CaretRight, CaretLeft, Check, Warning } from '@phosphor-icons/react';
import { Switch } from '@mui/material';
import { useUI, useAuth } from '@contexts/UniShareContext';
import { updateUserProfile } from '@lib/api/userProfile';
import { CAPABILITIES } from '@features/profile/lib/profileTokens';

const CATEGORIES = [
  { id: 'account', label: 'Account' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
  { id: 'danger', label: 'Danger Zone' },
];

export default function SettingsSection({ profile, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState('account');
  const [isMobileList, setIsMobileList] = useState(true);
  
  // Responsive hook could go here, for now using a simple width check on mount/resize if needed,
  // but we can manage purely with CSS media queries or tailwind classes for the split view.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (isMobile) {
      setIsMobileList(false);
    }
  };

  const handleBack = () => {
    setIsMobileList(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'account': return <AccountSettings profile={profile} onProfileUpdate={onProfileUpdate} />;
      case 'appearance': return <AppearanceSettings />;
      case 'notifications': return <NotificationSettings />;
      case 'security': return <SecuritySettings />;
      case 'danger': return <DangerZoneSettings />;
      default: return null;
    }
  };

  if (isMobile) {
    return (
      <div className="relative overflow-hidden w-full h-[600px]">
        <AnimatePresence initial={false} custom={isMobileList}>
          {isMobileList ? (
            <motion.div
              key="list"
              className="absolute inset-0"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            >
              <div className="flex flex-col space-y-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleTabClick(cat.id)}
                    className="flex items-center justify-between p-4 bg-surface-primary border border-border-default rounded-lg text-text-primary"
                  >
                    <span className={cat.id === 'danger' ? 'text-red-500 font-medium' : 'font-medium'}>
                      {cat.label}
                    </span>
                    <CaretRight size={20} className="text-text-muted" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              className="absolute inset-0 overflow-y-auto pb-10"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            >
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 mb-6 text-brand-primary font-medium"
              >
                <CaretLeft size={20} />
                Back to Settings
              </button>
              {renderContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-8 min-h-[600px]">
      <div className="w-[200px] flex-shrink-0 flex flex-col space-y-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === cat.id 
                ? 'bg-surface-secondary text-brand-primary' 
                : 'text-text-secondary hover:bg-surface-secondary/50 hover:text-text-primary'
            } ${cat.id === 'danger' ? 'hover:text-red-500' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="flex-1 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function AccountSettings({ profile, onProfileUpdate }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      displayName: profile?.display_name || '',
      bio: profile?.bio || '',
      username: profile?.username || '',
      phone: profile?.phone || '',
      campusName: profile?.campus_name || '',
    }
  });
  
  const [status, setStatus] = useState(null);

  const onSubmit = async (data) => {
    setStatus(null);
    try {
      const updated = await updateUserProfile(data);
      if (onProfileUpdate) onProfileUpdate(updated);
      setStatus({ type: 'success', message: 'Profile updated successfully' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to update profile' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">Account Information</h3>
        <p className="text-sm text-text-secondary">Update your personal details and public profile.</p>
      </div>

      {status && (
        <div className={`p-3 rounded-md text-sm flex items-center gap-2 ${
          status.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {status.type === 'success' ? <Check size={18} /> : <Warning size={18} />}
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-secondary">Display Name</label>
            <input 
              {...register('displayName')} 
              className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-secondary">Username</label>
            <input 
              {...register('username')} 
              className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary" 
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">Bio</label>
          <textarea 
            {...register('bio')} 
            rows={3}
            className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none" 
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-secondary">Phone Number</label>
            <input 
              {...register('phone')} 
              className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-secondary">Campus Name</label>
            <input 
              {...register('campusName')} 
              className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="mt-6 px-4 py-2 bg-brand-primary text-white rounded-md font-medium hover:bg-opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

function AppearanceSettings() {
  const { darkMode, setDarkMode } = useUI();
  const [mode, setMode] = useState(darkMode ? 'dark' : 'light');

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === 'light') setDarkMode(false);
    else if (newMode === 'dark') setDarkMode(true);
    else {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isSystemDark);
    }
  };

  const ThemeCard = ({ id, icon: Icon, label }) => {
    const isActive = mode === id;
    return (
      <button
        onClick={() => handleModeChange(id)}
        className={`relative flex flex-col items-center justify-center p-6 border rounded-xl transition-all ${
          isActive 
            ? 'border-brand-secondary bg-surface-secondary/30' 
            : 'border-border-default bg-surface-primary hover:border-brand-primary/50'
        }`}
      >
        <Icon size={32} weight={isActive ? 'duotone' : 'regular'} className={isActive ? 'text-brand-secondary' : 'text-text-secondary'} />
        <span className={`mt-3 font-medium ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>{label}</span>
        {isActive && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-brand-secondary rounded-full" />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">Appearance</h3>
        <p className="text-sm text-text-secondary">Customize the look and feel of UniShare.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ThemeCard id="light" icon={Sun} label="Light" />
        <ThemeCard id="dark" icon={Moon} label="Dark" />
        <ThemeCard id="system" icon={Monitor} label="System" />
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">Notifications</h3>
        <p className="text-sm text-text-secondary">Manage what alerts you receive.</p>
        <p className="text-xs text-brand-secondary mt-1">Note: Connect to real notification preference API later.</p>
      </div>

      <div className="space-y-4 bg-surface-primary border border-border-default rounded-xl p-4">
        {[
          { id: 'new_requests', label: 'New requests', desc: 'When someone requests your item' },
          { id: 'updates', label: 'Request updates', desc: 'Status changes on your requests' },
          { id: 'messages', label: 'New messages', desc: 'Direct messages from other users' },
          { id: 'announcements', label: 'Announcements', desc: 'Campus wide alerts and news' }
        ].map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2 border-b border-border-default last:border-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-text-primary">{item.label}</p>
              <p className="text-xs text-text-muted">{item.desc}</p>
            </div>
            <Switch defaultChecked color="primary" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySettings() {
  const { register, handleSubmit } = useForm();
  
  const onSubmit = (data) => {
    console.log('Password update', data);
    // Backend work needed
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">Security</h3>
        <p className="text-sm text-text-secondary">Manage your password and security settings.</p>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-text-primary border-b border-border-default pb-2">Change Password</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <div className="space-y-1">
            <label className="text-sm text-text-secondary">Current Password</label>
            <input type="password" {...register('currentPassword')} className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-text-primary" />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-text-secondary">New Password</label>
            <input type="password" {...register('newPassword')} className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-text-primary" />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-text-secondary">Confirm New Password</label>
            <input type="password" {...register('confirmPassword')} className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-text-primary" />
          </div>
          <button type="submit" className="px-4 py-2 bg-surface-secondary text-text-primary border border-border-default rounded-md text-sm font-medium hover:bg-border-default">
            Update Password
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-text-primary border-b border-border-default pb-2">Two-Factor Authentication</h4>
        <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
          <div>
            <p className="text-sm font-medium text-text-primary">App Authenticator</p>
            <p className="text-xs text-text-muted">Coming soon</p>
          </div>
          <button disabled className="px-3 py-1.5 bg-surface-primary text-text-muted rounded border border-border-default text-sm cursor-not-allowed">
            Setup
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-text-primary border-b border-border-default pb-2">Active Sessions</h4>
        <p className="text-sm text-text-muted italic">Coming soon</p>
      </div>
    </div>
  );
}

function DangerZoneSettings() {
  const { logout } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleDelete = () => {
    if (deleteConfirm === 'DELETE') {
      const ok = window.confirm("Are you absolutely sure you want to delete your account? This cannot be undone.");
      if (ok) {
        logout();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-red-500 mb-1">Danger Zone</h3>
        <p className="text-sm text-text-secondary">Irreversible account actions.</p>
      </div>

      <div className="border border-red-500/30 rounded-xl p-5 bg-red-500/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-500/20 pb-6">
          <div>
            <h4 className="text-sm font-medium text-text-primary">Deactivate Account</h4>
            <p className="text-xs text-text-secondary mt-1">Temporarily hide your profile and listings.</p>
          </div>
          <button className="px-4 py-2 bg-surface-primary text-red-500 border border-red-500/30 rounded-md text-sm font-medium hover:bg-red-500/10 shrink-0">
            Deactivate
          </button>
        </div>

        <div className="pt-2">
          <h4 className="text-sm font-medium text-text-primary">Delete Account</h4>
          <p className="text-xs text-text-secondary mt-1 mb-4">Permanently remove your account and all data. This action cannot be reversed.</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Type DELETE to confirm" 
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              className="flex-1 px-3 py-2 bg-surface-primary border border-red-500/30 rounded-md text-text-primary focus:outline-none focus:border-red-500"
            />
            <button 
              onClick={handleDelete}
              disabled={deleteConfirm !== 'DELETE'}
              className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
