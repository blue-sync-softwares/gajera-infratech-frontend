import React from 'react';
import Link from 'next/link';

export default function ContentPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkmode py-12 px-4">
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
            href="/admin/content/navigation"
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-border/50"
          >
            <h3 className="text-xl font-bold text-midnight_text dark:text-white mb-2">
              Navigation
            </h3>
            <p className="text-gray dark:text-slate-400">
              Manage header and footer navigation menus
            </p>
          </Link>

          <Link
            href="/admin/content/features"
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-border/50"
          >
            <h3 className="text-xl font-bold text-midnight_text dark:text-white mb-2">
              Features
            </h3>
            <p className="text-gray dark:text-slate-400">
              Manage feature sections and content
            </p>
          </Link>

          <Link
            href="/admin/content/about"
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-border/50"
          >
            <h3 className="text-xl font-bold text-midnight_text dark:text-white mb-2">
              About Page
            </h3>
            <p className="text-gray dark:text-slate-400">
              Manage about page content and team
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
