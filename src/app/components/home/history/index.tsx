import React from "react";
import Image from "next/image";
import "../../../style/index.css";
import Link from "next/link";
import { getImgPath } from "@/utils/pathUtils";

export default function History() {
  return (
    <section className="history-bg">
      <div className="container lg:max-w-screen-xl md:max-w-screen-md dark:text-black mx-auto grid grid-cols-1 lg:grid-cols-12 py-40">
        <div
          className="col-span-1 lg:col-span-7 5xl:col-span-8 px-4"
          data-aos="fade-right"
        >
          <p className="text-4xl text-midnight_text dark:text-white mb-8 font-bold">
            Gajera Group <br />
            How we became number one
          </p>
          <p className="mb-8 pb-2 text-gray">
            Leadership isn't about being the loudest—it's about being the most reliable. Gajera Brothers delivers what others promise: projects on time, quality beyond expectations, and lasting value. Our integrated expertise across construction, aluminium systems, and water management ensures seamless execution. In an industry built on trust, we've become the preferred choice by simply doing what we say, every time.
          </p>
          {/* <Link
            href="/properties/properties-list"
            className="text-xl px-9 py-3 border border-primary text-primary hover:text-white hover:bg-primary rounded-lg"
          >
            More Details
          </Link> */}
        </div>
        <div
          className="hidden lg:block 5xl:col-span-4 5xl:ml-11 col-span-1 lg:col-span-5"
          data-aos="fade-left"
        >
          <div className="bg-white dark:bg-darklight dark:text-white p-4 max-w-60 border-4 border-primary rounded-lg">
            <p className="mb-16 text-3xl text-midnight_text dark:text-white font-bold">
              BEST BUSINESS GROUP
            </p>
            <div className="flex justify-between">
              <div>
                <p className="text-black text-opacity-60 dark:text-gray">
                  Years Experience
                </p>
                <p className="text-[65px] leading-[1.2] -mt-1 text-midnight_text dark:text-white font-bold mb-2">
                  8+
                </p>
              </div>
              <div>
                <Image
                  src={getImgPath("/images/history/logo.svg")}
                  alt="company"
                  width={93}
                  height={130}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
