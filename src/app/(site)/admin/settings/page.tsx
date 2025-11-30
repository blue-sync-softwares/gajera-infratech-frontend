import React from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkmode py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-primary hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-midnight_text dark:text-white">
            Settings
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-border/50">
            <h3 className="text-xl font-bold text-midnight_text dark:text-white mb-4">
              General Settings
            </h3>
            <p className="text-gray dark:text-slate-400 mb-4">
              Configure site title, logo, and basic information
            </p>
            <button className="text-primary hover:underline">
              Configure →
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-border/50">
            <h3 className="text-xl font-bold text-midnight_text dark:text-white mb-4">
              SEO Settings
            </h3>
            <p className="text-gray dark:text-slate-400 mb-4">
              Manage meta tags, keywords, and SEO configuration
            </p>
            <button className="text-primary hover:underline">
              Configure →
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-border/50">
            <h3 className="text-xl font-bold text-midnight_text dark:text-white mb-4">
              Footer Settings
            </h3>
            <p className="text-gray dark:text-slate-400 mb-4">
              Customize footer content and social links
            </p>
            <button className="text-primary hover:underline">
              Configure →
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-border/50">
            <h3 className="text-xl font-bold text-midnight_text dark:text-white mb-4">
              Theme Settings
            </h3>
            <p className="text-gray dark:text-slate-400 mb-4">
              Customize colors, fonts, and appearance
            </p>
            <button className="text-primary hover:underline">
              Configure →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
