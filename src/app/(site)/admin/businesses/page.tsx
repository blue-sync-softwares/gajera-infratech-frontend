import React from 'react';
import Link from 'next/link';

export default function BusinessesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkmode py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-primary hover:underline mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-midnight_text dark:text-white">
              Business Management
            </h1>
          </div>
          <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            + Add New Business
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-border/50 p-8">
          <p className="text-gray dark:text-slate-300 text-center py-12">
            Business management interface will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
}
