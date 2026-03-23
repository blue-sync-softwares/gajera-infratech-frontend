import React from "react";
import { Metadata } from "next";
import HeroSub from "@/app/components/shared/hero-sub";
import ContactInfo from "@/app/components/contact/contact-info";
import ContactForm from "@/app/components/contact/form";
import Location from "@/app/components/contact/office-location";
import AboutIntro from "@/app/components/about/about-intro";
import MissionValues from "@/app/components/about/mission-values";
import HistoryTimeline from "@/app/components/about/history-timeline";
import TeamGrid from "@/app/components/about/team-grid";
import StatsRow from "@/app/components/about/stats-row";
// use testimonial component from home/testimonial folder
import HomeTestimonials from "@/app/components/home/testimonial";

export const metadata: Metadata = {
  title: "About | Gajera Brothers",
};

const page = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About Us" },
  ];
  return (
    <>
      {/* About introduction */}
      <div className="pt-44">

      <AboutIntro
        headline="Who we are"
        text="Founded in 2019, Gajera Brothers is a professionally managed, diversified enterprise based in India, delivering reliable solutions in construction, aluminium window and façade systems, and sustainable water management manufacturing. With a strong foundation in engineering and execution excellence, we support private, commercial, and government sector projects with a focus on quality, compliance, and long-term performance."
        breadcrumbLinks={breadcrumbLinks}
      />
      </div>

      {/* Mission and values */}
      <MissionValues
        mission="To drive inclusive economic growth through ethical practices, cutting-edge solutions and community partnerships."
        values={[
          "Integrity",
          "Sustainability",
          "Innovation",
          "Community focus",
        ]}
      />

      {/* Key milestones / history */}
      <HistoryTimeline
        events={[
          { year: 2019, title: "Foundation", desc: "Establishment of Gajera Brothers. Entry into private residential construction" },
          { year: 2020, title: "Expansion", desc: "Execution of commercial construction projects. Entry into government construction works with strengthened compliance processes" },
          { year: 2021, title: "Aluminium Solutions Division", desc: "Launch of aluminium window and façade systems. Successful delivery for villas and bungalow projects" },
          { year: 2022, title: "High-Rise Capability", desc: "Expansion into aluminium solutions for high-rise towers. Enhancement of design, engineering, and execution expertise" },
          { year: 2023, title: "Sustainability Initiative", desc: "Entry into water management and water harvesting manufacturing. Setup of in-house shop floor for FRP membrane housing components" },
          { year: 2024, title: "Product Range Expansion", desc: "Manufacturing of a comprehensive range of FRP membrane housing components and spare parts. Supply across multiple sizes and configurations." },
          { year: 2025, title: "Integrated Operations", desc: "Active presence across construction, aluminium systems, and sustainability sectors. Focus on long-term partnerships, innovation, and responsible development" },
        ]}
      />

      {/* Quick stats */}
      <StatsRow
        stats={[
          { label: "Years", value: 5 },
          { label: "Projects", value: 20 },
          { label: "Employees", value: 50 },
          { label: "Locations", value: 2 },
        ]}
      />

      {/* Team */}
      <TeamGrid
        members={[
          { name: "Mr. Hiren Gajera", role: "Founder & Chairman", photo: "/images/team/gajera.jpg" },
          // { name: "S. Patel", role: "CEO", photo: "/images/team/ceo.jpg" },
          // { name: "A. Mehta", role: "Head of Operations", photo: "/images/team/ops.jpg" },
        ]}
      />

      {/* Use existing home testimonial component */}
      <HomeTestimonials
        // quotes={[
        //   { text: "Working with Gajera Brothers transformed our community project.", author: "Community Leader" },
        //   { text: "Professional, reliable, and mission-driven.", author: "Partner Organization" },
        // ]}
      />

      {/* Existing contact components (kept commented for now) */}
      {/* <ContactInfo />
      <ContactForm />
      <Location /> */}
    </>
  );
};

export default page;
