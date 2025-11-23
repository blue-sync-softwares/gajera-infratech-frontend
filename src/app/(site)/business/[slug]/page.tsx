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

type Props = {
    params: Promise<{ slug: string }>;
};

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
    const filePath = join(process.cwd(), 'public/data/businessdata.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const properties = JSON.parse(fileContents);

    const item = properties.find((it: any) => it.slug === slug) || {};

    const breadcrumbLinks = [
        { href: "/", text: "Home" },
        { href: "/business", text: "Businesses" },
        { href: '#', text: item?.property_title || 'Business' },
    ];

    // sample shape expected: { property_title, tagline, hero_img, description_html, gallery: string[], testimonials: [], projects: [] }
    return (
        <div>
            <section className="bg-cover pt-36 pb-20 relative bg-gradient-to-b from-white from-10% dark:from-darkmode to-herobg to-90% dark:to-darklight overflow-x-hidden">
                <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
                    <Breadcrumb pageName={item?.property_title || 'Business'} pageDescription={item?.tagline || ''} />
                    <BusinessHero
                        title={item?.property_title || 'Business'}
                        tagline={item?.tagline || ''}
                        ctaText={item?.ctaText || 'Enquire'}
                        ctaHref={item?.ctaHref || '#'}
                        image={item?.hero_img ? getImgPath(item.hero_img) : undefined}
                    />
                </div>
            </section>

            <section className="container mx-auto dark:bg-darkmode my-12 px-4">
                {/* main image */}
                {item?.property_img && (
                    <div className="h-[420px] max-w-5xl mx-auto w-full mb-8">
                        <Image
                            src={getImgPath(item.property_img)}
                            alt={item.property_title}
                            width={1200}
                            height={600}
                            className="h-full w-full object-cover rounded-lg"
                        />
                    </div>
                )}

                {/* Tabs for overview/gallery/testimonials/projects */}
                <BusinessTabs
                    overview={{ html: item?.description_html || item?.description || '' }}
                    gallery={item?.gallery || []}
                    testimonials={item?.testimonials || []}
                    projects={item?.projects || []}
                />

                {/* Projects list with filter */}
                {item?.projects?.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-2xl text-midnight_text dark:text-white font-bold mb-4">Related Projects</h3>
                        <ProjectFilters />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            {item.projects.map((p: any, i: number) => (
                                <ProjectCard key={i} project={p} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Discover properties (existing component) */}
                <div className="mt-12">
                    <DiscoverProperties />
                </div>
            </section>
        </div>
    );
}
