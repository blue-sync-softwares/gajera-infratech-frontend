import React from 'react';

interface TextSectionProps {
    description?: string;
}

export default function TextSection({ description }: TextSectionProps) {
    if (!description) return null;

    return (
        <section className="py-12 bg-white dark:bg-darkmode">
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {description}
                </p>
            </div>
        </section>
    );
}