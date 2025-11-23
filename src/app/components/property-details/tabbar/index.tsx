"use client";
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { getImgPath } from '@/utils/pathUtils';

type TabLabel = 'Project Details' | 'Project Gallery' | 'Project Document';

type TabContent = {
    title?: string;
    description?: string;
    features?: string[];
    image?: string;
    images?: string[]; // for gallery
    document?: {
        title: string;
        url?: string;
        image?: string;
        description?: string;
    };
};

const content: Record<TabLabel, TabContent> = {
    'Project Details': {
        title: 'Values of smart living in Vista Residence, NY',
        description:
            'Sometimes by accident, sometimes chunks as necessary making this the first true generator on the Internet.',
        features: ['Wellness & Spa', 'Fitness', 'Conference', 'Library', 'Restaurant', 'Bars'],
        image: getImgPath('/images/tabbar/tab-1.jpg'),
    },
    'Project Gallery': {
        images: [
            getImgPath('/images/tabbar/tab-3.jpg'),
            getImgPath('/images/tabbar/tab-1.jpg'),
            getImgPath('/images/tabbar/tab-4.jpg'),
            getImgPath('/images/tabbar/tab-2.jpg'),
            getImgPath('/images/tabbar/tab-5.jpg'),
            getImgPath('/images/tabbar/tab-6.jpg'),
        ],
    },
    'Project Document': {
        title: 'Luxury Villas Brochure',
        description:
            'A short overview of the luxury villas and their amenities. Includes floorplans and specifications.',
        document: {
            title: 'Luxury Villas - Brochure.pdf',
            url: '/documents/luxury-villas-brochure.pdf',
            image: getImgPath('/images/tabbar/tab-4.jpg'),
            description:
                'Download the brochure for detailed specs, floorplans and pricing information.',
        },
    },
};

const tabs: { label: TabLabel; icon: string }[] = [
    { label: 'Project Details', icon: 'mdi:information-outline' },
    { label: 'Project Gallery', icon: 'mdi:image-multiple' },
    { label: 'Project Document', icon: 'mdi:file-document-outline' },
];

const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
};

export default function Tabbar() {
    const [activeTab, setActiveTab] = useState<TabLabel>('Project Details');
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

    return (
        <section className="dark:bg-darkmode">
            <div className="max-w-screen-xl mx-auto">
                <div className="flex flex-wrap justify-center gap-1 bg-transparent" role="tablist">
                    {tabs.map((tab) => (
                        <button
                            key={tab.label}
                            className={`px-4 py-2 text-lg rounded-t-md focus:outline-none flex items-center gap-2
                                ${activeTab === tab.label ? 'text-primary border-b-2 border-primary' : 'text-gray transition duration-300 hover:text-primary'}
                            `}
                            onClick={() => setActiveTab(tab.label)}
                            role="tab"
                            aria-selected={activeTab === tab.label}
                            aria-controls={`content-${tab.label}`}
                        >
                            {/* show icon always for consistent alignment; hide label on very small screens */}
                            <Icon icon={tab.icon} className="w-5 h-5" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="rounded-b-lg rounded-tr-lg">
                    {/* Project Details - one photo + description + features */}
                    <div
                        id="content-Project Details"
                        role="tabpanel"
                        className={`max-w-screen-xl mt-11 mx-auto ${activeTab === 'Project Details' ? 'block' : 'hidden'}`}
                    >
                        <div className="max-w-6xl mx-auto" data-aos="fade-up">
                            <div className="flex flex-col lg:flex-row">
                                <div className="lg:w-1/2 px-4 flex flex-col justify-center">
                                    <p className="md:text-4xl text-[28px] leading-[1.2] text-midnight_text dark:text-white font-bold">
                                        {content['Project Details'].title}
                                    </p>
                                    <p className="my-6 text-gray text-lg">
                                        {content['Project Details'].description}
                                    </p>

                                    <table className="w-full text-base text-gray">
                                        <tbody>
                                            {chunkArray(content['Project Details'].features || [], 3).map((chunk, chunkIndex) => (
                                                <tr key={chunkIndex}>
                                                    {chunk.map((feature, featureIndex) => (
                                                        <td key={featureIndex} className="pr-4 py-2">
                                                            <div className="flex items-center w-fit">
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                                </svg>
                                                                {feature}
                                                            </div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="lg:w-1/2 h-[450px] md:block hidden px-4">
                                    <Image
                                        src={content['Project Details'].image || getImgPath('/images/blog/blog-1.jpg')}
                                        alt="Project Details Image"
                                        width={570}
                                        height={367}
                                        className="rounded-lg w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Gallery - only photos, no text */}
                    <div
                        id="content-Project Gallery"
                        role="tabpanel"
                        className={`max-w-screen-xl mt-11 mx-auto ${activeTab === 'Project Gallery' ? 'block' : 'hidden'}`}
                    >
                        <div className="max-w-6xl mx-auto" data-aos="fade-up">
                            <div className="px-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {(content['Project Gallery'].images || []).map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800 cursor-pointer"
                                            onClick={() => setLightboxSrc(img)}
                                            role="button"
                                            aria-label={`Open image ${idx}`}
                                        >
                                            <div className="w-full h-40 relative">
                                                <Image
                                                    src={img}
                                                    alt={`gallery-${idx}`}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, 33vw"
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Document - document info + one photo + description */}
                    <div
                        id="content-Project Document"
                        role="tabpanel"
                        className={`max-w-screen-xl mt-11 mx-auto ${activeTab === 'Project Document' ? 'block' : 'hidden'}`}
                    >
                        <div className="max-w-6xl mx-auto" data-aos="fade-up">
                            <div className="flex flex-col lg:flex-row">
                                <div className="lg:w-1/2 px-4 flex flex-col justify-center">
                                    <p className="md:text-4xl text-[28px] leading-[1.2] text-midnight_text dark:text-white font-bold">
                                        {content['Project Document'].title}
                                    </p>
                                    <p className="my-6 text-gray text-lg">
                                        {content['Project Document'].description}
                                    </p>

                                    <div className="mt-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-base text-gray">
                                                <strong>{content['Project Document'].document?.title}</strong>
                                                <p className="text-sm text-gray mt-1">{content['Project Document'].document?.description}</p>
                                            </div>
                                            <a
                                                href={content['Project Document'].document?.url || '#'}
                                                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
                                                download
                                            >
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:w-1/2 h-[450px] md:block hidden px-4">
                                    <Image
                                        src={content['Project Document'].document?.image || getImgPath('/images/tabbar/tab-4.jpg')}
                                        alt="Document Image"
                                        width={570}
                                        height={367}
                                        className="rounded-lg w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox overlay */}
            {lightboxSrc && lightboxSrc !== null && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setLightboxSrc(null)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="relative max-w-5xl w-full max-h-full"
                        onClick={(e) => setLightboxSrc(null)}
                    >
                        <button
                            className="absolute top-3 right-3 z-60 text-white bg-black/40 hover:bg-black/60 rounded-full p-2"
                            onClick={() => setLightboxSrc(null)}
                            aria-label="Close image"
                        >
                            <Icon icon="mdi:close" className="w-6 h-6" />
                        </button>

                        <div className="w-full h-[80vh] md:h-[85vh] relative rounded-md overflow-hidden">
                            <Image
                                src={lightboxSrc}
                                alt="Enlarged"
                                fill
                                sizes="(max-width: 1024px) 100vw, 80vw"
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
