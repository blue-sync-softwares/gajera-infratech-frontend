import React from 'react';
import Link from 'next/link';

export default function ContentPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkmode pt-32 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-primary hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-midnight_text dark:text-white">
            Content Management
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/content/home"
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-border/50"
          >
            <h3 className="text-xl font-bold text-midnight_text dark:text-white mb-2">
              Home
            </h3>
            <p className="text-gray dark:text-slate-400">
              Manage home page content and sections
            </p>
          </Link>

          <Link
            href="/admin/content/contact"
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-border/50"
          >
            <h3 className="text-xl font-bold text-midnight_text dark:text-white mb-2">
              Contact Us
            </h3>
            <p className="text-gray dark:text-slate-400">
              Manage contact page information and details
            </p>
          </Link>

          <Link
            href="/admin/content/about"
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-border/50"
          >
            <h3 className="text-xl font-bold text-midnight_text dark:text-white mb-2">
              About Us
            </h3>
            <p className="text-gray dark:text-slate-400">
              Manage about page content and team information
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
