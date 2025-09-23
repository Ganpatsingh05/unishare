"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Megaphone, Tag, Calendar, Link2, Send } from "lucide-react";
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";
import { submitAnnouncement } from "../../lib/api/announcements";
import { useUI } from "../../lib/contexts/UniShareContext";

export default function SubmitAnnouncementPage() {
  const { darkMode } = useUI();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
  const titleClr = darkMode ? "text-white" : "text-gray-900";
  const textMuted = darkMode ? "text-gray-300" : "text-gray-600";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setLoading(true);
    try {
      const announcementData = {
        title: title.trim(),
        body: body.trim(),
        category: 'general', // Default category - admin can change later
        priority: 'normal', // Default priority - admin can change later
        link: null, // No link field for users
        expires: null, // No expiry field for users
        active: false, // Default to inactive - admin will activate
      };

      const result = await submitAnnouncement(announcementData);
      
      if (result.success) {
        setSuccess(true);
        // Reset form
        setTitle('');
        setBody('');
        
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setBody('');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      

      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <header className="mb-6 sm:mb-8">
            <Link 
              href="/announcements" 
              className={`inline-flex items-center gap-2 text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} mb-4`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Announcements
            </Link>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                <Megaphone className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${titleClr}`}>Submit Announcement</h1>
                <p className={`mt-1 text-sm sm:text-base ${textMuted}`}>Share important information with the community. Submissions require admin approval before publishing.</p>
              </div>
            </div>
          </header>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-green-400 font-medium">Announcement submitted successfully!</p>
                  <p className="text-green-300 text-sm mt-1">Your announcement is pending admin review and will be published once approved.</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className={`rounded-2xl border p-6 sm:p-8 ${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className="grid grid-cols-1 gap-6">
              {/* Title */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClr}`}>
                  Announcement Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Campus Event This Weekend"
                  className={`w-full px-4 py-3 rounded-lg border ${inputBg} focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                  required
                />
              </div>

              {/* Body */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClr}`}>
                  Details *
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  placeholder="Write the announcement details here..."
                  className={`w-full px-4 py-3 rounded-lg border ${inputBg} focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                  required
                />
              </div>



              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200/10">
                <button
                  type="submit"
                  disabled={loading || !title.trim() || !body.trim()}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Announcement
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className={`px-4 py-3 rounded-lg border text-sm ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}