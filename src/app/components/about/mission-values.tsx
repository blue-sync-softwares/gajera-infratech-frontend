import React from "react";

type Props = {
  mission: string;
  values: string[];
};

export default function MissionValues({ mission, values }: Props) {
  return (
    <section
      aria-labelledby="our-mission"
      className="py-12 bg-emerald-50 dark:bg-slate-900/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 items-start">
          {/* Mission card */}
          <div className="relative">
            <h3
              id="our-mission"
              className="flex items-center gap-3 text-3xl sm:text-4xl font-extrabold text-emerald-900 dark:text-emerald-300 mb-6"
            >
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-emerald-100/80 dark:bg-emerald-800/30 text-emerald-700 dark:text-emerald-200 shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 2v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 21h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              Our Mission
            </h3>

            <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 shadow-sm">
              <p className="text-lg sm:text-xl leading-relaxed text-gray-800 dark:text-slate-100">
                {mission}
              </p>

              <p className="mt-4 text-sm text-gray-600 dark:text-slate-300 max-w-prose">
                We combine ethics, innovation and community partnership to create long-term, measurable impact — focusing on sustainable growth and responsible stewardship.
              </p>
            </div>
          </div>

          {/* Values list (subtle style) */}
          <div>
            <h4 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-emerald-200 mb-4">Our Values</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v) => (
                <div
                  key={v}
                  className="flex items-start gap-4 p-4 rounded-lg bg-white dark:bg-slate-800/60 ring-1 ring-gray-100/50 dark:ring-0 transition hover:shadow-md"
                >
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-md bg-emerald-50 dark:bg-emerald-800/25 text-emerald-600 dark:text-emerald-300">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{v}</div>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-slate-300">
                      {`Committed to ${v.toLowerCase()} in all our projects and partnerships.`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

           
          </div>
        </div>
      </div>
    </section>
  );
}