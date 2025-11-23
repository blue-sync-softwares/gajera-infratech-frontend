'use client';
import React from 'react';

// NOTE: keep this simple — the html should be sanitized server-side in a real app.
// If you have an existing markdown utility (utils/markdown) prefer that.
type Props = { html: string };

export default function MarkdownBlock({ html }: Props) {
  return (
    <div
      className="text-base text-gray dark:text-slate-300"
      dangerouslySetInnerHTML={{ __html: html || '<p>No overview available.</p>' }}
    />
  );
}