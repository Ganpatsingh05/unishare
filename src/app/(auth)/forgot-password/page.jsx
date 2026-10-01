'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestPasswordReset } from '@/app/lib/api';
import AuthLayout from '@/app/components/auth/AuthLayout';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await requestPasswordReset(email);
      
      if (result.success) {
        setMessage(result.message);
        setEmail('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive a password reset link"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">{message}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="you@university.edu"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Back to Login
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
