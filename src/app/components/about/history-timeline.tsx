import React from "react";

type Event = { year: number; title: string; desc?: string };
type Props = { events: Event[] };

export default function HistoryTimeline({ events }: Props) {
  return (
    <section
      aria-labelledby="our-history"
      className="pt-12 md:pt-16 pb-12 bg-gradient-to-b from-emerald-50 to-white dark:from-slate-900 dark:to-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h3
          id="our-history"
          className="text-3xl sm:text-4xl font-extrabold mb-8 relative z-20"
          // inline style uses a CSS variable so dark/light can be controlled from globals.css
          style={{ color: "var(--site-heading, #1f2937)" }}
        >
          Our History
        </h3>

        <div className="relative">
          {/* vertical line - keep subtle and aligned with the badge center */}
          <div className="hidden md:block absolute left-7 top-6 bottom-6 w-px bg-gray-200 dark:bg-slate-700" />

          <ol className="space-y-6">
            {events.map((e) => (
              // align items center so badge vertically centers with the right content
              <li key={e.year} className="flex gap-4 items-center md:items-center">
                {/* left column: fixed width so badge centers over the vertical line */}
                <div className="hidden md:flex md:w-14 items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-mono font-semibold text-sm shadow-sm z-10">
                    {e.year}
                  </div>
                </div>

                {/* content column */}
                <div className="flex-1">
                  <div className="bg-white dark:bg-slate-800/60 ring-1 ring-gray-50 dark:ring-0 rounded-xl p-5 shadow-sm hover:shadow-md transition">
                    <div className="font-semibold text-gray-800 dark:text-slate-100 text-lg sm:text-xl leading-tight">
                      {e.title}
                    </div>
                    {e.desc && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-slate-300 max-w-prose leading-relaxed">
                        {e.desc}
                      </p>
                    )}
                  </div>
                </div>

                {/* small badge for mobile (keeps layout responsive) */}
                <div className="md:hidden flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-mono font-semibold text-sm shadow-sm">
                    {e.year}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}