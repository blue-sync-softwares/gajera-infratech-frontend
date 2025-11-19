import React from "react";
import Breadcrumb from "../breadcrumb";
import { BreadcrumbLink } from "@/app/types/data/breadcrumb";

type Props = {
  headline: string;
  text: string;
  ctaText?: string;
  ctaHref?: string;
  breadcrumbLinks?: BreadcrumbLink[];
};

export default function AboutIntro({
  headline,
  text,
  ctaText,
  ctaHref,
  breadcrumbLinks,
}: Props) {
  return (
    // use same hero background/spacing utilities so section aligns visually with hero
    <section
      aria-labelledby="about-intro"
      className="relative pt-44 pb-12 bg-no-repeat bg-gradient-to-b from-white from-10% dark:from-darkmode to-herobg to-90% dark:to-darklight overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            id="about-intro"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight"
          >
            {headline}
          </h2>

          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-slate-300">
            {text}
          </p>

          {/* Breadcrumbs (optional) */}
          {breadcrumbLinks && breadcrumbLinks.length > 0 && (
            <div className="mt-6">
              <Breadcrumb links={breadcrumbLinks} />
            </div>
          )}

          {/* CTA (kept but commented out by default) */}
          {/* {ctaText && ctaHref && (
            <div className="mt-6">
              <a
                href={ctaHref}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
              >
                {ctaText}
              </a>
            </div>
          )} */}
        </div>
      </div>
    </section>
  );
}