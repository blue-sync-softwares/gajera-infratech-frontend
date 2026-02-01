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
    images?: string[];
    document?: {
        title: string;
        url?: string;
        image?: string;
        description?: string;
    };
};

interface TabbarProps {
    projectDetail?: {
        image?: { url: string; public_id?: string };
        title?: string;
        description?: string;
    };
    projectImages?: Array<{ ranking: number; url: string; public_id?: string }>;
    projectFeatures?: string[];
    projectDocuments?: Array<{
        image?: { url: string; public_id?: string };
        title?: string;
        description?: string;
        file_name?: string;
        file_link?: { url: string; public_id?: string };
        button_title?: string;
        download_message?: string;
    }>;
}

const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
};

const tabs: { label: TabLabel; icon: string }[] = [
    { label: 'Project Details', icon: 'mdi:information-outline' },
    { label: 'Project Gallery', icon: 'mdi:image-multiple' },
    { label: 'Project Document', icon: 'mdi:file-document-outline' },
];

export default function Tabbar({
    projectDetail,
    projectImages = [],
    projectFeatures = [],
    projectDocuments = [],
}: TabbarProps) {
    const [activeTab, setActiveTab] = useState<TabLabel>('Project Details');
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

    const galleryImages = projectImages
        .sort((a, b) => (a.ranking || 0) - (b.ranking || 0))
        .map((img) => getImgPath(img.url));

    const firstDocument = projectDocuments?.[0];

    return (
        <section className="dark:bg-darkmode">
            <div className="max-w-screen-xl mx-auto">
                <div className="flex flex-wrap justify-center gap-1 bg-transparent" role="tablist">
                    {tabs.map((tab) => (
                        <button
                            key={tab.label}
                            className={`px-4 py-2 text-lg rounded-t-md focus:outline-none flex items-center gap-2 transition duration-300
                                ${activeTab === tab.label 
                                    ? 'text-primary border-b-2 border-primary' 
                                    : 'text-gray hover:text-primary'
                                }
                            `}
                            onClick={() => setActiveTab(tab.label)}
                            role="tab"
                            aria-selected={activeTab === tab.label}
                            aria-controls={`content-${tab.label}`}
                        >
                            <Icon icon={tab.icon} className="w-5 h-5" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="rounded-b-lg rounded-tr-lg">
                    {/* Project Details Tab */}
                    <div
                        id="content-Project Details"
                        role="tabpanel"
                        className={`max-w-screen-xl mt-11 mx-auto ${activeTab === 'Project Details' ? 'block' : 'hidden'}`}
                    >
                        <div className="max-w-6xl mx-auto" data-aos="fade-up">
                            <div className="flex flex-col lg:flex-row">
                                <div className="lg:w-1/2 px-4 flex flex-col justify-center">
                                    <p className="md:text-4xl text-[28px] leading-[1.2] text-midnight_text dark:text-white font-bold">
                                        {projectDetail?.title || 'Project Details'}
                                    </p>
                                    <p className="my-6 text-gray text-lg">
                                        {projectDetail?.description || 'No description available'}
                                    </p>

                                   

                                    {projectFeatures && projectFeatures.length > 0 && (
                                        
                                        <table className="w-full text-base text-gray">
                                            
                                            <tbody>
                                                
                                                {chunkArray(projectFeatures, 3).map((chunk, chunkIndex) => (
                                                    <tr key={chunkIndex}>
                                                        {chunk.map((feature, featureIndex) => (
                                                            <td key={featureIndex} className="pr-4 py-2">
                                                                <div className="flex items-center w-fit">
                                                                    <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                                    </svg>
                                                                    {feature}
                                                                </div>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                <div className="lg:w-1/2 h-[450px] hidden md:block px-4">
                                    <Image
                                        src={projectDetail?.image?.url ? getImgPath(projectDetail.image.url) : getImgPath('/images/tabbar/tab-1.jpg')}
                                        alt="Project Details"
                                        width={570}
                                        height={367}
                                        className="rounded-lg w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Gallery Tab */}
                    <div
                        id="content-Project Gallery"
                        role="tabpanel"
                        className={`max-w-screen-xl mt-11 mx-auto ${activeTab === 'Project Gallery' ? 'block' : 'hidden'}`}
                    >
                        <div className="max-w-6xl mx-auto" data-aos="fade-up">
                            <div className="px-4">
                                {galleryImages.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {galleryImages.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className="rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800 cursor-pointer hover:shadow-md transition"
                                                onClick={() => setLightboxSrc(img)}
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`Open image ${idx + 1}`}
                                                onKeyDown={(e) => e.key === 'Enter' && setLightboxSrc(img)}
                                            >
                                                <div className="w-full h-40 relative">
                                                    <Image
                                                        src={img}
                                                        alt={`Gallery image ${idx + 1}`}
                                                        fill
                                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray text-center py-8">No gallery images available</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Project Document Tab */}
                    <div
                        id="content-Project Document"
                        role="tabpanel"
                        className={`max-w-screen-xl mt-11 mx-auto ${activeTab === 'Project Document' ? 'block' : 'hidden'}`}
                    >
                        <div className="max-w-6xl mx-auto" data-aos="fade-up">
                            {firstDocument ? (
                                <div className="flex flex-col lg:flex-row">
                                    <div className="lg:w-1/2 px-4 flex flex-col justify-center">
                                        <p className="md:text-4xl text-[28px] leading-[1.2] text-midnight_text dark:text-white font-bold">
                                            {firstDocument?.title || 'Document'}
                                        </p>
                                        <p className="my-6 text-gray text-lg">
                                            {firstDocument?.description || 'No description available'}
                                        </p>

                                        <div className="mt-4">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                <div className="text-base text-gray">
                                                    {firstDocument?.file_name && (
                                                        <>
                                                            <strong>{firstDocument.file_name}</strong>
                                                            {firstDocument?.download_message && (
                                                                <p className="text-sm text-gray mt-1">{firstDocument.download_message}</p>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                {firstDocument?.file_link?.url && (
                                                    <a
                                                        href={firstDocument.file_link.url}
                                                        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition"
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {firstDocument?.button_title || 'Download'}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:w-1/2 h-[450px] hidden md:block px-4">
                                        <Image
                                            src={firstDocument?.image?.url ? getImgPath(firstDocument.image.url) : getImgPath('/images/tabbar/tab-4.jpg')}
                                            alt="Document"
                                            width={570}
                                            height={367}
                                            className="rounded-lg w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray text-center py-8">No documents available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox overlay */}
            {lightboxSrc && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setLightboxSrc(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image lightbox"
                >
                    <div 
                        className="relative max-w-5xl w-full max-h-full" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-3 right-3 z-60 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition"
                            onClick={() => setLightboxSrc(null)}
                            aria-label="Close image"
                        >
                            <Icon icon="mdi:close" className="w-6 h-6" />
                        </button>

                        <div className="w-full h-[80vh] md:h-[85vh] relative rounded-md overflow-hidden">
                            <Image
                                src={lightboxSrc}
                                alt="Enlarged view"
                                fill
                                sizes="(max-width: 1024px) 100vw, 80vw"
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
