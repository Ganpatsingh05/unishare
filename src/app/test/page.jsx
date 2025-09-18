"use client";

import React, { useState } from 'react';

function UnishareForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: '',
    urgency: '',
    whatHappened: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Create FormData object for submission
    const submitData = new FormData();
    submitData.append('entry.1633920210', formData.name);
    submitData.append('entry.227649005', formData.email);
    submitData.append('entry.790080973', formData.issueType);
    submitData.append('entry.1770822543', formData.urgency);
    submitData.append('entry.1846923513', formData.whatHappened);
    
    try {
      await fetch("https://docs.google.com/forms/d/e/1FAIpQLSe0m0oz-Jzx_QQCPmZtLjbvZY3uUW7gRL3-waTH3jg8-OZuQg/formResponse", {
        method: "POST",
        body: submitData,
        mode: "no-cors"
      });

      setSubmitMessage("Submitted successfully to Google Form!");
      // Reset form
      setFormData({
        name: '',
        email: '',
        issueType: '',
        urgency: '',
        whatHappened: ''
      });
    } catch (error) {
      setSubmitMessage("There was an error submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Report an Issue</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What type of issue would you like to report? *
          </label>
          <textarea 
            name="issueType"
            value={formData.issueType}
            onChange={handleInputChange}
            required 
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How urgent is this issue?
          </label>
          <input 
            type="text" 
            name="urgency"
            value={formData.urgency}
            onChange={handleInputChange}
            placeholder="e.g., High, Medium, Low"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What happened?
          </label>
          <textarea 
            name="whatHappened"
            value={formData.whatHappened}
            onChange={handleInputChange}
            rows="4"
            placeholder="Please provide details about the issue..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> File attachments cannot be submitted directly through this component. 
            If you need to share files, please include links to cloud storage (Google Drive, Dropbox, etc.) 
            in the "What happened?" field above.
          </p>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.name || !formData.email || !formData.issueType}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>

        {submitMessage && (
          <div className={`p-4 rounded-md ${
            submitMessage.includes('successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {submitMessage}
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <p>* Required fields</p>
        <p className="mt-1">This component submits directly to Google Forms and responses will be recorded in the associated Google Sheet.</p>
      </div>
    </div>
  );
}

export default UnishareForm;