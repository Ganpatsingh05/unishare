'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center">
            <Image
              src="/images/logos/logounishare1.png"
              alt="UniShare"
              width={48}
              height={48}
              className="rounded-lg"
            />
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-300">{subtitle}</p>
          )}
        </div>

        {/* Content Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl">
          {children}
        </div>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-indigo-300 hover:text-indigo-100 transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
