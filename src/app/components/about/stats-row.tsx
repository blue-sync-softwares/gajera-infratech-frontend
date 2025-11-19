import React from "react";

type Stat = { label: string; value: number | string };
type Props = { stats: Stat[] };

export default function StatsRow({ stats }: Props) {
  return (
    <section
      className="pt-12 pb-16 bg-white dark:bg-slate-900"
      aria-labelledby="about-stats"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Visible heading styled to match project typography and ensure contrast on white */}
        <h3
          id="about-stats"
          className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-emerald-400 mb-8 font-dm-sans"
           style={{ color: "var(--site-heading, #1f2937)" }}
        >
          Company statistics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              role="group"
              aria-label={`${s.label}: ${s.value}`}
              className="rounded-lg p-6 bg-white dark:bg-slate-800/60 ring-1 ring-gray-100/50 dark:ring-0 shadow-sm transition-transform hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay={i * 100}
              data-aos-duration="700"
              data-aos-once="true"
            >
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-600 dark:text-blue-400 leading-tight font-dm-sans">
                    {s.value}
                  </div>
                  <div className="mt-2 text-xs sm:text-sm uppercase tracking-wide text-gray-500 dark:text-slate-300 font-medium font-dm-sans">
                    {s.label}
                  </div>
                </div>

                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-blue-50 dark:bg-blue-800/25 text-blue-600 dark:text-blue-300">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 2v7M5 12h14M7 21h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}