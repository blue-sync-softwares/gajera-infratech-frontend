'use client';
import React, { useState } from 'react';

export default function ProjectFilters() {
  const [filter, setFilter] = useState<'all'|'gov'|'private'>('all');

  return (
    <div className="flex items-center gap-3">
      <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray'}`}>All</button>
      <button onClick={() => setFilter('gov')} className={`px-3 py-1 rounded ${filter === 'gov' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray'}`}>Gov</button>
      <button onClick={() => setFilter('private')} className={`px-3 py-1 rounded ${filter === 'private' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 text-gray'}`}>Private</button>
    </div>
  );
}