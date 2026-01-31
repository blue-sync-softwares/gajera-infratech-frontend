import React from 'react';
import { readFileSync } from 'fs';
import { join } from 'path';
import Image from 'next/image';
import Breadcrumb from '@/app/components/shared/Breadcrumb';
import BusinessHero from '@/app/components/business/BusinessHero';
import BusinessTabs from '@/app/components/business/BusinessTabs';
import ProjectFilters from '@/app/components/business/ProjectFilters';
import ProjectCard from '@/app/components/business/ProjectCard';
import DiscoverProperties from '@/app/components/home/property-option';
import { getImgPath } from '@/utils/pathUtils';
import { API_BASE_URL } from '@/utils/api';

type Props = {
    params: Promise<{ slug: string }>;
};

interface BusinessData {
    slug: string;
    hero_image?: { url: string };
    business_title?: string;
    business_tagline?: string;
    business_descripiton?: string;
    business_overview?: string;
    ctaText?: string;
    ctaHref?: string;
    business_gallery?: any[];
    business_testimonials?: any[];
    project_details?: any[];
    project_types?: any[];
}

export async function generateStaticParams() {
    const filePath = join(process.cwd(), 'public/data/businessdata.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const properties = JSON.parse(fileContents);
    return properties.map((property: any) => ({
        slug: property.slug,
    }));
}

export default async function Details({ params }: Props) {
    const { slug } = await params;
    
    let item: BusinessData = { slug };
    
    try {
        // Fetch business data from API
        const response = await fetch(`${API_BASE_URL}/api/v1/business/${slug}`, {
            next: { revalidate: 60 } // Revalidate every 60 seconds for ISR
        });
        
        if (response.ok) {
            const data = await response.json();
            // Handle both direct data and nested data.data response
            item = data.data || data;
        } else {
            console.error(`Failed to fetch business with slug: ${slug}`);
        }
    } catch (error) {
        console.error('Error fetching business from API:', error);
        // Fallback: try to get from static JSON
        try {
            const filePath = join(process.cwd(), 'public/data/businessdata.json');
            const fileContents = readFileSync(filePath, 'utf8');
            const properties = JSON.parse(fileContents);
            item = properties.find((it: any) => it.slug === slug) || { slug };
        } catch (jsonError) {
            console.error('Error reading fallback JSON:', jsonError);
        }
    }

    const breadcrumbLinks = [
        { href: "/", text: "Home" },
        { href: "/business", text: "Businesses" },
        { href: '#', text: item?.business_title || 'Business' },
    ];

    // sample shape expected: { property_title, tagline, hero_img, description_html, gallery: string[], testimonials: [], projects: [] }
    return (
        <div>
            <section className="bg-cover pt-36 pb-20 relative bg-gradient-to-b from-white from-10% dark:from-darkmode to-herobg to-90% dark:to-darklight overflow-x-hidden">
                <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">

                    <BusinessHero
                        title={item?.business_title || 'Business'}
                        tagline={item?.business_tagline || ''}
                        ctaText={item?.ctaText || 'Enquire'}
                        ctaHref={item?.ctaHref || '#'}
                        image={item?.hero_image ? getImgPath(item.hero_image?.url) : undefined}
                    />
                </div>

            </section>

            <section className="container mx-auto dark:bg-darkmode my-12 px-4">
                {/* main image */}
                {item?.business_gallery && item.business_gallery.length > 0 && (
                    <div className="h-[420px] max-w-5xl mx-auto w-full mb-8">
                        <Image
                            src={getImgPath(item.business_gallery[0].image_src.url)}
                            alt={item.business_title || 'Business Image'}
                            width={1200}
                            height={600}
                            className="h-full w-full object-cover rounded-lg"
                        />
                    </div>
                )}

                {/* Business Introduction Section */}
                <div className="max-w-5xl mx-auto mb-12">
                    <div 
                        className="text-center mb-8"
                        data-aos="fade-up"
                        data-aos-duration="800"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-midnight_text dark:text-white mb-4">
                            Welcome to {item?.business_title || 'Our Business'}
                        </h2>
                        <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
                        <p className="text-lg md:text-xl text-gray dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            {item?.business_descripiton || 'Discover our commitment to excellence and innovation. We bring your vision to life with dedication, quality craftsmanship, and unparalleled service.'}
                        </p>
                    </div>

                    {/* Stats or Features Grid */}
                    <div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
                        data-aos="fade-up"
                        data-aos-duration="1000"
                        data-aos-delay="200"
                    >
                        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl font-bold text-primary mb-2">
                                {item?.project_details?.length || 0}+
                            </div>
                            <p className="text-gray dark:text-slate-400 font-medium">Projects</p>
                        </div>
                        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl font-bold text-primary mb-2">
                                {item?.business_testimonials?.length || 0}+
                            </div>
                            <p className="text-gray dark:text-slate-400 font-medium">Happy Clients</p>
                        </div>
                        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl font-bold text-primary mb-2">15+</div>
                            <p className="text-gray dark:text-slate-400 font-medium">Years Experience</p>
                        </div>
                        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                            <div className="text-4xl font-bold text-primary mb-2">100%</div>
                            <p className="text-gray dark:text-slate-400 font-medium">Satisfaction</p>
                        </div>
                    </div>

                    {/* Call to Action Banner */}
                    <div 
                        className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 md:p-12 text-center text-white shadow-lg"
                        data-aos="zoom-in"
                        data-aos-duration="800"
                        data-aos-delay="400"
                    >
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            Ready to Start Your Project?
                        </h3>
                        <p className="text-lg mb-6 opacity-90">
                            Let's discuss how we can bring your vision to life with our expertise and dedication.
                        </p>
                        <a
                            href={item?.ctaHref || '/contact'}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-semibold rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            <span>Get Started Today</span>
                            <svg 
                                className="w-5 h-5" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Tabs for overview/gallery/testimonials/projects */}
                <BusinessTabs
                    overview={{ html: item?.business_overview || item?.business_descripiton || '' }}
                    gallery={(item?.business_gallery as any) || []}
                    testimonials={item?.business_testimonials || []}
                    projects={item?.project_details || []}
                    projectTypes={item?.project_types || []}
                />

                {/* Projects list with filter */}
                {/* {item?.project_details?.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-2xl text-midnight_text dark:text-white font-bold mb-4">Our Projects</h3>
                        <ProjectFilters />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            {item.project_details.map((p: any, i: number) => (
                                <ProjectCard key={i} project={p} />
                            ))}
                        </div>
                    </div>
                )} */}

                {/* Discover properties (existing component) */}
                {/* <div className="mt-12">
                    <DiscoverProperties />
                </div> */}
            </section>
        </div>
    );
}
