import React from 'react';
import Image from 'next/image';
import { getImgPath } from '@/utils/pathUtils';

export default function Testimonials() {

    return (
        <section className="px-4 md:px-0 dark:bg-darkmode">
            <div className="container lg:max-w-screen-xl md:max-w-screen-md  px-8 mx-auto py-12 flex flex-col-reverse md:flex-row items-center justify-between">
                <div className="flex justify-between">
                    <div className="flex-1 lg:block hidden" data-aos="fade-right">
                        <Image
                            src={getImgPath("/images/testimonial/testimonials.png")}
                            alt="testimonial"
                            width={451}
                            height={470}
                            quality={100}
                            style={{ width: "auto", height: "auto" }}
                        />
                    </div>
                    <div className="flex-1" data-aos="fade-left">
                        <Image
                            src={getImgPath("/images/testimonial/quote.svg")}
                            alt="quote"
                            className="mb-4 md:mb-6"
                            height={135}
                            width={135}
                        />
                        <p className="text-lg md:text-2xl text-gray mb-6 md:mb-12">
                            Gajera Infratech transformed our infrastructure vision into reality with exceptional professionalism and expertise. From initial consultation to project completion, their team demonstrated unmatched dedication and innovative problem-solving. They delivered solutions that not only met our requirements but significantly exceeded expectations, resulting in measurable growth and long-term value.
                        </p>
                        <p className="text-lg md:text-2xl">Rajesh Patel</p>
                        <p className="text-gray text-lg md:text-xl">Customer</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
