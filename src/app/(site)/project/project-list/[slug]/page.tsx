import React from 'react';
import { readFileSync } from 'fs';
import { join } from 'path';
import Image from 'next/image';
import CompanyInfo from '@/app/components/home/info';
import Availability from '@/app/components/property-details/availability';
import Tabbar from '@/app/components/property-details/tabbar';
import TextSection from '@/app/components/property-details/text-section';
import DiscoverProperties from '@/app/components/home/property-option';
import { getImgPath } from '@/utils/pathUtils';
import { API_BASE_URL } from '@/utils/api';

type Props = {
  params: Promise<{ slug: string }>;
};

interface ProjectData {
  _id?: string;
  project_id?: string;
  business_name_slug?: string;
  project_name?: string;
  project_description?: string;
  project_type?: string;
  slug?: string;
  project_features?: string[];
  hero_image?: { url: string; public_id?: string };
  project_images?: Array<{ ranking: number; url: string; public_id?: string }>;
  project_detail?: {
    image?: { url: string; public_id?: string };
    title?: string;
    description?: string;
  };
  project_document?: Array<{
    image?: { url: string; public_id?: string };
    title?: string;
    description?: string;
    file_name?: string;
    file_link?: { url: string; public_id?: string };
    button_title?: string;
    download_message?: string;
  }>;
  business?: {
    _id?: string;
    business_name?: string;
    slug?: string;
    description?: string;
    logo?: { url: string; public_id?: string };
  };
}

export async function generateStaticParams() {
  try {
    const filePath = join(process.cwd(), 'public/data/projectdata.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const projects = JSON.parse(fileContents);
    
    if (Array.isArray(projects) && projects.length > 0) {
      return projects.map((project: any) => ({
        slug: project.slug,
      }));
    }
  } catch (error) {
    console.error('Error reading projectdata.json:', error);
  }

  return [];
}

export default async function Details({ params }: Props) {
  const { slug } = await params;
  
  let item: ProjectData = { slug };
  
  try {
    // Fetch project data from API
    const response = await fetch(`${API_BASE_URL}/api/v1/project/${slug}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds for ISR
    });
    
    if (response.ok) {
      const data = await response.json();
      // Handle both direct data and nested data.data response
      item = data.data || data;
      console.log('Fetched project data from API:', item);
    } else {
      console.error(`Failed to fetch project with slug: ${slug}`);
    }
  } catch (error) {
    console.error('Error fetching project from API:', error);
    // Fallback: try to get from static JSON
    try {
      const filePath = join(process.cwd(), 'public/data/projectdata.json');
      const fileContents = readFileSync(filePath, 'utf8');
      const projects = JSON.parse(fileContents);
      item = projects.find((it: any) => it.slug === slug) || { slug };
    } catch (jsonError) {
      console.error('Error reading fallback JSON:', jsonError);
    }
  }

  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/project-list", text: "Projects" },
    { href: '#', text: item?.project_name || 'Project' },
  ];

  return (
    <div>
      <section className="bg-cover pt-36 pb-20 relative bg-gradient-to-b from-white from-10% dark:from-darkmode to-herobg to-90% dark:to-darklight overflow-x-hidden" >
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
          <h2 className="text-midnight_text text-4xl lg:text-[50px] leading-[1.2] md:mx-auto md:max-w-60% text-center relative font-bold dark:text-white"> {item?.project_name} </h2>
        </div>
      </section>
      <section>
        <div className='container mx-auto dark:bg-darkmode'>
          <div className="h-[580px] max-w-5xl mx-auto w-full">
            {item?.hero_image?.url &&
              <Image
                src={getImgPath(item?.hero_image?.url)}
                alt={item?.project_name || 'Project'}
                width={1000}
                height={600}
                className='h-full w-full object-cover rounded-lg'
              />}
          </div>
        </div>
      </section>
      <TextSection description={item?.project_description} />
      {/* <CompanyInfo /> */}
      <Tabbar 
        projectDetail={item?.project_detail}
        projectImages={item?.project_images}
        projectFeatures={item?.project_features}
        projectDocuments={item?.project_document}
      />
      {/* <Availability /> */}
      <DiscoverProperties />
    </div>
  );
}
