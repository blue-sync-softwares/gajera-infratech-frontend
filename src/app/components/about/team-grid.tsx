import { getImgPath } from "@/utils/pathUtils";
import React from "react";

type Member = { name: string; role: string; photo?: string };
type Props = { members: Member[] };
export default function TeamGrid({ members }: Props) {
  return (
    <section className="py-12 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3
          className="text-2xl sm:text-3xl font-extrabold mb-8 text-gray-900 dark:text-white font-dm-sans relative z-10"
          style={{ color: "var(--site-heading, #1f2937)" }}
        >
          Leadership
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((m, i) => (
            <article
              key={m.name}
              role="group"
              aria-label={`${m.name} — ${m.role}`}
              data-aos="fade-up"
              data-aos-delay={i * 80}
              data-aos-duration="700"
              data-aos-once="true"
              className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 ring-1 ring-gray-100/60 dark:ring-0 shadow-sm transform-gpu transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  {/* subtle halo behind the image for depth */}
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-50 to-white dark:from-transparent dark:to-transparent opacity-60 blur-sm pointer-events-none" />

                  <img
                    src={ getImgPath("/images/avatar/avatar_1.jpg")}
                    alt={m.name}
                    loading="lazy"
                    className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-1 ring-gray-50/60 dark:ring-slate-700/40 shadow-sm transition-transform duration-300 ease-out group-hover:scale-105"
                  />
                </div>

                <h4 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white font-dm-sans">
                  {m.name}
                </h4>
                <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-slate-300">
                  {m.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}